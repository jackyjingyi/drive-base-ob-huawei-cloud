import React from "react";
import {UploadModal, CreateDirectoryModal} from "./S3ObjectFuncModals";

export function S3ObjectFuncs(props) {

    return (
        <ul className="list-group list-group-horizontal" style={{listStyle: "none", border: "none"}}>
            <li className={`list-group-item`}
                style={{listStyle: "none", border: "none", padding: '0px 0px 0px 15px'}}>
                <UploadModal prefix={props.currentPrefix} addTasks={props.addTasks}
                />
            </li>
            <li className={`list-group-item`}
                style={{listStyle: "none", border: "none", padding: '0px 0px 0px 15px'}}>
                <CreateDirectoryModal prefix={props.currentPrefix} onRefresh={() => props.handleFresh()}
                                      obsClient={props.obsClient}/>
            </li>
        </ul>
    )
}

