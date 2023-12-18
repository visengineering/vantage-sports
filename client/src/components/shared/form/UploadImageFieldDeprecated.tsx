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

export const UploadImageFieldDeprecated: FC<{
  type: MediaTypeEnum;
  savedImage?: MediaType;
  disabled?: boolean;
  createMedia?: (mediaId: MediaType) => void;
  deleteMedia?: () => void;
  allowProfileDelete?: boolean;
}> = ({
  type,
  savedImage,
  disabled = false,
  createMedia,
  deleteMedia,
  allowProfileDelete = false,
}) => {
  const [mediaId, setValue] = useState<number | undefined>(savedImage?.id);

  const user = useUser();
  const { profileId } = useContext(MainContext);
  const [show, setShow] = useState<boolean>(false);
  const [createMediaReq] = useMutation<{ createMedia?: MediaType }>(
    createMediaMutation,
    {
      refetchQueries: ['active', 'Coach'],
      onCompleted({ createMedia: createdMedia }) {
        if (createdMedia) {
          setValue(createdMedia.id);
          if (createMedia) {
            createMedia(createdMedia);
          }
        }
      },
    }
  );
  const [deleteMediaReq] = useMutation(deleteMediaMutation, {
    refetchQueries: ['active', 'Coach'],
    onCompleted() {
      setValue(undefined);
      if (deleteMedia) {
        deleteMedia();
      }
    },
  });

  const createMediaCb = useCallback(
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
  const deleteMediaCb = useCallback(
    (mediaId: number) => {
      if (!allowProfileDelete && user && user.profileImage?.id === mediaId) {
        console.log('prevented picture delete!!');
        // Make sure that passed media is not exactly the same as profile image
        // We do not want to delete profile image / banner by accident
        return;
      }
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
      loading: putLoading,
      error: putError,
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
      createMediaCb(type, uploadedImage);
      setShow(false);
    }
  }, [uploadedImage]);

  return ((!uploadedImage && !savedImage) || show) && assets.defaultPic ? (
    <div {...getRootProps({ style })}>
      {
        savedImage && show && ''
        // WARNING!
        // Deprecated version did not show status updates.
        // Also adding them is problematic because it breaks modal forms...
        // <div className="alert alert-info my-2" role="alert">
        //   Picture removed.
        // </div>
      }
      <input disabled={disabled} {...getInputProps()} />
      <div className="img-upload-block">
        <div className="img-container">
          <img
            src={type === 'banner' ? assets.defaultBanner : assets.defaultPic}
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
            Edit
          </Button>
        </>
      )}
    </div>
  ) : (
    <>
      <div className="img-upload-block">
        <div className="img-container">
          <Image
            cloudName="vantagesports"
            publicId={uploadedImage?.public_id || savedImage?.publicId}
            crop="fill"
            gravity="face"
          />
        </div>
      </div>
      <Button
        variant="danger"
        disabled={disabled}
        style={{ margin: '1.2rem auto', display: 'block' }}
        onClick={(e) => {
          setShow(true);
          if (mediaId) {
            deleteMediaCb(mediaId);
          }
        }}
      >
        Delete
      </Button>
    </>
  );
};

export default UploadImageFieldDeprecated;
