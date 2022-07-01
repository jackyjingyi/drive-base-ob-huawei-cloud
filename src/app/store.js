import {configureStore} from '@reduxjs/toolkit'
import queryReducer from '../features/query/querySlice'


export const store = configureStore({
    reducer:{
        query: queryReducer
    },
})