import React from "react";
import { X } from "lucide-react";
import styled from "styled-components";

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;

  &.open {
    opacity: 1;
    visibility: visible;
  }
`;

const DialogContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(0.95);
  opacity: 0;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;

  &.open {
    transform: scale(1);
    opacity: 1;
  }
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const DialogTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const DialogMessage = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #4b5563;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;

  &:hover:not(:disabled) {
    background-color: #e5e7eb;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #ef4444;
  color: white;
  border: 1px solid #ef4444;

  &:hover:not(:disabled) {
    background-color: #dc2626;
    border-color: #dc2626;
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirming = false,
}) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isConfirming) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, isConfirming]);

  // Prevent scrolling when dialog is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Click outside to close
  const contentRef = React.useRef(null);
  const handleOverlayClick = (e) => {
    if (
      !isConfirming &&
      contentRef.current &&
      !contentRef.current.contains(e.target)
    ) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <DialogOverlay
      className={isOpen ? "open" : ""}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <DialogContent
        className={isOpen ? "open" : ""}
        ref={contentRef}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        <DialogHeader>
          <DialogTitle id="dialog-title">{title}</DialogTitle>
          <CloseButton
            onClick={onClose}
            disabled={isConfirming}
            aria-label="Close dialog"
          >
            <X size={18} />
          </CloseButton>
        </DialogHeader>

        <DialogMessage id="dialog-message">{message}</DialogMessage>

        <DialogActions>
          <CancelButton onClick={onClose} disabled={isConfirming} type="button">
            {cancelText}
          </CancelButton>
          <ConfirmButton
            onClick={onConfirm}
            disabled={isConfirming}
            type="button"
          >
            {isConfirming && <Spinner aria-hidden="true" />}
            {confirmText}
          </ConfirmButton>
        </DialogActions>
      </DialogContent>
    </DialogOverlay>
  );
};

export default ConfirmationDialog;
