 import { combineReducers, configureStore } from "@reduxjs/toolkit";
 import postsReducer from "../features/postsSlice.ts";
 
 const rootReducer = combineReducers({
    posts: postsReducer,
 })

 const store = configureStore({
    reducer: rootReducer,
 });

 export default store;