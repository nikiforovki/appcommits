import { configureStore } from '@reduxjs/toolkit';
import rtkQueryApi from '../../../api/rtkQuery';

export const store = configureStore({
  reducer: {
    [rtkQueryApi.reducerPath]: rtkQueryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQueryApi.middleware),
});
