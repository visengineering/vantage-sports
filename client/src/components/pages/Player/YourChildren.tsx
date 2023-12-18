import React, { useState, useContext, useEffect, FC } from 'react';
import { useQuery } from '@apollo/client';
import { MainContext } from '../../../contexts';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { childQuery } from 'src/components/shared/api/child';
import { errorToString } from 'src/components/shared/api/errorToString';
import { Child } from 'src/types';
import { Stack } from 'src/components/shared/Stack';
import { RemoveChildModal } from 'src/components/shared/player/children/RemoveChildModal';

export const YourChildren: FC = () => {
  const [paramsReady, setParamsReady] = useState(false);
  const [showModal, setShowModal] = useState<
    | {
        childId: number;
      }
    | false
  >(false);
  const { userId, profileId, isSignedIn } = useContext(MainContext);
  const history = useHistory();

  const { loading, error, data, refetch, fetchMore } = useQuery(childQuery, {
    variables: {
      parentProfileId: profileId,
      limit: 10,
      offset: 0,
    },
  });

  useEffect(() => {
    if (isSignedIn && userId && profileId) {
      setParamsReady(true);
    }
  }, [isSignedIn, userId, profileId]);

  useEffect(() => {
    refetch();
  }, [paramsReady]);

  return data?.child?.edges?.length > 0 ? (
    <section className="child-details-section">
      {showModal !== false && (
        <RemoveChildModal
          showModal={true}
          childId={showModal.childId}
          onHide={() => setShowModal(false)}
        />
      )}
      <div className="container">
        <div className="child-details">
          <Stack flow="row" gap={1}>
            <Stack gap={1} flow="column" justifyContent="space-between">
              <h1 className="title">Your Children</h1>
              <div>
                <Button
                  type="button"
                  disabled={loading}
                  className="btn btn-primary btn-wide btn-sm"
                  onClick={() => {
                    history.push('/add-child');
                  }}
                >
                  Add Child Information
                </Button>
              </div>
            </Stack>
            {error && (
              <div className="alert alert-danger" role="alert">
                {errorToString(error)}
              </div>
            )}
            {data?.child?.edges.map(({ node: child }: { node: Child }) => (
              <div
                key={child.name}
                className="card child-card"
                style={{ maxWidth: 'unset', width: '100%' }}
              >
                <Stack flow="row" gap={1}>
                  <Stack gap={1} flow="column" justifyContent="space-between">
                    <div className="name">
                      <h3>
                        {child.name}{' '}
                        <span className="badge badge-success">
                          {child.age}{' '}
                          {child.age.toString() === '1'
                            ? 'year old'
                            : 'years old'}
                        </span>
                      </h3>
                    </div>
                    <Stack flow="column" gap={1}>
                      <Button
                        type="button"
                        disabled={loading}
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setShowModal({
                            childId: child.id,
                          });
                        }}
                      >
                        Remove
                      </Button>
                      <Button
                        type="button"
                        disabled={loading}
                        className="btn btn-sm"
                        onClick={() => {
                          history.push(`/update-child-information/${child.id}`);
                        }}
                      >
                        Edit
                      </Button>
                    </Stack>
                  </Stack>

                  {child.favoriteSport ? (
                    <div>
                      <small className="text-muted">
                        Favorite Sport: {child.favoriteSport.name}
                        {child.favoritePosition && (
                          <>
                            {' '}
                            | Favorite Position: {child.favoritePosition.name}
                          </>
                        )}
                      </small>
                    </div>
                  ) : null}
                  {child.remarks && (
                    <div className="remarks">{child.remarks}</div>
                  )}
                </Stack>
              </div>
            ))}
          </Stack>
        </div>
      </div>
    </section>
  ) : (
    <section className="event-details-section">
      <div className="container">
        <div className="event-details">
          <h2 className="title">
            {!loading && !(data?.participant?.edges?.length > 0)
              ? 'Add information about your children.'
              : 'Loading...'}
          </h2>
          {error && (
            <div className="alert alert-danger" role="alert">
              {errorToString(error)}
            </div>
          )}
          {!loading && !(data?.participant?.edges?.length > 0) && (
            <>
              <p>
                Tell your coach who is attending the session by adding children
                data.
              </p>
              <p>
                Soon you will be able to choose who is attending the session.
                (Currently under construction.)
              </p>
              <Button
                type="button"
                disabled={loading}
                className="btn btn-primary btn-wide"
                onClick={() => {
                  history.push('/add-child');
                }}
              >
                Add Child Information
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
