import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import ClinicSlice from './ClinicSlice.jsx';
import DoctorSlice from './DoctorSlice.jsx';
import GeneralSlice from './GeneralSlice.jsx';
import LibraryImageSlice from './LibraryImageSlice.jsx';
import PatientSlice from './PatientSlice.jsx';

const persistConfig = {
	key: 'root',
	version: 1,
	storage
};

const rootReducer = combineReducers({doctor: DoctorSlice, general: GeneralSlice, clinic: ClinicSlice, patient: PatientSlice, libraryImage: LibraryImageSlice});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export let persistor = persistStore(store);