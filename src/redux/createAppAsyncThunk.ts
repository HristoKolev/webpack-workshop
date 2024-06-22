import { createAsyncThunk } from '@reduxjs/toolkit';

import type { AppDispatch, ReduxState } from '~redux/createReduxStore';

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: ReduxState;
  dispatch: AppDispatch;
}>();
