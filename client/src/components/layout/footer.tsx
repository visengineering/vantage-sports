import React, { useContext, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
const { Link } = require('react-router-dom');
import * as assets from '../../assets';
import facebook from '../../assets/facebook.svg';
import { useMediaQuery } from 'react-responsive';
import { MainContext } from 'src/contexts';
import { SocialList } from './SocialList';

type ButtonMailtoProps = {
  className: string;
  mailto: string;
  label: string;
};
const ButtonMailto = ({ className, mailto, label }: ButtonMailtoProps) => {
  return (
    <Link
      to="#"
      className={className}
      onClick={(e: any) => {
        window.location.href = `mailto: ${mailto}`;
        e.preventDefault();
      }}
    >
      {label}
    </Link>
  );
};
const SupportSection = () => (
  <div className="quick-nav">
    <div className="title">Support</div>

    <ul className="nav-list">
      <li className="list-item">
        <a href="/faq" className="list-link">
          FAQ
        </a>
      </li>
      <li className="list-item">
        <a href="/charity" className="list-link">
          Charity
        </a>
      </li>
      <li className="list-item">
        <ButtonMailto
          className="list-link"
          label="Contact Us"
          mailto="info@vantagesports.com"
        />
      </li>
    </ul>
  </div>
);
const LegalSection = () => (
  <div className="quick-nav">
    <div className="title">Legal</div>

    <ul className="nav-list">
      <li className="list-item">
        <a href="/terms-of-service" className="list-link">
          Terms of Service
        </a>
      </li>
      <li className="list-item">
        <a href="/privacy-policy" className="list-link">
          Privacy Policy
        </a>
      </li>
    </ul>
  </div>
);
const PressSection = () => (
  <div className="quick-nav">
    <div className="title">Press</div>

    <ul className="nav-list">
      <li className="list-item">
        <a href="/testimonials" className="list-link">
          Testimonials
        </a>
      </li>
      <li className="list-item">
        <a href="/news" className="list-link">
          News Releases
        </a>
      </li>
      <li className="list-item">
        <a href="/keys-to-coaching" className="list-link">
          5 Keys To Coaching
        </a>
      </li>

      <li className="list-item">
        <a href="/recruiting-guide" className="list-link">
          Recruiting Guide
        </a>
      </li>
      <li className="list-item">
        <a href="/soccer" className="list-link">
          Soccer
        </a>
      </li>
      <li className="list-item">
        <a href="/sports-partner" className="list-link">
          Sports Partner
        </a>
      </li>
    </ul>
  </div>
);
const MediaSection = () => {
  const { signedIn } = useContext(MainContext);
  return (
    <div>
      <SocialList className="social-list" />

      {!signedIn() && (
        <div>
          <p className="font-weight-medium">Ready to become a coach?</p>
          <a
            href="/coach-signup"
            className="btn border border-primary bg-light text-primary font-weight-medium"
          >
            Join as a coach
          </a>
        </div>
      )}
      <div className="mt-4">
        <p className="font-weight-medium">Want to find a coach?</p>
        <Link
          to="/coaches"
          className="btn border border-primary bg-light text-primary font-weight-medium"
        >
          Find a coach
        </Link>
      </div>
    </div>
  );
};
const LargeDevicesFooter = () => {
  return (
    <footer className="bg-white border-top py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 mx-auto">
            <div className="row">
              <div className="col-lg-3 col-6">
                <SupportSection />
              </div>
              <div className="col-lg-3 col-6">
                <LegalSection />
              </div>
              <div className="col-lg-3 col-6">
                <PressSection />
              </div>

              <div className="col-lg-3 col-6">
                <MediaSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
const SmallAndMediumDevicesFooter = () => {
  return (
    <footer className="bg-white border-top py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 mx-auto">
            <div className="row">
              <div className="col-6">
                <SupportSection />
                <PressSection />
              </div>
              <div className="col-6">
                <LegalSection />
                <MediaSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Footer = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 991px)' });
  return (
    <>
      {isTabletOrMobile && <SmallAndMediumDevicesFooter />}
      {!isTabletOrMobile && <LargeDevicesFooter />}
    </>
  );
};
export default Footer;
