import React, {useState} from "react";

export function S3ObjectListPanel(props) {
    const [header, setHeader] = useState([{name: '名称',}, {name: '最后操作时间',}, {name: '文件大小'}, {name: '操作'}])

    return (
        <div>
            <table className={`table table-bordered table-striped table-hover`}>
                <thead>
                <tr>
                    {header.map((item, index) => {
                        return (<td key={index}>{item.name}</td>)
                    })}
                </tr>
                </thead>
                <tbody>
                {props.children}
                </tbody>
            </table>
        </div>
    )
}

export function S3ObjectAppPanel(props) {

    return (
        <div>
            <div className={`d-inline-flex flex-wrap`} style={{listStyle: 'none'}}>
                {props.children}
            </div>
        </div>
    )
}
