import useAxios from 'axios-hooks';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { MediaType, MediaTypeEnum } from '../../../types';
import * as assets from '../../../assets';
import {
  createMediaMutation,
  deleteMediaMutation,
  DeleteMediaMutationRequestType,
} from 'src/components/shared/api/media';
import { MainContext } from 'src/contexts/MainContext';
import { useMutation } from '@apollo/client';
import { useField } from 'formik';
import { useUser } from '../hooks/use-user';

const { Image } = require('cloudinary-react');

const baseStyle = {
  background: 'transparent',
};

const activeStyle = { borderColor: '#2196f3' };
const acceptStyle = { borderColor: '#00e676' };
const rejectStyle = { borderColor: '#ff1744' };

export type ImageType = number | undefined;

export const UploadImageField: FC<{
  type: MediaTypeEnum;
  name: string;
  initialImage?: MediaType;
  disabled?: boolean;
}> = ({ type, name, initialImage, disabled = false }) => {
  const [{ value: mediaId }, _, { setValue }] = useField<ImageType>(name);
  const user = useUser();
  const { profileId } = useContext(MainContext);
  const [show, setShow] = useState<boolean>(false);
  const [createMediaReq, { error: createError, loading: createLoading }] =
    useMutation(createMediaMutation, {
      refetchQueries: 'active',
      onCompleted({ createMedia }) {
        if (createMedia) {
          setValue(createMedia.id);
        }
      },
    });
  const [deleteMediaReq, { error: deleteError, loading: deleteLoading }] =
    useMutation<{}, DeleteMediaMutationRequestType>(deleteMediaMutation, {
      refetchQueries: 'active',
      onCompleted() {
        setValue(undefined);
      },
    });

  const createMedia = useCallback(
    (type: MediaTypeEnum, file: any) => {
      createMediaReq({
        variables: {
          media: {
            name: file.asset_id,
            publicId: file.public_id,
            url: file.url,
            type,
            profileId: Number(profileId),
          },
        },
      });
    },
    [createMediaReq]
  );
  const deleteMedia = useCallback(
    (mediaId: ImageType) => {
      if (!mediaId) {
        return;
      }
      if (
        type !== MediaTypeEnum.PROFILE_PICTURE &&
        user &&
        (user as any).profileImage === mediaId
      ) {
        // Make sure that passed media is not exactly the same as profile image
        // We do not want to delete profile image / banner by accident
        return;
      }
      console.log('deleting ', mediaId);
      deleteMediaReq({
        variables: {
          deleteMediaId: mediaId,
        },
      });
    },
    [deleteMediaReq]
  );
  const [
    {
      data: uploadedImage,
      loading: uploadLoading,
      error: uploadError,
      response: uploadResponse,
    },
    uploadImage,
  ] = useAxios(
    {
      url: 'https://api.cloudinary.com/v1_1/vantagesports/image/upload',
      headers: {},
      method: 'POST',
    },
    { manual: true }
  );

  const onDrop = useCallback((acceptedFiles) => {
    let photoId = 0;
    acceptedFiles.forEach((file: File) => {
      photoId = photoId++;
      let data = new FormData();
      data.append('cloud_name', 'vantagesports');
      data.append('file', file);
      data.append('upload_preset', 'profile_unsigned');
      uploadImage({ data });
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  useEffect(() => {
    if (uploadedImage) {
      createMedia(type, uploadedImage);
      setShow(false);
    }
  }, [uploadedImage]);

  return (
    <>
      {((!uploadedImage && !initialImage) || show) && assets.defaultPic ? (
        <div {...getRootProps({ style })}>
          <input disabled={disabled} {...getInputProps()} />
          <div className="img-upload-block">
            <div className="img-container">
              <img
                src={
                  type === 'banner' ? assets.defaultBanner : assets.defaultPic
                }
              />
            </div>
          </div>
          {!isDragActive && (
            <>
              <Button
                variant="success"
                disabled={disabled}
                style={{ margin: '1.2rem auto', display: 'block' }}
              >
                {uploadLoading ? 'Uploading...' : 'Edit'}
              </Button>
            </>
          )}
          {!deleteError && initialImage && show && (
            <div className="alert alert-info my-2" role="alert">
              Picture successfully removed.
            </div>
          )}
        </div>
      ) : (
        <>
          <Image
            cloudName="vantagesports"
            publicId={uploadedImage?.public_id || initialImage?.publicId}
            crop="fill"
            gravity="face"
          />
          <Button
            variant="danger"
            disabled={disabled}
            style={{ margin: '1.2rem auto', display: 'block' }}
            onClick={(e) => {
              setShow(true);
              deleteMedia(mediaId);
            }}
          >
            Delete
          </Button>
        </>
      )}
      {deleteError && (
        <div className="text text-danger text-small m-2" role="alert">
          Failed to delete picture. Please contact us at{' '}
          <a href="mailto:help@vantagesports.com">help@vantagesports.com</a> if
          the issue happens again.
        </div>
      )}
      {uploadError && (
        <div className="text text-danger text-small m-2" role="alert">
          Failed to upload picture. Please contact us at{' '}
          <a href="mailto:help@vantagesports.com">help@vantagesports.com</a> if
          the issue happens again.
        </div>
      )}
      {createError && (
        <div className="text text-danger text-small m-2" role="alert">
          Failed to save uploaded picture. Please contact us at{' '}
          <a href="mailto:help@vantagesports.com">help@vantagesports.com</a> if
          the issue happens again.
        </div>
      )}
    </>
  );
};

export default UploadImageField;
