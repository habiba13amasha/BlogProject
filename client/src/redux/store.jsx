import { configureStore,combineReducers } from '@reduxjs/toolkit'
import themeRedsucer from "./theme/themeSlice" 
import userReducer from './user/userSlice'
import {persistReducer,persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"

const rootReducer=combineReducers({   //combineReducers  تقوم بدمج جميع الـ Reducers في تطبيقكِ في Reducer واحد يسمى rootReducer.
  user: userReducer,
  theme: themeRedsucer,

})

const persistConfig = {
  key: 'root',
  storage,
  version:1
}

const persistedReducer=persistReducer(persistConfig,rootReducer)
export const store = configureStore({
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false}),
})

export const persistor=persistStore(store)