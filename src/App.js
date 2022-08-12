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
import {RegionDict, searchDataGrim, bucketName, s3server, companyProductDir, productType} from './config'
import Banner from "./banner/Banner";
import {RepoContext} from "./contextManager";
import ProductPanel from "./core/mainpanel";
import ProductList from "./core/productList"
import Thumbnail from "./core/thumbnail";
import ProductDetail from "./core/productDetail";
import Query from './features/query/Query'
import cookie from "react-cookies";
import jwt_decode from "jwt-decode"
import {useDispatch, useSelector} from "react-redux";
import {ListItem, ListItemIcon, ListItemText, MenuItem, MenuList, TextField} from "@mui/material";
import {login, logout} from "./features/user/usersSlice";
import conf from "./config.json"
import {ContentCut} from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import {nanoid} from "@reduxjs/toolkit";
import TabPanel, {a11yProps} from "./features/tabs/Tabs";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import ResearchCenter from "./features/research/ResearchCenter";
import PDFDisplay from "./features/management/PDFDisplay";

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
const config = conf

function App() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    // main entry
    useEffect(() => {
        let ignore = false
        const timestamp = Date.parse(new Date()) / 1000
        const refresh = cookie.load(`refresh`)
        const uid = cookie.load('uid')

        async function get_csrf() {
            const csrf = await axios.get('/api/accounts/get_csrf_token')
            if (!ignore) {
                cookie.save('csrftoken', csrf.data.csrf_token, '/')
            }
        }

        async function refresh_token(p) {
            console.log(p)
            const access = await axios.post(`/api/token/refresh/`, {
                refresh: p
            })
            if (!ignore) {
                cookie.save('access', access.data.access, '/')
                const newInfo = jwt_decode(access.data.access)
                dispatch(login({
                    ...newInfo, isLogin: true
                }))
                cookie.save('uid', newInfo.uid, '/')  // 用户id
                cookie.save('access', access.data.access, '/')
                cookie.save('refresh', p, '/')
            }
        }

        if (uid && refresh) {
            // 有用户信息
            const info = jwt_decode(refresh)
            console.log(info, timestamp)
            if (timestamp > info.exp) {
                // 过期
                console.log(timestamp, info)
                navigate('/user/login')
            } else {
                // 未过期
                // 直接refresh token
                refresh_token(refresh)
            }
        } else {
            // 无用户信息，pass
            console.log("here")
            if (config.debug) {
                get_csrf()
            }
            navigate('/user/login')
        }
        return () => {
            ignore = true;
        };
    }, [])

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
                    <Route path={`:productID`} element={<ProductDetail/>}/>
                </Route>
                <Route path={`product/house`} element={<HouseHolder/>}>
                    <Route path={''} element={<div>house center</div>}/>
                </Route>
                <Route path={`product/building`} element={<BuildingHolder/>}>
                    <Route path={''} element={<BuildingCenter/>}>
                        <Route path={`:regionID`} element={<BuildingList/>}/>
                    </Route>
                </Route>
                <Route path={`product-management`} element={<div>产品库管理办法</div>}>
                </Route>
                <Route path={`product-research`} element={<ResearchCenter/>}>
                </Route>
            </Route>
            <Route path={`/user`} element={<UserMain/>}>
                <Route path={`login`} element={<Login/>}/>
                <Route path={`logout`} element={<Logout/>}/>
                <Route path={`sign-up`} element={<SignUp/>}/>
                <Route path={`management`} element={<UserManager/>}>
                    <Route path={`reset-passwd`} element={<PasswdReset/>}/>
                </Route>
            </Route>
        </Routes>
    </div>)

}

function UserMain() {
    return (<>
        'user'
        <Box sx={{
            height: '85vh', minHeight: '85vh'
        }}>
            <Outlet/>
        </Box>

    </>)
}

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [values, setValues] = useState({
        username: '', password: '',
    })
    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    };

    function handleClick() {
        if (values.username !== '' && values.password !== '') {
            axios({
                method: 'post', url: `/api/token/`, data: {
                    username: values.username, password: values.password
                }
            }).then((res) => {
                const info = jwt_decode(res.data.access)
                dispatch(login({
                    ...info, isLogin: true
                }))
                cookie.save('uid', info.uid, '/')
                cookie.save('access', res.data.access, '/')
                cookie.save('refresh', res.data.refresh, '/')
                navigate('/')
            }).catch((err) => {
                // popup user login error
                console.log(err)
            })
        }
    }

    return (<>
        <Grid container
              direction={`row`}
              justifyContent={`center`}
              alignItems={`stretch`}
              sx={{
                  height: '100%'
              }}
        >
            <Grid item xs={2} md={6} lg={8}>

            </Grid>
            <Grid item xs={10} md={4} lg={3}>
                <Grid container
                      direction={`column`}
                      justifyContent={`center`}
                      alignItems={`stretch`}
                      sx={{
                          height: '100%', padding: '30px', margin: '15px'
                      }}
                >
                    <Grid item xs={4}>

                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Stack>
                                <TextField id={`username`} label={`用户名`} variant={`standard`} margin={`normal`}
                                           value={values.username}
                                           onChange={handleChange(`username`)}
                                />
                                <TextField id={`password`} label={`密码`} variant={`standard`} margin={`normal`}
                                           value={values.password} type={`password`}
                                           onChange={handleChange(`password`)}
                                />
                                <Button onClick={handleClick}>
                                    登录
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid item xs={2}>

                    </Grid>
                </Grid>

            </Grid>
            <Grid item xs md={2} lg>

            </Grid>
        </Grid>
    </>)
}

function Logout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        cookie.remove('uid', {domain: 'localhost'})
        cookie.remove('access', {domain: 'localhost'})
        cookie.remove('refresh', {domain: 'localhost'})
        cookie.remove('csrftoken', {domain: 'localhost'})
        dispatch(logout())
        navigate('/')
    }, [])
    return ('logout')
}

function UserManager() {
    return (<>
            'user manager'
            <NavLink to={'/user/management/reset-passwd'}>
                更改密码
            </NavLink>
            <Outlet/>
        </>

    )
}

function PasswdReset() {
    return ('change password')
}

function SignUp() {
    return ('signup')
}

function Home() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const [tabIndex, setTabIndex] = useState(0)
    const bannerSX = {
        width: "100%", height: "10vh"
    }
    const topLinks = () => {
        if (user.isLogin) {
            return (<>
                <NavLink to={'/user/management'}>
                    <Typography variant={`body2`} component={`span`} children={'用户管理'}/>
                </NavLink>
                <NavLink to={'/user/logout'}>
                    <Typography variant={`body2`} component={`span`} children={'登出'}/>
                </NavLink>
                <NavLink to={'/'}>
                    <Typography variant={`body2`} component={`span`} children={'首页'}
                    />
                </NavLink>
            </>)
        } else {
            return (<>
                <NavLink to={'/user/sign-up'}>
                    <Typography variant={`body2`} component={`span`} children={'注册'}
                                style={{visibility: user.isLogin ? 'hidden' : 'visible'}}
                    />
                </NavLink>

                <NavLink to={'/user/login'}>
                    <Typography variant={`body2`} component={`span`} children={'登录'}
                                style={{visibility: user.isLogin ? 'hidden' : 'visible'}}/>
                </NavLink>
                <NavLink to={'/'}>
                    <Typography variant={`body2`} component={`span`} children={'首页'}
                    />
                </NavLink>
            </>)
        }
    }

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };


    return (<React.Fragment>
            <Grid container direction={`column`}
                  columns={2}
                  alignItems="stretch"
                  sx={{height: '100%', width: '100%', padding: 0}}>
                <Grid item sx={{backgroundColor: '#e3e4e5', borderBottom: 'solid 1px #ddd', height: '2vh'}}>
                    <Stack
                        direction="row-reverse"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            paddingInlineEnd: '20px'
                        }}
                    >
                        {topLinks()}
                    </Stack>
                </Grid>
            </Grid>
            <Box sx={bannerSX}>
                <Banner/>
            </Box>

            <Box sx={{width: '100%',backgroundColor:'#f6f8fa'}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="首页" {...a11yProps(0)} />
                        <Tab label="产品库V1.0管理办法" {...a11yProps(1)} />
                        <Tab label="产品库V1.0强排可研模板" {...a11yProps(2)} />
                        <Tab label="产品库V1.0楼型库" {...a11yProps(3)} />
                        <Tab label="产品库V1.0户型库" {...a11yProps(4)} />
                    </Tabs>
                </Box>
                <TabPanel value={tabIndex} index={0}>
                    <MapsHolder/>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <ManageHolder/>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <ResearchHolder/>
                </TabPanel>
                <TabPanel value={tabIndex} index={3}>
                    <BuildingHolder/>
                </TabPanel>
                <TabPanel value={tabIndex} index={4}>
                    <HouseHolder/>
                </TabPanel>
            </Box>

        </React.Fragment>

    )
}


function ManageHolder(){
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/product-management')
    }, [])
    return (
        <>
         <PDFDisplay fileID={"G2WKB-ZuIc"}/>

        </>
    )
}


function ResearchHolder(){

    const navigate = useNavigate()
    const user = useSelector(state=>state.user)

    useEffect(() => {
        navigate('/product-research')
    }, [])
    return (
        <Grid container
              direction={`column`}
              justifyContent={`center`}
              alignItems={`stretch`}
              className={`survey-main-panel`}
        >

            <Grid item xs={12} sx={{
                minHeight: '80vh',
                paddingTop: '16px'
            }}>
                <Outlet/>
            </Grid>
        </Grid>

    )
}


function MapsHolder() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('')
    }, [])
    return (<Outlet/>)
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

function BuildingHolder() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/product/building')
    }, [])

    return (
        <Outlet/>
    )
}


function BuildingCenter() {
    function getLeftList() {
        const listData = {
            region: [
                {id: 0, label: '华东战区', value: 'chinaEast'},
                {id: 1, label: '西部战区', value: 'chinaWest'},
                {id: 2, label: '中部战区', value: 'chinaMiddle'},
                {id: 3, label: '北方战区', value: 'chinaNorth'},
                {id: 4, label: '华南战区', value: 'chinaSouth'},
            ]
        }
        return (
            Object.keys(listData).map((item, index) => {

                return <React.Fragment key={nanoid()}><MenuList key={`item-${index}`}>{listData[item].map((i, d) => {
                    return (
                        <MenuItem key={i.id}>
                            <ListItemText key={i.id}>
                                <NavLink to={i.value}>
                                    {i.label}
                                </NavLink>
                            </ListItemText>
                        </MenuItem>
                    )
                })}</MenuList><Divider/></React.Fragment>
            })
        )
    }

    return (<Grid container
                  columns={36}
                  direction={`row`}
                  alignItems={`stretch`}
                  justifyContent={`flex-start`}
        >
            <Grid item xs={4}
                  sx={{border: '1px solid'}}
            >
                <Paper>
                    {getLeftList()}
                </Paper>
            </Grid>
            <Grid item xs={32}
                  sx={{border: '1px solid'}}
            >
                <Grid container spacing={0}
                      direction={`column`}
                      alignItems="stretch"
                      justifyContent="flex-start"
                >
                    <Grid item>
                        <Outlet/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

function BuildingList() {
    const params = useParams()
    const user = useSelector(state=>state.user)

    // 1. 获取project list || creator == user.id


    useEffect(()=>{
        async function fetchBuilding(p) {
            const buildingList = axios({

            })
        }

    })

    return (
        params.regionID

    )
}

function HouseHolder() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/product/house')
    }, [])

    return (<>
        <Outlet/>
    </>)
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
                                    prefix, productTypes, productTab, setProductTab, formatTab, setFormatTab, obsClient
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