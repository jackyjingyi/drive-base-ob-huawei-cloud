import React, {useCallback, useState} from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import axios from "axios";
import LeftSideNavbar from "./Navbar";
import Banner from "./Banner"
import {open} from "fs";
import $ from 'jquery'
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import {useDropzone} from "react-dropzone";

var bucketName = 'dev-do-not-delete'//'oct-project-collection'
var obsClient = new ObsClient({
    access_key_id: "POC15HNEABZRTCXJXRR7",
    secret_access_key: "koKUwzTk1KQD77FiAwrF6TfdyAqEqKIZKnlzlNJ7",
    server: 'obs.cn-south-1.myhuaweicloud.com'
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    height: 500,
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


function BasicModal(props) {
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
        props.addTasks(acceptedFiles, props.prefix)
        handleClose();
    }

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


function InputModal(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const namingRule = "\\:*?'<>|"
    const [directory, setDirectory] = useState('')
    const prefix = props.prefix

    function handleDirectory(e) {
        setDirectory(e.target.value)
    }

    function handleFresh() {
        props.onFresh()
    }

    const putDir = () => {
        // pud dir to obs
        let newKey = prefix.toString() + {directory: directory}.directory + "/"
        obsClient.putObject({
            Bucket: bucketName,
            Key: newKey
        }, function (err, result) {
            if (err) {
                //console.error('Error-->' + err);
            } else {
                //console.log('Status-->' + result.CommonMsg.Status);
                handleFresh();
            }
        });
        handleClose();

    }

    return (
        <div>
            <Button onClick={handleOpen}>新建文件夹</Button>
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

// ========================================

class InfoPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infoPanel: 'file',
            currentTasks: [],
            finishedTasks: []
        }
    }

    handleMessage = (k, p, s, t, ta, ts) => {

        if (t === ta) {
            let _tty = [];
            let _con = false
            const _tmp = this.state.currentTasks
            const _tmpf = this.state.finishedTasks
            for (let i = 0; i < _tmp.length; i++) {
                if (_tmp[i][0] !== k) {
                    _tty.push(_tmp[i])
                }
            }
            for (let i = 0; i < _tmpf.length; i++) {
                if (_tmpf[i][0] === k) {
                    _tmpf[i] = [k, p, s, t, ta, ts]
                    _con = true
                    break;
                }
            }
            if (!_con) {
                this.setState({
                    currentTasks: _tty,
                    finishedTasks: this.state.finishedTasks.concat([[k, p, s, t, ta, ts]]),
                    infoPanel: "file",
                })
            } else {
                this.setState({
                    currentTasks: _tty,
                    finishedTasks: _tmpf,
                    infoPanel: "file",
                })
            }
        } else {
            let contain = false
            let _up = false
            const tmp = this.state.currentTasks
            for (let i = 0; i < tmp.length; i++) {
                if (tmp[i][0] === k) {
                    if (t > tmp[i][3]) {
                        tmp[i] = [k, p, s, t, ta, ts]
                        _up = true
                    }
                    contain = true
                    break;
                }
            }
            if (!contain) {
                this.setState({
                    currentTasks: this.state.currentTasks.concat([[k, p, s, t, ta, ts]]),
                    infoPanel: "task",
                })
            } else {
                if (_up) {
                    this.setState({
                        currentTasks: tmp
                    })
                }
            }
        }
    }

    handleNavClick(action) {
        this.setState({infoPanel: action})
    }


    render() {
        const taskList = <TaskTable currentTasks={this.state.currentTasks} finishedTasks={this.state.finishedTasks}/>
        const fileList = <FileTable bucketName={this.props.bucketName} taskMessage={this.handleMessage}/>
        return (
            <div className="container">
                <Banner/>
                <div className="row">
                    <div className="col-md-2">
                        <ul className="nav flex-column" role={`tablist`} id={`myTab`}>
                            <li className="nav-item" role={`presentation`}>
                                <a key={1} className="nav-link" onClick={() => this.handleNavClick('file')}>文件管理
                                </a>
                            </li>
                            <li>
                                <a key={2} className="nav-link" onClick={() => this.handleNavClick('task')}>任务管理
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-10">
                        {this.state.infoPanel === 'file' ? fileList : taskList}
                    </div>
                </div>
            </div>
        )
    }
}


class Task extends React.Component {

    render() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.size}</td>
                <td>{this.props.progress}</td>
                <td>{this.props.type}</td>
                <td>{this.props.status}</td>
                <td>{this.props.speed}</td>
                <td>{this.props.actions}</td>
            </tr>
        )
    }
}

function sizeHandler(s) {

    if (s > 10 ** 9) {
        return (s / 10.0 ** 9).toFixed(2).toString() + "GB"
    } else if (s < 10 ** 9 && s > 10 ** 6) {
        return (s / 10.0 ** 6).toFixed(2).toString() + "MB"
    } else if (s < 10 ** 6 && s > 10 ** 3) {
        return (s / 10.0 ** 3).toFixed(2).toString() + "KB"
    } else {
        return (s / 1.0).toFixed(2).toString() + "Bit"
    }
}

class TaskTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTasks: this.props.currentTasks,
            finishedTasks: this.props.finishedTasks,
            tab: 1,
            _isRunningTab: 'active',
            _isFinishTab: '',
        }
        this.handleTabClick = this.handleTabClick.bind(this)
    }


    handleTabClick(e, act) {
        if (act === 1) {
            this.setState({
                tab: act,
                _isRunningTab: 'active',
                _isFinishTab: '',
            })
        } else {
            this.setState({
                tab: act,
                _isRunningTab: '',
                _isFinishTab: 'active',
            })
        }

    }

    render() {

        const runningTab = (<div>
            <table className='table table-bordered'>
                <thead>
                <tr>
                    <th>名称</th>
                    <th>大小</th>
                    <th>进度</th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>速度</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {this.state.currentTasks.map((item, index) => {
                    let pr = (item[3] * 100.0 / item[4]).toFixed(2).toString() + "%"
                    let sp = sizeHandler((item[3] * 1.0 / item[5])) + "/s"
                    let st = "上传中"
                    if (item[3] === item[4]) {
                        st = "已完成"
                    }
                    return (
                        <Task key={index} name={item[1]} size={sizeHandler(item[2])} progress={pr} type="上传"
                              status={st}
                              speed={sp} actions={0}/>
                    )
                })}
                </tbody>
            </table>
        </div>)

        const finishTab = (<div>
            <table className='table table-bordered'>
                <thead>
                <tr>
                    <th>名称</th>
                    <th>大小</th>
                    <th>进度</th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>速度</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {this.state.finishedTasks.map((item, index) => {
                    if (item) {
                        let pr = (item[3] * 100.0 / item[4]).toFixed(2).toString() + "%"
                        let sp = sizeHandler((item[3] * 1.0 / item[5])) + "/s"
                        let st = "已完成"
                        return (
                            <Task key={index} name={item[1]} size={sizeHandler(item[2])} progress={pr} type="上传"
                                  status={st}
                                  speed={sp} actions={0}/>
                        )
                    }

                })}
                </tbody>
            </table>
        </div>)
        return (
            <div>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className={`nav-link ${this.state._isRunningTab}`}
                           aria-current="page"
                           onClick={(e) => this.handleTabClick(e, 1)}>
                            运行队列
                        </a></li>
                    <li className="nav-item"><a className={`nav-link ${this.state._isFinishTab}`}
                                                onClick={(e) => this.handleTabClick(e, 2)}> 已完成 </a>
                    </li>
                </ul>
                {this.state.tab === 1 ? runningTab : finishTab}
            </div>
        )
    }

}


class AddressComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <input className="form-control" value={this.props.currentPrefix}
                   onChange={() => this.props.onChange()}/>

        )
    }

}


class TCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <td onClick={this.props.onClick}>
                {this.props.name}
            </td>
        )
    }

}

class Thead extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<thead>
        <tr>
            {this.props.header.map((item, index) =>
                <TCell key={index} {...item} />
            )}
        </tr>
        </thead>)
    }
}


class Row extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {

        return (
            <tr>
                <td>
                    {this.props.Key}
                </td>
                <td>
                    {this.props.LastModified}
                </td>
                <td>
                    {sizeHandler(this.props.Size)}
                </td>
                <td>
                    <button>下载</button>
                </td>
            </tr>
        )
    }

}

class InfoLine extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row margin-bottom-10">
                <p>对象数{this.props.currentObjectNumbers} | 容量： {this.props.currentLevelSize}</p>
            </div>
        )
    }
}

class FileTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            header: [{name: '名称',}, {name: '最后操作时间',}, {name: '文件大小'}, {name: '操作'}],
            bucketName: this.props.bucketName,
            currentPrefix: '', // dir/
            contents: [],
            commonPrefixes: [],
            prePrefix: '',
            parentDir: '',
            history: [
                {
                    prefix: ''
                }
            ],
            stepNumber: 0,
            needRefresh: false,

        }
        // todo => require from backend
        this.obsClient = new ObsClient({
            access_key_id: "POC15HNEABZRTCXJXRR7",
            secret_access_key: "koKUwzTk1KQD77FiAwrF6TfdyAqEqKIZKnlzlNJ7",
            server: 'obs.cn-south-1.myhuaweicloud.com'
        });
        this.addressClickHandler = this.addressClickHandler.bind(this)

    }


    init() {
        // list all
        let table = this;
        this.obsClient.listObjects({
            Bucket: this.state.bucketName,
            MaxKeys: 1000,
            Delimiter: '/',
        }, function (err, result) {
            if (err) {
                console.error('Error-->' + err);
            } else {
                //console.log(result)
                if (result.CommonMsg.Status < 300 && result.InterfaceResult) {
                    table.setState({
                        contents: result.InterfaceResult.Contents,
                        commonPrefixes: result.InterfaceResult.CommonPrefixes,
                        currentPrefix: result.InterfaceResult.Prefix,
                    })

                }
            }
        })
    }

    getObj(key) {
        let info = this
        this.obsClient.getObject({
            Bucket: this.state.bucketName,
            Key: key,
            SaveByType: 'file',
            ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
                info.props.taskMessage(
                    prefix + files[0].path, files[0].path, files[0].size, transferredAmount, totalAmount, totalSeconds
                )
            }
        }, function (err, result) {
            if (err) {
                console.error('Error-->' + err);
            } else {
                console.log('Status-->' + result.CommonMsg.Status);
                if (result.CommonMsg.Status < 300 && result.InterfaceResult) {
                    // 获取下载对象的路径
                    console.log('Download Path:');
                    console.log(result.InterfaceResult.Content.SignedUrl);
                }
            }
        });
    }

    downwards(prefix) {
        let table = this
        this.obsClient.listObjects({
            Bucket: this.state.bucketName,
            MaxKeys: 1000,
            Prefix: prefix,
            Delimiter: '/'
        }, function (err, result) {
            if (err) {
                console.error('Error-->' + err);
            } else {

                if (result.CommonMsg.Status < 300 && result.InterfaceResult) {
                    table.setState({
                        contents: result.InterfaceResult.Contents,
                        commonPrefixes: result.InterfaceResult.CommonPrefixes,
                        currentPrefix: result.InterfaceResult.Prefix,
                        history: table.state.history.concat([
                            {
                                prefix: result.InterfaceResult.Prefix
                            }
                        ]),
                        stepNumber: table.state.stepNumber + 1
                    })

                }
            }
        })
    }

    componentDidMount() {
        this.init()
    }

    upload(files, prefix) {
        var cp;
        var hook;
        let info = this
        this.obsClient.uploadFile({
            Bucket: bucketName,
            Key: prefix + files[0].path,
            SourceFile: document.getElementById('obsupload').files[0],
            PartSize: 9 * 1024 * 1024,

            ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
                info.props.taskMessage(
                    prefix + files[0].path, files[0].path, files[0].size, transferredAmount, totalAmount, totalSeconds
                )

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
                        // console.log(transferredAmount * 1.0 / totalSeconds / 1024);
                        // console.log(transferredAmount * 100.0 / totalAmount);
                        info.props.taskMessage(
                            prefix + files[0].path, files[0].path, files[0].size, transferredAmount, totalAmount, totalSeconds
                        )
                    },
                    EventCallback: function (eventType, eventParam, eventResult) {
                        // 处理事件响应
                    },
                }, function (err, result) {
                    if (err) {
                        console.error('Error-->' + err);
                        info.handleFresh();
                    } else {
                        if (result.CommonMsg.Status < 300) {
                            // console.log('RequestId-->' + result.InterfaceResult.RequestId);
                            // console.log('Bucket-->' + result.InterfaceResult.Bucket);
                            // console.log('Key-->' + result.InterfaceResult.Key);
                            // console.log('Location-->' + result.InterfaceResult.Location);
                            // todo info.refresh();
                            info.handleFresh();
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
                    info.handleFresh();
                }
            }
        });

    }

    handleFresh() {
        this.setState({needRefresh: true});
        this.refresh();
    }

    refresh() {
        if (this.state.needRefresh) {
            let table = this
            let prefix = this.state.currentPrefix
            this.obsClient.listObjects({
                Bucket: table.state.bucketName,
                MaxKeys: 1000,
                Prefix: prefix,
                Delimiter: '/'
            }, function (err, result) {
                if (err) {
                    console.error('Error-->' + err);
                } else {
                    if (result.CommonMsg.Status < 300 && result.InterfaceResult) {
                        table.setState({
                            contents: result.InterfaceResult.Contents,
                            commonPrefixes: result.InterfaceResult.CommonPrefixes,
                            currentPrefix: result.InterfaceResult.Prefix,
                            needRefresh: false,
                        })
                    }
                }
            })
        }
    }

    addTasks = (items, prefix) => {
        this.upload(items, prefix)
    }

    addressClickHandler(e, act) {
        console.log(this.state.stepNumber, this.state.history.length)
        if (act === 1 && this.state.stepNumber > 0) {
            // back
            let table = this
            this.obsClient.listObjects({
                Bucket: this.state.bucketName,
                MaxKeys: 1000,
                Prefix: table.state.history[table.state.stepNumber - 1].prefix,
                Delimiter: '/'
            }, function (err, result) {
                if (err) {
                    console.error('Error-->' + err);
                } else {

                    if (result.CommonMsg.Status < 300 && result.InterfaceResult) {

                        table.setState({
                            contents: result.InterfaceResult.Contents,
                            commonPrefixes: result.InterfaceResult.CommonPrefixes,
                            currentPrefix: result.InterfaceResult.Prefix,
                            stepNumber: table.state.stepNumber - 1
                        })

                    }
                }
            })
        } else if (act === 2 && this.state.stepNumber < this.state.history.length - 1) {
            let table = this
            this.obsClient.listObjects({
                Bucket: this.state.bucketName,
                MaxKeys: 1000,
                Prefix: table.state.history[table.state.stepNumber + 1].prefix,
                Delimiter: '/'
            }, function (err, result) {
                if (err) {
                    console.error('Error-->' + err);
                } else {

                    if (result.CommonMsg.Status < 300 && result.InterfaceResult) {

                        table.setState({
                            contents: result.InterfaceResult.Contents,
                            commonPrefixes: result.InterfaceResult.CommonPrefixes,
                            currentPrefix: result.InterfaceResult.Prefix,
                            stepNumber: table.state.stepNumber + 1
                        })
                    }
                }
            })

        } else if (act === 3 && this.state.currentPrefix != null) {
            let table = this
            let prefix = this.state.currentPrefix.split("/").filter(function (x) {
                return x != "";
            })
            let p = prefix.slice(0, prefix.length - 1)
            p.push("")

            this.obsClient.listObjects({
                Bucket: this.state.bucketName,
                MaxKeys: 1000,
                Prefix: p.join("/"),
                Delimiter: '/'
            }, function (err, result) {
                if (err) {
                    console.error('Error-->' + err);
                } else {

                    if (result.CommonMsg.Status < 300 && result.InterfaceResult) {

                        table.setState({
                            contents: result.InterfaceResult.Contents,
                            commonPrefixes: result.InterfaceResult.CommonPrefixes,
                            currentPrefix: result.InterfaceResult.Prefix,
                            history: table.state.history.concat([
                                {
                                    prefix: result.InterfaceResult.Prefix
                                }
                            ]),
                            stepNumber: table.state.stepNumber + 1
                        })
                    }
                }
            })
        }
    }

    render() {
        const dirs = this.state.commonPrefixes.map((item, index) => {
            return (<tr key={index}>
                    <td colSpan={3} onClick={() => this.downwards(item.Prefix)}>{item.Prefix}</td>
                    <td>
                        <button>下载</button>
                    </td>
                </tr>
            )
        });
        const rows = this.state.contents.map((item, index) => {

            let res = item.Key.includes(this.state.currentPrefix)
            if (res && this.state.currentPrefix && item.Key !== this.state.currentPrefix) {
                item.Key = item.Key.slice(this.state.currentPrefix.length,)
                return <Row key={index} {...item}/>
            } else if (item.Key === this.state.currentPrefix) {

            } else {
                return (
                    <Row key={index} {...item}/>
                );
            }

        })

        return (
            <div>
                <div className="row margin-bottom-10">
                    <div className="col-md-2">
                        <a onClick={(e) => this.addressClickHandler(e, 1)} data-target='back'>back </a>
                        <a onClick={(e) => this.addressClickHandler(e, 2)} data-target='forward'>forward </a>
                        <a onClick={(e) => this.addressClickHandler(e, 3)} data-target='up'>up</a>
                    </div>
                    <div className="col-md-10">
                        <input className="form-control" value={this.state.currentPrefix} readOnly={true}
                        />
                    </div>
                </div>
                <InfoLine key={2} currentObjectNumbers={3} currentLevelSize="9G"/>
                <div key={3} className="row margin-bottom-10">
                    <ul className="list-group list-group-horizontal" style={{listStyle: "none", border: "none"}}>
                        <li className="list-group-item" style={{listStyle: "none", border: "none"}}>
                            <BasicModal prefix={this.state.currentPrefix} addTasks={this.addTasks}
                            />
                        </li>
                        <li className="list-group-item" style={{listStyle: "none", border: "none"}}>
                            <InputModal prefix={this.state.currentPrefix} onFresh={() => this.handleFresh()}/>
                        </li>
                        <li className="list-group-item" style={{listStyle: "none", border: "none"}}>
                            <button key="3" className="btn btn-sm btn-primary">下载</button>
                        </li>
                    </ul>
                </div>

                <FileList header={this.state.header} dirs={dirs} rows={rows} />

            </div>
        )
    }
}


class FileList extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <table key={4} className='table table-bordered'>
                <Thead header={this.props.header}/>
                <tbody>
                {this.props.dirs}
                {this.props.rows}
                </tbody>
            </table>
        )
    }
}


ReactDOM.render(
    // <LeftSideNavbar/>
    <InfoPanel bucketName={bucketName}/>,
    document.getElementById('root')
);
