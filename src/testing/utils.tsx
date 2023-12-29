import {
  type RenderOptions,
  type RenderResult,
  render,
} from '@testing-library/react';
import { HttpResponse, type RequestHandler, http } from 'msw';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';

import { type ReduxStoreType, createReduxStore } from '~redux/createReduxStore';
import { createWaitHandleCollection } from '~testing/wait-handle';
import { BASE_URL } from '~utils/api-client';

import { mockPetKinds, mockPetList } from './mock-data';

type ExtendedRenderOptions = Omit<RenderOptions, 'queries'> & {
  store?: ReduxStoreType;
};

export const renderWithProviders = (
  ui: ReactElement,
  options?: ExtendedRenderOptions
): RenderResult => {
  const store = options?.store || createReduxStore();
  let restOptions;
  if (options) {
    const { store: _store, ...restOpt } = options;
    restOptions = restOpt;
  }
  return render(<Provider store={store}>{ui}</Provider>, restOptions);
};

export const defaultWaitHandles = createWaitHandleCollection<
  | 'getAllPets'
  | 'getPetKinds'
  | 'getPet'
  | 'deletePet'
  | 'updatePet'
  | 'createPet'
>();

export const defaultHandlers: RequestHandler[] = [
  http.get(`${BASE_URL}/pet/all`, async () => {
    await defaultWaitHandles.getAllPetsWaitHandle.wait();
    return HttpResponse.json(
      mockPetList.map((pet) => ({
        petId: pet.petId,
        petName: pet.petName,
        addedDate: pet.addedDate,
        kind: pet.kind,
      }))
    );
  }),
  http.get(`${BASE_URL}/pet/kinds`, async () => {
    await defaultWaitHandles.getPetKindsWaitHandle.wait();
    return HttpResponse.json(mockPetKinds);
  }),
  http.get(`${BASE_URL}/pet/:petId`, async ({ params }) => {
    await defaultWaitHandles.getPetWaitHandle.wait();
    const petId = Number(params.petId);
    return HttpResponse.json(mockPetList.find((x) => x.petId === petId));
  }),
  http.delete(`${BASE_URL}/pet/:petId`, async ({ params }) => {
    await defaultWaitHandles.deletePetWaitHandle.wait();
    const petId = Number(params.petId);
    return HttpResponse.json(mockPetList.find((x) => x.petId === petId));
  }),
  http.put(`${BASE_URL}/pet/:petId`, async ({ params, request }) => {
    await defaultWaitHandles.updatePetWaitHandle.wait();

    const petId = Number(params.petId);
    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({ ...body, petId });
  }),
  http.post(`${BASE_URL}/pet`, async ({ request }) => {
    await defaultWaitHandles.createPetWaitHandle.wait();

    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({ ...body, petId: 43 });
  }),
];
