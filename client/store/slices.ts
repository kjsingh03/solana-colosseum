import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InitialState {
    alert: { message: string; type: 'success' | 'error'; };
    sideNavOpen: boolean,
    mnemonic:string
}

const initialState: InitialState = {
    alert: {
        message: '',
        type: 'error',
    },
    sideNavOpen: false,
    mnemonic:''
};

const slice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setAlert: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' }>) => {
            state.alert.message = action.payload.message;
            state.alert.type = action.payload.type;
        },
        setNavOpen: (state, action) => {
            state.sideNavOpen = action.payload
        },
        setMnemonic: (state, action) => {
            state.mnemonic = action.payload
        },
    },
});

export const { setAlert, setNavOpen,setMnemonic } = slice.actions;
export default slice.reducer;
