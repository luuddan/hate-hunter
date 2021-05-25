import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AbuseArray } from '../../services/utils/abuseArray';
import API from "../../services/sdk"
import { getDate,getDateDays } from '../../services/utils/dateHelpers';

// First, create the thunk
const fetchCountry = createAsyncThunk(
  'country/fetchCountry',
  async (renewData, thunkAPI) => {
    console.log("renewData", renewData)
    const countryState = thunkAPI.getState().country;
    const response = await API.get('/twitter/tweets', {
      params: {
        start_time: countryState.fromDate,
        end_time: countryState.toDate,
        keywords: countryState.keywords,
        excludeKeywords: countryState.excludeKeywords,
        hashtags: countryState.hashtags,
        excludeHashtags: countryState.excludeHashtags,
        users: countryState.users,
        excludeUsers: countryState.excludeUsers,
        abuseFilters: countryState.abuseFilters.map(a => a.label),
        order: countryState.fetchOrder,
        sort: countryState.fetchSort,
        limit: countryState.fetchLimit,
        language: countryState.languages.map(l => l.code),
        addData: renewData || false,
      }
    });
    console.log("country-result", response);
    return response.data
  }
)

const analyzeTweets = createAsyncThunk(
  'country/analyze',
  async (props,thunkAPI) => {
    try {
      conso
      const countryState = thunkAPI.getState().country;
      await API.get('/twitter/analyze', {
        params: {
          start_time: countryState.fromDate,
          end_time: countryState.toDate,
          keywords: countryState.keywords,
          hashtags: countryState.hashtags,
          users: countryState.users,
          order: countryState.fetchOrder,
          sort: countryState.fetchSort,
          limit: countryState.fetchLimit,
          language: countryState.languages.map(l => l.code),
        }
      });
      console.log("analyzing data")
    } catch(error) {
      console.log("couldn't analyze data", error)
    }
  }
)



const countrySlice = createSlice({
  name: 'country',
  initialState: {
    loading: false,
    keywords: ['ira'],
    excludeKeywords: [],
    hashtags: [],
    excludeHashtags: [],
    users: [],
    excludeUsers: [],
    abuseFilters: [],
    toDate: new Date().toISOString(),
    fromDate: getDateDays(new Date(),30).toISOString(),
    languages: [],
    excludeLanguages: [],
    fetchOrder: "DESC",
    fetchSort: "value",
    fetchLimit: 3,
  },
  reducers: {
    changeCountryState(state, action) {
      state[action.payload.key] = action.payload.value
    },
    changeCountryKeyHashUserState(state, action) {
      state[action.payload.key].push(action.payload.value);
    },
    removeCountryKeyHashUserState(state, action) { 
      state[action.payload.key]=state[action.payload.key].filter((item) => item !== action.payload.value)
    },
    countryLoading(state, action) {
      // Use a "state machine" approach for loading state instead of booleans
        state.loading = action.payload
    }
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [fetchCountry.fulfilled]: (state, action) => {
      // Add user to the state array
      state.country = (action.payload)
    }
  }
})

export { fetchCountry, analyzeTweets }

export const { countryLoading,changeCountryState, changeCountryKeyHashUserState, removeCountryKeyHashUserState } = countrySlice.actions


export default countrySlice.reducer