import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

import { mockPetKinds, mockPetKindsByValue } from '~testing/mock-data';
import { defaultHandlers, defaultWaitHandles } from '~testing/utils';
import { WaitHandle } from '~testing/wait-handle';
import { BASE_URL } from '~utils/api-client';

import { EditPetModal } from './EditPetModal';

jest.mock('../utils/reportUnknownError');

const server = setupServer(...defaultHandlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  jest.restoreAllMocks();
  defaultWaitHandles.disableAllHandles();
});

afterAll(() => {
  server.close();
});

const { getPetWaitHandle, updatePetWaitHandle } = defaultWaitHandles;

interface RenderEditModalOptions {
  registerHandlers?: () => void;

  addMode?: boolean;
}

const renderEditModal = (options?: RenderEditModalOptions) => {
  const handleOnDeleted = jest.fn();
  const handleOnClose = jest.fn();
  const handleOnSaved = jest.fn();

  options?.registerHandlers?.();

  const petId = options?.addMode ? undefined : 42;

  render(
    <EditPetModal
      petKinds={mockPetKinds}
      petKindsByValue={mockPetKindsByValue}
      petId={petId}
      onClose={handleOnClose}
      onDeleted={handleOnDeleted}
      onSaved={handleOnSaved}
    />
  );

  return {
    handleOnDeleted,
    handleOnClose,
    handleOnSaved,
  };
};

const verifyDisplayMode = async () => {
  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: 'View pet' })
    ).toBeInTheDocument();
  });

  const editButton = screen.getByRole('button', { name: 'Edit' });
  const deleteButton = screen.getByRole('button', { name: 'Delete' });
  const cancelButton = screen.getByRole('button', { name: 'Cancel' });

  expect(editButton).toBeEnabled();
  expect(deleteButton).toBeEnabled();
  expect(cancelButton).toBeEnabled();

  const nameField = screen.getByLabelText('Name:');
  expect(nameField).toBeDisabled();

  const kindField = screen.getByLabelText('Kind:');
  expect(kindField).toBeDisabled();

  const ageField = screen.getByLabelText('Age:');
  expect(ageField).toBeDisabled();

  const healthProblemsField = screen.getByLabelText('Health Problems:');
  expect(healthProblemsField).toBeDisabled();

  const addedDateField = screen.getByLabelText('Added Date:');
  expect(addedDateField).toBeDisabled();

  const notesField = screen.getByLabelText('Notes:');
  expect(notesField).toBeDisabled();
};

const verifyEditMode = () => {
  expect(screen.getByRole('heading', { name: 'Edit pet' })).toBeInTheDocument();

  const saveButton = screen.getByRole('button', { name: 'Save' });
  const cancelButton = screen.getByRole('button', { name: 'Cancel' });

  expect(saveButton).toBeEnabled();
  expect(cancelButton).toBeEnabled();

  const nameField = screen.getByLabelText('Name:');
  expect(nameField).toBeEnabled();

  const kindField = screen.getByLabelText('Kind:');
  expect(kindField).toBeDisabled();

  const ageField = screen.getByLabelText('Age:');
  expect(ageField).toBeEnabled();

  const healthProblemsField = screen.getByLabelText('Health Problems:');
  expect(healthProblemsField).toBeEnabled();

  const addedDateField = screen.getByLabelText('Added Date:');
  expect(addedDateField).toBeDisabled();

  const notesField = screen.getByLabelText('Notes:');
  expect(notesField).toBeEnabled();
};

const verifyAddMode = () => {
  expect(screen.getByRole('heading', { name: 'Add pet' })).toBeInTheDocument();

  const saveButton = screen.getByRole('button', { name: 'Save' });
  const cancelButton = screen.getByRole('button', { name: 'Cancel' });

  expect(saveButton).toBeEnabled();
  expect(cancelButton).toBeEnabled();

  const nameField = screen.getByLabelText('Name:');
  expect(nameField).toBeEnabled();

  const kindField = screen.getByLabelText('Kind:');
  expect(kindField).toBeEnabled();

  const ageField = screen.getByLabelText('Age:');
  expect(ageField).toBeEnabled();

  const healthProblemsField = screen.getByLabelText('Health Problems:');
  expect(healthProblemsField).toBeEnabled();

  const addedDateField = screen.getByLabelText('Added Date:');
  expect(addedDateField).toBeEnabled();

  const notesField = screen.getByLabelText('Notes:');
  expect(notesField).toBeEnabled();
};

const verifyDefaultFieldValues = () => {
  expect(screen.getByLabelText('Name:')).toHaveValue('Gosho');
  expect(screen.getByLabelText('Kind:')).toHaveValue('1');
  expect(screen.getByLabelText('Age:')).toHaveValue(2);
  expect(screen.getByLabelText('Health Problems:')).not.toBeChecked();
  expect(screen.getByLabelText('Added Date:')).toHaveValue('2022-10-31');
  expect(screen.getByLabelText('Notes:')).toHaveValue('White fur, very soft.');
};

test('edit modal defaults to view mode when called with a valid pet id', async () => {
  getPetWaitHandle.enable();

  renderEditModal();

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  getPetWaitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await verifyDisplayMode();
});

test('shows error indicator when pet request fails', async () => {
  const waitHandle = new WaitHandle();

  renderEditModal({
    registerHandlers: () => {
      server.use(
        http.get(`${BASE_URL}/pet/:petId`, async () => {
          await waitHandle.wait();
          return new HttpResponse(null, { status: 500 });
        })
      );
    },
  });

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  waitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await waitFor(() => {
    expect(screen.getByTestId('error-indicator')).toBeInTheDocument();
  });
});

test('onClosed is called on successful delete operation', async () => {
  const user = userEvent.setup();

  const { handleOnClose } = renderEditModal();

  const deleteButton = await screen.findByRole('button', { name: 'Delete' });

  await user.click(deleteButton);

  const deleteModal = await screen.findByRole('dialog', {
    name: 'Delete pet modal',
  });

  const confirmButton = await within(deleteModal).findByRole('button', {
    name: 'Confirm',
  });

  await user.click(confirmButton);

  expect(handleOnClose).toHaveBeenCalled();
});

test('onClosed is called when cancel button is clicked', async () => {
  const user = userEvent.setup();

  const { handleOnClose } = renderEditModal();

  const cancelButton = await screen.findByRole('button', { name: 'Cancel' });

  await user.click(cancelButton);

  expect(handleOnClose).toHaveBeenCalled();
});

test('transitions the form into edit mode when the edit button is clicked', async () => {
  const user = userEvent.setup();

  renderEditModal();

  const editButton = await screen.findByRole('button', { name: 'Edit' });

  await user.click(editButton);

  verifyEditMode();
});

test('transitions back to display mode when the cancel button is clicked', async () => {
  const user = userEvent.setup();

  renderEditModal();

  const editButton = await screen.findByRole('button', { name: 'Edit' });

  await user.click(editButton);

  expect(screen.getByRole('heading', { name: 'Edit pet' })).toBeInTheDocument();

  const cancelButton = await screen.findByRole('button', { name: 'Cancel' });

  await user.click(cancelButton);

  await verifyDisplayMode();
});

const changeEditFormFields = async (
  user: ReturnType<typeof userEvent.setup>
) => {
  const nameField = screen.getByLabelText('Name:');
  const ageField = screen.getByLabelText('Age:');
  const healthProblemsField = screen.getByLabelText('Health Problems:');
  const notesField = screen.getByLabelText('Notes:');

  await user.clear(nameField);
  await user.type(nameField, 'test123');
  await user.clear(ageField);
  await user.type(ageField, '2');
  await user.click(healthProblemsField);
  await user.clear(notesField);
  await user.type(notesField, 'Notes 123');
};

test('clicking save transitions the form to display mode', async () => {
  const user = userEvent.setup();

  renderEditModal();

  await user.click(await screen.findByRole('button', { name: 'Edit' }));

  await changeEditFormFields(user);

  updatePetWaitHandle.enable();

  const saveButton = screen.getByRole('button', { name: 'Save' });

  await user.click(saveButton);

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  updatePetWaitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await verifyDisplayMode();

  expect(screen.getByLabelText('Name:')).toHaveValue('test123');
  expect(screen.getByLabelText('Kind:')).toHaveValue('1');
  expect(screen.getByLabelText('Age:')).toHaveValue(2);
  expect(screen.getByLabelText('Health Problems:')).toBeChecked();
  expect(screen.getByLabelText('Added Date:')).toHaveValue('2022-10-31');
  expect(screen.getByLabelText('Notes:')).toHaveValue('Notes 123');
});

test('delete modal is closed after cancel is clicked', async () => {
  const user = userEvent.setup();

  renderEditModal();

  const deleteButton = await screen.findByRole('button', { name: 'Delete' });

  await user.click(deleteButton);

  const deleteModal = await screen.findByRole('dialog', {
    name: 'Delete pet modal',
  });

  const cancelButton = await within(deleteModal).findByRole('button', {
    name: 'Cancel',
  });

  await user.click(cancelButton);

  await waitFor(() => {
    expect(
      screen.queryByRole('dialog', { name: 'Delete pet modal' })
    ).not.toBeInTheDocument();
  });
});

test('form is returned to display mode when the cancel button is clicked', async () => {
  const user = userEvent.setup();

  renderEditModal();

  await user.click(await screen.findByRole('button', { name: 'Edit' }));

  await changeEditFormFields(user);

  const cancelButton = screen.getByRole('button', { name: 'Cancel' });

  await user.click(cancelButton);

  await verifyDisplayMode();

  verifyDefaultFieldValues();
});

test('cancel button resets the state successfully after failed update request', async () => {
  const user = userEvent.setup();

  renderEditModal();

  await user.click(await screen.findByRole('button', { name: 'Edit' }));

  await changeEditFormFields(user);

  const waitHandle = new WaitHandle();

  server.use(
    http.put(`${BASE_URL}/pet/:petId`, async () => {
      await waitHandle.wait();
      return new HttpResponse(null, { status: 500 });
    })
  );

  const saveButton = screen.getByRole('button', { name: 'Save' });

  await user.click(saveButton);

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  waitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await waitFor(() => {
    expect(screen.getByTestId('error-indicator')).toBeInTheDocument();
  });

  const cancelButton = screen.getByRole('button', { name: 'Cancel' });

  await user.click(cancelButton);

  await verifyDisplayMode();

  verifyDefaultFieldValues();

  await waitFor(() => {
    expect(screen.queryByTestId('error-indicator')).not.toBeInTheDocument();
  });
});

test('will not submit data if input validation fails', async () => {
  const reportValidityMock = jest.spyOn(
    HTMLFormElement.prototype,
    'reportValidity'
  );
  reportValidityMock.mockImplementation(() => false);

  const user = userEvent.setup();

  renderEditModal();

  const editButton = await screen.findByRole('button', { name: 'Edit' });

  await user.click(editButton);

  const nameField = screen.getByLabelText('Name:');

  await user.clear(nameField);
  await user.type(nameField, 'X');

  const updateEndpointFunc = jest.fn();

  server.use(
    http.put(`${BASE_URL}/pet/:petId`, () => {
      updateEndpointFunc();
      return HttpResponse.json({});
    })
  );

  await user.click(screen.getByRole('button', { name: 'Save' }));

  expect(updateEndpointFunc).not.toHaveBeenCalled();

  verifyEditMode();
});

describe('add mode', () => {
  const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
    const nameField = screen.getByLabelText('Name:');
    const kindField = screen.getByLabelText('Kind:');
    const ageField = screen.getByLabelText('Age:');
    const healthProblemsField = screen.getByLabelText('Health Problems:');
    const addedDateField = screen.getByLabelText('Added Date:');
    const notesField = screen.getByLabelText('Notes:');

    await user.clear(nameField);
    await user.type(nameField, 'test123');
    await user.selectOptions(kindField, ['Cat']);
    await user.clear(ageField);
    await user.type(ageField, '2');
    await user.click(healthProblemsField);
    await user.clear(addedDateField);
    await user.type(addedDateField, '2023-10-10');
    await user.clear(notesField);
    await user.type(notesField, 'Notes 123');
  };

  test('error indicator is shown when the add request fails', async () => {
    const user = userEvent.setup();

    const waitHandle = new WaitHandle();

    renderEditModal({
      registerHandlers: () => {
        server.use(
          http.post(`${BASE_URL}/pet`, async () => {
            await waitHandle.wait();
            return new HttpResponse(null, { status: 500 });
          })
        );
      },
      addMode: true,
    });

    verifyAddMode();

    await fillForm(user);

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    const loadingIndicator = await screen.findByTestId('loading-indicator');
    waitHandle.release();
    await waitForElementToBeRemoved(loadingIndicator);

    await waitFor(() => {
      expect(screen.getByTestId('error-indicator')).toBeInTheDocument();
    });
  });

  test('transitions to display mode after successful save', async () => {
    const user = userEvent.setup();

    renderEditModal({
      addMode: true,
    });

    verifyAddMode();

    await fillForm(user);

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    await verifyDisplayMode();
  });

  test('cancel button calls onClose', async () => {
    const user = userEvent.setup();

    const { handleOnClose } = renderEditModal({
      addMode: true,
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(cancelButton);

    expect(handleOnClose).toHaveBeenCalled();
  });

  test('once pet kind is selected the empty option is removed from the list', async () => {
    const user = userEvent.setup();

    renderEditModal({ addMode: true });

    const kindField = screen.getByLabelText('Kind:');

    const getOptionValues = () =>
      within(kindField)
        .getAllByRole<HTMLOptionElement>('option')
        .map((x) => x.value);

    expect(getOptionValues()).toStrictEqual(['', '1', '2', '3']);

    await user.selectOptions(kindField, ['Cat']);

    expect(getOptionValues()).toStrictEqual(['1', '2', '3']);
  });
});
