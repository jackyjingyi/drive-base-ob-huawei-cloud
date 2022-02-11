import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import Banner from "./Banner"
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import {useDropzone} from "react-dropzone";
import {IconContext} from "react-icons";
import {AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineArrowUp, AiOutlineUpload} from "react-icons/ai";
import {MdOutlineCreateNewFolder} from "react-icons/md"

var bucketName = 'iri-drive-bucket' //'iri-drive-bucket'  //'dev-do-not-delete''oct-project-collection'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '60%',
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
        props.obsClient.putObject({
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

const localStorage = window.localStorage

// ========================================

function LoginModal(props) {
    const [open, setOpen] = useState(!props.isLogin);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isLogin, setLogin] = useState(props.isLogin);
    const [ak, setAK] = useState(() => {
        const saved = localStorage.getItem('ak')
        return saved || ""
    })
    const [sk, setSK] = useState(() => {
        const saved = localStorage.getItem('sk')
        return saved || ""
    })

    function handleAk(e) {
        setAK(e.target.value)
    }


    useEffect(() => {
        localStorage.setItem("ak", ak)
    })

    useEffect(() => {
        localStorage.setItem("sk", sk)
    })

    useEffect(() => {
        localStorage.setItem('isLogin', isLogin)
    })

    function handleSK(e) {
        setSK(e.target.value)
    }

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
                    <input aria-label={`sk`} className="form-control" value={sk} onChange={handleSK}/>
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

class InfoPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infoPanel: 'file',
            currentTasks: [],
            finishedTasks: [],
            login: localStorage.getItem('isLogin') || false,
            ak: localStorage.getItem('ak') || '',
            sk: localStorage.getItem('sk') || '',
            server: 'obs.cn-south-1.myhuaweicloud.com',
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

    handleUserLogin = (ak, sk) => {
        this.setState({
            ak: ak,
            sk: sk,
            login: localStorage.getItem('isLogin') || false,
        })
    }

    getObsClient() {
        if (this.state.login) {
            return new ObsClient({
                access_key_id: this.state.ak,
                secret_access_key: this.state.sk,
                server: this.state.server,
            })
        }
        return null

    }

    render() {
        const taskList = <TaskTable currentTasks={this.state.currentTasks} finishedTasks={this.state.finishedTasks}
                                    isLogin={this.state.login}/>
        const fileList = <FileTable bucketName={this.props.bucketName} taskMessage={this.handleMessage}
                                    isLogin={this.state.login} ak={this.state.ak} sk={this.state.sk}
                                    obsClient={this.getObsClient()} server={this.state.server}
        />
        return (
            <div className="container">
                <Banner/>
                <div className="row">
                    <div className="col-md-2">
                        <ul className="nav flex-column" role={`tablist`} id={`myTab`}>
                            <li className="nav-item border" role={`presentation`}>
                                <a key={1} className="nav-link" onClick={() => this.handleNavClick('file')}>文件管理
                                </a>
                            </li>
                            <li className="nav-item border">
                                <a key={2} className="nav-link" onClick={() => this.handleNavClick('task')}>任务管理
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-10">
                        {this.state.infoPanel === 'file' ? fileList : taskList}
                    </div>
                </div>
                <div><LoginModal isLogin={this.state.login} userLogin={this.handleUserLogin}/></div>
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
            isLogin: this.props.isLogin
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
            <td>
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
    imageSupportList = [
        'jpg', 'jpeg', 'png', 'bmp', 'webp', 'gif', 'tiff'
    ]

    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            isImage: this.imageSupportList.includes(this.props.Key.split('.').pop()),
        }

    }

    componentDidMount() {
        if (this.state.isImage) {
            this.setState({
                imageUrl: 'https://' + bucketName + '.' + this.props.server + '/' + this.props.Key + '?x-image-process=image/resize,m_lfit,h_55,w_55',
            })
        }
    }

    actionList() {
        if (this.state.isImage) {
            // is image call getImageUrl
            return (
                <div>
                    <button onClick={this.props.onClick}>下载</button>
                    <span>&nbsp;</span>
                    <a className={`btn`}>查看</a>
                </div>
            )
        } else {
            return (
                <div>
                    <button onClick={this.props.onClick}>下载</button>
                </div>
            )
        }
    }

    dateFormat() {
        const date = this.props.LastModified
        if (date instanceof Date) {
            return date.Format("yyyy-MM-dd")
        } else {
            const newDate = new Date(date)
            return newDate.Format("yyyy-MM-dd")
        }
    }

    viewImage() {
        if (this.state.isImage) {
            return (
                <img
                    src={this.state.imageUrl}
                    // alt={this.props.Key}
                />
            )
        }
    }

    render() {
        return (
            <tr>
                <td>
                    <div>
                        {this.viewImage()}
                        <span className={`d-inline-block text-truncate`}>
                            {this.props.currentKey}
                        </span>
                    </div>
                </td>
                <td>
                    {this.dateFormat()}
                </td>
                <td>
                    {sizeHandler(this.props.Size)}
                </td>
                <td>
                    {this.actionList()}
                </td>
            </tr>
        )
    }

}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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
            isLogin: this.props.isLogin,
            ak: this.props.ak,
            sk: this.props.sk,
            obsClient: this.props.obsClient,
            server: this.props.server,
        }
        // todo => require from backend
        // if (this.state.ak !== null && this.state.sk !== null) {
        //     this.obsClient = new ObsClient({
        //         access_key_id: this.state.ak,
        //         secret_access_key: this.state.sk,
        //         server: 'obs.cn-south-1.myhuaweicloud.com'
        //     });
        // }
        this.addressClickHandler = this.addressClickHandler.bind(this)

    }

    init() {
        // list all
        let table = this;
        console.log(this.state.obsClient)
        this.state.obsClient.listObjects({
            Bucket: this.state.bucketName,
            MaxKeys: 1000,
            Delimiter: '/',
        }, function (err, result) {
            if (err) {
                console.error('Error-->' + err);
            } else {
                console.log(result)
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

    getObj(e, item) {
        let info = this
        let signedUrl;
        this.state.obsClient.getObject({
            Bucket: this.state.bucketName,
            Key: this.state.currentPrefix + item.Key,
            SaveByType: 'file',
            ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
                info.props.taskMessage(
                    this.state.currentPrefix + item.Key, item.Key, item.Size, transferredAmount, totalAmount, totalSeconds
                )
            }
        }, function (err, result) {
            console.log(result)
            if (err) {
                console.error('Error-->' + err);
            } else {
                console.log('Status-->' + result.CommonMsg.Status);
                if (result.CommonMsg.Status < 300 && result.InterfaceResult) {
                    // 获取下载对象的路径
                    console.log('Download Path:');
                    console.log(result.InterfaceResult.Content.SignedUrl);
                    signedUrl = result.InterfaceResult.Content.SignedUrl
                }
            }
        });
        window.open(signedUrl)
        // if (signedUrl){
        //     axios({
        //         url:signedUrl,
        //         method:'GET',
        //         responseType:'blob',
        //         onDownloadProgress:(progressEvent)=>{
        //             console.log(this.state.currentPrefix+item.Key,item.Key,item.Size,progressEvent.loaded, progressEvent.total,progressEvent.timeStamp)
        //             info.props.taskMessage(
        //                 this.state.currentPrefix+item.Key,item.Key,item.Size,progressEvent.loaded, progressEvent.total,progressEvent.timeStamp
        //             )
        //         }
        //     })
        // }
    }

    downwards(prefix) {
        let table = this
        this.state.obsClient.listObjects({
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

    static getDerivedStateFromProps(props, state) {
        if (props.isLogin) {
            return {
                isLogin: props.isLogin,
                ak: props.ak,
                sk: props.sk,
                obsClient: props.obsClient
            }

        }
        return null
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.ak !== this.state.ak && prevState.sk !== this.state.sk && this.state.obsClient !== null) {
            console.log(this.state)
            this.init()
        }
    }

    componentDidMount() {
        console.log("here", this.state)
        if (this.state.isLogin) {
            // let obs= new ObsClient({
            //     access_key_id: this.state.ak,
            //     secret_access_key: this.state.sk,
            //     server: 'obs.cn-south-1.myhuaweicloud.com'
            // });
            //  this.setState({
            //     obsClient:obs
            // })
            this.init()
        }
    }

    upload(files, prefix) {
        var cp;
        var hook;
        let info = this

        function reUpload() {
            info.state.obsClient.uploadFile({
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
                ResumeCallback: function (resumeHook, uploadCheckpoint) {
                    // 获取取消断点续传上传任务控制参数
                    hook = resumeHook;
                    // 记录断点
                    cp = uploadCheckpoint;
                }
            }, function (err, result) {
                if (err) {
                    console.error('Error-->' + err);
                    reUpload()
                } else {
                    if (result.CommonMsg.Status < 300) {
                        info.handleFresh();
                    } else {
                        console.log('Code-->' + result.CommonMsg.Code);
                        console.log('Message-->' + result.CommonMsg.Message);
                    }
                }
            })
        }

        this.state.obsClient.uploadFile({
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
                reUpload()
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
            this.state.obsClient.listObjects({
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
            this.state.obsClient.listObjects({
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
            this.state.obsClient.listObjects({
                Bucket: this.state.bucketName,
                MaxKeys: 1000,
                Prefix: table.state.history[table.state.stepNumber + 1].prefix,
                Delimiter: '/'
            }, function (err, result) {
                console.log(result)
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

            this.state.obsClient.listObjects({
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

            const _item = Object.assign({}, item)
            let res = _item.Key.includes(this.state.currentPrefix)
            if (res && this.state.currentPrefix && _item.Key !== this.state.currentPrefix) {
                _item.Key = item.Key
                _item.currentKey = _item.Key.slice(this.state.currentPrefix.length,)
                _item.server = this.state.server

                return <Row key={index} {..._item} onClick={(e) => this.getObj(e, {..._item})}/>
            } else if (_item.Key === this.state.currentPrefix) {

            } else {
                _item.Key = item.Key
                _item.currentKey = _item.Key.slice(this.state.currentPrefix.length,)
                _item.server = this.state.server
                return (
                    // 主目录下的obj this.state.currentPrefix is null
                    <Row key={index} {..._item} onClick={(e) => this.getObj(e, {..._item})}/>
                );
            }

        })

        return (
            <div>
                <div className="row margin-bottom-10">
                    <div className={`col-md-2 clearfix`}>
                        <ul className={`list-group list-group-horizontal`}>
                            <li className={`list-group-item`} style={{border: 'none'}}>
                                <a onClick={(e) => this.addressClickHandler(e, 1)} data-target='back'>
                                    <IconContext.Provider value={{size: '1.5em'}}>
                                        <div>
                                            <AiOutlineArrowLeft/>
                                        </div>
                                    </IconContext.Provider>
                                </a>
                            </li>
                            <li className={`list-group-item`} style={{border: 'none'}}>
                                <a onClick={(e) => this.addressClickHandler(e, 2)} data-target='forward'>
                                    <IconContext.Provider value={{size: '1.5em'}}>
                                        <div>
                                            <AiOutlineArrowRight/>
                                        </div>
                                    </IconContext.Provider>
                                </a>
                            </li>
                            <li className={`list-group-item`} style={{border: 'none'}}>
                                <a onClick={(e) => this.addressClickHandler(e, 3)} data-target='up'>
                                    <IconContext.Provider value={{size: '1.5em'}}>
                                        <div>
                                            <AiOutlineArrowUp/>
                                        </div>
                                    </IconContext.Provider>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className={`col-md-10 margin-top-5`}>
                        <input className={`form-control fw-bold`} value={this.state.currentPrefix} readOnly={true}
                        />
                    </div>
                </div>
                <InfoLine key={2} currentObjectNumbers={3} currentLevelSize="9G"/>
                <div key={3} className="row margin-bottom-10">
                    <ul className="list-group list-group-horizontal" style={{listStyle: "none", border: "none"}}>
                        <li className={`list-group-item`}
                            style={{listStyle: "none", border: "none", padding: '0px 0px 0px 15px'}}>
                            <BasicModal prefix={this.state.currentPrefix} addTasks={this.addTasks}
                            />
                        </li>
                        <li className={`list-group-item`}
                            style={{listStyle: "none", border: "none", padding: '0px 0px 0px 15px'}}>
                            <InputModal prefix={this.state.currentPrefix} onFresh={() => this.handleFresh()}
                                        obsClient={this.state.obsClient}/>
                        </li>
                    </ul>
                </div>

                <FileList header={this.state.header} dirs={dirs} rows={rows}/>

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
