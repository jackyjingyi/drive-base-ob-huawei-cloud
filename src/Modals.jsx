import React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import {useDropzone} from "react-dropzone";

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

function upload(e, files) {
    console.log(files)

    var cp;
    var hook;
    obsClient.uploadFile({
        Bucket: bucketName,
        Key: files[0].path,
        SourceFile: document.getElementById('obsupload').files[0],
        PartSize: 9 * 1024 * 1024,

        ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
            console.log(transferredAmount * 1.0 / totalSeconds / 1024);
            console.log(transferredAmount * 100.0 / totalAmount);
            if (hook && (transferredAmount / totalAmount) > 0.5) {
                // 暂停断点续传任务
                hook.cancel();
            }
        },
        EventCallback: function (eventType, eventParam, eventResult) {
            // 处理事件响应
        },
        ResumeCallback: function (resumeHook, uploadCheckpoint) {
            // 获取取消断点续传上传任务控制参数
            hook = resumeHook;
            // 记录断点
            cp = uploadCheckpoint;
        }
    }, function (err, result) {
        console.error('Error-->' + err);
        // 出现错误，再次调用断点续传接口，继续上传任务
        if (err) {
            obsClient.uploadFile({
                UploadCheckpoint: cp,
                ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
                    console.log(transferredAmount * 1.0 / totalSeconds / 1024);
                    console.log(transferredAmount * 100.0 / totalAmount);
                },
                EventCallback: function (eventType, eventParam, eventResult) {
                    // 处理事件响应
                },
            }, function (err, result) {
                if (err) {
                    console.error('Error-->' + err);
                } else {
                    if (result.CommonMsg.Status < 300) {
                        console.log('RequestId-->' + result.InterfaceResult.RequestId);
                        console.log('Bucket-->' + result.InterfaceResult.Bucket);
                        console.log('Key-->' + result.InterfaceResult.Key);
                        console.log('Location-->' + result.InterfaceResult.Location);
                    } else {
                        console.log('Code-->' + result.CommonMsg.Code);
                        console.log('Message-->' + result.CommonMsg.Message);
                    }
                }
            });
        } else {
            console.log('Status-->' + result.CommonMsg.Status);
            if (result.CommonMsg.Status < 300 && result.InterfaceResult) {
                console.log('RequestId-->' + result.InterfaceResult.RequestId);
            }
        }
    });
}

function StyledDropzone(props) {
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

    return (
        <div className="container">
            <Container {...getRootProps({isFocused, isDragAccept, isDragReject})}>
                <input id='obsupload' {...getInputProps()} />
                <p>单击上传文件</p>
            </Container>
            <div>
                <button onClick={(e) => upload(e, acceptedFiles)}>upload</button>
            </div>
            <ul>{files}</ul>
        </div>

    );
}

export default function BasicModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>上传</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        上传对象
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        <StyledDropzone/>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}