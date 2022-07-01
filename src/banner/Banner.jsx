import {GoCloudUpload} from 'react-icons/go'
import {IconContext} from "react-icons";
import React, {useState} from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import FormControl, {useFormControl} from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import Button from "@mui/material/Button";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const theme = createTheme({
    typography: {
        fontSize: 12
    }
})
const logo = () => {
    return (

        <IconContext.Provider value={{size: '4.2em', color: 'dark'}}>
            <div>
                <GoCloudUpload/>&nbsp;&nbsp;
                <span className={`text-bold text-dark`}>企业云盘</span>
            </div>
        </IconContext.Provider>)
}

const MainSearchForm = () => {

    return (<Paper
        component="form"
        sx={{
            p: '0px 0px',
            display: 'flex',
            alignItems: 'center',
            width: '40%',
            border: '#01A439 1px solid',
            borderRadius: '0',
            marginLeft:'10%',
        }}
    >
        <InputBase
            sx={{ml: 1, flex: 1}}
            inputProps={{'aria-label': 'search product'}}
        />

        <Divider sx={{height: 28, m: 0.5}} orientation="vertical"/>

        <Button color={`success`}
                sx={{backgroundColor: '#01A439',
                    borderRadius: '0',
                    fontSize:'16px'}}
                aria-label="directions" variant={`contained`}>
            搜索
        </Button>
    </Paper>)
}



const Banner = () => {
    const [isLogin, setIsLogin] = useState(true)
    return (<ThemeProvider theme={theme}>
        <Grid container direction={`column`}
              columns={2}
              alignItems="stretch"
              sx={{height: '100%', width: '100%', padding: 0}}>
            <Grid item sx={{backgroundColor: '#e3e4e5', borderBottom: 'solid 1px #ddd', height: '2vh'}}>
                <Stack
                    direction="row-reverse"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography variant={`body2`} component={`a`} children={isLogin ? '欢迎' : '请登录'}/>
                </Stack>
            </Grid>
            <Grid item sx={{height: '8vh'}}>
                <Grid container direction={`row`} justifyContent="flex-end" sx={{height: '100%'}}
                      alignItems="center">
                    <Grid item xs={2}
                          className={`logo`}
                          alignItems="flex-end">
                        {logo()}
                    </Grid>
                    <Grid item xs={9} className={'searchPanel'} alignItems="center">
                        <MainSearchForm/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </ThemeProvider>)

}
export default Banner