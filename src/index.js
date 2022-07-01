import React, {useEffect, useReducer, useState} from 'react'
import ReactDOM from 'react-dom';
import './css/index.css';
import {DriveController} from "./core/DriveController";
import {BrowserRouter} from "react-router-dom"
import {store} from './app/store'
import {Provider} from "react-redux";
import App from './App'

var bucketName = 'oct-project-collection' //'iri-drive-bucket'  //'dev-do-not-delete''oct-project-collection'

// ========================================

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


ReactDOM.render(
    // <LeftSideNavbar/>
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    // <DriveController bucketName={bucketName} server={`obs.cn-south-1.myhuaweicloud.com`}/>,
    document.getElementById('root')
);
