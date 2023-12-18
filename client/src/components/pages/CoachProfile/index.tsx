import { gql, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { CoachContext, CriteriaContext } from '../../../contexts';
import ProfileInfoSection from './ProfileInfoSection';
import ProfileTopSection from './profileTopSection';

const IS_NUM_REGEX = /^\d+$/;
const coachQuery = gql`
  query Coach($coachId: Int, $coachPath: String) {
    coach(id: $coachId, path: $coachPath) {
      ... on Coach {
        id
        user {
          id
          email
        }
        name
        sport {
          id
          name
        }
        university {
          id
          name
        }
        primaryPosition {
          id
          name
        }
        secondaryPosition {
          id
          name
        }
        skill
        skill1 {
          id
          name
          sport {
            id
            name
          }
        }
        skill2 {
          id
          name
          sport {
            id
            name
          }
        }
        skill3 {
          id
          name
          sport {
            id
            name
          }
        }
        skill4 {
          id
          name
          sport {
            id
            name
          }
        }
        rating
        class
        height
        weight
        isPhoneVerified
        hometown
        bio
        cellphone
        userType
        profileImage {
          id
          publicId
          url
        }
        bannerImage {
          id
          publicId
          url
        }
        gender
        disabledBooking
      }
    }
  }
`;

const CoachProfile = () => {
  const params = useParams<{ path: string; tab: string; id: string }>();
  const [tab, setTab] = useState<string | null>(params.tab);

  let coach_id, coach_slug, coachPath;

  if (params.path) {
    if (IS_NUM_REGEX.test(params.path)) {
      coach_id = parseInt(params.path);
    } else {
      coachPath = params.path;
    }
  } else if (parseInt(params.id) > 0) {
    coach_id = parseInt(params.id);
  }

  const { coach, setCoach, setCoachBusy } = useContext(CoachContext);
  const [cellphone, setCellPhone] = useState(coach?.cellphone);
  const {
    sportId,
    universityId,
    setSportId,
    setUniversityId,
    setPositionId,
    setSkillId,
  } = useContext(CriteriaContext);
  let [coachRating, setCoachRating] = useState(0);
  const notify = useNotification();

  const { loading, error, data, refetch } = useQuery(coachQuery, {
    fetchPolicy: 'no-cache',
    variables: {
      coachId: coach_id,
      coachPath,
    },
    skip: !(coach_id || coachPath),
  });

  const [profileMedia, setProfileMedia] = useState();
  const [profileMediaPublicId, setProfileMediaPublicId] = useState();

  const selectedSportId = sportId;
  const selectedUniversityId = universityId;

  useEffect(() => {
    if (loading) {
      setCoachBusy(true);
    } else if (error) {
      notify({
        type: 'error',
        children: error.message || 'Something went wrong.',
      });
    } else if (data) {
      const coachData = data?.coach || {};
      setCoach({ ...coachData });
      setCellPhone(coachData?.cellphone);
      setSportId(coachData?.sport?.id);
      setUniversityId(coachData?.university?.id);
      setSkillId(coachData?.skill1?.id);
      setPositionId(coachData?.primaryPosition?.id);
      setCoachBusy(false);
      setCoachRating(coachData?.rating);

      setProfileMedia(coachData?.profileImage?.id);
      setProfileMediaPublicId(coachData?.profileImage?.publicId);
    }
    return () => {
      setSportId(selectedSportId || 0);
      setUniversityId(selectedUniversityId || 0);
    };
  }, [loading, data, error]);

  if (tab) {
    setTab(null);
    refetch();
  }

  return (
    <React.Fragment>
      <ProfileTopSection
        coachRating={Number(coachRating)}
        callback={refetch}
        cellphone={cellphone ?? ''}
        setCellPhone={setCellPhone}
        profileMediaId={profileMedia}
        profileMediaPublicId={profileMediaPublicId}
      />
      <ProfileInfoSection />
    </React.Fragment>
  );
};
export default CoachProfile;
