import React, { FC } from 'react';
import facebook from '../../assets/share-icons/facebook.svg';
import link from '../../assets/share-icons/link.svg';
import envelope from '../../assets/share-icons/envelope.svg';
import * as assets from '../../assets';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';
import { useNotification } from '../shared/hooks/use-notifications';

export const ShareOnSocial: FC<{
  shareLink: string;
  emailSubject?: string;
  className?: string;
}> = ({ shareLink: postLink, emailSubject, className }) => {
  const notify = useNotification();
  return (
    <div className={`d-flex align-items-center share-on-socials ${className}`}>
      <TwitterShareButton url={postLink}>
        <img
          className="share-icon"
          src={assets.twitter}
          alt="share on twitter"
        />
      </TwitterShareButton>
      <FacebookShareButton url={postLink}>
        <img className="share-icon" src={facebook} alt="share on facebook" />
      </FacebookShareButton>
      {emailSubject && (
        <EmailShareButton subject={emailSubject} url={postLink}>
          <img className="share-icon" src={envelope} alt="share via email" />
        </EmailShareButton>
      )}
      <button
        id="copy-link-button"
        onClick={() => {
          navigator.clipboard.writeText(postLink);
          notify({
            type: 'success',
            children: 'Copied to clipboard',
          });
        }}
      >
        <img className="share-icon" src={link} alt="copy link" />
      </button>
    </div>
  );
};
