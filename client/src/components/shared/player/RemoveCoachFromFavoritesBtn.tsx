import React, { CSSProperties, FC, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { Tooltip } from '../tooltip';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { MainContext } from 'src/contexts';
import {
  FavoriteCoachMutation,
  removeFavoriteCoachMutation,
} from '../api/favorite-coaches';
import { useMutation } from '@apollo/client';
import { useNotification } from '../hooks/use-notifications';
import { UserTypeEnum } from 'src/types';

export const RemoveCoachFromFavoritesBtn: FC<{
  coachProfileId: number;
  size?: SizeProp;
  style?: CSSProperties | undefined;
  cb?: () => void;
}> = ({ coachProfileId, style, size = 'lg', cb }) => {
  const { loading, profileId, userType } = useContext(MainContext);
  const notify = useNotification();
  const [
    removeFavoriteCoach,
    { data, error: removeError, loading: removeLoading },
  ] = useMutation<{}, FavoriteCoachMutation>(removeFavoriteCoachMutation, {
    refetchQueries: 'active',
    onCompleted() {
      if (cb) {
        cb();
      }
    },
  });
  useEffect(() => {
    if (removeError) {
      notify({
        type: 'error',
        children: removeError.message ?? 'Failed to unfavorite coach.',
      });
    }
  }, [removeError]);
  useEffect(() => {
    if (data) {
      notify({
        type: 'success',
        children: 'Coach removed from favorites.',
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
        removeFavoriteCoach({
          variables: {
            playerProfileId: profileId,
            coachProfileId,
          },
        });
      }}
      variant="danger"
    >
      <Tooltip content={<small>Remove coach from favorites</small>}>
        {() => (
          <FontAwesomeIcon
            icon={faTimes as any}
            size={size}
            aria-label="Remove coach from favorites list."
          />
        )}
      </Tooltip>
    </Button>
  );
};
