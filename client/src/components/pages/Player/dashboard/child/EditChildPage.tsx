import { useQuery } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Loader } from 'src/components/shared';
import { childQueryById } from 'src/components/shared/api/child';
import { errorToString } from 'src/components/shared/api/errorToString';
import { EditChildForm } from 'src/components/shared/player/children/EditChildForm';
import { MainContext } from 'src/contexts';
import { Child } from 'src/types';

export const EditChildPage = () => {
  const history = useHistory();
  const { loading, isSignedIn, profileId } = useContext(MainContext);
  const params = useParams<{ id?: string }>();
  const childId = params.id ?? '';
  const {
    loading: dataLoading,
    error,
    data,
  } = useQuery<{
    child: Child;
  }>(childQueryById, {
    variables: {
      id: parseInt(childId),
    },
  });

  useEffect(() => {
    if (!loading && !isSignedIn) {
      history.push('/sports-coaching');
    }
  }, [loading, isSignedIn]);

  if (dataLoading) {
    return <Loader />;
  }

  return (
    <div className="container" style={{ margin: '32px auto' }}>
      <h1 className="title">Add information about your child</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {errorToString(error)}
        </div>
      )}
      {data?.child && (
        <EditChildForm
          child={data.child}
          onSuccess={() => {
            history.push(`/player/${profileId}/?tab=4`);
          }}
        />
      )}
    </div>
  );
};

export default EditChildPage;
