import React, { FC } from 'react';
import { Stack } from 'src/components/shared/Stack';
import { VerifyMobile } from '../../VerifyPhonePage';

type StepThreeMobileVerificationProps = {
  mobile: string;
  userType: string;
  onSuccess: () => void;
};

export const StepThreeMobileVerification: FC<
  StepThreeMobileVerificationProps
> = ({ mobile, userType, onSuccess }) => {
  return (
    <Stack flow="row" gap={1.5}>
      <h4 className="fw-600">Number Verification</h4>
      <VerifyMobile
        userType={userType}
        userPhone={mobile}
        onSuccess={onSuccess}
      />
    </Stack>
  );
};
