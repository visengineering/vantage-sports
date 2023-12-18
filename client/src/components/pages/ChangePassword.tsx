import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useNotification } from '../shared/hooks/use-notifications';
import { ScrollToError } from '../shared/form/ScrollToError';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { Formik, FormikValues } from 'formik';
import { Input } from 'src/components/shared/form/Input';
import * as yup from 'yup';
import { DerivedFormikProps } from 'src/types';
import {
  password2Schema,
  passwordSchema,
} from './Event/event-timeslots/validation-schema';
import { Loading } from '../shared/Loading';
import { axiosInstance } from '../shared/api/axios';

const ChangePassword = () => {
  const notify = useNotification();

  const [expired, setExpired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>();
  const history = useHistory();
  const { key } = useParams<{ key: string }>();

  useEffect(() => {
    axiosInstance
      .post(
        `${process.env.REACT_APP_API || ''}/rest/validate-reset`,
        { key },
        { withCredentials: true }
      )
      .then((res) => {
        setLoading(false);
        setEmail(res.data.email);
      })
      .catch((err) => {
        setLoading(false);
        if (err.message.includes('403')) {
          setExpired(true);
          notify({
            type: 'error',
            children:
              'This reset request has expired. Please request a reset link again.',
          });
          history.push('/request-password');
        } else {
          notify({
            type: 'error',
            children: err.message ?? 'Something wrong happened.',
          });
        }
      });
  }, []);

  return (
    <section>
      <div
        className="form-container narrow-container"
        style={{ margin: '48px auto' }}
      >
        <h4>Change Password</h4>
        {loading ? (
          <Loading />
        ) : expired ? (
          <p>Reset password link expired.</p>
        ) : (
          <Formik<{ password1: string; password2: string }>
            initialValues={{
              password1: '',
              password2: '',
            }}
            validationSchema={yup
              .object({
                password1: passwordSchema,
                password2: password2Schema,
              })
              .required()}
            onSubmit={({ password1, password2 }) => {
              if (!(password1 || password2)) {
                notify({
                  type: 'error',
                  children: 'Please enter your new password.',
                });
                return;
              }
              if (password1 != password2) {
                notify({
                  type: 'error',
                  children: 'Passwords do not match',
                });
                return;
              }

              axiosInstance
                .post(
                  `${process.env.REACT_APP_API || ''}/rest/change-password`,
                  { email, key, password2 },
                  { withCredentials: true }
                )
                .then(() => {
                  notify({
                    type: 'success',
                    children: 'Password successfully changed.',
                  });
                  history.push('/sports-coaching');
                })
                .catch((err) => {
                  if (err.message.includes('403')) {
                    notify({
                      type: 'error',
                      children:
                        'You used this password previously. Please choose a different one.',
                    });
                  } else {
                    notify({
                      type: 'error',
                      children:
                        err.message || err.msg || 'Something went wrong.',
                    });
                  }
                });
            }}
          >
            {({ handleSubmit }: DerivedFormikProps<FormikValues>) => (
              <BootstrapForm onSubmit={handleSubmit}>
                <ScrollToError />
                <div className="row">
                  <div className="col-sm-12">
                    <Input type="password" name="password1" label="Password*" />
                  </div>
                  <div className="col-sm-12">
                    <Input
                      type="password"
                      name="password2"
                      label="Retype Password*"
                    />
                  </div>
                </div>
                <Button type="submit" className="btn btn-primary submit-button">
                  Save New Password
                </Button>
              </BootstrapForm>
            )}
          </Formik>
        )}
      </div>
    </section>
  );
};

export { ChangePassword };
export default ChangePassword;
