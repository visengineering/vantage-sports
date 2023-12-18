import React, { FC, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { MainContext } from '../../../contexts';
import inflcrIcon from '../../../assets/inflcr.svg';
import { UserTypeEnum } from 'src/types';
import { StepOneEmail } from './signup/step-one-email';
import { SignInSignUpModalState } from './SignUpInModal';
import { StepTwoUserDetails } from './signup/step-two-user-details';
import { StepThreeMobileVerification } from './signup/step-three-mobile-verification';
import { Loader } from 'src/components/shared';
import { GroupWrap } from 'src/components/group-wrap';

export enum SignupModeEnum {
  BASIC = '/signup',
  COACH = '/coach-signup',
  TRAINEE = '/trainee-signup',
}

export type SignUpFormProps = {
  type: 'modal' | 'landing_signup' | 'basic_signup' | 'inflcr_signup';
  // only when type 'modal':
  setModalState?: (state: SignInSignUpModalState) => void;
  isFromPrchsEvntBtn?: boolean;
};

const SignUpForm: FC<SignUpFormProps> = ({
  type,
  setModalState = () => {},
  isFromPrchsEvntBtn,
}) => {
  const history = useHistory();
  const inflcr = type === 'inflcr_signup';
  const { loading, profile, invite, userType } = useContext(MainContext);
  const [isSocialSignup, setIsSocialSignup] = useState<boolean>(false);
  const [socialToken, setSocialToken] = useState<string | undefined>(undefined);
  const [socialType, setSocialType] = useState<string | undefined>(undefined);
  const [signupStep, setSignupStep] = useState(1);
  const [email, setEmail] = useState<string>('');
  const [name, changeName] = useState<string>('');
  const [cellphone, setCellphone] = useState<string>('');
  const [finished, setFinished] = useState<boolean>(false);
  const profilePath =
    userType === UserTypeEnum.COACH
      ? `/${profile?.path ?? profile?.id ?? 'sports-coaching'}`
      : `/sports-coaching`;

  useEffect(() => {
    if (finished) {
      (window as any).dataLayer.push({
        event: 'Signup',
      });
      if (type === 'modal' && isFromPrchsEvntBtn) {
        setModalState('purchaseBtnEvent');
      } else {
        if (type === 'modal') {
          setModalState('handleClose');
        }
        history.push(profilePath);
      }
    }
  }, [finished]);

  return (
    <section
      className={
        type === 'modal' ? '' : 'd-flex justify-content-center h-auto p-0'
      }
      key="signup-form-section"
    >
      <Row className="m-0 justify-content-center">
        <Col className={'col-12'}>
          <Card
            className={'bg-white border-0 sign-up-form'}
            style={{ position: 'relative' }}
          >
            {inflcr && (
              <div className="mb-md-3">
                <GroupWrap gap={0}>
                  <img src={inflcrIcon} alt="Inflcr" />
                  <h4 className="title">Partner Signup</h4>
                </GroupWrap>
              </div>
            )}

            {signupStep === 1 && (
              <StepOneEmail
                type={type}
                setModalState={setModalState}
                successCb={(data) => {
                  setEmail(data.email);
                  if (data.name) {
                    changeName(data.name);
                  }

                  if (data.socialType && data.socialToken) {
                    setSocialType(data.socialType);
                    setSocialToken(data.socialToken);
                    setIsSocialSignup(true);
                  }

                  setSignupStep(2);
                }}
                isInfluencerProgram={inflcr}
                isTriggeredByCheckout={!!isFromPrchsEvntBtn}
              />
            )}
            {signupStep === 2 && (
              <StepTwoUserDetails
                inviteCohort={invite}
                setModalState={setModalState}
                successCb={(data) => {
                  setCellphone(data.mobile);
                  setSignupStep(3);
                }}
                isInfluencerProgram={inflcr}
                isTriggeredByCheckout={!!isFromPrchsEvntBtn}
                isSocialSignup={isSocialSignup}
                email={email}
                name={name}
                socialType={socialType}
                socialToken={socialToken}
              />
            )}
            {signupStep === 3 && (
              <>
                {loading ? (
                  <Loader />
                ) : (
                  <StepThreeMobileVerification
                    mobile={cellphone}
                    userType={userType ?? UserTypeEnum.TRAINEE}
                    onSuccess={() => {
                      setSignupStep(4);
                      setFinished(true);
                    }}
                  />
                )}
              </>
            )}
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default SignUpForm;

/* eslint-enable @typescript-eslint/no-unnecessary-condition */
