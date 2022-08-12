import {configureStore} from '@reduxjs/toolkit'
import queryReducer from '../features/query/querySlice'
import userReducer from '../features/user/usersSlice'


export const store = configureStore({
    reducer:{
        query: queryReducer,
        user: userReducer
    },
})