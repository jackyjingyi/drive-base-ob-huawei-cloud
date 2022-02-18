import React, {useEffect, useReducer, useState} from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import Banner from "./Banner"
import {LoginModal} from "./Modals";
import {Row} from './s3objectList/s3objectComponent/row';
import {FileList} from "./s3objectList/s3objectComponent/fileList";
import {sizeHandler} from "./utils";
import {DirectoryLine} from './s3directoryFuncs/directoryLine'
import {S3ObjectFuncs} from './s3ObjectPanel/s3ObjectFuncs/s3ObjectFuncs'
import {Controller} from './s3ObjectPanel/s3ObjectPanel'
import LeftSideNavbar from './Navbar'
import {TaskManager} from "./task/taskManager";
import {UploadModal} from "./s3ObjectPanel/s3ObjectFuncs/S3ObjectFuncModals";

var bucketName = 'oct-project-collection' //'iri-drive-bucket'  //'dev-do-not-delete''oct-project-collection'

const localStorage = window.localStorage

// ========================================


function DriveController(props) {
    const imageSupportList = [
        'jpg', 'jpeg', 'png', 'bmp', 'webp', 'gif', 'tiff'
    ]
    const [isLogin, setIsLogin] = useState(localStorage.getItem('isLogin') || false)
    const [ak, setAk] = useState(localStorage.getItem('ak') || '')
    const [sk, setSK] = useState(localStorage.getItem('sk') || '')
    const [server, setServer] = useState(props.server)
    const [tab, setTab] = useState(0)
    const [currentTasks, setCurrentTasks] = useState([])
    const [finishedTasks, setFinishedTasks] = useState([])
    const [Prefix, setPrefix] = useState('')
    const [obsClient, setObsClient] = useState(() => {
        if (isLogin && ak !== '' && sk !== '') {
            return new ObsClient({
                access_key_id: ak,
                secret_access_key: sk,
                server: server,
            })
        }
        return null
    })
    const [needRefresh, setNeedRefresh] = useReducer(x => x + 1, 0) // 强制更新
    const [bucketName, setBucketName] = useState(props.bucketName)
    const [imageBaseUrl, setImageBaseUrl] = useState(
        'https://' + bucketName + '.' + server + '/'
    )
    const [target, setTarget] = useState('')
    const taskList = <TaskManager currentTasks={currentTasks} finishedTasks={finishedTasks} dirLoader={dirLoader}/>
    const fileList = (
        <Controller obsClient={obsClient} bucketName={bucketName} setPrefix={setPrefix} needRefresh={needRefresh}
                    cp={Prefix}
                    imageBaseUrl={imageBaseUrl}> <UploadModal prefix={Prefix}
                                                              upload={upload}/></Controller>)
    const switchDict = [
        {tabID: 0, component: fileList},
        {tabID: 1, component: taskList},
    ]

    function handleSwitch(e, s) {
        setTab(s);
    }

    function dirLoader(s) {
        setTab(0);
        setNeedRefresh();
        setPrefix(s)
    }

    useEffect(() => {
        setObsClient(new ObsClient({
            access_key_id: ak,
            secret_access_key: sk,
            server: server,
        }))

    }, [ak, sk])

    function handleUserLogin(a, s) {
        setAk(a);
        setSK(s);
    }

    function refresh() {
        setNeedRefresh();
    }

    function handleMessage(k, p, s, t, ta, ts) {

        if (t === ta) {
            //完成
            let _tty = [];
            let _con = false
            const _tmp = currentTasks
            const _tmpf = finishedTasks
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
                setCurrentTasks(_tty);
                setFinishedTasks(finishedTasks.concat([[k, p, s, t, ta, ts]]));
            } else {
                setCurrentTasks(_tty);
                setFinishedTasks(_tmpf);
            }
        } else {
            let contain = false
            let _up = false
            const tmp = currentTasks
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
                setCurrentTasks(currentTasks.concat([[k, p, s, t, ta, ts]]))
                setTab(1);
            } else {
                setCurrentTasks(tmp)
            }
        }
    }

    function upload(files) {
        var cp;
        var hook;
        if (imageSupportList.includes(files[0].path.split('.').pop())) {
            obsClient.uploadFile({
                Bucket: bucketName,
                Key: Prefix + files[0].path,
                SourceFile: document.getElementById('obsupload').files[0],
                PartSize: 9 * 1024 * 1024,
                ACL: obsClient.enums.AclPublicRead,
                ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
                    console.log(currentTasks)
                    handleMessage(
                        Prefix + files[0].path, files[0].path, files[0].size, transferredAmount, totalAmount, totalSeconds
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
                        setTab(0)
                        refresh()
                    }
                }
            });

        } else {
            obsClient.uploadFile({
                Bucket: bucketName,
                Key: Prefix + files[0].path,
                SourceFile: document.getElementById('obsupload').files[0],
                PartSize: 9 * 1024 * 1024,


                ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
                    console.log(currentTasks)
                    handleMessage(
                        Prefix + files[0].path, files[0].path, files[0].size, transferredAmount, totalAmount, totalSeconds
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
                        setTab(0)
                        refresh()
                    }
                }
            });
        }


        function reUpload() {
            obsClient.uploadFile({
                UploadCheckpoint: cp,
                ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
                    // console.log(transferredAmount * 1.0 / totalSeconds / 1024);
                    // console.log(transferredAmount * 100.0 / totalAmount);
                    console.log(currentTasks)
                    handleMessage(
                        Prefix + files[0].path, files[0].path, files[0].size, transferredAmount, totalAmount, totalSeconds
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
                        refresh()
                    } else {
                        console.log('Code-->' + result.CommonMsg.Code);
                        console.log('Message-->' + result.CommonMsg.Message);
                    }
                }
            })
        }


    }

    return (
        <div className={`container`}>
            <Banner/>
            <div className="row">
                <div className={`col-md-2`} style={{backgroundColor: '#f8f9fa'}}>
                    <LeftSideNavbar onClick={handleSwitch}/>
                </div>
                <div className={`col-md-10 border-b-radius no-padding border border-light border-start-0`}>
                    {switchDict[tab].component}
                </div>
            </div>
            <div><LoginModal isLogin={isLogin} userLogin={handleUserLogin}/></div>
        </div>
    )
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

ReactDOM.render(
    // <LeftSideNavbar/>
    <DriveController bucketName={bucketName} server={`obs.cn-south-1.myhuaweicloud.com`}/>,
    document.getElementById('root')
);
