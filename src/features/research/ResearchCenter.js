import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {
    AppBar,
    Box,
    Button,
    Dialog,
    Slide, Toolbar, Typography,
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ResearchCardAdd from "./ResearchCardAdd";
import Grid from "@mui/material/Grid";
// url :


function ResearchCenter() {
    const user = useSelector(state=>state.user)
    const params = useParams()


    return (
        <>
            <Grid container
                  direction={`row`}
                  justifyContent={`flex-start`}
                  alignItems={`flex-start`}
                  spacing={2}
            >

                <Grid item>
                    <ResearchCardAdd/>
                </Grid>
                <Grid item>
                    <ResearchCardAdd/>
                </Grid>
                <Grid item>
                    <ResearchCardAdd/>
                </Grid>
            </Grid>
        </>
    )

}


export default ResearchCenter;