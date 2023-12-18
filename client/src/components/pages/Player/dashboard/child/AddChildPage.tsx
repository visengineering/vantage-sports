import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AddChildForm } from 'src/components/shared/player/children/AddChildForm';
import { MainContext } from 'src/contexts';

export const AddChildPage = () => {
  const history = useHistory();
  const { isSignedIn, profileId } = useContext(MainContext);

  useEffect(() => {
    if (!isSignedIn) {
      history.push('/');
    }
  }, [isSignedIn]);

  return (
    <div className="container" style={{ margin: '32px auto' }}>
      <h1 className="title">Add information about your child</h1>
      {profileId && (
        <AddChildForm
          onSuccess={() => {
            history.push(`/player/${profileId}/?tab=4`);
          }}
        />
      )}
    </div>
  );
};

export default AddChildPage;
