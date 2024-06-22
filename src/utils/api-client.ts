import { reportUnknownError } from '~utils/reportUnknownError';

import type { Pet, PetKind, PetListItem } from './server-data-model';

const REQUEST_TIMEOUT = 30 * 1000; // 30 seconds.
export const BASE_URL = 'http://localhost:5150';

export const fetchJSON = async <T>(
  httpRequest: RequestInit & { url: string }
) => {
  const ac = new AbortController();
  const timeoutId = setTimeout(() => {
    ac.abort();
  }, REQUEST_TIMEOUT);

  let httpResponse;
  try {
    httpResponse = await fetch(httpRequest.url, {
      signal: ac.signal,
      ...httpRequest,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!httpResponse.ok) {
    throw new Error(
      `${httpResponse.status} status code received from ${httpRequest.method} ${httpRequest.url}`
    );
  }

  try {
    return (await httpResponse.json()) as T;
  } catch (error) {
    reportUnknownError(error);
    throw new Error(
      `Failed to parse JSON from ${httpRequest.method} ${httpRequest.url}`
    );
  }
};

export const getPetList = (): Promise<PetListItem[]> =>
  fetchJSON({ method: 'GET', url: `${BASE_URL}/pet/all` });

export const getPetKinds = (): Promise<PetKind[]> =>
  fetchJSON({ method: 'GET', url: `${BASE_URL}/pet/kinds` });

export const getPet = (petId: number): Promise<Pet> =>
  fetchJSON({ method: 'GET', url: `${BASE_URL}/pet/${petId}` });

export const deletePet = (petId: number): Promise<Pet> =>
  fetchJSON({ method: 'DELETE', url: `${BASE_URL}/pet/${petId}` });

export const updatePet = (
  petId: number,
  petData: Omit<Pet, 'petId'>
): Promise<Pet> =>
  fetchJSON({
    method: 'PUT',
    url: `${BASE_URL}/pet/${petId}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(petData),
  });

export const createPet = (petData: Omit<Pet, 'petId'>): Promise<Pet> =>
  fetchJSON({
    method: 'POST',
    url: `${BASE_URL}/pet`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(petData),
  });
