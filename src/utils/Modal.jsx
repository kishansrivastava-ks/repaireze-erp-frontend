import { X } from "lucide-react";
import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  background: white;
  padding: 28px 32px;
  border-radius: 12px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  transform: translateY(0);
  opacity: 1;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    color: #000;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
`;

const ModalHeader = styled.h2`
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 1.5em;
  font-weight: 600;
  color: #222;
  letter-spacing: -0.02em;
`;

const ModalBody = styled.div`
  margin-bottom: 28px;
  color: #444;
  line-height: 1.6;
  font-size: 1rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const Modal = ({ isOpen, onClose, title, children, footerContent }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={18} />
        </CloseButton>

        {title && <ModalHeader>{title}</ModalHeader>}

        <ModalBody>{children}</ModalBody>

        {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
      </ModalContent>
    </Overlay>
  );
};

export default Modal;
