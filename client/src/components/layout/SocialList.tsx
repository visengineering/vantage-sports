import React, { FC } from 'react';
import { Nav } from 'react-bootstrap';
import facebook from '../../assets/facebook.svg';
import * as assets from '../../assets';

export const SocialList: FC<{
  Component?: React.FC<{ href: string; target: string }>;
  className?: string;
}> = ({ Component = Nav.Link, className = 'd-flex' }) => (
  <div className={className}>
    <Component href="https://www.tiktok.com/@yosefvtg?" target="social">
      <img src={assets.tiktok} alt="tiktok" />
    </Component>
    <Component href="https://www.twitter.com/Vantage_NIL/" target="social">
      <img src={assets.twitter} alt="twitter" />
    </Component>
    <Component
      href="https://www.instagram.com/vantagesports_nil/"
      target="social"
    >
      <img src={assets.instagram} alt="instagram" />
    </Component>
    <Component
      href="https://www.facebook.com/pages/category/Sports/Vantage-Sports-104350515110470/"
      target="social"
    >
      <img src={facebook} alt="facebook" />
    </Component>
  </div>
);
