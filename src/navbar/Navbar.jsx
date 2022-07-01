import React from "react";


const LeftSideNavbar = (props) => {

    return (

        <ul className="nav flex-column" role={`tablist`} id={`myTab`}>
            <li className="nav-item border" role={`presentation`}>
                <a key={1} className="nav-link" onClick={(e) => props.onClick(e, 0)}>文件管理
                </a>
            </li>
            <li className="nav-item border">
                <a key={2} className="nav-link" onClick={(e) => props.onClick(e, 1)}>任务管理
                </a>
            </li>
             <li className="nav-item border">
                 <a key={3} className="nav-link" href="https://bigdata.octiri.com" target={'_blank'}>
                     返回数字大脑首页
                 </a>
            </li>
        </ul>

    )
}

export default LeftSideNavbar