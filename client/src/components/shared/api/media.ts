import { gql } from '@apollo/client';

export const createMediaMutation = gql`
  mutation createMedia($media: MediaInputTypeCreate!) {
    createMedia(media: $media) {
      id
    }
  }
`;

export type DeleteMediaMutationRequestType = {
  deleteMediaId: number;
};
export const deleteMediaMutation = gql`
  mutation DeleteMedia($deleteMediaId: Int!) {
    deleteMedia(id: $deleteMediaId) {
      id
      name
      publicId
      url
      type
      externalId
      eventId
      contentId
      createdAt
      updatedAt
    }
  }
`;
