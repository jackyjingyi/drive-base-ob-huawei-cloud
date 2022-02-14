import React from "react";

function TCell(props) {
    return (
        <td>
            {props.name}
        </td>
    )
}

function Thead(props) {
    return (<thead>
    <tr>
        {props.header.map((item, index) =>
            <TCell key={index} {...item} />
        )}
    </tr>
    </thead>)
}


export function FileList(props) {
    return (
        <table key={4} className='table table-bordered'>
            <Thead header={props.header}/>
            <tbody>
            {props.dirs}
            {props.rows}
            </tbody>
        </table>
    )
}