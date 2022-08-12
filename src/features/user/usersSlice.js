import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    isLogin: false,
    exp: -9999999,
    iat: -9999999,
    nbf: -9999999,
    org_exp: '',
    org_code: '',
    org_id: '',
    uid: '',
    uname: '',
    super: '',
    avatar: null,
    is_senior: 0
}

export const userSlice = createSlice({
    name: 'user', initialState, reducers: {
        login: (state, action) => {
            state.isLogin = action.payload.isLogin
            state.exp = action.payload.exp
            state.iat = action.payload.iat
            state.nbf = action.payload.nbf
            state.org_exp = action.payload.org_exp
            state.org_code = action.payload.org_code
            state.org_id = action.payload.org_id
            state.uid = action.payload.uid
            state.uname = action.payload.uname
            state.super = action.payload.super
            state.avatar = action.payload.avatar
            state.is_senior = action.payload.is_senior
        },
        logout:(state)=>{
            state.isLogin = false
            state.exp =  -9999999
            state.iat =  -9999999
            state.nbf =  -9999999
            state.org_exp = ''
            state.org_code = ''
            state.org_id =''
            state.uid = ''
            state.uname = ''
            state.super = ''
            state.avatar = null
            state.is_senior = 0
        }

    }
})

export const {login, logout} = userSlice.actions
export default userSlice.reducer