import React, { FC } from 'react';
import { Modal } from 'react-bootstrap';
import { RemoveChildForm } from 'src/components/shared/player/children/RemoveChildForm';

export const RemoveChildModal: FC<{
  showModal: boolean;
  onHide: () => void;
  childId: number;
}> = ({ childId, showModal, onHide }) => {
  return (
    <Modal show={showModal} onHide={onHide} className="edit-child-modal">
      <Modal.Header closeButton>
        <Modal.Title>Remove Child Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RemoveChildForm
          childId={childId}
          onSuccess={() => {
            onHide();
          }}
        />
      </Modal.Body>
    </Modal>
  );
};
