import React, { CSSProperties, FC, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { Tooltip } from '../tooltip';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { MainContext } from 'src/contexts';
import {
  addFavoriteCoachMutation,
  FavoriteCoachMutation,
} from '../api/favorite-coaches';
import { useMutation } from '@apollo/client';
import { useNotification } from '../hooks/use-notifications';
import { UserTypeEnum } from 'src/types';

export const AddCoachToFavoritesBtn: FC<{
  coachProfileId: number;
  size?: SizeProp;
  style?: CSSProperties | undefined;
  cb?: () => void;
}> = ({ coachProfileId, style, size = 'lg', cb }) => {
  const { loading, profileId, userType } = useContext(MainContext);
  const notify = useNotification();
  const [addFavoriteCoach, { data, error: addError, loading: addLoading }] =
    useMutation<{}, FavoriteCoachMutation>(addFavoriteCoachMutation, {
      refetchQueries: 'active',
      onCompleted() {
        if (cb) {
          cb();
        }
      },
    });
  useEffect(() => {
    if (addError) {
      notify({
        type: 'error',
        children: addError.message || 'Failed to favorite coach.',
      });
    }
  }, [addError]);
  useEffect(() => {
    if (data) {
      notify({
        type: 'success',
        children: 'Coach favorited.',
      });
    }
  }, [data]);
  if (loading || !profileId) {
    return null;
  }
  if (!userType || userType === UserTypeEnum.COACH) {
    return null;
  }
  return (
    <Button
      type="button"
      style={style}
      onClick={() => {
        addFavoriteCoach({
          variables: {
            playerProfileId: profileId,
            coachProfileId,
          },
        });
      }}
      variant="success"
    >
      <Tooltip content={<small>Add coach to favorites</small>}>
        {() => (
          <FontAwesomeIcon
            icon={faPlus as any}
            size={size}
            aria-label="Add coach to favorites list."
          />
        )}
      </Tooltip>
    </Button>
  );
};
