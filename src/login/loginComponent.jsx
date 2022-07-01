import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function LoginModal(props) {
    const [open, setOpen] = useState(props.open);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function menuLogin() {

        handleOpen()
    }

    useEffect(()=>{
        const isLogin = JSON.parse(window.localStorage.getItem('isLogin'))

        setOpen(!isLogin)
    },[JSON.parse(window.localStorage.getItem('isLogin'))])

    return (
        <div>
            <Button onClick={menuLogin}>登录</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {props.children}
            </Modal>
        </div>
    );
}

export {LoginModal};