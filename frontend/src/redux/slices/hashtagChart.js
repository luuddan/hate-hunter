import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import API from "../../services/sdk"
import { getDate } from '../../services/utils/dateHelpers';

const fetchTopHashtags = createAsyncThunk(
  'hashtagChart/fetchTopHashtags',
  async (value, thunkAPI) => {

    const countryState = thunkAPI.getState().country;

    const response = await API.get('/twitter/top-hashtags', {
      params: {
        start_time: countryState.fromDate,
        end_time: countryState.toDate,
        keywords: countryState.keywords,
        excludeKeywords: countryState.excludeKeywords,
        hashtags: countryState.hashtags,
        excludeHashtags: countryState.excludeHashtags,
        users: countryState.users,
        excludeUsers: countryState.excludeUsers,
        order: countryState.fetchOrder,
        sort: countryState.fetchSort,
        limit: countryState.fetchLimit,
        language: countryState.languages.map(l => l.code),
      }
    });

    return response.data.topHashTags.map(val => ({...val, display: true}))
  }
)

const fetchHashtagTrendline = createAsyncThunk(
  'hashtagChart/fetchHashtagTrendline',
  async (value, thunkAPI) => {

    const countryState = thunkAPI.getState().country;
    const hashtags = thunkAPI.getState().hashtagChart.hashtags;

    const checkedHashtags = hashtags.filter(h => h.display).map(h => h.value)

    console.log("checkedHash", checkedHashtags)
    const response = await API.get('/twitter/hashtag-trend-line', {
      params: {
        start_time: countryState.fromDate,
        end_time: countryState.toDate,
        hashtags: checkedHashtags,
      }
    });

    return response.data;
  }
)

const hashtagSlice = createSlice({
  name: 'hashtagChart',
  initialState: {
    loading: false,
    graph: [],
    hashtags: [],
  },
  reducers: {
    changeHashtagState(state, action) {
      state.hashtags.find(h => h.value === action.payload.name).display = action.payload.checked;
    },
    hashtagLoading(state, action) {
      // Use a "state machine" approach for loading state instead of booleans
      state.loading = action.payload;
    }
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [fetchTopHashtags.fulfilled]: (state, action) => {
      // Add user to the state array
      state.hashtags = (action.payload)
    },
    [fetchHashtagTrendline.fulfilled]: (state, action) => {
      // Add user to the state array
      state.graph = (action.payload)
    },
  }
})

export { fetchTopHashtags, fetchHashtagTrendline }

export const { changeHashtagState } = hashtagSlice.actions


export default hashtagSlice.reducer