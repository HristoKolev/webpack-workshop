import { configureStore } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';

import { globalSlice } from './globalSlice';

export const createReduxStore = () =>
  configureStore({
    reducer: {
      [globalSlice.name]: globalSlice.reducer,
    },
  });

export type ReduxStore = ReturnType<typeof createReduxStore>;
export type ReduxState = ReturnType<ReduxStore['getState']>;
export type AppDispatch = ReduxStore['dispatch'];

// eslint-disable-next-line @arabasta/redux-use-app-functions/use-app-dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<ReduxState> = useSelector;
