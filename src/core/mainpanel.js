import React, {useContext, useEffect, useReducer, useState} from 'react'
import { Outlet,useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {RepoContext} from "../contextManager";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import './mainpanel.css'
import Stack from "@mui/material/Stack";


export default function ProductPanel(props) {
    const params = useParams()
    const navigate = useNavigate()
    const {prefix, productTypes, productTab, setProductTab, formatTab, setFormatTab} = useContext(RepoContext)

    function handleClickFormat(k) {
        setFormatTab(k)
        navigate(`/region-company/${params.regionCompanyID}/type/${params.productType}/${k}`)
    }

    return (
        <Box sx={{padding: '1vmin'}}>
            <Stack direction={`row`}>
                <ButtonGroup variant={`contained`} size={`large`}>
                    <Button
                        sx={{
                            backgroundColor: 'list' === formatTab ? '#333854' : '#707387',
                            width: '12vw',
                            height: '3vh'
                        }}
                        onClick={() => handleClickFormat('list')}
                    >列表</Button>
                    <Button
                        sx={{
                            backgroundColor: 'thumnail' === formatTab ? '#333854' : '#707387',
                            width: '12vw',
                            height: '3vh'
                        }}
                        onClick={() => handleClickFormat('thumnail')}
                    >缩略图</Button>
                </ButtonGroup>
            </Stack>
        <Box>
            <Outlet/>
        </Box>
        </Box>

    )
}
