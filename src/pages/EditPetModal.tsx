import {
  type ChangeEvent,
  type JSX,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ErrorIndicator } from '~shared/ErrorIndicator';
import { LoadingIndicator } from '~shared/LoadingIndicator';
import { Modal } from '~shared/Modal';
import { createPet, getPet, updatePet } from '~utils/api-client';
import { reportUnknownError } from '~utils/reportUnknownError';
import type { Pet, PetKind } from '~utils/server-data-model';

import { DeletePetModal } from './DeletePetModal';

import './EditPetModal.css';

const getCurrentDate = (): string => {
  const now = new Date();
  return `${now.getFullYear().toString()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
};

const getFormTitle = (
  existingPet: Pet | undefined,
  editMode: boolean
): string => {
  if (existingPet && editMode) {
    return 'Edit pet';
  }
  if (existingPet && !editMode) {
    return 'View pet';
  }
  if (!existingPet && editMode) {
    return 'Add pet';
  }
  return '';
};

interface EditPetModalProps {
  onClose?: () => void;

  petId: number | undefined;

  onSaved?: () => void;

  onDeleted?: () => void;

  petKinds: PetKind[];

  petKindsByValue: Map<number, string>;
}

export const EditPetModal = memo(
  ({
    petId,
    onSaved,
    onDeleted,
    onClose,
    petKinds,
    petKindsByValue,
  }: EditPetModalProps): JSX.Element => {
    const [editingEnabled, setEditingEnabled] = useState<boolean>(false);

    const [selectedPetLoading, setSelectedPetLoading] =
      useState<boolean>(false);
    const [selectedPetError, setSelectedPetError] = useState<boolean>(false);
    const [selectedPet, setSelectedPet] = useState<Pet | undefined>();

    const [savePetLoading, setSavePetLoading] = useState<boolean>(false);
    const [savePetError, setSavePetError] = useState<boolean>();

    const [petName, setPetName] = useState<string>('');
    const handleOnPetNameChange = useCallback(
      (ev: ChangeEvent<HTMLInputElement>) => {
        setPetName(ev.target.value);
      },
      []
    );
    const [kind, setKind] = useState<string>('');
    const handleOnKindChange = useCallback(
      (ev: ChangeEvent<HTMLSelectElement>) => {
        setKind(ev.target.value);
      },
      []
    );
    const [age, setAge] = useState<string>('');
    const handleOnAgeChange = useCallback(
      (ev: ChangeEvent<HTMLInputElement>) => {
        setAge(ev.target.value);
      },
      []
    );
    const [healthProblems, setHealthProblems] = useState<boolean>(false);
    const handleOnHealthProblemsChange = useCallback(
      (ev: ChangeEvent<HTMLInputElement>) => {
        setHealthProblems(ev.target.checked);
      },
      []
    );
    const [addedDate, setAddedDate] = useState<string>('');
    const handleOnAddedDateChange = useCallback(
      (ev: ChangeEvent<HTMLInputElement>) => {
        setAddedDate(ev.target.value);
      },
      []
    );
    const [notes, setNotes] = useState<string>('');
    const handleOnNotesChange = useCallback(
      (ev: ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(ev.target.value);
      },
      []
    );

    const fillForm = useCallback((pet: Pet) => {
      setPetName(pet.petName || '');
      setKind((pet.kind || '').toString());
      setAge((pet.age || '').toString());
      setHealthProblems(Boolean(pet.healthProblems));
      setAddedDate(pet.addedDate || '');
      setNotes(pet.notes || '');
    }, []);

    const readForm = useCallback(
      () => ({
        petName: petName || '',
        kind: Number(kind || '0'),
        age: Number(age || '0'),
        healthProblems,
        addedDate: addedDate || '',
        notes: notes || undefined,
      }),
      [petName, kind, age, healthProblems, addedDate, notes]
    );

    useEffect(() => {
      void (async () => {
        if (petId) {
          try {
            setSelectedPetError(false);
            setSelectedPetLoading(true);

            const pet = await getPet(petId);
            setSelectedPet(pet);
            fillForm(pet);
          } catch (error) {
            reportUnknownError(error);

            setSelectedPetError(true);
          } finally {
            setSelectedPetLoading(false);
          }
        } else {
          fillForm({ addedDate: getCurrentDate() } as Pet);
          setEditingEnabled(true);
        }
      })().catch(reportUnknownError);
    }, [petId, fillForm]);

    const handleOnCancelClick = useCallback(() => {
      if (selectedPet && editingEnabled) {
        fillForm(selectedPet);
        setEditingEnabled(false);
        setSavePetError(false);
      } else {
        onClose?.();
      }
    }, [selectedPet, fillForm, editingEnabled, onClose]);

    const handleOnEditClick = useCallback(() => {
      setEditingEnabled(true);
    }, []);

    const formRef = useRef<HTMLFormElement | null>(null);

    const handleOnSaveClick = useCallback(async () => {
      if (formRef.current?.reportValidity()) {
        try {
          setSavePetLoading(true);
          setSavePetError(false);

          const petData = readForm();

          let updatedPet;

          if (selectedPet) {
            updatedPet = await updatePet(selectedPet.petId, petData);
          } else {
            updatedPet = await createPet(petData);
          }

          setSelectedPet(updatedPet);
          fillForm(updatedPet);
          setEditingEnabled(false);

          onSaved?.();
        } catch (error) {
          reportUnknownError(error);

          setSavePetError(true);
        } finally {
          setSavePetLoading(false);
        }
      }
    }, [formRef, readForm, fillForm, onSaved, selectedPet]);

    const [deletePet, setDeletePet] = useState<Pet | undefined>();
    const handleOnDeleteClick = useCallback(() => {
      setDeletePet(selectedPet);
    }, [selectedPet]);
    const handleOnDeleteModalClose = useCallback(() => {
      setDeletePet(undefined);
    }, []);

    const handleOnClose = useCallback(() => onClose?.(), [onClose]);

    const handleOnDeleted = useCallback(() => {
      onClose?.();
      onDeleted?.();
    }, [onClose, onDeleted]);

    return (
      <Modal
        className="edit-pet-modal"
        disableClosing={selectedPetLoading || savePetLoading}
        onClose={handleOnClose}
        ariaLabel={`${getFormTitle(selectedPet, editingEnabled)} modal`}
      >
        {deletePet && (
          <DeletePetModal
            pet={deletePet}
            onClose={handleOnDeleteModalClose}
            onDeleted={handleOnDeleted}
            petKindsByValue={petKindsByValue}
          />
        )}
        {selectedPetLoading && <LoadingIndicator text="Loading pet" />}
        {selectedPetError && <ErrorIndicator />}
        {!selectedPetLoading && !selectedPetError && (
          <form className="pet-form" ref={formRef}>
            <h1 className="form-title">
              {getFormTitle(selectedPet, editingEnabled)}
            </h1>

            <div className="fields">
              <label htmlFor="petName">
                Name:
                <input
                  type="text"
                  name="petName"
                  id="petName"
                  className="form-input"
                  required
                  minLength={2}
                  maxLength={20}
                  value={petName}
                  onChange={handleOnPetNameChange}
                  disabled={!editingEnabled || savePetLoading}
                />
              </label>

              <label htmlFor="kind">
                Kind:
                <select
                  name="kind"
                  id="kind"
                  className="form-input"
                  required
                  value={kind}
                  onChange={handleOnKindChange}
                  disabled={
                    !editingEnabled || Boolean(selectedPet) || savePetLoading
                  }
                >
                  {!kind && (
                    <option value="" key="">
                      Please, select a pet kind
                    </option>
                  )}

                  {petKinds.map((petKind) => (
                    <option value={petKind.value} key={petKind.value}>
                      {petKind.displayName}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="age">
                Age:
                <input
                  type="number"
                  name="age"
                  id="age"
                  className="form-input"
                  required
                  min="0"
                  value={age}
                  onChange={handleOnAgeChange}
                  disabled={!editingEnabled || savePetLoading}
                />
              </label>

              <label htmlFor="healthProblems">
                Health Problems:
                <input
                  type="checkbox"
                  name="healthProblems"
                  id="healthProblems"
                  className="form-input"
                  checked={healthProblems}
                  onChange={handleOnHealthProblemsChange}
                  disabled={!editingEnabled || savePetLoading}
                />
              </label>

              <label htmlFor="addedDate">
                Added Date:
                <input
                  type="date"
                  name="addedDate"
                  id="addedDate"
                  className="form-input"
                  required
                  value={addedDate}
                  onChange={handleOnAddedDateChange}
                  disabled={
                    !editingEnabled || Boolean(selectedPet) || savePetLoading
                  }
                />
              </label>

              <label htmlFor="notes" className="notes-label">
                <span>Notes:</span>
                <textarea
                  name="notes"
                  id="notes"
                  cols={30}
                  rows={10}
                  className="form-input"
                  value={notes}
                  onChange={handleOnNotesChange}
                  disabled={!editingEnabled || savePetLoading}
                />
              </label>
            </div>

            <div className="indicator-placeholder">
              {savePetLoading && <LoadingIndicator text="Saving pet" />}
              {savePetError && (
                <ErrorIndicator errorMessage="An error occurred while saving the pet." />
              )}
            </div>

            <div className="button-group">
              {!editingEnabled && selectedPet && (
                <>
                  <button
                    type="button"
                    className="btn btn-orange"
                    onClick={handleOnEditClick}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-red"
                    onClick={handleOnDeleteClick}
                  >
                    Delete
                  </button>
                </>
              )}

              {editingEnabled && (
                <button
                  type="button"
                  className="btn btn-blue"
                  onClick={handleOnSaveClick}
                  disabled={savePetLoading}
                >
                  Save
                </button>
              )}

              <button
                type="button"
                className="btn btn-gray"
                onClick={handleOnCancelClick}
                disabled={savePetLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    );
  }
);
