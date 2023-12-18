import startsWith from 'lodash.startswith';
import PhoneInput from 'react-phone-input-2';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { CoachContext } from '../../../contexts';
import 'react-phone-input-2/lib/style.css';
import { axiosInstance } from 'src/components/shared/api/axios';

type SMSVerifyModalProps = {
  callback: () => void;
  isVerifyModalVisible: boolean;
  setIsVerifyModalVisible: (b: boolean) => void;
  cellphone: string;
  isEditProfile?: boolean;
  setCellPhone: (a: string) => void;
};

const SMSVerifyModal: FC<SMSVerifyModalProps> = ({
  isVerifyModalVisible,
  setIsVerifyModalVisible,
  callback,
  cellphone,
  setCellPhone,
  isEditProfile,
}) => {
  const { coach } = useContext(CoachContext);

  const [show, setShow] = useState<boolean>(false);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resError, setResError] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeRemainingForOTP, setTimeRemainingForOTP] = useState<number | null>(
    null
  );
  const [manyOTPAttemptsDanger, setManyOTPAttemptsDanger] = useState<{
    show: boolean;
    message: string;
  }>({
    show: false,
    message: '',
  });

  useEffect(() => {
    if (localStorage.getItem('OTPTimer') && !isEditProfile) {
      let timeLeft = Number(localStorage.getItem('OTPTimer'));
      let resendOTPTimer = setInterval(function () {
        setTimeRemainingForOTP(timeLeft);
        localStorage.setItem('OTPTimer', timeLeft.toString());
        if (timeLeft <= 0) {
          clearInterval(resendOTPTimer);
          setTimeRemainingForOTP(null);
          localStorage.removeItem('OTPTimer');
        }
        timeLeft -= 1;
      }, 1000);
    }
    if (
      localStorage.getItem('OTPTryCount') &&
      localStorage.getItem('OTPExpiryDate')
    ) {
      const OTPTryCount = Number(localStorage.getItem('OTPTryCount'));
      const OTPExpiryDate = Number(localStorage.getItem('OTPExpiryDate'));
      if (OTPTryCount >= 6) {
        const newDate = new Date().getTime();
        setManyOTPAttemptsDanger({
          show: true,
          message: 'Too many attempts. Retry in 30 minutes.',
        });
        setTimeout(() => {
          localStorage.removeItem('OTPTryCount');
          localStorage.removeItem('OTPExpiryDate');
          setManyOTPAttemptsDanger({ show: false, message: '' });
        }, OTPExpiryDate - newDate);
      }
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    setIsVerifyModalVisible(false);
  };

  useEffect(() => {
    if (isVerifyModalVisible) {
      setShow(true);
    }
    return () => {
      setIsVerifyModalVisible(false);
      setIsCodeVerified(false);
      setCode('');
      setIsCodeSent(false);
      setMessage('');
      setErrorMessage('');
    };
  }, [isVerifyModalVisible]);

  function handleSendCode() {
    const newDate = new Date().getTime();
    if (
      localStorage.getItem('OTPTryCount') &&
      localStorage.getItem('OTPExpiryDate')
    ) {
      let OTPTryCount = Number(localStorage.getItem('OTPTryCount'));
      const OTPExpiryDate = Number(localStorage.getItem('OTPExpiryDate'));
      if (OTPTryCount < 6 && OTPExpiryDate > newDate) {
        localStorage.setItem('OTPTryCount', (OTPTryCount + 1).toString());
      } else {
        if (OTPExpiryDate <= newDate) {
          localStorage.removeItem('OTPTryCount');
          localStorage.removeItem('OTPExpiryDate');
          setManyOTPAttemptsDanger({ show: false, message: '' });
        } else {
          localStorage.setItem('OTPTryCount', (OTPTryCount + 1).toString());
          setManyOTPAttemptsDanger({
            show: true,
            message: 'Too many attempts. Retry in 30 minutes.',
          });
          return;
        }
      }
    } else {
      localStorage.setItem('OTPTryCount', '1');
      localStorage.setItem('OTPExpiryDate', (newDate + 30 * 60000).toString());
      setTimeout(() => {
        localStorage.removeItem('OTPTryCount');
        localStorage.removeItem('OTPExpiryDate');
        setManyOTPAttemptsDanger({ show: false, message: '' });
      }, 30 * 60000);
    }

    let timeLeft = 45;
    const resendOTPTimer = setInterval(function () {
      setTimeRemainingForOTP(timeLeft);
      localStorage.setItem('OTPTimer', timeLeft.toString());
      if (timeLeft <= 0) {
        clearInterval(resendOTPTimer);
        setTimeRemainingForOTP(null);
        localStorage.removeItem('OTPTimer');
      }
      timeLeft -= 1;
    }, 1000);
    setResError(false);
    setIsLoading(true);
    const baseUrl = process.env.REACT_APP_API || '';
    const sendVerificationOTPUrl = `${baseUrl}/rest/send-verification-code`;
    const reqBody = { phoneNumber: cellphone || coach?.cellphone };
    const reqConfig = { timeout: 10000, withCredentials: true };

    const failureCallback = (err: any) => {
      setIsLoading(false);
      setResError(true);
      console.log('res msg is', err?.response?.data?.msg);
      setErrorMessage(err?.response?.data?.msg || 'Something went wrong!');
      // setIsCodeSent(!(err?.response?.data?.isExists ||  err?.response?.data?.isInvalid || err?.response?.data?.tooManyRequests ))
      setIsCodeSent(false);
      setMessage('');

      let OTPTryCount = Number(localStorage.getItem('OTPTryCount'));
      if (localStorage.getItem('OTPTryCount')) {
        localStorage.setItem('OTPTryCount', (OTPTryCount - 1).toString());
      }
      localStorage.removeItem('OTPTimer');
      clearInterval(resendOTPTimer);
      setTimeRemainingForOTP(null);
    };

    axiosInstance
      .post(sendVerificationOTPUrl, reqBody, reqConfig)
      .then((res) => {
        setMessage(res?.data?.msg || '');
        setIsLoading(false);
        setErrorMessage('');
        setIsCodeSent(true);
      })
      .catch(failureCallback);
  }

  function handleVerifyCode() {
    if (!code) {
      setErrorMessage('This field is required.');
      return;
    }

    setIsLoading(true);
    setResError(false);
    const baseUrl = process.env.REACT_APP_API || '';
    const checkVerificationOTPUrl = `${baseUrl}/rest/check-verification-code`;
    const reqBody = { phoneNumber: cellphone || coach?.cellphone, code };
    const reqConfig = { timeout: 10000, withCredentials: true };

    const failureCallback = (error: any) => {
      setResError(true);
      setIsCodeSent(
        !(error?.response?.data?.isExists || error?.response?.data?.isInvalid)
      );
      setIsLoading(false);
      setIsCodeVerified(false);
      setMessage('');
      setErrorMessage(error?.response?.data?.msg || 'Something went wrong!');
      console.error('handle verify code failed', error);

      let OTPTryCount = Number(localStorage.getItem('OTPTryCount'));
      if (localStorage.getItem('OTPTryCount')) {
        localStorage.setItem('OTPTryCount', (OTPTryCount - 1).toString());
      }
      localStorage.removeItem('OTPTimer');
      setTimeRemainingForOTP(null);
    };

    axiosInstance
      .post(checkVerificationOTPUrl, reqBody, reqConfig)
      .then((res) => {
        setIsLoading(false);
        setMessage(res?.data?.msg || '');
        if (callback) {
          callback();
        }
        // setIsPhoneVerified(true)
        setErrorMessage('');
        setShow(false);
        setIsCodeVerified(true);

        localStorage.removeItem('OTPTimer');
        setTimeRemainingForOTP(null);
      })
      .catch(failureCallback);
  }

  return (
    <>
      <div
        className="modal edit-profile-modal fade"
        id="profileEditModal"
        tabIndex={-1}
        aria-labelledby="profileEditModalLabel"
        aria-hidden="true"
      >
        <Modal show={show} onHide={handleClose} className="edit-profile-modal">
          <Modal.Header closeButton>
            <Modal.Title>Verify Phone Number</Modal.Title>
          </Modal.Header>
          {
            <Modal.Body>
              <form>
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label htmlFor="cellphone">Cell Phone</label>
                      <PhoneInput
                        enableSearch
                        containerClass="form-group"
                        inputClass="form-control w-100 h-100 d-flex flex-grow-1"
                        inputStyle={{ textIndent: '1em' }}
                        value={cellphone}
                        country={'us'}
                        isValid={(number, country, countries: any) => {
                          const cond1 =
                            countries.some((country: { dialCode: string }) => {
                              return (
                                startsWith(number, country.dialCode) ||
                                startsWith(country.dialCode, number)
                              );
                            }) &&
                            number.length > 9 &&
                            number.length <= 13;
                          return cond1;
                        }}
                        onChange={(
                          value,
                          country: { dialCode: string },
                          e,
                          formattedvalue
                        ) => {
                          const cond1 =
                            (startsWith(value, country.dialCode) ||
                              startsWith(country.dialCode, value)) &&
                            value.length > 9 &&
                            value.length <= 13;

                          if (cond1) {
                            setErrorMessage(resError ? errorMessage : '');
                          } else {
                            setErrorMessage(
                              'Please enter a valid phone number.'
                            );
                          }
                          setCellPhone(value);
                        }}
                        specialLabel=""
                        autocompleteSearch
                      />
                    </div>
                  </div>
                  <div className="col-md-4 d-flex justify-content-between align-items-center">
                    <Button
                      disabled={
                        !!timeRemainingForOTP || manyOTPAttemptsDanger.show
                      }
                      variant={isCodeSent ? 'secondary' : 'primary'}
                      onClick={handleSendCode}
                    >
                      {isCodeSent ? `Resend Code` : `Send Verification Code`}
                    </Button>
                  </div>
                  <div className="ml-3">
                    {manyOTPAttemptsDanger.show && (
                      <p className="text-danger">
                        {manyOTPAttemptsDanger.message}
                      </p>
                    )}
                    {!isLoading && timeRemainingForOTP && (
                      <p className="text-danger">
                        Resend OTP in: {timeRemainingForOTP}
                      </p>
                    )}
                    {isLoading && (
                      <p className="text text-info">Please wait...</p>
                    )}
                    {(resError || errorMessage) && (
                      <p className="text text-danger " role="text">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </div>
                {isCodeSent && (
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form-group">
                        <label htmlFor="code">Verification Code</label>
                        <input
                          type="text"
                          id="code"
                          className="form-control"
                          placeholder="Verification Code"
                          defaultValue={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 d-flex justify-content-between align-items-center">
                      <Button variant="primary" onClick={handleVerifyCode}>
                        Verify
                      </Button>
                    </div>
                    {message && <p className="text text-info">{message}</p>}
                  </div>
                )}
              </form>
            </Modal.Body>
          }
          <Modal.Footer>
            <p className="text text-secondary d-flex w-100 text-small">
              Verified mobile users, receive timely SMS notifications of Vantage
              Sports events.
            </p>
            <Button
              variant={isCodeVerified ? 'primary' : 'secondary'}
              onClick={handleClose}
            >
              {isCodeVerified ? 'Continue' : 'Skip For Now'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default SMSVerifyModal;
