import React, {useEffect, useState} from 'react'
import {
    AppBar, Box, Button, Container, Divider, Grid, IconButton, List, ListItem, ListItemText, Stack, Toolbar, Typography
} from "@mui/material";
import axios from "axios";
import cookie from "react-cookies";
import {useSelector, useDispatch} from "react-redux";

import {useNavigate} from "react-router-dom";

function CreateDialog() {


    return (<>

        <Box sx={{
            backgroundColor: '#eff1f7', padding: '16px', minHeight: '92.6vh'
        }}>
            <Box className={`survey-create-panel`}
                 sx={{
                     backgroundColor: '#fff', padding: '26px', minHeight: '88.6vh'
                 }}
            >
                <Stack direction={`column`}
                       justifyContent={`center`}
                       alignItems={`stretch`}
                       spacing={2}
                       sx={{
                           userSelect: 'none'
                       }}
                >
                    <Box className={`create-title text-left`}>
                        <Box className={`create-title-main`}>
                            <Typography variant={`h6`}

                            >
                                快速创建
                            </Typography>
                        </Box>
                        <Box className={`create-title-sub`}>
                            <Typography variant={`subtitle2`}>
                                创建空白项目、复制已有项目或导入项目
                            </Typography>
                        </Box>
                    </Box>
                    <Box className={`create-fast-content`}>
                        <Stack
                            className={`create-content-stack`}
                            direction={`row`}
                            justifyContent={`flex-start`}
                            alignItems={`stretch`}
                            spacing={2}
                        >

                            <FastCreateBlankWrapper/>
                        </Stack>

                    </Box>

                </Stack>


            </Box>
        </Box>
    </>)
}

function FastCreateBlankWrapper() {
    const [show, setShow] = useState(false)
    const [projectName, setProjectName] = useState('')
    const dispatch = useDispatch()
    const navigater = useNavigate()

    function handleChange(e) {
        setProjectName(
            e.target.value
        )
    }

    function onHide() {
        setProjectName('')
        setShow(false)

    }

    function onShow() {
        setShow(true)
    }

    function handleSubmitProject() {
        // send post request to backend
        axios(
            {
                url: '/api/survey/project/',
                method: 'post',
                data: {
                    title: projectName
                },
                headers: {
                    Authorization: `Bearer ${cookie.load('access')}`
                }

            }
        ).then((res) => {

        }).catch((err) => {
            console.log(err)
        })
        // 跳转



    }

    function showPanel() {
        if (show) {
            return (
                <Box sx={{
                    // height: '210px',
                    width: '410px',
                    display: 'flex',
                    backgroundColor: '#fff',
                    visibility: show ? 'visible' : 'hidden',
                    border: '1px solid #bed4ff',
                    cursor: 'auto',
                    borderRadius: '4px',
                    padding: '20px',
                    flexDirection: 'column'

                }}
                >
                    <Typography sx={{
                        fontSize1: 11
                        , fontWeight: 'bolder'
                    }}>
                        创建空白项目
                    </Typography>
                    <Box component={'form'} mt={2} sx={{width: '100%'}}>
                        <Box component={`div`} sx={{display: 'flex'}}>
                            <Box component={`div`}
                                 sx={{
                                     width: '25%',
                                     alignItems: 'flex-start',
                                     lineHeight: '32px',
                                 }}
                            >
                                <Box component={`label`}
                                     htmlFor={`project_title`}
                                     mt={2}
                                >
                                    项目名称
                                </Box>
                            </Box>

                            <Box ml={2} mt={2}
                                 id={`project_title`}
                                 sx={{
                                     width: '65%',
                                     lineHeight: '32px',
                                     border: '1px solid #d3d6de',
                                     boxShadow: '0 1px 0 0 rgb(48 49 51 / 5%)',
                                     transition: 'border-color .2s cubic-bezier(.645,.045,.355,1)',
                                     padding: '0 12px',
                                     ":focus": {
                                         borderColor: '#518eff',
                                         boxShadow: '0 0 4px 0 #bed4ff'
                                     }
                                 }}
                                 component={`input`}
                                 placeholder={`未命名项目`}
                                 value={projectName}
                                 onChange={handleChange}
                            />
                        </Box>
                        <Box component={`div`} sx={{display: 'flex'}}>
                            <Box component={`div`}
                                 sx={{
                                     width: '25%',
                                     display: 'flex',
                                     flexDirection: 'column',
                                     alignItems: 'flex-start',
                                     lineHeight: '32px',
                                 }}
                            >
                                <Box component={`label`}
                                     mt={2}
                                     htmlFor={`project-folder`}
                                >
                                    所属战区
                                </Box>
                            </Box>
                            <Box ml={2} mt={2}
                                 id={`project-folder`}
                                 sx={{
                                     width: '65%',
                                     lineHeight: '32px',
                                     border: '1px solid #d3d6de',
                                     boxShadow: '0 1px 0 0 rgb(48 49 51 / 5%)',
                                     transition: 'border-color .2s cubic-bezier(.645,.045,.355,1)',
                                     padding: '0 12px',
                                     ":focus": {
                                         borderColor: '#518eff',
                                         boxShadow: '0 0 4px 0 #bed4ff'
                                     }
                                 }}
                                 component={`input`}
                                 placeholder={`未分组`}
                                 disabled
                            />
                        </Box>

                    </Box>
                    <Box component={'div'} mt={2} sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Button variant={`outlined`} onClick={onHide}>
                            取消
                        </Button>
                        <Button variant={`contained`} color={`primary`} sx={{marginX: '10px'}}
                                onClick={handleSubmitProject}
                        >
                            确定
                        </Button>
                    </Box>
                </Box>
            )
        } else {
            return (
                <Stack
                    direction={`column`}
                    justifyContent={`center`}
                    alignItems={`stretch`}
                    spacing={2}
                    sx={{
                        height: '234.5px',
                        width: '168px',
                        display: 'flex',
                        backgroundColor: '#eff1f7',
                        visibility: show ? 'hidden' : 'visible',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        alignItems:'center',
                        flexDirection: 'column',
                        border: 'none'
                    }}
                    onClick={onShow}
                    component={`button`}
                >
                    <Box>
                        <img src={`static/img/create-blank.svg`}
                             style={{width: '32px', height: '32px'}}
                        />
                        <Typography variant={`body2`}
                                    mt={2}
                        >
                            创建空白项目
                        </Typography>
                    </Box>

                </Stack>
            )
        }
    }

    return (
        <>
            <Grid container
                  direction={`column`}
                  justifyContent="flex-start"
                  alignItems="stretch"
                  spacing={2}
            >
                <Grid item>
                    {showPanel()}

                </Grid>
                <Grid item>
                    <Box>
                        <Typography>
                            第一部分 项目用地条件及规划条件分析
                        </Typography>
                        <Typography>
                            第二部分 项目周边资源分析
                        </Typography>
                        <Typography>
                            第三部分 项目定位及定价说明
                        </Typography>
                        <Typography>
                            第四部分 项目规划布局及建筑方案
                        </Typography>
                        <Typography>
                            第五部分 示范区选址及规模专篇设计
                        </Typography>
                    </Box>
                </Grid>
            </Grid>


        </>

    )
}


export default CreateDialog;