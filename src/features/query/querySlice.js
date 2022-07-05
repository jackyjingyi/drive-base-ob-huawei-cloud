import {createSlice, nanoid} from "@reduxjs/toolkit";


const initialState = {
    currentTabIndex: 0,
    tabs: [
        {index: 0, name: '楼型库'},
        {index: 1, name: '户型库'},
        {index: 2, name: '统计大屏'},
    ],
    categories:
        [
            {
                index:0,
                name:'楼型库',
                tags:[
                    {
                        id: 0,
                        name: 'region',
                        verboseName: '战区',
                        level: 1,
                        count: 10,
                        rowCount: 5,
                        supportMulti: true,
                        isMulti: false,
                        options: [
                            {id: 1, tagVal: '东部战区', db_column: 'region', tagKey: '战区'},
                            {id: 2, tagVal: '西部战区', db_column: 'region', tagKey: '战区'},
                            {id: 3, tagVal: '华南战区', db_column: 'region', tagKey: '战区'},
                            {id: 4, tagVal: '中部战区', db_column: 'region', tagKey: '战区'},
                            {id: 5, tagVal: '西部战区', db_column: 'region', tagKey: '战区'},
                        ],
                        selected: [],
                    },
                    {
                        id: 1,
                        name: 'productType',
                        verboseName: '产品类型',
                        level: 1,
                        count: 10,
                        rowCount: 5,
                        supportMulti: true,
                        isMulti: true,
                        options: [
                            {id: 1, tagVal: '超高层', db_column: 'product_type', tagKey: '产品类型'},
                            {id: 2, tagVal: '小高层', db_column: 'product_type', tagKey: '产品类型'},
                            {id: 3, tagVal: '高层', db_column: 'product_type', tagKey: '产品类型'},
                            {id: 4, tagVal: '中高层', db_column: 'product_type', tagKey: '产品类型'},
                            {id: 5, tagVal: '别墅', db_column: 'product_type', tagKey: '产品类型'},
                        ],
                        selected: [],
                    },
                ]
            },

        ],

}

export const querySlice = createSlice({
    name: 'query',
    initialState,
    reducers: {
        selectOption: (state, action) => {
            state.categories.push(action.payload)
        },
        changeTaB:(state, action)=>{
            state.currentTabIndex = action.payload
        },
    }

})

export const {selectOption,changeTaB} = querySlice.actions

export default querySlice.reducer