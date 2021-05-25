import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user'
import countryReducer from './slices/country'
import hashtagReducer from './slices/hashtagChart'
import topUsersReducer from './slices/topUsers'


export default configureStore({
  reducer: {
    user: userReducer,
    country: countryReducer,
    hashtagChart: hashtagReducer,
    topUsers: topUsersReducer
  }
})