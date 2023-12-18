import { Formik } from 'formik';
import React, { FC, useState } from 'react';
import {
  EditCoachProfileFormValues,
  EditProfileMutation,
  GraphQLUserProfile,
  MediaTypeEnum,
  UpdateProfileMutation,
} from 'src/types';
import {
  Button,
  Form as BootstrapForm,
  Nav,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';
import {
  isKnownSport,
  editCoachProfileFormValidationSchema,
} from '../Event/event-timeslots/validation-schema';
import { Input } from 'src/components/shared/form/Input';
import { SportSearchField } from 'src/components/shared/form/SportSearchField';
import { PositionSearchField } from 'src/components/shared/form/PositionSearchField';
import { UniversitySearchField } from 'src/components/shared/form/UniversitySearchField';
import { ClassSelect } from 'src/components/shared/form/ClassSelect';
import { PhoneField } from 'src/components/shared/form/PhoneField';
import { GenderSelect } from '../../shared/GenderSelect';
import { Textarea } from 'src/components/shared/form/TextArea';
import SMSVerifyModal from './smsVerifyModal';
import { useMutation, useApolloClient } from '@apollo/client';
import { verified } from 'src/assets';
import { errorToString } from 'src/components/shared/api/errorToString';
import { editProfileMutation } from 'src/components/queries/profile';
import { GroupWrap } from 'src/components/group-wrap';
import UploadImageField from 'src/components/shared/form/UploadImageField';
import { ScrollToError } from 'src/components/shared/form/ScrollToError';
import { useHistory } from 'react-router-dom';
import { CheckboxField } from 'src/components/shared/form/CheckboxField';
import { SwitchCheckButton } from 'src/components/shared/form/SwitchCheckButton';

export type EditCoachProfileProps = {
  initialValues: EditCoachProfileFormValues;
  cb?: () => void;
  profile: GraphQLUserProfile;
  profileId: number | undefined;
};
const emptyInitialValues: EditCoachProfileFormValues = {
  name: '',
  email: '',
  cellphone: '',
  gender: '',
  sport: '',
  primaryPosition: '',
  university: '',
  class: '',
  secondaryPosition: '',
  height: '',
  weight: '',
  hometown: '',
  bio: '',
  profileImage: undefined,
  bannerImage: undefined,
  disabledBooking: false,
};

export const EditCoachProfile: FC<EditCoachProfileProps> = ({
  initialValues = emptyInitialValues,
  cb,
  profileId,
  profile,
}) => {
  const client = useApolloClient();
  const history = useHistory();
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [editProfile, { error, loading }] = useMutation<
    UpdateProfileMutation,
    EditProfileMutation
  >(editProfileMutation, {
    refetchQueries: 'active',
    onCompleted(data) {
      if (history.location.pathname !== `/${data.updateCoach?.path}`) {
        history.push(`/${data.updateCoach.path || data.updateCoach.id}`);
      }
      if (cb) {
        cb();
      }
    },
  });

  return (
    <Formik<EditCoachProfileFormValues>
      initialValues={initialValues}
      validationSchema={editCoachProfileFormValidationSchema}
      onSubmit={(values) => {
        if (!values.sport) {
          // TypeScript safeguard only...
          // as Yup schema guarantees sport is present
          return;
        }
        editProfile({
          variables: {
            coach: {
              id: Number(profileId),
              name: values.name,
              email: values.email,
              cellphone: values.cellphone,
              gender: values.gender,
              sportId: values.sport,
              universityId:
                values.university === '' ? undefined : values.university,
              class: values.class === '' ? undefined : values.class,
              primaryPositionId:
                values.primaryPosition === ''
                  ? undefined
                  : values.primaryPosition,
              secondaryPositionId:
                values.secondaryPosition === ''
                  ? undefined
                  : values.secondaryPosition,
              height: values.height?.toString(),
              weight: values.weight?.toString(),
              bio: values.bio,
              profileImage:
                values.profileImage === undefined ? null : values.profileImage,
              bannerImage:
                values.bannerImage === undefined ? null : values.bannerImage,
              disabledBooking: values.disabledBooking,
            },
          },
        });
      }}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <BootstrapForm onSubmit={handleSubmit}>
          <ScrollToError />
          <Tab.Container id="tab-test" defaultActiveKey="1">
            <Nav
              defaultActiveKey="1"
              id="pills-tab"
              className="nav nav-pills mb-3 "
              as="ul"
            >
              <Nav.Item as="li" className="flex-nowrap">
                <Nav.Link eventKey="1">General</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="2">About</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="1">
                <div className="my-5">
                  <div className="row">
                    <div className="col-md-6 d-flex flex-column align-items-center">
                      <h3 className="title">Profile Image</h3>
                      <div className="info-edit-block">
                        <div className="img-upload-block">
                          <div className="img-container">
                            <UploadImageField
                              name="profileImage"
                              type={MediaTypeEnum.PROFILE_PICTURE}
                              initialImage={profile.profileImage}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex flex-column align-items-center">
                      <h3 className="title">Banner Image</h3>
                      <div className="info-edit-block">
                        <div className="img-upload-block">
                          <div className="img-container">
                            <UploadImageField
                              name="bannerImage"
                              type={MediaTypeEnum.BANNER_PICTURE}
                              initialImage={profile.bannerImage}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h4 className="edit-form-heding">Basic Info</h4>
                  <Input name="name" label="Name*" />
                  <div className="row">
                    <div className="col-sm-6">
                      <Input name="email" label="Email*" />
                    </div>
                    <div className="col-sm-6">
                      <PhoneField
                        gap={0}
                        name="cellphone"
                        label={
                          <>
                            Cell Phone*{' '}
                            {profile.isPhoneVerified && (
                              <img
                                src={verified}
                                style={{ width: '20px' }}
                                alt="verified"
                              />
                            )}
                          </>
                        }
                        flow="row"
                        justifyItems="end"
                        componentNext={
                          <>
                            {(!profile.isPhoneVerified ||
                              values.cellphone !== profile.cellphone) && (
                              <>
                                {isVerifyModalVisible && (
                                  <SMSVerifyModal
                                    setIsVerifyModalVisible={
                                      setIsVerifyModalVisible
                                    }
                                    isEditProfile={true}
                                    isVerifyModalVisible={isVerifyModalVisible}
                                    cellphone={values.cellphone}
                                    setCellPhone={(phone) => {
                                      setFieldValue('cellphone', phone);
                                    }}
                                    callback={() => {
                                      client.refetchQueries({
                                        include: 'active',
                                      });
                                    }}
                                  />
                                )}
                                <Button
                                  variant="link"
                                  onClick={() => setIsVerifyModalVisible(true)}
                                >
                                  Verify Number
                                </Button>
                              </>
                            )}
                          </>
                        }
                      />
                    </div>
                    <div className="col-sm-6">
                      <GenderSelect name="gender" />
                    </div>
                    <div className="col-sm-6">
                      <SportSearchField
                        name="sport"
                        onChange={(value) => {
                          setFieldValue('position', '');
                        }}
                      />
                    </div>
                  </div>
                  {!!values.sport && isKnownSport(values.sport) && (
                    <PositionSearchField
                      name="primaryPosition"
                      label="Primary Position*"
                      sportId={values.sport}
                    />
                  )}
                  <h4 className="edit-form-heding">More Info</h4>
                  <div className="row">
                    <div className="col-sm-6">
                      <UniversitySearchField
                        name="university"
                        label="University"
                      />
                    </div>
                    <div className="col-sm-6">
                      <ClassSelect name="class" />
                    </div>
                  </div>
                  <SwitchCheckButton
                    name="disabledBooking"
                    label="Temporary disable booking of your trainings"
                  />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="2">
                <div className="my-5">
                  <h4 className="edit-form-heding">About</h4>
                  <div className="row">
                    <div className="col-sm-6">
                      {values.sport && isKnownSport(values.sport) && (
                        <PositionSearchField
                          name="secondaryPosition"
                          label="Secondary Position"
                          sportId={values.sport}
                        />
                      )}
                    </div>
                    <div className="col-sm-6">
                      <Input name="height" label="Height" />
                    </div>
                    <div className="col-sm-6">
                      <Input name="weight" label="Weight" />
                    </div>
                    <div className="col-sm-6">
                      <Input name="hometown" label="Hometown" />
                    </div>
                  </div>
                  <div className="form-group">
                    <Textarea
                      name="bio"
                      label={`Bio ${
                        values.bio ? `(${values.bio.length}/250)` : ''
                      }`}
                      placeholder={'Type here...'}
                      rows={4}
                    />
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
          {error && (
            <div className="alert alert-danger" role="alert">
              {errorToString(error)}
            </div>
          )}
          <GroupWrap gap={0} justifyContent="end">
            <Button variant="primary" type="submit">
              Update
            </Button>
          </GroupWrap>
        </BootstrapForm>
      )}
    </Formik>
  );
};
