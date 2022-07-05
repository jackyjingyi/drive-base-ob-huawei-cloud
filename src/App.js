import React, {useEffect, useReducer, useState} from 'react'
import {Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams} from "react-router-dom";
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import $ from 'jquery'
import {UploadModal} from "./s3ObjectPanel/s3ObjectFuncs/S3ObjectFuncModals";
import {Controller} from "./s3ObjectPanel/s3ObjectPanel";
import {LoginModal} from "./login/loginComponent";
import {RegionDict, searchDataGrim, bucketName, s3server, companyProductDir, productType, companyID} from './config'
import Banner from "./banner/Banner";
import {RepoContext} from "./contextManager";
import ProductPanel from "./core/mainpanel";
import ProductList from "./core/productList"
import Thumbnail from "./core/thumbnail";
import ProductDetail from "./core/productDetail";
import Query from './features/query/Query'

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

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: "#E2E6EA", ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    fontSize: 18,
    color: theme.palette.text.secondary,
    height: 'auto',
    minHeight: '12.5vh',
}));

const Title = styled(Paper)(({theme}) => ({
    backgroundColor: "#738499", ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: "white",
    fontWeight: 24,
    fontSize: 24,
    bold: true
}));

const Tag = styled(Paper)(({theme}) => ({
    ...theme.typography.body2, // padding: theme.spacing(1),
    textAlign: 'center',
    fontWeight: 12,
    fontSize: 12,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    width: '45%',
    display: 'inline-block',
    margin: '3.5px',
    padding: '3px',
}));

const defaultTotal = 12
const total = 16
const left = 3
const mapWidth = 9
const titleWidth = 4

function App() {
    // main entry
    return (<div className={`App`}>

        <Routes>
            <Route path={`/`} element={<Home/>}>
                <Route path={``} element={<MapsPanel/>}/>
                <Route path={`region-company/:regionCompanyID`}
                       element={<FileSys bucketName={bucketName} server={s3server}/>}>

                    <Route path={`type/:productType`} element={<ProductPanel/>}>
                        <Route index element={<ProductList/>}/>
                        <Route path={`list`} element={<ProductList/>}/>
                        <Route path={`thumnail`} element={<Thumbnail/>}/>
                    </Route>
                    <Route path={`:productType/:productID`} element={<ProductDetail/>}/>
                </Route>
            </Route>
        </Routes>
    </div>)

}

function Home() {
    const location = useLocation()
    const params = useParams()
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const bannerSX = {
        width: "100%", height: "10vh", paddingLeft: '12px', paddingRight: '12px'
    }

    return (<div className={`container-fluid page`}>
        <Box className={`banner`} sx={bannerSX}>
            <Banner/>
        </Box>
        <Grid className={`main`}>
            <Grid container spacing={0} columns={total}>
                <Grid item xs={left} className={`leftSideMenu`} sx={{
                    height: '80vh', minHeight: '80vh', overflowY: 'scroll'
                }}>
                    <Stack>
                        <Box>
                            <Title>主数据检索</Title>
                        </Box>
                        <Box>
                            <Grid container direction={`column`}>
                                {searchDataGrim.map((item, index) => {
                                    return (<Grid item key={index}
                                            sx={{backgroundColor: '#E2E6EA'}}
                                    >
                                        <Grid container

                                        >
                                            <Grid item xs={titleWidth} className={`infoType`}
                                                  sx={{height: '100%'}}>
                                                <Typography variant={`h6`} align={`center`} noWrap={true}>{item.title}</Typography>
                                            </Grid>
                                            <Grid item xs={defaultTotal - titleWidth}
                                                sx={{backgroundColor: '#fff',
                                            }}
                                            >
                                                <Box sx={{display: 'inline-block', overflowX:'auto',overflowY:'auto'}}>
                                                    {item.tags.map((n, j) => {

                                                        if (n.link !== null) {
                                                            return (<Tag id={j} key={j}>
                                                                <Button size={`small`}
                                                                        variant={`text`}
                                                                        color={`secondary`}
                                                                >
                                                                    <NavLink to={`${n.link}/type/highBuilding`}
                                                                             style={{
                                                                                 backgroundColor: params.regionCompanyID === n.id ? "#8FAADC" : "",
                                                                                 textDecorationLine: "none",
                                                                                 color: "black",
                                                                             }}

                                                                    >{n.name}</NavLink>
                                                                </Button>
                                                            </Tag>)
                                                        } else {

                                                            return (<Tag key={j}>
                                                                <Button size={`small`} disabled>
                                                                    {n.name}
                                                                </Button>
                                                            </Tag>)
                                                        }
                                                    })}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>)
                                })}
                            </Grid>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={total - left}>
                    <Outlet/>
                </Grid>
            </Grid>
        </Grid>
    </div>)
}

function MapsPanel() {
    return (<Grid container spacing={0}>
        <Grid item xs={mapWidth} sx={{
            backgroundImage: `url("https://materials-bay.octiri.com/projects/map-all.png")`,
            backgroundColor: '#cccccc',
            height: '80vh',
            minHeight: '80vh',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            position: 'relative',
        }}>

        </Grid>
        <Grid item xs={defaultTotal - mapWidth} className={`rightSideTool`} sx={{
            height: '80vh', minHeight: '80vh', width: '100%', display: 'table-cell', verticalAlign: 'middle'
        }}>
            <Box>
                <div>
                    <img className={`rightImg`}
                         src={`https://materials-bay.octiri.com/projects/map1.png`}/>
                </div>
                <div>
                    <img className={`rightImg`}
                         src={`https://materials-bay.octiri.com/projects/map2.png`}/>
                </div>
            </Box>
        </Grid>
    </Grid>)
}

function FileSys(props) {
    const params = useParams()
    const navigate = useNavigate()
    const imageSupportList = ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'gif', 'tiff']
    const [isLogin, setIsLogin] = useState(JSON.parse(window.localStorage.getItem('isLogin')) || false)
    const [ak, setAk] = useState(window.localStorage.getItem('ak') || '')
    const [sk, setSK] = useState(window.localStorage.getItem('sk') || '')

    const [server, setServer] = useState(props.server)
    // todo discard
    const [tab, setTab] = useState(0)
    // upload \ download tasks
    const [currentTasks, setCurrentTasks] = useState([])
    const [finishedTasks, setFinishedTasks] = useState([])
    // company directory
    const [companyDir, setCompanyDir] = useState(RegionDict[params.regionCompanyID])
    // todo switch this to concat prefix
    const [prefix, setPrefix] = useState(RegionDict[params.regionCompanyID])
    // global obsClient
    const [obsClient, setObsClient] = useState(() => {
        if (isLogin && ak !== '' && sk !== '') {
            return new ObsClient({
                access_key_id: ak, secret_access_key: sk, server: server,
            })
        }
        return null
    })
    // 产品库按钮
    const [productTypes, setProductTypes] = useState(productType)
    const [needRefresh, setNeedRefresh] = useReducer(x => x + 1, 0) // 强制更新
    const [bucketName, setBucketName] = useState(props.bucketName)
    const [imageBaseUrl, setImageBaseUrl] = useState('https://' + bucketName + '.' + server + '/')
    const [target, setTarget] = useState('')
    const [productTab, setProductTab] = useState('highBuilding')
    const [formatTab, setFormatTab] = useState('list')

    function handleSwitch(e, s) {
        setTab(s);
    }

    function dirLoader(s) {
        setTab(0);
        setNeedRefresh();
        setPrefix(s)
    }

    useEffect(() => {
        console.group("Change Prefix")
        setPrefix(RegionDict[params.regionCompanyID])
        console.log(`Current prefix is ${params.regionCompanyID}`)
        console.groupEnd()
    }, [params.regionCompanyID])

    useEffect(() => {
        if (ak !== '' && sk !== '') {
            setObsClient(new ObsClient({
                access_key_id: ak, secret_access_key: sk, server: server,
            }))
            console.log(obsClient)
        }
    }, [ak, sk])

    useEffect(() => {
        setProductTab(params.productType)
    }, [params.productType])

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
                Key: prefix + files[0].path,
                SourceFile: document.getElementById('obsupload').files[0],
                PartSize: 9 * 1024 * 1024,
                ACL: obsClient.enums.AclPublicRead,
                ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
                    console.log(currentTasks)
                    handleMessage(prefix + files[0].path, files[0].path, files[0].size, transferredAmount, totalAmount, totalSeconds)
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
                Key: prefix + files[0].path,
                SourceFile: document.getElementById('obsupload').files[0],
                PartSize: 9 * 1024 * 1024,


                ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
                    console.log(currentTasks)
                    handleMessage(prefix + files[0].path, files[0].path, files[0].size, transferredAmount, totalAmount, totalSeconds)
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
                UploadCheckpoint: cp, ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
                    // console.log(transferredAmount * 1.0 / totalSeconds / 1024);
                    // console.log(transferredAmount * 100.0 / totalAmount);
                    console.log(currentTasks)
                    handleMessage(prefix + files[0].path, files[0].path, files[0].size, transferredAmount, totalAmount, totalSeconds)
                }, EventCallback: function (eventType, eventParam, eventResult) {
                    // 处理事件响应
                }, ResumeCallback: function (resumeHook, uploadCheckpoint) {
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

    function handleLogin() {
        // todo  check if valid ak,sk
        setIsLogin(true)
        window.localStorage.setItem('ak', ak)
        window.localStorage.setItem('sk', sk)
        window.localStorage.setItem('isLogin', true)
    }

    function handleClickTab(e) {
        console.group('Switch Info')
        console.log(e.target.dataset.target)
        // setProductTab(e.target.dataset.target)
        navigate(`/region-company/${params.regionCompanyID}/type/${e.target.dataset.target}`)
        console.groupEnd()
    }

    return (<Grid container spacing={0}>
        <Grid item xs={defaultTotal}>
            <Box sx={{maxheight: '80vh', minHeight: '75vh'}}>
                <Box sx={{margin: '1vmin'}}>
                    <Grid
                        container
                        direction={`column`}
                        justifyContent={`center`}
                        // alignItems={`center`}
                    >
                        <Grid
                            item
                            xs={3}
                            id={`buttonRow`}
                        >
                            <Grid container spacing={0}
                                  justifyContent={`center`}
                                  alignItems={`center`}
                            >

                                {Object.keys(productTypes).map((i) => {
                                    return (<Grid key={i} item xs={4} sx={{padding: "0.2vmin"}}
                                                  alignItems={'center'}
                                                  justifyContent={`center`}
                                    >
                                        <Button key={i} variant={`contained`}
                                                sx={{
                                                    backgroundColor: i === productTab ? '#333854' : '#707387',
                                                    width: '100%',
                                                    height: '4vh'
                                                }}
                                                data-target={i}
                                                onClick={(e) => handleClickTab(e)}
                                        >
                                            {productTypes[i]}
                                        </Button>
                                    </Grid>)
                                })}
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={10}
                            id={`infoPanel`}
                            sx={{border: '1.5px solid'}}
                        >
                            <RepoContext.Provider
                                value={{
                                    prefix,
                                    productTypes,
                                    productTab,
                                    setProductTab,
                                    formatTab,
                                    setFormatTab,
                                    obsClient
                                }}>
                                <Outlet/>
                            </RepoContext.Provider>
                        </Grid>
                    </Grid>
                </Box>
            </Box>


            <div>
                <LoginModal open={!isLogin}>
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="body2" component={'span'}>
                            请登录
                        </Typography>
                        <input aria-label={`ak`} className="form-control" value={ak} onChange={(e) => {
                            setAk(e.target.value)
                        }}/>
                        <input aria-label={`sk`} className="form-control" value={sk} onChange={(e) => {
                            setSK(e.target.value)
                        }} type={`password`}/>
                        <div id="modal-modal-description">
                            <p><span>说明:</span></p>
                            <p>- 基于集团安全要求: </p>
                            <p>- 登录本云盘需求重新进行安全验证。</p>
                            <p>- 请输入AK/SK</p>
                        </div>
                        <Button onClick={handleLogin}>确定</Button>
                    </Box>
                </LoginModal>
            </div>
        </Grid>
    </Grid>)
}

export default App;