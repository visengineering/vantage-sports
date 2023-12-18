import { useQuery } from '@apollo/client';
import { AxiosRequestConfig } from 'axios';
import React, { useEffect, useContext, FC, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { GraphQLUserProfile, UserTypeEnum } from 'src/types';
import { MainContext } from '../../../contexts/MainContext';
import { errorToString } from '../../shared/api/errorToString';
import { allProfiles } from '../../shared/api/profile';
import { useAxios } from '../../shared/api/use-axios';
import { Loading } from '../../shared/Loading';
import { Stack } from '../../shared/Stack';
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

const ProfileRow: FC<{ profile: GraphQLUserProfile; callback: () => void }> = ({
  profile,
  callback,
}) => {
  const history = useHistory();
  const { login } = useContext(MainContext);

  const loginAsRequestConfig = useMemo<AxiosRequestConfig>(() => {
    return {
      fetchOnLoad: false,
      method: 'POST',
      url: `${process.env.REACT_APP_API || ''}/rest/admin/login-as`,
      data: {
        userId: profile.userId,
      },
    };
  }, [profile.userId]);

  const {
    response: loginAsResponse,
    error: loginAsError,
    loading: loginAsLoading,
    refetch: executeLoginAs,
  } = useAxios<{ token: string }>(loginAsRequestConfig);

  const changeUserTypeRequestConfig = useMemo<AxiosRequestConfig>(() => {
    return {
      fetchOnLoad: false,
      method: 'POST',
      url: `${process.env.REACT_APP_API || ''}/rest/admin/change-user-type`,
      data: {
        userId: profile.userId,
        userType: profile.userType?.toString() === '1' ? '2' : '1',
      },
    };
  }, [profile.userId]);

  const {
    response: changeUserTypeResponse,
    error: changeUserTypeError,
    loading: changeUserTypeLoading,
    refetch: executeChangeUserType,
  } = useAxios<{}>(changeUserTypeRequestConfig);

  const deleteUserRequestConfig = useMemo<AxiosRequestConfig>(() => {
    return {
      fetchOnLoad: false,
      method: 'POST',
      url: `${process.env.REACT_APP_API || ''}/rest/admin/delete-user`,
      data: {
        userProfileId: profile.id,
      },
    };
  }, [profile.userId]);

  const {
    response: deleteUserResponse,
    error: deleteUserError,
    loading: deleteUserLoading,
    refetch: executeDeleteUser,
  } = useAxios<{ token: string }>(deleteUserRequestConfig);

  useEffect(() => {
    if (!loginAsLoading && loginAsResponse && loginAsResponse.token) {
      login({ jwt: loginAsResponse.token });

      if (profile.userType?.toString() === UserTypeEnum.COACH) {
        history.push(`/${profile.path || profile.id}`);
      } else {
        history.push(`/player/${profile.id}/`);
      }
    }
  }, [loginAsLoading, loginAsResponse]);

  useEffect(() => {
    if (!changeUserTypeLoading && changeUserTypeResponse) {
      callback();
    }
  }, [changeUserTypeLoading, changeUserTypeResponse]);

  useEffect(() => {
    if (!deleteUserLoading && deleteUserResponse) {
      callback();
    }
  }, [deleteUserLoading, deleteUserResponse]);

  const lastChancePromptText = `delete user id ${profile.id}`;

  return (
    <>
      <Stack flow="column">
        <div className="profile-text">{profile.id}</div>
        <div className="profile-text">
          {profile.name} ~{' '}
          {profile.userType?.toString() == UserTypeEnum.COACH
            ? 'coach'
            : 'player'}
        </div>
        <div className="profile-text">{profile.cellphone}</div>
        <div className="profile-text">{profile.user?.email}</div>

        <Stack flow="row" gap={1}>
          <Button
            disabled={loginAsLoading}
            className="btn btn-primary"
            onClick={() => executeLoginAs(loginAsRequestConfig)}
          >
            {loginAsLoading ? 'Logging...' : 'Become User'}
          </Button>
          <Button
            disabled={changeUserTypeLoading}
            className="btn btn-primary"
            onClick={() => executeChangeUserType(changeUserTypeRequestConfig)}
          >
            {changeUserTypeLoading
              ? 'Changing...'
              : profile.userType?.toString() === '1'
              ? 'Change to Player'
              : 'Change to Coach'}
          </Button>
          <Button
            disabled={deleteUserLoading}
            className="btn btn-danger"
            onClick={() =>
              confirm('Are you sure? You cannot revert this change.') &&
              prompt(
                `Please the following phrase to delete user: ${lastChancePromptText}`
              ) == lastChancePromptText &&
              executeDeleteUser(deleteUserRequestConfig)
            }
          >
            {deleteUserLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Stack>
      </Stack>
      {changeUserTypeResponse && (
        <div className="alert alert-info my-2" role="alert">
          Successfully changed user type.
        </div>
      )}
      {deleteUserResponse && (
        <div className="alert alert-info my-2" role="alert">
          Successfully deleted user.
        </div>
      )}
      {loginAsError && (
        <div className="alert alert-danger my-2" role="alert">
          {errorToString(loginAsError)}
        </div>
      )}
      {changeUserTypeError && (
        <div className="alert alert-danger my-2" role="alert">
          {errorToString(changeUserTypeError)}
        </div>
      )}
      {deleteUserError && (
        <div className="alert alert-danger my-2" role="alert">
          {errorToString(deleteUserError)}
        </div>
      )}
      <hr />
    </>
  );
};

export const AdminUsers: FC = () => {
  const {
    loading,
    profile: loggedProfile,
    isSignedIn,
  } = useContext(MainContext);
  const {
    loading: loadingProfiles,
    error,
    data,
    refetch,
  } = useQuery<{ profile: GraphQLUserProfile[] }>(allProfiles, {});
  const history = useHistory();

  if (loading || loadingProfiles) {
    return <Loading />;
  }
  if (error) {
    return <p>Failed to load all profiles. Contact IT team at #engineering.</p>;
  }

  if (!isSignedIn) {
    history.push('/');
  }

  return (
    <section className="admin-info-section">
      <div className="container">
        <Stack flow="row" gap={2}>
          {loggedProfile && (
            <div className="alert alert-info my-2" role="alert">
              <Stack flow="column" gap={1}>
                <div>
                  Logged in as: {loggedProfile.name} (
                  {loggedProfile.user?.email})
                </div>
              </Stack>
            </div>
          )}
          <div className="profile-list">
            {data != undefined &&
              [...data.profile]
                .sort((a, b) =>
                  (a?.user?.email?.toString() ?? '').localeCompare(
                    b?.user?.email?.toString() ?? ''
                  )
                )
                .map((profile) => (
                  <ProfileRow
                    key={profile.id}
                    profile={profile}
                    callback={refetch}
                  />
                ))}
          </div>
        </Stack>
      </div>
    </section>
  );
};
/* eslint-enable @typescript-eslint/no-unnecessary-condition */
