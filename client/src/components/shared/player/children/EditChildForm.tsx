import { useMutation } from '@apollo/client';
import { Formik, FormikValues } from 'formik';
import React, { FC, useContext, useEffect } from 'react';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {
  addChildFormSchema,
  isKnownSport,
} from 'src/components/pages/Event/event-timeslots/validation-schema';
import { updateChildMutation } from 'src/components/shared/api/child';
import { errorToString } from 'src/components/shared/api/errorToString';
import { ChildAgeSelect } from 'src/components/shared/form/ChildAgeSelect';
import { Input } from 'src/components/shared/form/Input';
import { PositionSearchField } from 'src/components/shared/form/PositionSearchField';
import { ScrollToError } from 'src/components/shared/form/ScrollToError';
import { SportSearchField } from 'src/components/shared/form/SportSearchField';
import { Textarea } from 'src/components/shared/form/TextArea';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { MainContext } from 'src/contexts';
import { Child, ChildUpdateForm, DerivedFormikProps } from 'src/types';

export const EditChildForm: FC<{ child: Child; onSuccess?: () => void }> = ({
  child,
  onSuccess,
}) => {
  const notify = useNotification();
  const history = useHistory();
  const { loading, isSignedIn, profileId } = useContext(MainContext);

  useEffect(() => {
    if (
      !loading &&
      (!isSignedIn ||
        profileId?.toString() !== child.parentProfileId.toString())
    ) {
      history.push('/');
    }
  }, [isSignedIn, profileId]);

  const [updateChild, { error, loading: dataLoading, data }] = useMutation<
    ChildUpdateForm,
    ChildUpdateForm
  >(updateChildMutation, {
    refetchQueries: 'all',
    onCompleted() {
      notify({
        type: 'success',
        children: 'Child information updated',
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  return (
    <section className="add-new-child primary-form">
      <Formik<{
        name: string;
        age: number | '';
        remarks: string;
        favoriteSportId: number | '';
        favoritePositionId: number | '';
      }>
        initialValues={{
          name: child.name,
          age: child.age,
          remarks: child.remarks ?? '',
          favoriteSportId: child.favoriteSport?.id ?? '',
          favoritePositionId: child.favoritePosition?.id ?? '',
        }}
        validationSchema={addChildFormSchema}
        onSubmit={(values) => {
          if (!values.age || !profileId) return; // Just TypeScript safeguard, it is validated by Yup beforehand
          updateChild({
            variables: {
              id: child.id,
              name: values.name,
              age: values.age,
              remarks: values.remarks,
              favoriteSportId: values.favoriteSportId || undefined,
              favoritePositionId: values.favoritePositionId || undefined,
            },
          });
        }}
      >
        {({
          values,
          handleSubmit,
          setFieldValue,
        }: DerivedFormikProps<FormikValues>) => (
          <BootstrapForm onSubmit={handleSubmit}>
            <ScrollToError />

            <div className="row">
              <div className="col-md-6">
                <Input name="name" label="Child Name*" />
              </div>
              <div className="col-md-6">
                <ChildAgeSelect name="age" label="Child Age*" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <SportSearchField
                  name="favoriteSportId"
                  label="Favorite Sport"
                  onChange={(value) => {
                    if (!isKnownSport(value)) {
                      setFieldValue('position', null);
                    }
                    setFieldValue('favoritePositionId', null);
                  }}
                />
              </div>
              {values.favoriteSportId && isKnownSport(values.favoriteSportId) && (
                <div className="col-md-6">
                  <PositionSearchField
                    name="favoritePositionId"
                    label="Favorite Position"
                    sportId={values.favoriteSportId}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <Textarea
                name="remarks"
                label={`Optional Remarks ${
                  values.remarks ? `(${values.remarks.length}/250)` : ''
                }`}
                placeholder={'Type here...'}
                rows={4}
              />
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {errorToString(error)}
              </div>
            )}
            <Button type="submit" className="btn btn-primary btn-wide">
              Save
            </Button>
          </BootstrapForm>
        )}
      </Formik>
    </section>
  );
};
