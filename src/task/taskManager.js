import React, {useEffect, useState} from "react";
import Task from "./taskObj"
import {sizeHandler} from "../utils";


function TaskContainer(props) {
    return (<div>
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
            {props.children}
            </tbody>
        </table>
    </div>)
}


function useAssignTask(tasks, clickHandler) {
    const [displayTasks, setDisplayTasks] = useState()

    useEffect(() => {
        setDisplayTasks(
            tasks.map((item, index) => {
                let pr = (item[3] * 100.0 / item[4]).toFixed(2).toString() + "%"
                let sp = sizeHandler((item[3] * 1.0 / item[5])) + "/s"
                let st = "上传中"
                if (item[3] === item[4]) {
                    st = "已完成"
                }
                console.log(item[0])
                return (
                    <Task key={index} name={item[1]} size={sizeHandler(item[2])} progress={pr} type="上传"
                          status={st}
                          speed={sp} actions={0}>
                        <button onClick={()=>clickHandler(item[0])}>打开</button>
                    </Task>
                )
            })
        )
    }, [tasks])
    return displayTasks
}

function useCssActive(tab, c) {

    const [activeCSS, setActCss] = useState()

    useEffect(() => {
        setActCss(c[tab])
    })
    return activeCSS
}

export function TaskManager(props) {
    const [currentTasks, setCurrentTasks] = useState(props.currentTasks)
    const [finishedTasks, setFinishedTasks] = useState(props.finishedTasks)
    const [tab, setTab] = useState(0)
    const running= useCssActive(tab,['active',''])
    const finish = useCssActive(tab,['','active'])
    const currentTaskDisplay = useAssignTask(currentTasks,props.dirLoader)
    const finishedTaskDisplay = useAssignTask(finishedTasks,props.dirLoader)
    const currentTaskContainer = <TaskContainer>{currentTaskDisplay}</TaskContainer>
    const finishedTaskContainer = <TaskContainer>{finishedTaskDisplay}</TaskContainer>
    const displayDict = [
        {tabindex: 0, component: currentTaskContainer},
        {tabindex: 1, component: finishedTaskContainer}
    ]

    function handleSwitch(s) {
        setTab(s);
    }


    useEffect(()=>{
        setCurrentTasks(props.currentTasks)
    },[props.currentTasks])

    useEffect(()=>{
        setCurrentTasks(props.finishedTasks)
    },[props.finishedTasks])

    return (
        <div>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a className={`nav-link ${running}`}
                       aria-current="page"
                       onClick={() => handleSwitch(0)}>
                        运行队列
                    </a></li>
                <li className="nav-item"><a className={`nav-link ${finish}`}
                                            onClick={() => handleSwitch(1)}> 已完成 </a>
                </li>
            </ul>
            {displayDict[tab].component}
        </div>
    )
}
