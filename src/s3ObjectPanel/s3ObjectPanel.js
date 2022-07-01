import React, {useContext, useEffect, useReducer, useState} from "react";
import {IconContext} from "react-icons";
import {AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineArrowUp, AiOutlineAppstore} from "react-icons/ai";
import {BsList} from "react-icons/bs"
import {UploadModal, CreateDirectoryModal} from "./s3ObjectFuncs/S3ObjectFuncModals";
import {S3Dir, S3Object} from "./S3Object";
import {S3ObjectAppPanel, S3ObjectListPanel} from "./S3ObjectContainer";
import {RepoContext} from "../contextManager";
const iconStyle = {}

function FuncContainer(props) {

    return (
        <div>
            <button onClick={props.onClick}>下载</button>
        </div>
    )
}


export function Controller(props) {
    const {prefix} = useContext(RepoContext)
    const [directoryInfo, setDiretoryInfo] = useReducer((directoryInfo, newDirectory) => ({...directoryInfo, ...newDirectory}), {
        Contents: [], CommonPrefixes: [], Prefix: prefix
    })
    const [history, setHistory] = useState([{Prefix: '',}])
    const [forceUpdate, setForceUpdate] = useReducer(x => x + 1, 0) // 强制更新
    const [stepNumber, setStepNumber] = useState(0)
    const [displaySwitch, setDisplaySwitch] = useState(true)
    const switchStyleList = displaySwitch ? 'btn btn-info' : 'btn btn-light'
    const switchStyleApp = !displaySwitch ? 'btn btn-info' : 'btn btn-light'
    const currentObjects = directoryInfo.Contents.map((item, index) => {
        if (item.Key !== directoryInfo.Prefix) {
            return (
                <S3Object key={index} {...item} isList={displaySwitch} imageBaseUrl={props.imageBaseUrl}>
                    <FuncContainer onClick={(e) => handleDownload(e, item.Key)}/>
                </S3Object>
            )
        }
    })
    const currentDirectories = directoryInfo.CommonPrefixes.map((item, index) => {
        return (
            <S3Dir key={index}  {...item} isList={displaySwitch} onClick={(e) => handleDirClick(e, item.Prefix)}/>
        )
    })
    const listFormat = <S3ObjectListPanel>
        {currentDirectories}
        {currentObjects}
    </S3ObjectListPanel>
    const appFormat = <S3ObjectAppPanel>
        {currentDirectories}
        {currentObjects}
    </S3ObjectAppPanel>

    function handleDirClick(e, p) {
        setForceUpdate();
        setDiretoryInfo({
            Prefix: p,
        });
        setHistory(history.concat([{
            Prefix: directoryInfo.Prefix
        }]));
        setStepNumber(stepNumber + 1);
    }


    useEffect(async () => {
        if (props.obsClient instanceof ObsClient) {
            console.group("List Repo Start")
            const listObjs = await props.obsClient.listObjects({
                Bucket: props.bucketName,
                MaxKeys: 1000,
                Delimiter: '/',
                Prefix: directoryInfo.Prefix, //初始路径
            })
            console.log(directoryInfo.Prefix, prefix)
            if (listObjs.CommonMsg.Status < 300) {
                setDiretoryInfo({
                    Contents: listObjs.InterfaceResult.Contents,
                    CommonPrefixes: listObjs.InterfaceResult.CommonPrefixes,
                    Prefix: listObjs.InterfaceResult.Prefix,
                })
                console.log(directoryInfo.Prefix)
                // props.setPrefix(directoryInfo.Prefix)
            }
            console.groupEnd()
        }
    }, [directoryInfo.Prefix])

    useEffect(() => {
        setDiretoryInfo({
            Prefix: prefix
        })
    }, [prefix])

    function backward() {
        if (stepNumber > 0) {
            setStepNumber(stepNumber - 1)
            setDiretoryInfo({
                Prefix: history[stepNumber].Prefix
            })
        }
    }

    function forward() {

        if (stepNumber < history.length - 1) {
            setStepNumber(stepNumber + 1)
            setDiretoryInfo({
                Prefix: history[stepNumber].Prefix
            })
        }
    }

    function upward() {
        if (directoryInfo.Prefix !== '') {
            let pi = directoryInfo.Prefix.split('/').filter(function (x) {
                return x !== ""
            })
            // setForceUpdate();
            let p = pi.slice(0, pi.length - 1)
            p.push("");
            setDiretoryInfo({
                Prefix: p.join("/"),
            })
            setStepNumber(stepNumber + 1)
            setHistory(history.concat([{
                Prefix: directoryInfo.Prefix
            }]))
        }
    }


    function handleRefresh() {
        setForceUpdate();
    }

    function handleSwitchList() {
        setDisplaySwitch(true)
    }

    function handleSwitchApp() {
        setDisplaySwitch(false)
    }


    async function handleDownload(e, k) {
        const res = await props.obsClient.getObject({
            Bucket: props.bucketName,
            Key: k,
            SaveByType: 'file',
        })
        const signedUrl = await res.InterfaceResult.Content.SignedUrl
        window.open(signedUrl)
    }

    return (
        <div>
            <div key={`address`} className={`row no-padding`}>
                <div className={`col-md-2 clearfix`} key={0}>
                    <ul className={`list-group list-group-horizontal`}>
                        <li className={`list-group-item`} style={{border: 'none'}}>
                            <ArrayButton onClick={backward}>
                                <AiOutlineArrowLeft/>
                            </ArrayButton>
                        </li>
                        <li className={`list-group-item`} style={{border: 'none'}}>
                            <ArrayButton onClick={forward}>
                                <AiOutlineArrowRight/>
                            </ArrayButton>
                        </li>
                        <li className={`list-group-item`} style={{border: 'none'}}>
                            <ArrayButton onClick={upward}>
                                <AiOutlineArrowUp/>
                            </ArrayButton>
                        </li>
                    </ul>
                </div>
                <div className={`col-md-10 margin-top-5`} key={1}>
                    <input className={`form-control fw-bold`} value={directoryInfo.Prefix} readOnly={true}
                    />
                </div>
            </div>
            <hr className={`margin-top-5`}/>
            <div key={`funcBar`} className={`row margin-bottom-10`}>
                <div key={`obsFuncBar`} className={`col-md-6 pull-left`}>
                    <ul className="list-group list-group-horizontal" style={{listStyle: "none", border: "none"}}>
                        <li className={`list-group-item`}
                            style={{listStyle: "none", border: "none", padding: '0px 0px 0px 15px'}}>
                            {props.children}
                        </li>
                        <li className={`list-group-item`}
                            style={{listStyle: "none", border: "none", padding: '0px 0px 0px 15px'}}>
                            <CreateDirectoryModal prefix={directoryInfo.Prefix} onRefresh={() => handleRefresh()}
                                                  obsClient={props.obsClient} bucketName={props.bucketName}/>
                        </li>
                    </ul>
                </div>
                <div className={`col-md-3 clearfix`}>

                </div>
                <div key={`displayFuncBar`} className={`col-md-3 me-auto`}>
                    <div className={`d-flex flex-row-reverse`}>
                        <ul className={`list-group list-group-horizontal`}
                            style={{listStyle: "none"}}>
                            <li className={`list-group-item no-padding`} style={{listStyle: "none", border: "none"}}>
                                <button className={switchStyleList} type={`button`} onClick={handleSwitchList}>
                                    <IconContext.Provider
                                        value={{size: '1.5em',}}>
                                        <div>
                                            <BsList/>
                                        </div>
                                    </IconContext.Provider>
                                </button>

                            </li>
                            <li className={`list-group-item no-padding`} style={{listStyle: "none", border: "none"}}>
                                <button className={switchStyleApp} type={`button`} onClick={handleSwitchApp}>
                                    <IconContext.Provider
                                        value={{size: '1.5em',}}>
                                        <div>
                                            <AiOutlineAppstore/>
                                        </div>
                                    </IconContext.Provider>
                                </button>

                            </li>
                        </ul>
                    </div>

                </div>

            </div>

            <div key={`objContainer`} className={`row border border-light`}>
                {displaySwitch && listFormat}
                {!displaySwitch && appFormat}
            </div>

        </div>
    )

}

function ArrayButton(props) {
    return (
        <a onClick={props.onClick} data-target='back'>
            <IconContext.Provider value={{size: '1.5em'}}>
                <div>
                    {props.children}
                </div>
            </IconContext.Provider>
        </a>
    )
}


