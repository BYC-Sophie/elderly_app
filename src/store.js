import { configureStore } from '@reduxjs/toolkit';
import {articleReducer} from "./reducers/article.slice";



export const store = configureStore({
  reducer: {
    article: articleReducer
  },
})
