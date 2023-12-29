import { type JSX, type ReactNode, memo, useCallback } from 'react';
import { createPortal } from 'react-dom';

import closeModalPng from './close-modal.png';

import './Modal.css';

interface ModalProps {
  children: ReactNode;

  className?: string;

  ariaLabel?: string;

  ariaLabelledBy?: string;

  disableClosing?: boolean;

  onClose?: () => void;
}

const ModalImpl = memo(
  ({
    children,
    onClose,
    className,
    ariaLabel,
    ariaLabelledBy,
    disableClosing,
  }: ModalProps): JSX.Element => {
    const handleOnClose = useCallback(() => onClose?.(), [onClose]);

    return (
      <div className="modal">
        <button
          type="button"
          className="modal-backdrop"
          data-testid="modal-backdrop"
          aria-label="Close modal"
          disabled={disableClosing}
          onClick={handleOnClose}
        />
        <div
          className={`modal-body ${className || ''}`}
          role="dialog"
          {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
          {...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {})}
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
