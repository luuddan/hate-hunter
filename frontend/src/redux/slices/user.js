import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import API from "../../services/sdk"

// First, create the thunk
const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (value, thunkAPI) => {
      console.log(thunkAPI)
      const userState =  thunkAPI.getState().user;
      console.log(userState)
      if(!userState.userName || userState.userName === "")
        return {};
      const response =  await API.get('/twitter/user',{
      params:{
          name:value || userState.userName,
          start_time:"",
          end_time:"",
          order: userState.fetchOrder,
          sort: userState.fetchSort,
          limit: userState.fetchLimit,
      }
      });
      console.log("User-result",response, response.data);
      const botometer = ((response.data.botometerScore && response.data.botometerScore[0] &&  response.data.botometerScore[0].raw_scores &&  response.data.botometerScore[0].raw_scores.english.overall) || "")
      const data = {...response.data, botometerScore: botometer}
      console.log(data)
    return data;
  }
)

const userSlice = createSlice({
    name: 'users',
    initialState: {
      loading: false,
      user: {},
      fetchOrder:"DESC",
      fetchSort:"value",
      fetchLimit:3,
      userName:""
    },
    reducers: {
      changeUserState(state, action) {
        state[action.payload.key] = action.payload.value
      },
      usersLoading(state, action) {
        // Use a "state machine" approach for loading state instead of booleans
          state.loading = action.payload;
      }
    }, 
    extraReducers: {
      // Add reducers for additional action types here, and handle loading state as needed
      [fetchUsers.fulfilled]: (state, action) => {
        // Add user to the state array
        state.user = (action.payload)
      }
    }
  })

export {fetchUsers}

export const { changeUserState, usersLoading} = userSlice.actions

export default userSlice.reducer