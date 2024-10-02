import { User } from "@/interface";
import { createSlice } from "@reduxjs/toolkit"

interface userSlice {
    user: User;
}

const initialState: userSlice = {
    user: {
        email:'',
        name:'',
        walletAddress:'',
        token:'',
    }
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload
        }
    }
})

export const { updateUser } = userSlice.actions

export default userSlice.reducer