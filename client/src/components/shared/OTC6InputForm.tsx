import React, { FC, ChangeEvent } from 'react';

type OTC6InputFormType = {
  disabled?: boolean;
  code: string;
  setCode: (code: string) => void;
};

const OTC6InputForm: FC<OTC6InputFormType> = ({ disabled, code, setCode }) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 6) setCode(inputValue);
  };

  return (
    <div className="my-3">
      <h6 className="h-db-600-9">6 digit verification code</h6>

      <div className="my-3 form-floating">
        <input
          className="form-control"
          type="tel"
          id="otc"
          placeholder="e.g. 123456"
          value={code}
          onChange={handleOnChange}
          disabled={disabled}
          autoComplete="off"
        />
        <label htmlFor="otc">Verification Code</label>
      </div>
    </div>
  );
};

export default OTC6InputForm;
