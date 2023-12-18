import React, { useState, useContext, useEffect, FC } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { GroupWrap } from 'src/components/group-wrap';
import v from 'voca';
import * as assets from '../../../assets';
import { CoachContext, MainContext } from '../../../contexts';
import Rating from '../../shared/Rating';
import { EditCoachProfileModal } from './EditCoachProfileModal';
import SMSVerifyModal from './smsVerifyModal';
const { Image } = require('cloudinary-react');

type ProfileTopSectionType = {
  callback: () => void;
  cellphone: string;
  setCellPhone: (c: string) => void;
  profileMediaId?: number;
  profileMediaPublicId?: string;
  coachRating: number;
};

const ProfileTopSection: FC<ProfileTopSectionType> = ({
  callback,
  profileMediaId,
  profileMediaPublicId,
  cellphone,
  setCellPhone,
  coachRating,
}) => {
  const { coach } = useContext(CoachContext);
  const { profileId, loading } = useContext(MainContext);
  const [skills, setSkills] = useState<string>();
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);

  const history = useHistory();

  function isMyProfile() {
    const isOwnProfile = coach?.id === profileId && !loading && !!coach?.id;
    return isOwnProfile;
  }

  function hasBannerImage() {
    return coach?.bannerImage?.publicId != null;
  }
  function hasProfileImage() {
    return coach?.profileImage?.publicId != null;
  }

  useEffect(() => {
    if (coach !== null) {
      setSkills(
        [
          coach?.skill1?.name,
          coach?.skill2?.name,
          coach?.skill3?.name,
          coach?.skill4?.name,
        ]
          .filter((obj) => obj)
          .map((a) => {
            return v.titleCase(a);
          })
          .join(', ')
      );
    }
  }, [coach]);

  return (
    <section className="profile-top-section">
      <div className="container">
        <div className="pr-top-container">
          <div className="cover-img-container">
            <div className="img-container">
              {hasBannerImage() && (
                <Image
                  publicId={coach?.bannerImage?.publicId}
                  dpr={6.0}
                  alt="cover image"
                />
              )}
              {!hasBannerImage() && <img src={assets.defaultBanner} />}
              {isMyProfile() && !hasBannerImage() && (
                <div> Click Edit to Add a Profile Image</div>
              )}
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-img-block">
              {hasProfileImage() && (
                <Image
                  publicId={coach?.profileImage?.publicId}
                  dpr={6.0}
                  height="100"
                  width="100"
                  crop="fill"
                  gravity="face"
                />
              )}
              {!hasProfileImage() && (
                <img src={assets.defaultPic} className="img" />
              )}

              {isMyProfile() && <EditCoachProfileModal />}

              {!coach?.isPhoneVerified &&
                isMyProfile() &&
                isVerifyModalVisible && (
                  <SMSVerifyModal
                    setIsVerifyModalVisible={setIsVerifyModalVisible}
                    isVerifyModalVisible={isVerifyModalVisible}
                    callback={callback}
                    cellphone={cellphone}
                    setCellPhone={setCellPhone}
                  />
                )}
              {(!coach?.isPhoneVerified || cellphone !== coach.cellphone) &&
                isMyProfile() && (
                  <>
                    <SMSVerifyModal
                      setIsVerifyModalVisible={setIsVerifyModalVisible}
                      isVerifyModalVisible={isVerifyModalVisible}
                      callback={callback}
                      cellphone={cellphone}
                      setCellPhone={setCellPhone}
                    />
                  </>
                )}
            </div>

            <div className="pr-in-block">
              <h4 className="name">{coach?.name}</h4>
              <div className="skills"> {skills}</div>
              <Rating value={coachRating || 0} maxValue={5} />
            </div>
            <div className="btn-container d-flex justify-content-center">
              {isMyProfile() ? (
                <GroupWrap gap={1} templateColumns="250px 175px">
                  <Button
                    className="btn btn-primary"
                    onClick={() =>
                      history.push('/set-availability', {
                        profileMediaId,
                        profileMediaPublicId,
                      })
                    }
                  >
                    Set Training Availability
                  </Button>
                  <Button
                    className="btn btn-primary"
                    onClick={() =>
                      history.push('/create-event', {
                        profileMediaId,
                        profileMediaPublicId,
                      })
                    }
                  >
                    Create Event
                  </Button>
                </GroupWrap>
              ) : (
                <div>
                  <br />
                  <br />
                  {coach?.disabledBooking && (
                    <p className="alert alert-danger">
                      This coach is taking a break. You cannot book events from{' '}
                      {coach.name} until coach switches bookings on again.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileTopSection;
