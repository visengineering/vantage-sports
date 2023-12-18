import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axios';
import { errorToString } from '../api/errorToString';
import { useCountdown } from './use-countdown';

export const useSendOtc = (): {
  sendCode: (cellphone: string) => void;
  verifyCode: (code: number, cellphone: string) => Promise<void>;
  isLoading: boolean;
  isCodeSent: boolean;
  isCodeVerified: boolean;
  timeRemainingForOTC: number | null;
  message?: string;
  error?: string;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [timeRemainingForOTC, startTimer, stopTimer] = useCountdown(45);
  const [manyOTPAttemptsDanger, setManyOTPAttemptsDanger] = useState('');

  useEffect(() => {
    if (timeRemainingForOTC !== null) {
      if (timeRemainingForOTC && timeRemainingForOTC !== 0) {
        localStorage.setItem('OTPTimer', timeRemainingForOTC.toString());
      } else {
        localStorage.removeItem('OTPTimer');
      }
    }
  }, [timeRemainingForOTC]);

  useEffect(() => {
    const otpTimer = Number(localStorage.getItem('OTPTimer'));
    if (otpTimer && otpTimer !== 0) {
      startTimer(otpTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const OTPTryCount = Number(localStorage.getItem('OTPTryCount'));
    const otpExpiryDate = Number(localStorage.getItem('OTPExpiryDate'));
    if (
      otpExpiryDate &&
      OTPTryCount &&
      OTPTryCount >= 6 &&
      !(otpExpiryDate <= new Date().getTime())
    ) {
      setManyOTPAttemptsDanger('Too many attempts. Retry in 30 minutes.');
    }
  }, []);

  const sendCodeFunc = (cellphone: string) => {
    setIsLoading(true);

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
          setManyOTPAttemptsDanger('');
        } else {
          localStorage.setItem('OTPTryCount', (OTPTryCount + 1).toString());
          setManyOTPAttemptsDanger('Too many attempts. Retry in 30 minutes.');
          return;
        }
      }
    } else {
      localStorage.setItem('OTPTryCount', '1');
      localStorage.setItem('OTPExpiryDate', (newDate + 30 * 60000).toString());
      setTimeout(() => {
        localStorage.removeItem('OTPTryCount');
        localStorage.removeItem('OTPExpiryDate');
        setManyOTPAttemptsDanger('');
      }, 30 * 60000);
    }

    startTimer();

    axiosInstance
      .post(
        `${process.env.REACT_APP_API || ''}/rest/send-verification-code`,
        { phoneNumber: cellphone },
        { timeout: 10000 }
      )
      .then((res: AxiosResponse<any>) => {
        setIsLoading(false);
        setMessage((res as any)?.data?.msg || '');
        setError('');
        setIsCodeSent(true);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsCodeSent(
          err?.response?.data?.isExists || err?.response?.data?.isInvalid
        );
        setError(
          errorToString(err, 'Failed to send mobile verification passcode.')
        );
        stopTimer();
      });
  };

  const verifyCodeFunc = async (code: number, cellphone: string) => {
    try {
      const res: AxiosResponse<any> = await axiosInstance.post(
        `${process.env.REACT_APP_API || ''}/rest/check-verification-code`,
        { phoneNumber: cellphone, code },
        { timeout: 10000, withCredentials: true }
      );
      setMessage((res as any)?.data?.msg || '');
      setError('');
      setIsCodeVerified(true);
    } catch (err: any) {
      setIsCodeSent(err?.response?.data?.isCodeInvalid || true);
      setIsCodeVerified(false);
      setMessage('');
      setError(errorToString(err, 'Something went wrong!'));
    }
  };

  return {
    sendCode: sendCodeFunc,
    verifyCode: verifyCodeFunc,
    isCodeVerified,
    isLoading,
    isCodeSent,
    timeRemainingForOTC,
    message,
    error: manyOTPAttemptsDanger !== '' ? manyOTPAttemptsDanger : error,
  };
};
