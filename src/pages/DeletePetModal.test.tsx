import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

import { mockPetKindsByValue, mockPetList } from '~testing/mock-data';
import { defaultHandlers } from '~testing/utils';
import { WaitHandle } from '~testing/wait-handle';
import { API_URL } from '~utils/api-client';
import { reportError } from '~utils/reportError';
import type { PetListItem } from '~utils/server-data-model';

import { DeletePetModal } from './DeletePetModal';

jest.mock('../utils/reportError');

const server = setupServer(...defaultHandlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  jest.restoreAllMocks();
});

afterAll(() => {
  server.close();
});

const renderDeleteModal = () => {
  const pet: PetListItem = {
    petId: 42,
    petName: 'Gosho',
    kind: 1,
    addedDate: '2022-10-31',
  };

  const handleOnDeleted = jest.fn();
  const handleOnClose = jest.fn();

  render(
    <DeletePetModal
      pet={pet}
      petKindsByValue={mockPetKindsByValue}
      onDeleted={handleOnDeleted}
      onClose={handleOnClose}
    />
  );

  return {
    handleOnDeleted,
    handleOnClose,
  };
};

test('shows heading and pet data', () => {
  renderDeleteModal();

  expect(
    screen.getByRole('dialog', { name: 'Delete pet modal' })
  ).toBeInTheDocument();

  expect(screen.getByRole('heading')).toHaveTextContent(
    'Are you sure you want to delete this pet?'
  );

  expect(screen.getByTestId('delete-modal_petId')).toHaveTextContent(
    'PetId: 42'
  );
  expect(screen.getByTestId('delete-modal_petName')).toHaveTextContent(
    'Pet Name: Gosho'
  );
  expect(screen.getByTestId('delete-modal_petKind')).toHaveTextContent(
    'Pet Kind: Cat'
  );
});

test('onClose is called on cancel click', async () => {
  const user = userEvent.setup();

  const { handleOnClose } = renderDeleteModal();

  await user.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(handleOnClose).toHaveBeenCalled();
});

test('delete pet endpoint is called on confirm click', async () => {
  const user = userEvent.setup();

  const onDeletePetEndpoint = jest.fn();

  const waitHandle = new WaitHandle();

  server.use(
    http.delete(`${API_URL}/pet/:petId`, async ({ params }) => {
      await waitHandle.wait();
      const petId = Number(params.petId);
      onDeletePetEndpoint(petId);
      return HttpResponse.json(mockPetList.find((x) => x.petId === petId));
    })
  );

  const { handleOnDeleted } = renderDeleteModal();

  await user.click(screen.getByRole('button', { name: 'Confirm' }));

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  waitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await waitFor(() => {
    expect(handleOnDeleted).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(onDeletePetEndpoint).toHaveBeenCalledWith(42);
  });
});

test('shows error when the delete call fails', async () => {
  const user = userEvent.setup();

  const { handleOnDeleted } = renderDeleteModal();

  const waitHandle = new WaitHandle();

  server.use(
    http.delete(`${API_URL}/pet/:petId`, async () => {
      await waitHandle.wait();
      return new HttpResponse(null, { status: 500 });
    })
  );

  await user.click(screen.getByRole('button', { name: 'Confirm' }));

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  waitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await waitFor(() => {
    expect(screen.getByTestId('error-indicator')).toBeInTheDocument();
  });

  expect(handleOnDeleted).not.toHaveBeenCalled();

  expect(reportError).toHaveBeenCalled();
});
