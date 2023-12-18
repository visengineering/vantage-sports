import { useQuery } from '@apollo/client';
import React, { FC, useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Formik, FormikValues } from 'formik';
import { Form as BootstrapForm } from 'react-bootstrap';
const { Link } = require('react-router-dom');
import v from 'voca';
import * as assets from '../../../assets';
import { Rating } from '../../shared';
import { CoachQueryType, DerivedFormikProps } from 'src/types';
import { coachesQueryWithPagination } from 'src/components/shared/api/coach';
import { GroupWrap } from 'src/components/group-wrap';
import { SportSearchField } from 'src/components/shared/form/SportSearchField';
import { UniversitySearchField } from 'src/components/shared/form/UniversitySearchField';
import { MainContext } from 'src/contexts';
import { RemoveCoachFromFavoritesBtn } from 'src/components/shared/player/RemoveCoachFromFavoritesBtn';
import { Paragraph } from 'src/components/shared/Paragraph';
import { Stack } from 'src/components/shared/Stack';
const { Image } = require('cloudinary-react');

const CoachPanel: FC<{ coachProfile: CoachQueryType }> = ({ coachProfile }) => {
  const skills = [
    coachProfile.sport?.name,
    coachProfile.primaryPosition?.name,
    coachProfile.university?.name,
  ]
    .filter((obj) => obj)
    .map((a) => {
      return v.titleCase(a).replace("'S", "'s");
    });

  return (
    <div className="card profile-card">
      <Link to={'/coach/' + coachProfile.id}>
        <div className="card-profile-img">
          {!coachProfile.profileImage?.publicId && (
            <img className="img" src={assets.defaultPic} />
          )}
          {coachProfile.profileImage?.publicId && (
            <Image
              className="img"
              publicId={coachProfile.profileImage.publicId}
              dpr={6.0}
              height="100"
              width="100"
              crop="fill"
              gravity="face"
            />
          )}
          <img
            className="icon"
            src={assets.verified}
            alt="verified"
            title="Verified"
          />
        </div>

        <div className="info-block">
          <div className="name">{coachProfile.name}</div>
          <Rating value={coachProfile.rating || 0} maxValue={5} />

          <ul className="info-list">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
            &nbsp;
          </ul>

          <div className="rating-block">
            {coachProfile.eventCount > 0 && (
              <div className="item-block">
                <span className="point">{coachProfile.eventCount}</span>
                <span className="lbl">Trainings</span>
              </div>
            )}
            <div className="item-block">
              &nbsp;
              {!!coachProfile.rating && (
                <>
                  <span className="point">
                    <img src={assets.starBlue} alt="icon" />
                    {coachProfile.rating}
                  </span>
                  <span className="lbl text-muted">(reviews)</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
      <RemoveCoachFromFavoritesBtn coachProfileId={coachProfile.id} />
    </div>
  );
};

const FavoriteCoaches: FC = () => {
  const { loading: loadingUser, profileId } = useContext(MainContext);
  const [universityId, setUniversityId] = useState<number | undefined>();
  const [sportId, setSportId] = useState<number | undefined>();
  const { loading, error, data, refetch, fetchMore } = useQuery<{
    coach: {
      total: number;
      edges: { node: CoachQueryType }[];
    };
  }>(coachesQueryWithPagination, {
    variables: {
      offset: 0,
      limit: 10,
      sportId,
      universityId,
      onlyFavorites: true,
      playerProfileId: profileId,
      name: undefined,
    },
  });

  useEffect(() => {
    refetch();
  }, [sportId, universityId]);

  if (loadingUser) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <section className="card-panel-section">
        <div className="container">
          <div className="block-header">
            <h3 className="title">Your Favorite Coaches</h3>
            <Formik<{ sport: number | ''; university: number | '' }>
              initialValues={{
                sport: '',
                university: '',
              }}
              onSubmit={() => {}}
            >
              {({ handleSubmit }: DerivedFormikProps<FormikValues>) => (
                <BootstrapForm onSubmit={handleSubmit}>
                  <GroupWrap
                    gap={1}
                    style={{ minWidth: '250px', flex: 1 }}
                    justifyContent="normal"
                    alignItems="stretch"
                  >
                    <SportSearchField
                      name="sport"
                      placeholder="By Sport"
                      withLabel={false}
                      onChange={(value) => setSportId(value)}
                    />
                    <UniversitySearchField
                      name="university"
                      placeholder="By University"
                      withLabel={false}
                      onChange={(value) => setUniversityId(value)}
                    />
                  </GroupWrap>
                </BootstrapForm>
              )}
            </Formik>
          </div>
          <div className="card-container">
            {loading && <p>Loading...</p>}
            {error && (
              <p>
                Failed to load favorite coaches list. Please refresh to try
                again.
              </p>
            )}
            {!!data?.coach?.edges?.length ? (
              <InfiniteScroll
                style={{ display: 'flex', flexWrap: 'wrap' }}
                dataLength={data.coach.edges.length}
                next={() => {
                  const currentLength = data.coach.edges.length;
                  fetchMore({
                    variables: { offset: currentLength },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev;
                      return {
                        ...prev,
                        ...fetchMoreResult,
                        coach: {
                          ...fetchMoreResult?.coach,
                          edges: [
                            ...prev?.coach?.edges,
                            ...fetchMoreResult?.coach?.edges,
                          ],
                        },
                      };
                    },
                  });
                }}
                hasMore={!(data.coach.total === data.coach.edges.length)}
                loader={<h4>Loading...</h4>}
              >
                {data.coach.edges.map(({ node }) => (
                  <CoachPanel key={node.id} coachProfile={node} />
                ))}
              </InfiniteScroll>
            ) : (
              <Stack flow="row" gap={1}>
                <Paragraph type="infobox">
                  {sportId || universityId
                    ? 'No favorite coaches matching your search criteria'
                    : `You don't have favorite coaches.`}
                </Paragraph>
                <Link
                  className="btn btn-primary"
                  variant="blue"
                  to={`/coaches`}
                >
                  Add Favorite Coach
                </Link>
              </Stack>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default FavoriteCoaches;
