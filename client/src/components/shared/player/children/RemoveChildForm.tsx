import { useMutation } from '@apollo/client';
import React, { FC, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { deleteChildMutation } from 'src/components/shared/api/child';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { Child } from 'src/types';

export const RemoveChildForm: FC<{
  childId: number;
  onSuccess?: () => void;
}> = ({ onSuccess, childId }) => {
  const notify = useNotification();

  const [removeChild, { error, loading }] = useMutation<
    { childId: Child['id'] },
    { childId: Child['id'] }
  >(deleteChildMutation, {
    refetchQueries: 'all',
    onCompleted() {
      notify({
        type: 'success',
        children: 'Child information removed',
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  useEffect(() => {
    if (error) {
      notify({
        type: 'error',
        children: 'Failed to remove child information',
      });
    }
  }, [error]);

  return (
    <div>
      <p>
        You are about to remove your child data from the application. This
        action cannot be undone.
      </p>
      <Button
        className="btn btn-danger btn-wide"
        onClick={() => {
          removeChild({
            variables: {
              childId,
            },
          });
        }}
      >
        Remove
      </Button>
    </div>
  );
};
