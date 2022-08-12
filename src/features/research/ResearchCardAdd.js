import React, {useEffect, useState} from 'react'
import {
    AppBar,
    Box,
    Button,
    Dialog,
    Slide, Toolbar, Typography,
} from "@mui/material";
import './research.css'
import CreateDialog from "./CreateDialog";
import {createTheme, ThemeProvider} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const theme = createTheme({
    palette: {
        light: {
            main: '#fff'
        }
    },
    typography: {
        h6: {
            fontSize: 18,
            fontWeight: 'bold'
        },
        subtitle2: {
            fontSize: 11,
            color: 'grey'
        },
        body2: {
            fontSize: 12,
        }
    }

})
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function ResearchCardAdd() {
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box className={`research-card-context item-center`} component={`div`}
             sx={{border:'none'}}
        >

            <Box>
                <img src={`static/img/create-blank.svg`}
                     style={{width: '32px', height: '32px', marginLeft:'12px'}}
                     onClick={handleClickOpen}
                />
                <Typography variant={`body2`}
                            mt={2}
                >
                    创建项目
                </Typography>
            </Box>
            <ThemeProvider theme={theme}>

                <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{position: 'relative', userSelect: 'none'}} color={`light`}>
                        <Toolbar>
                            <Typography sx={{ml: 2, flex: 1}} variant="body2" component="div">
                                创建项目
                            </Typography>
                            <Button autoFocus color="inherit" onClick={handleClose}
                                    variant={`outlined`}
                                    size={`small`}>
                                关闭
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <CreateDialog />
                </Dialog>
            </ThemeProvider>
        </Box>
    )
}

export default ResearchCardAdd;
