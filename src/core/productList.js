import React, {useContext, useEffect, useReducer, useState} from 'react'
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {RepoContext} from "../contextManager";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import {DataGrid, GridColDef, GridValueGetterParams, zhCN} from '@mui/x-data-grid';
import {styled} from '@mui/material/styles';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import './mainpanel.css'

import Stack from "@mui/material/Stack";
import {NavLink, useNavigate, useParams} from "react-router-dom";

const theme = createTheme({
    palette: {
        primary: {main: '#1976d2'}, type: 'dark',
    }, typography: {
        fontSize: 20
    }
}, zhCN,);

const StyledGridOverlay = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
        fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
        fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
        fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
        fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
        fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
        fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
}));
const columns: GridColDef[] = [{
    field: 'action', headerName: '', width: 90
}, {
    field: 'id', headerName: '序号', width: 90
}, {
    field: 'modelCode',
    headerName: '模型编号',
    width: 450,
    editable: false,
    renderCell: (params) => (<NavLink style={{textDecorationLine: 'none'}}
                                      to={`/region-company/${params.row.region}/${params.row.productType}/${params.row.modelCode}/`}>{params.row.modelCode}</NavLink>)
}, {
    field: 'structure', headerName: '梯户比', width: 150
}, {field: 'buildingType', headerName: '体型特征', width: 150}, {
    field: 'buildingCombine', headerName: '户型组合', width: 550
}, {
    field: 'location', headerName: '模型归属地', width: 450
}, {field: 'rate', headerName: '评分', width: 100}]


const testRows = [{
    action: '',
    id: '01',
    modelCode: 'HD-G(19-33F)-2T4-390',
    structure: '2T4',
    buildingType: '板式',
    buildingCombine: '105㎡+90㎡+90㎡+105㎡',
    location: '华东战区-南京-燕熙台项目-B07#楼',
    rate: 96,
    region: 'chinaEast',
    productType:'highBuilding',
}, {
    action: '',
    id: '02',
    modelCode: 'HD-G(19-33F)-2T4-430',
    structure: '2T4',
    buildingType: '板式',
    buildingCombine: '125㎡+90㎡+90㎡+125㎡',
    location: '华东战区-南京-燕熙台项目-A06#楼',
    rate: 92,
    region: 'chinaEast',
    productType:'highBuilding',
}, {
    action: '',
    id: '03',
    modelCode: 'HD-G(19-33F)-2T4-420',
    structure: '2T4',
    buildingType: '板式',
    buildingCombine: '115㎡+95㎡+95㎡+115㎡',
    location: '华东战区-无锡-运河城项目-A7#楼',
    rate: 95,
    region: 'chinaEast',
    productType:'highBuilding',
}, {
    action: '',
    id: '04',
    modelCode: 'HD-G(19-33F)-2T4-460',
    structure: '2T4',
    buildingType: '板式',
    buildingCombine: '125㎡+105㎡+105㎡+125㎡',
    location: '华东战区-苏州-WG-31号地块项目-1#楼',
    rate: 96,
    region: 'chinaEast',
    productType:'highBuilding',
}, {
    action: '',
    id: '05',
    modelCode: 'HD-G(19-33F)-2T4-470',
    structure: '2T4',
    buildingType: '板式',
    buildingCombine: '130㎡+105㎡+105㎡+130㎡',
    location: '华东战区-南京-燕熙台项目-B09#楼',
    rate: 90,
    region: 'chinaEast',
    productType:'highBuilding',
}, {
    action: '',
    id: '06',
    modelCode: 'HD-G(19-33F)-2T4-490',
    structure: '2T4',
    buildingType: '板式',
    buildingCombine: '140㎡+105㎡+105㎡+140㎡',
    location: '华东战区-苏州-WG-31号地块项目-3#楼',
    rate: 96,
    region: 'chinaEast',
    productType:'highBuilding',
}, {
    action: '',
    id: '07',
    modelCode: 'HD-G(19-33F)-3T6-610',
    structure: '3T6',
    buildingType: '板式',
    buildingCombine: '115㎡+95㎡*4+115㎡',
    location: '华东战区-扬州-华侨城项目-B3-15#楼',
    rate: 92,
    region: 'chinaEast',
    productType:'highBuilding',
},

]

function CustomNoRowsOverlay() {

    return (<ThemeProvider theme={theme}>
            <StyledGridOverlay>
                <svg
                    width="120"
                    height="100"
                    viewBox="0 0 184 152"
                    aria-hidden
                    focusable="false"
                >
                    <g fill="none" fillRule="evenodd">
                        <g transform="translate(24 31.67)">
                            <ellipse
                                className="ant-empty-img-5"
                                cx="67.797"
                                cy="106.89"
                                rx="67.797"
                                ry="12.668"
                            />
                            <path
                                className="ant-empty-img-1"
                                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                            />
                            <path
                                className="ant-empty-img-2"
                                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                            />
                            <path
                                className="ant-empty-img-3"
                                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                            />
                        </g>
                        <path
                            className="ant-empty-img-3"
                            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                        />
                        <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"/>
                            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"/>
                        </g>
                    </g>
                </svg>
                <Box sx={{mt: 1}}>暂无数据</Box>
            </StyledGridOverlay>
        </ThemeProvider>
    );
}

export default function ProductList() {
    const params = useParams()
    const [rows, setRows] = useState([])
    useEffect(() => {
        if (params.regionCompanyID === 'chinaEast' && params.productType === 'highBuilding') {
            setRows(testRows)
        } else {
            setRows([])
        }

    }, [params.regionCompanyID, params.productType])
    return (<Box sx={{height: '70vh', width: '100%'}}>
        <ThemeProvider theme={theme}>
            <DataGrid
                components={{
                    NoRowsOverlay: CustomNoRowsOverlay,
                }}
                rows={rows}
                columns={columns}
                rowsPerPageOptions={[5]}
                isCellEditable={() => false}
                disableSelectionOnClick
                autoPageSize
                checkboxSelection={false}
                localeText={zhCN}
                disableColumnFilter
                disableColumnMenu
                headerHeight={80}
            />
        </ThemeProvider>
    </Box>)
}