import React, { useState, useContext, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/logo2.png';
import { MainContext } from '../../contexts';
import SignUpInModal from '../pages/SignUpIn/SignUpInModal';
import { DisabledBookingStripe } from '../shared/coach/DisabledBookingStripe';
import { SocialList } from './SocialList';

const Header = () => {
  const [alert, setAlert] = useState({ show: false, message: '' });
  const {
    profileId,
    isCoach,
    player,
    signedIn,
    isSocialSignup,
    setIsSocialSignup,
    admin,
    profile,
    logout,
  } = useContext(MainContext);

  const [showSignUpInModal, setShowSignUpInModal] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (showSignUpInModal === 'signup') {
      if (isSocialSignup) {
        setIsSocialSignup(false);

        // Removing previous state from inside of history
        history.replace({ state: undefined });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSignUpInModal]);

  const handleSignupButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault?.();
    setShowSignUpInModal('signup');
  };

  const handleSigninBtnClick = (e: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault?.();
    setShowSignUpInModal('signin');
  };

  return (
    <>
      {showSignUpInModal && (
        <SignUpInModal
          showModalFor={showSignUpInModal}
          setShowModalFor={setShowSignUpInModal}
          handlePurchaseBtnClick={() => {}}
        />
      )}

      {alert.show && (
        <Alert
          variant="danger"
          style={{
            position: 'fixed',
            top: '5%',
            zIndex: 10000,
            right: '25%',
            left: '25%',
          }}
          dismissible
          onClose={() => setAlert({ show: false, message: '' })}
        >
          <Alert.Heading>Error!</Alert.Heading>
          <p>{alert.message}</p>
        </Alert>
      )}
      <Navbar
        className="top-navbar sticky-top shadow-sm font-weight-medium flex-wrap p-0"
        expand="lg"
      >
        <div className="container mx-auto my-3">
          <Navbar.Brand
            className="pb-2"
            href={
              signedIn() && profile
                ? isCoach
                  ? `/${profile?.path || profile.id}`
                  : `/player/${profile.id}/`
                : '/'
            }
          >
            <img src={logo} alt="Vantage Sports" className="logo" />
          </Navbar.Brand>

          {admin && (
            <Nav.Link className="signup_small mx-2" href={`/admin`}>
              Admin Panel
            </Nav.Link>
          )}

          {!signedIn() && (
            <div className="d-flex">
              <Navbar className="signup_small">
                <Button
                  className="join-button font-weight-medium"
                  onClick={handleSigninBtnClick}
                >
                  Sign In
                </Button>
              </Navbar>
              <Navbar className="signup_small">
                <Button
                  onClick={(e) => handleSignupButtonClick(e)}
                  className="join-button bg-light text-primary font-weight-medium"
                  variant="primary"
                >
                  Join Today
                </Button>
              </Navbar>
            </div>
          )}

          <Navbar.Toggle className="mr-2" aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="navbar-nav">
            <Nav className="right-nav ml-auto">
              <Nav.Link className="nav-item" href="/blog">
                Blog
              </Nav.Link>
              <Nav.Link className="nav-item" href="/sports-coaching">
                Available Training
              </Nav.Link>
              <Nav.Link className="nav-item" href="/coaches">
                Coaches
              </Nav.Link>

              {player() && (
                <Nav.Link className="nav-item" href={`/player/${profileId}`}>
                  Dashboard
                </Nav.Link>
              )}
              {isCoach && (
                <Nav.Link
                  className="nav-item mx-2"
                  href={`/${profile?.path || profileId}`}
                >
                  My Profile
                </Nav.Link>
              )}

              {admin && (
                <Nav.Link className="nav-item mx-2" href={`/admin`}>
                  Admin Panel
                </Nav.Link>
              )}

              {signedIn() && (
                <Nav.Link
                  className="nav-item"
                  onClick={() => {
                    logout();
                  }}
                  href="#"
                >
                  Sign Out
                </Nav.Link>
              )}

              {!signedIn() && (
                <>
                  <Nav.Item className="signup_menu">
                    <Button
                      onClick={(e) => handleSignupButtonClick(e)}
                      className="join-button register-btn bg-light text-primary font-weight-medium"
                      variant="primary"
                    >
                      Join Today
                    </Button>
                  </Nav.Item>
                  <Nav.Item className="signup_menu">
                    <Button
                      className="join-button font-weight-medium"
                      variant="primary"
                      onClick={handleSigninBtnClick}
                    >
                      Sign In
                    </Button>
                  </Nav.Item>
                </>
              )}

              <SocialList />
            </Nav>
          </Navbar.Collapse>
        </div>
        {signedIn() && profile?.disabledBooking && <DisabledBookingStripe />}
      </Navbar>
    </>
  );
};

export { Header };
