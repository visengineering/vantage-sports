import { useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MainContext } from 'src/contexts/MainContext';
import { EditCoachProfile } from './EditCoachProfile';
import { coachQuery } from 'src/components/queries/coach';
import { CoachQueryType } from 'src/types';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { useHistory } from 'react-router-dom';

export const EditCoachProfileModal = () => {
  const history = useHistory();
  const queryParams = new URLSearchParams(history.location.search);
  const pathIncludesShowEdit = queryParams.get('showEdit');

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  useEffect(() => {
    if (pathIncludesShowEdit) {
      setShowModal(true);
    }
  }, [pathIncludesShowEdit]);

  const {
    loading: userContextLoading,
    profileId,
    profile,
  } = useContext(MainContext);
  const notify = useNotification();

  const { loading, error, data } = useQuery<{
    coach: CoachQueryType;
  }>(coachQuery, {
    variables: { profileId },
  });

  if (loading || userContextLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Failed to load coach data. Please refresh and try again.</p>;
  }
  return (
    <>
      <Button
        type="button"
        variant=""
        className="profile-edit-btn"
        onClick={handleShowModal}
      >
        Edit
      </Button>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="edit-profile-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profile && (
            <EditCoachProfile
              initialValues={{
                name: profile.name,
                email: profile.user?.email ?? '',
                cellphone: profile.cellphone ?? '',
                gender: profile.gender ?? '',
                sport: profile.sport?.id ?? '',
                primaryPosition: profile.primaryPosition?.id ?? '',
                university: profile.university?.id ?? '',
                class: profile.class ?? '',
                secondaryPosition: profile.secondaryPosition?.id ?? '',
                height: profile.height ?? '',
                weight: profile.weight ?? '',
                hometown: profile.hometown ?? '',
                bio: profile.bio ?? '',
                bannerImage: profile.bannerImage?.id,
                profileImage: profile.profileImage?.id,
                disabledBooking: profile.disabledBooking,
              }}
              cb={() => {
                setShowModal(false);
                notify({
                  type: 'success',
                  children: 'Profile changes saved.',
                });
              }}
              profileId={profileId}
              profile={profile}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
