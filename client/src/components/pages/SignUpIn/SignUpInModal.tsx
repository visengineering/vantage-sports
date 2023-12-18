import React, { FC, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { MainContext } from '../../../contexts';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

export type SignInSignUpModalState =
  | ''
  | 'signin'
  | 'signup'
  | 'handleClose'
  | 'purchaseBtnEvent';

type SignUpInModalProps = {
  showModalFor?: string;
  setShowModalFor: (show: string) => void;
  purchaseBtnEvent?: boolean;
  handlePurchaseBtnClick: () => void;
};

const SignUpInModal: FC<SignUpInModalProps> = ({
  showModalFor = '',
  setShowModalFor,
  purchaseBtnEvent = false,
  handlePurchaseBtnClick,
}) => {
  const { userType, profileId, signedIn, profile } = useContext(MainContext);
  const history = useHistory();

  const handleClose = () => {
    setShowModalFor('');
    if (signedIn() && purchaseBtnEvent && handlePurchaseBtnClick) {
      handlePurchaseBtnClick();
    }
    if (signedIn() && !purchaseBtnEvent) {
      history.push(
        Number(userType) === 1
          ? `/${profile?.path || profileId}`
          : `/sports-coaching`
      );
    }
  };

  function handleChildResponse(modalState: SignInSignUpModalState = '') {
    if (modalState === 'signin') setShowModalFor('signin');
    else if (modalState === 'signup') setShowModalFor('signup');
    else if (modalState === 'handleClose') setShowModalFor('');
    else if (modalState === 'purchaseBtnEvent') {
      setShowModalFor('');
      if (purchaseBtnEvent && handlePurchaseBtnClick) {
        handlePurchaseBtnClick();
      }
    } else {
      setShowModalFor('');
    }
  }

  return (
    <Modal
      show={showModalFor ? true : false}
      onHide={handleClose}
      backdrop="static"
      centered
      className="modal-custom"
    >
      <Modal.Header className="py-2 border-0" closeButton />

      <Modal.Body className="p-0 bg-transparent">
        {showModalFor === 'signin' ? (
          <SignInForm
            type="modal"
            setModalState={handleChildResponse}
            isFromPrchsEvntBtn={purchaseBtnEvent}
          />
        ) : (
          showModalFor === 'signup' && (
            <SignUpForm
              type="modal"
              setModalState={handleChildResponse}
              isFromPrchsEvntBtn={purchaseBtnEvent}
            />
          )
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SignUpInModal;
