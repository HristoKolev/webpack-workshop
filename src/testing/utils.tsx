import { HttpResponse, type RequestHandler, http } from 'msw';

import { mockPetKinds, mockPetList } from '~testing/mock-data';
import { createWaitHandleCollection } from '~testing/wait-handle';
import { API_URL } from '~utils/api-client';

export const defaultWaitHandles = createWaitHandleCollection<
  | 'getAllPets'
  | 'getPetKinds'
  | 'getPet'
  | 'deletePet'
  | 'updatePet'
  | 'createPet'
>();

export const defaultHandlers: RequestHandler[] = [
  http.get(`${API_URL}/pet/all`, async () => {
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
  http.get(`${API_URL}/pet/kinds`, async () => {
    await defaultWaitHandles.getPetKindsWaitHandle.wait();
    return HttpResponse.json(mockPetKinds);
  }),
  http.get(`${API_URL}/pet/:petId`, async ({ params }) => {
    await defaultWaitHandles.getPetWaitHandle.wait();
    const petId = Number(params.petId);
    return HttpResponse.json(mockPetList.find((x) => x.petId === petId));
  }),
  http.delete(`${API_URL}/pet/:petId`, async ({ params }) => {
    await defaultWaitHandles.deletePetWaitHandle.wait();
    const petId = Number(params.petId);
    return HttpResponse.json(mockPetList.find((x) => x.petId === petId));
  }),
  http.put(`${API_URL}/pet/:petId`, async ({ params, request }) => {
    await defaultWaitHandles.updatePetWaitHandle.wait();

    const petId = Number(params.petId);
    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({ ...body, petId });
  }),
  http.post(`${API_URL}/pet`, async ({ request }) => {
    await defaultWaitHandles.createPetWaitHandle.wait();

    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({ ...body, petId: 43 });
  }),
];
