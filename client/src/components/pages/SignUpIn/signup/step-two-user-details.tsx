import React, {
  FC,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Formik, FormikValues, FormikErrors, useFormikContext } from 'formik';
import { Input } from 'src/components/shared/form/Input';
import { registrationStep2Schema } from '../../Event/event-timeslots/validation-schema';
import {
  Button,
  Form as BootstrapForm,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { DerivedFormikProps, UserTypeEnum } from 'src/types';
import {
  defineGeoAddressType,
  GeoAddressDBType,
} from 'src/components/shared/hooks/googleapis/use-gmaps-place-result';
import { Stack } from 'src/components/shared/Stack';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { errorToString } from 'src/components/shared/api/errorToString';
import { SignInSignUpModalState } from '../SignUpInModal';
import { ShowHidePassword } from 'src/components/shared';
import { UserTypeField } from 'src/components/shared/form/ClassicUserTypeField';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { USPhoneNumberField } from 'src/components/shared/form/USPhoneNumberField';
import { LocationAutocompleteField } from 'src/components/shared/form/LocationAutocompleteField';
import { Link } from 'src/components/shared/Link';
import { ReferralSourceTypeField } from 'src/components/shared/form/ReferralSourceTypeField';
import { ClassicSportSearchField } from 'src/components/shared/form/ClassicSportSearchField';
import { ModalLoader } from '../../ModalLoader';
import { MainContext } from 'src/contexts/MainContext';
import { mapStringToUserType } from 'src/components/shared/utils/map-string-to-user-type';
import { axiosInstance } from 'src/components/shared/api/axios';

type SignUpStep2Data = {
  mobile: string;
};

type SignUpStepTwoProps = {
  successCb: (data: SignUpStep2Data) => void;
  isInfluencerProgram: boolean;
  isSocialSignup: boolean;
  socialType?: string;
  socialToken?: string;
  inviteCohort: string;
  email: string;
  name: string;
  // Only with modal type:
  setModalState?: (state: SignInSignUpModalState) => void;
  isTriggeredByCheckout?: boolean;
};

const validate = (values: FormikValues) => {
  const errors: FormikErrors<FormikValues> = {};

  if (values.address && !values.geoAddressState) {
    errors.address = 'Please select a location that has a state';
  }

  return errors;
};

export const StepTwoUserDetails: FC<SignUpStepTwoProps> = ({
  successCb,
  isInfluencerProgram,
  isSocialSignup,
  inviteCohort,
  email,
  name,
  socialType,
  socialToken,
}) => {
  const { login } = useContext(MainContext);
  const { search } = useLocation();
  const notify = useNotification();
  const utParam = queryString.parse(search).ut; // ut: [1, 2]

  const [geoAddressDB, setGeoAddressDB] = useState<GeoAddressDBType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      {isLoading && <ModalLoader />}
      <Formik<{
        name: string;
        password1: string;
        password2: string;
        userType: UserTypeEnum | '3' | undefined;
        sport: string | undefined;
        address: string;
        geoAddressState: string;
        mobile: string;
        referral: string | undefined;
        agreement: boolean;
      }>
        initialValues={{
          name,
          password1: '',
          password2: '',
          userType:
            utParam === UserTypeEnum.COACH
              ? UserTypeEnum.COACH
              : utParam === UserTypeEnum.TRAINEE
              ? UserTypeEnum.TRAINEE
              : isInfluencerProgram
              ? UserTypeEnum.COACH
              : undefined,
          sport: undefined,
          address: '',
          geoAddressState: '',
          mobile: '',
          referral: undefined,
          agreement: false,
        }}
        validate={validate}
        validationSchema={registrationStep2Schema(isSocialSignup)}
        onSubmit={({
          name,
          password1,
          password2,
          userType: userTypeRaw,
          sport,
          address,
          mobile,
          referral,
          agreement,
        }) => {
          setIsLoading(true);
          const userType = mapStringToUserType(
            userTypeRaw ?? UserTypeEnum.TRAINEE,
            UserTypeEnum.TRAINEE
          );
          // One in front for USA country code, +1 to be precise, but + is omitted
          const mobileOnlyNumbers = `1${mobile.toString().replace(/\D/g, '')}`;
          axiosInstance
            .post(
              `${
                process.env.REACT_APP_API || ''
              }/rest/check-phone-number-validation`,
              { phoneNumber: mobileOnlyNumbers },
              { timeout: 10000 }
            )
            .then(async () => {
              if (isSocialSignup) {
                try {
                  const res = await axiosInstance.post(
                    `${process.env.REACT_APP_API || ''}/rest/social-signup`,
                    {
                      sEmail: email,
                      sName: name,
                      sUserType: parseInt(userType ?? ''),
                      sSport: parseInt(sport ?? ''),
                      sReferralSource: parseInt(referral ?? ''),
                      sLocation: address,
                      geoAddressDB,
                      sPhoneNumber: mobileOnlyNumbers,
                      sSocialToken: socialToken,
                      sSocialType: socialType,
                      sInflcr: isInfluencerProgram,
                      source: inviteCohort,
                    },
                    { timeout: 10000, withCredentials: true }
                  );
                  setIsLoading(false);

                  login({ jwt: res.data?.token ?? '' });

                  notify({
                    type: 'success',
                    children:
                      'Successful registration please also verify your mobile.',
                  });

                  successCb({
                    mobile,
                  });
                } catch (err: any) {
                  setIsLoading(false);
                  notify({ type: 'error', children: errorToString(err) });
                }
              } else {
                try {
                  const res = await axiosInstance.post(
                    `${process.env.REACT_APP_API || ''}/rest/signup`,
                    {
                      email,
                      name,
                      password: password1,
                      userType: parseInt(userType ?? ''),
                      sport: parseInt(sport ?? ''),
                      referralSource: parseInt(referral ?? ''),
                      location: address,
                      geoAddressDB,
                      cellphone: mobileOnlyNumbers,
                      source: inviteCohort,
                      inflcr: isInfluencerProgram,
                    },
                    { withCredentials: true }
                  );
                  setIsLoading(false);
                  login({ jwt: res.data?.token ?? '' });
                  successCb({ mobile });
                } catch (err: any) {
                  setIsLoading(false);
                  notify({ type: 'error', children: errorToString(err) });
                }
              }
            })
            .catch((err) => {
              notify({
                type: 'error',
                children: errorToString(
                  err || 'Please check if your mobile number is correct.'
                ),
              });
              setIsLoading(false);
            });
        }}
      >
        <StepTwoUserDetailsFormInner
          isSocialSignup={isSocialSignup}
          inviteCohort={inviteCohort}
          isLoading={isLoading}
          geoAddressDB={geoAddressDB}
          setGeoAddressDB={setGeoAddressDB}
        />
      </Formik>
    </>
  );
};

const StepTwoUserDetailsFormInner: FC<{
  isSocialSignup: boolean;
  inviteCohort: string;
  isLoading: boolean;
  geoAddressDB: GeoAddressDBType | undefined;
  setGeoAddressDB: Dispatch<SetStateAction<GeoAddressDBType | undefined>>;
}> = ({
  isSocialSignup,
  inviteCohort,
  isLoading,
  geoAddressDB,
  setGeoAddressDB,
}) => {
  const { setFieldValue, handleSubmit } =
    useFormikContext<DerivedFormikProps<FormikValues>>();

  const defineGeoAddress: defineGeoAddressType = (params) => {
    const { geoAddressDB: _geoAddressDB } = params ?? {};

    if (geoAddressDB !== _geoAddressDB) {
      setGeoAddressDB(_geoAddressDB);
      setFieldValue('geoAddressState', _geoAddressDB?.state ?? '');
    }
  };

  return (
    <BootstrapForm onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Stack flow="row" gap={1} alignItems="flex-start" templateColumns="1fr">
        <h4 className="fw-600 signup-heading">Create an Account</h4>
        <div>
          <Input
            groupClassName="form-floating"
            name="name"
            label="Your Name*"
            placeholder="Your Name*"
            invertedLabel
            errorOutsideGroup
          />
        </div>
        {!isSocialSignup && (
          <>
            <div>
              <Input
                groupClassName="form-floating"
                type="password"
                name="password1"
                label="Enter Password*"
                placeholder="Enter Password*"
                invertedLabel
                errorOutsideGroup
                groupChildren={<ShowHidePassword elementId="password1" />}
              />
            </div>
            <div>
              <Input
                groupClassName="form-floating"
                type="password"
                name="password2"
                label="Verify Password*"
                placeholder="Verify Password*"
                invertedLabel
                errorOutsideGroup
                groupChildren={<ShowHidePassword elementId="password2" />}
              />
            </div>
          </>
        )}
        <div>
          <UserTypeField
            groupClassName="form-floating"
            name="userType"
            label="Select User Type*"
            placeholder="Select User Type*"
            invertedLabel
            errorOutsideGroup
            onChange={(userType) => {
              (window as any).dataLayer.push({
                event: 'Signup',
                action: 'Signup Select User',
                category: 'account',
                label: 'Signup Flow',
                version: 1,
                cohort: inviteCohort,
                value: userType === UserTypeEnum.COACH ? 'Coach' : 'Client',
              });
            }}
          />
        </div>
        <div>
          <ClassicSportSearchField
            groupClassName="form-floating"
            name="sport"
            label="Select Sport*"
            placeholder="Select Sport*"
            invertedLabel
            errorOutsideGroup
          />
        </div>
        <div>
          <LocationAutocompleteField
            showFindMyLocation={true}
            groupClassName="form-floating"
            name="address"
            label="Select Location*"
            placeholder="Select Location*"
            invertedLabel
            errorOutsideGroup
            defineGeoAddress={defineGeoAddress}
          />
        </div>
        <div>
          <USPhoneNumberField
            groupClassName="form-floating"
            type="tel"
            name="mobile"
            label="Enter Your Mobile Number*"
            placeholder="Enter Your Mobile Number*"
            invertedLabel
            errorOutsideGroup
            autoComplete="off"
            groupChildren={
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="mobile-field-overlay-tooltip">
                    e.g. (123) 456 7890
                  </Tooltip>
                }
              >
                <button
                  type="button"
                  className="far fa-question-circle"
                  style={{ color: 'darkblue' }}
                />
              </OverlayTrigger>
            }
          />
        </div>
        <div>
          <ReferralSourceTypeField
            label="Where did you find us*"
            name="referral"
            groupClassName="form-floating"
            placeholder="Where did you find us*"
            invertedLabel
            errorOutsideGroup
          />
        </div>

        <Input
          style={{ width: '24px', height: '24px' }}
          type="checkbox"
          name="agreement"
          label={
            <span>
              I am at least 18 years old and I have read and agree to the{' '}
              <Link to="/terms-of-service" variant="blue">
                Terms of Use
              </Link>
              {' and '}
              <Link to="/privacy-policy" variant="blue">
                Privacy Policy
              </Link>
            </span>
          }
        />

        <Button type="submit" className="btn-signin w-100" disabled={isLoading}>
          Continue
        </Button>
      </Stack>
    </BootstrapForm>
  );
};
