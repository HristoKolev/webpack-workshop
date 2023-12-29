import { type JSX, type ReactNode, memo, useCallback } from 'react';
import { createPortal } from 'react-dom';

import closeModalPng from './close-modal.png';

import './Modal.css';

interface ModalProps {
  children: ReactNode;

  className?: string;

  ariaLabel?: string;

  disableClosing?: boolean;

  onClose?: () => void;
}

const ModalImpl = memo(
  ({
    children,
    onClose,
    className,
    ariaLabel,
    disableClosing,
  }: ModalProps): JSX.Element => {
    const handleOnClose = useCallback(() => onClose?.(), [onClose]);

    return (
      <div className="modal open">
        <button
          type="button"
          className="modal-backdrop"
          data-testid="modal-backdrop"
          aria-label="Close modal"
          disabled={disableClosing}
          onClick={handleOnClose}
        />
        <div
          className={`modal-container ${className || ''}`}
          role="dialog"
          aria-label={ariaLabel}
        >
          {children}
          <button
            type="button"
            className="modal-close-button"
            data-testid="modal-close-button"
            aria-label="Close modal"
            disabled={disableClosing}
            onClick={handleOnClose}
          >
            <img src={closeModalPng} alt="Close modal" width={30} height={30} />
          </button>
        </div>
      </div>
    );
  }
);

export const Modal = ({ children, ...rest }: ModalProps) =>
  createPortal(<ModalImpl {...rest}>{children}</ModalImpl>, document.body);
