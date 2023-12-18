import React, { FC, useState } from 'react';

/**
 * TODO: Refactor to ref, instead of using document.
 */
const ShowHidePassword: FC<{ elementId?: string }> = ({
  elementId = 'password',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <button
      type="button"
      onMouseUp={() => {
        setShowPassword(false);
        const el = document.getElementById(elementId);
        if (el) {
          (el as any).type = 'password';
        }
      }}
      onMouseDown={() => {
        setShowPassword(true);
        setShowPassword(false);
        const el = document.getElementById(elementId);
        if (el) {
          (el as any).type = 'text';
        }
      }}
      onPointerUp={() => {
        setShowPassword(false);
        const el = document.getElementById(elementId);
        if (el) {
          (el as any).type = 'password';
        }
      }}
      onPointerDown={() => {
        const el = document.getElementById(elementId);
        if (el) {
          (el as any).type = 'text';
        }
      }}
      style={{
        zIndex: 3,
        minWidth: '32px',
        minHeight: '32px',
      }}
    >
      <i
        className="fas fa-key"
        style={{
          ...(showPassword ? { color: 'chocolate' } : { color: 'darkblue' }),
          zIndex: 4,
        }}
      />
    </button>
  );
};

export default ShowHidePassword;
