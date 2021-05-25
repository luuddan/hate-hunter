import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import API from "../../services/sdk"
import { getDate } from '../../services/utils/dateHelpers';

const fetchTopUsers = createAsyncThunk(
  'topUsers/fetchTopUsers',
  async (value, thunkAPI) => {
    const countryState = thunkAPI.getState().country;
    const orderBy = thunkAPI.getState().topUsers.orderBy;

    const response = await API.get('/twitter/top-users', {
      params: {
        start_time: countryState.fromDate,
        end_time: countryState.toDate,
        keywords: countryState.keywords,
        excludeKeywords: countryState.excludeKeywords,
        hashtags: countryState.hashtags,
        excludeHashtags: countryState.excludeHashtags,
        users: countryState.users,
        excludeUsers: countryState.excludeUsers,
        language: countryState.languages.map(l => l.code),
        orderBy: orderBy,
      }
    });
    return {value:response.data,key:"topUsers"};
  }
)

const topUsersSlice = createSlice({
  name: 'topUsers',
  initialState: {
    loading: false,
    topUsers: [],
    orderBy:"topScore",
  },
  reducers: {
    changeTopUsersState(state, action) {
        state[action.payload.key] = action.payload.value
    },
    topUsersLoading(state, action) {
      // Use a "state machine" approach for loading state instead of booleans
        state.loading = action.payload;
    }
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [fetchTopUsers.fulfilled]: (state, action) => {
      // Add user to the state array
      state.topUsers = (action.payload)
      
    },
  }
})

export { fetchTopUsers}

export const { changeTopUsersState } = topUsersSlice.actions


export default topUsersSlice.reducer