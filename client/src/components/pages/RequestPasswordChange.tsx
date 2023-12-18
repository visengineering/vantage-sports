import React, { useState } from 'react';
import { ScrollToError } from '../shared/form/ScrollToError';
import { useNotification } from '../shared/hooks/use-notifications';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { Formik, FormikValues } from 'formik';
import { Input } from 'src/components/shared/form/Input';
import * as yup from 'yup';
import { DerivedFormikProps } from 'src/types';
import { errorToString } from '../shared/api/errorToString';
import { emailSchema } from './Event/event-timeslots/validation-schema';
import { axiosInstance } from '../shared/api/axios';

const RequestPasswordChange = () => {
  const [status, setStatus] = useState<null | string>(null);
  const notify = useNotification();

  return (
    <section>
      <div
        className="form-container narrow-container"
        style={{ margin: '48px auto' }}
      >
        <h4>
          {status === 'success' ? 'Email Sent' : 'Request Password Change'}
        </h4>
        {status === null && (
          <Formik<{ email: string }>
            initialValues={{
              email: '',
            }}
            validationSchema={yup
              .object({
                email: emailSchema,
              })
              .required()}
            onSubmit={({ email }) => {
              axiosInstance
                .post(
                  `${process.env.REACT_APP_API || ''}/rest/password-reset`,
                  { email },
                  { withCredentials: true }
                )
                .then((res) => {
                  if (res.data.success === true) {
                    setStatus('success');
                    notify({
                      type: 'success',
                      children: 'Password reset link sent to your email.',
                    });
                  }
                })
                .catch((err) => {
                  notify({
                    type: 'error',
                    children: errorToString(
                      err,
                      'Failed to request password change.'
                    ),
                  });
                });
            }}
          >
            {({ handleSubmit }: DerivedFormikProps<FormikValues>) => (
              <BootstrapForm onSubmit={handleSubmit}>
                <ScrollToError />
                <div className="row">
                  <div className="col-sm-12">
                    <Input type="email" name="email" label="Email*" />
                  </div>
                </div>
                <Button type="submit" className="btn btn-primary submit-button">
                  Request Password
                </Button>
              </BootstrapForm>
            )}
          </Formik>
        )}
        {status === 'success' && (
          <div className="alert alert-success" role="alert">
            Check your email for a reset password link.
          </div>
        )}
      </div>
    </section>
  );
};

export { RequestPasswordChange };
export default RequestPasswordChange;
