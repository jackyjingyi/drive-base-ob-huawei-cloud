import React from "react";


const Task = (props) => {
    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.size}</td>
            <td>{props.progress}</td>
            <td>{props.type}</td>
            <td>{props.status}</td>
            <td>{props.speed}</td>
            <td>
                {props.children}
            </td>
        </tr>
    )
}

export default Task