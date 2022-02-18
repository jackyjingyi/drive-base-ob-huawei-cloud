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

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isFocused) {
        return '#2196f3';
    }
    return '#eeeeee';
}

function LoginModal(props) {
    const [open, setOpen] = useState(!props.isLogin);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isLogin, setLogin] = useState(props.isLogin);
    const [ak, setAK] = useState(() => {
        const saved = window.localStorage.getItem('ak')
        return saved || ""
    })
    const [sk, setSK] = useState(() => {
        const saved = window.localStorage.getItem('sk')
        return saved || ""
    })
    const handleSK = (e) => {
        setSK(e.target.value)
    }

    const handleAk = (e) => {
        setAK(e.target.value)
    }

    useEffect(() => {
        window.localStorage.setItem("ak", ak)
        window.localStorage.setItem("sk", sk)
        window.localStorage.setItem('isLogin', isLogin)
    })

    const handleLogin = () => {
        setLogin(true)
        props.userLogin(ak, sk)
        handleClose()
    }

    function menuLogin() {

        handleOpen()
    }

    return (
        <div>
            <Button onClick={menuLogin}>登录</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="body2" component={'span'}>
                        请登录
                    </Typography>
                    <input aria-label={`ak`} className="form-control" value={ak} onChange={handleAk}/>
                    <input aria-label={`sk`} className="form-control" value={sk} onChange={handleSK} type={`password`}/>
                    <div id="modal-modal-description">
                        <p><span>说明:</span></p>
                        <p>- 基于集团安全要求: </p>
                        <p>- 登录本云盘需求重新进行安全验证。</p>
                        <p>- 请输入AK/SK</p>
                    </div>
                    <Button onClick={handleLogin}>确定</Button><Button onClick={handleClose}>取消</Button>

                </Box>
            </Modal>
        </div>
    );
}

export {LoginModal};