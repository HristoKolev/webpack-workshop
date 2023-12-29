import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

import { App } from './App';
import {
  defaultHandlers,
  defaultWaitHandles,
  renderWithProviders,
} from './testing/utils';
import { WaitHandle } from './testing/wait-handle';
import { BASE_URL } from './utils/api-client';

jest.mock('./utils/reportError');

const server = setupServer(...defaultHandlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  jest.restoreAllMocks();
  server.resetHandlers();
  defaultWaitHandles.disableAllHandles();
});

afterAll(() => {
  server.close();
});

const { getPetKindsWaitHandle } = defaultWaitHandles;

describe('landing page', () => {
  test('shows app heading', () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole('heading', { name: 'Pet Store' })
    ).toBeInTheDocument();
  });

  test('add pet button is only shown after the first fetch', async () => {
    getPetKindsWaitHandle.enable();

    renderWithProviders(<App />);

    expect(
      screen.queryByRole('button', { name: 'Add Pet' })
    ).not.toBeInTheDocument();

    const loadingIndicator = await screen.findByTestId('loading-indicator');
    getPetKindsWaitHandle.release();
    await waitForElementToBeRemoved(loadingIndicator);

    expect(screen.getByRole('button', { name: 'Add Pet' })).toBeInTheDocument();
  });

  test('displays a list of pets', async () => {
    getPetKindsWaitHandle.enable();

    renderWithProviders(<App />);

    const loadingIndicator = await screen.findByTestId('loading-indicator');
    getPetKindsWaitHandle.release();
    await waitForElementToBeRemoved(loadingIndicator);

    const table = await screen.findByRole('table');

    expect(within(table).getAllByRole('row', { name: 'Pet' })).toHaveLength(3);
  });

  test('shows an error indicator when the all pets endpoint fails', async () => {
    const waitHandle = new WaitHandle();

    server.use(
      http.get(`${BASE_URL}/pet/all`, async () => {
        await waitHandle.wait();
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<App />);

    const loadingIndicator = await screen.findByTestId('loading-indicator');
    waitHandle.release();
    await waitForElementToBeRemoved(loadingIndicator);

    await waitFor(() => {
      expect(screen.getByTestId('error-indicator')).toBeInTheDocument();
    });
  });

  test('shows an error indicator when the pet kinds endpoint fails', async () => {
    const waitHandle = new WaitHandle();

    server.use(
      http.get(`${BASE_URL}/pet/kinds`, async () => {
        await waitHandle.wait();
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<App />);

    const loadingIndicator = await screen.findByTestId('loading-indicator');
    waitHandle.release();
    await waitForElementToBeRemoved(loadingIndicator);

    await waitFor(() => {
      expect(screen.getByTestId('error-indicator')).toBeInTheDocument();
    });
  });
});

describe('modals', () => {
  test('view / edit button brings up the details modal and cancel closes it', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    const petsTable = await screen.findByRole('table');
    const petRow = within(petsTable).getAllByRole('row', { name: 'Pet' })[0];

    await user.click(
      within(petRow).getByRole('button', { name: 'View / Edit' })
    );

    const editModal = await screen.findByRole('dialog', {
      name: 'View pet modal',
    });

    expect(editModal).toBeInTheDocument();

    await user.click(within(editModal).getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(editModal).not.toBeInTheDocument();
    });
  });

  test('delete button brings up the delete modal and cancel closes it', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    const petsTable = await screen.findByRole('table');
    const petRow = within(petsTable).getAllByRole('row', { name: 'Pet' })[0];

    await user.click(within(petRow).getByRole('button', { name: 'Delete' }));

    const deleteModal = await screen.findByRole('dialog', {
      name: 'Delete pet modal',
    });

    expect(deleteModal).toBeInTheDocument();

    await user.click(
      within(deleteModal).getByRole('button', { name: 'Cancel' })
    );

    await waitFor(() => {
      expect(deleteModal).not.toBeInTheDocument();
    });
  });

  test('add buttons brings up the add modal and cancel closes it', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    const addButton = await screen.findByRole('button', { name: 'Add Pet' });

    await user.click(addButton);

    const addModal = await screen.findByRole('dialog', {
      name: 'Add pet modal',
    });

    expect(addModal).toBeInTheDocument();

    await user.click(within(addModal).getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(addModal).not.toBeInTheDocument();
    });
  });
});

describe('re-fresh pet list', () => {
  test('re-fetches the list of pets when a pet is deleted', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    const table = await screen.findByRole('table');
    const row = within(table).getAllByRole('row', { name: 'Pet' })[0];

    await user.click(within(row).getByRole('button', { name: 'Delete' }));

    const deleteModal = await screen.findByRole('dialog', {
      name: 'Delete pet modal',
    });

    const onPetListEndpoint = jest.fn();
    const onPetKindsEndpoint = jest.fn();

    server.use(
      http.get(`${BASE_URL}/pet/all`, () => {
        onPetListEndpoint();
        return HttpResponse.json([]);
      }),
      http.get(`${BASE_URL}/pet/kinds`, () => {
        onPetKindsEndpoint();
        return HttpResponse.json([]);
      })
    );

    await user.click(
      await within(deleteModal).findByRole('button', { name: 'Confirm' })
    );

    await waitFor(() => {
      expect(onPetListEndpoint).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onPetKindsEndpoint).not.toHaveBeenCalled();
    });
  });

  test('re-fetches the list of pets when a pet is saved', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    const table = await screen.findByRole('table');
    const row = within(table).getAllByRole('row', { name: 'Pet' })[0];

    await user.click(within(row).getByRole('button', { name: 'View / Edit' }));

    const editModal = await screen.findByRole('dialog', {
      name: 'View pet modal',
    });

    await user.click(within(editModal).getByRole('button', { name: 'Edit' }));

    await waitFor(() => {
      expect(
        within(editModal).getByRole('heading', { name: 'Edit pet' })
      ).toBeInTheDocument();
    });

    await user.type(within(editModal).getByLabelText('Name:'), '_new');

    const onPetListEndpoint = jest.fn();
    const onPetKindsEndpoint = jest.fn();

    server.use(
      http.get(`${BASE_URL}/pet/all`, () => {
        onPetListEndpoint();
        return HttpResponse.json([]);
      }),
      http.get(`${BASE_URL}/pet/kinds`, () => {
        onPetKindsEndpoint();
        return HttpResponse.json([]);
      })
    );

    await user.click(
      await within(editModal).findByRole('button', { name: 'Save' })
    );

    await waitFor(() => {
      expect(onPetListEndpoint).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onPetKindsEndpoint).not.toHaveBeenCalled();
    });
  });
});
