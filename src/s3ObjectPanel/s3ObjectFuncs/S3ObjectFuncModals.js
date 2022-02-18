import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import {useDropzone} from "react-dropzone";
import {IconContext} from "react-icons";
import {AiOutlineUpload} from "react-icons/ai";
import {MdOutlineCreateNewFolder} from "react-icons/md";

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

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

function UploadModal(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles,
    } = useDropzone();
    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    function uploadCallback() {
        // upload(e, acceptedFiles, props.prefix);
        props.upload(acceptedFiles)
        handleClose();
    }

    return (
        <div>
            <Button className={`border`} onClick={handleOpen}>
                <IconContext.Provider value={{size: '1.5em'}}>
                    <div>
                        <AiOutlineUpload/>
                        <span>&nbsp;上传</span>
                    </div>
                </IconContext.Provider>
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="body2" component={'span'}>
                        上传对象
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                    </Typography>
                    <div className="container">
                        <Container {...getRootProps({isFocused, isDragAccept, isDragReject})}>
                            <input id='obsupload' {...getInputProps()} />
                            <span>单击上传文件</span>
                        </Container>
                        <div>
                            <button onClick={uploadCallback}>upload</button>
                        </div>
                        <ul>{files}</ul>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}


function CreateDirectoryModal(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const namingRule = "\\:*?'<>|"
    const [directory, setDirectory] = useState('')
    const prefix = props.prefix

    function handleDirectory(e) {
        setDirectory(e.target.value)
    }

    function handleRefresh() {
        props.onRefresh()
    }

    const putDir = () => {
        // pud dir to obs
        let newKey = prefix.toString() + {directory: directory}.directory + "/"
        props.obsClient.putObject({
            Bucket: props.bucketName,
            Key: newKey
        }, function (err, result) {
            if (err) {
                //console.error('Error-->' + err);
            } else {
                //console.log('Status-->' + result.CommonMsg.Status);
                handleRefresh();
            }
        });
        handleClose();

    }

    return (
        <div>
            <Button className={`border`} onClick={handleOpen}>
                <IconContext.Provider value={{size: '1.5em'}}>
                    <div>
                        <MdOutlineCreateNewFolder/>
                        <span>&nbsp;新建文件夹</span>
                    </div>
                </IconContext.Provider>
            </Button>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="body2" component={'span'}>
                        新建文件夹
                    </Typography>
                    <input className="form-control" value={directory} onChange={handleDirectory}/>
                    <div id="modal-modal-description">
                        <p><span>命名规则:</span></p>
                        <p>- 文件夹名称不能包含以下字符 :<span>{namingRule}</span>。 </p>
                        <p>- 文件夹名称不能以英文句号（.）或斜杠（/）开头或结尾。</p>
                        <p>- 文件夹的绝对路径总长度不能超过1023字符。</p>
                        <p>- 单个斜杠（/）表示分隔并创建多层级的文件夹。</p>
                    </div>
                    <Button onClick={putDir}>确定</Button><Button onClick={handleClose}>取消</Button>
                </Box>
            </Modal>
        </div>
    )
}

export {UploadModal, CreateDirectoryModal};