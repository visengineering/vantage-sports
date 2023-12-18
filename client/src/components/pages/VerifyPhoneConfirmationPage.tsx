import React, { FC } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useUser } from '../shared/hooks/use-user';
import { Stack } from '../shared/Stack';
import { UserTypeEnum } from 'src/types';

export const VerifyPhoneConfirmationPage: FC = () => {
  const history = useHistory();
  const user = useUser();

  return (
    <section className="join-section" id="verify-phone-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 mx-auto">
            <div className="form-container">
              <div className="title">Phone Verified</div>
              <div className="tab-content" style={{ margin: '16px 0' }}>
                <Stack
                  flow="row"
                  gap={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <div>
                    <p>Thank you for verifying your phone.</p>
                  </div>

                  <div className="d-flex justify-content-center">
                    <Button
                      className="join-button font-weight-medium"
                      variant="primary"
                      onClick={() => {
                        history.push(
                          user &&
                            user.userType === UserTypeEnum.COACH &&
                            user.profile
                            ? `/${user.profile.path || user.profile.id}`
                            : '/sports-coaching'
                        );
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </Stack>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
