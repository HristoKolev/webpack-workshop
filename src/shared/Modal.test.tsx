import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from './Modal';

test('clicking on the X button calls onClose', async () => {
  const user = userEvent.setup();

  const handleOnClose = jest.fn();

  render(
    <Modal onClose={handleOnClose}>
      <div />
    </Modal>
  );

  const xButton = screen.getByRole('button', { name: 'Close modal' });

  await user.click(xButton);

  expect(handleOnClose).toHaveBeenCalled();
});

test('clicking on the backdrop calls onClose', async () => {
  const user = userEvent.setup();

  const handleOnClose = jest.fn();

  render(
    <Modal onClose={handleOnClose}>
      <div />
    </Modal>
  );

  await user.click(screen.getByTestId('modal-backdrop'));

  expect(handleOnClose).toHaveBeenCalled();
});
