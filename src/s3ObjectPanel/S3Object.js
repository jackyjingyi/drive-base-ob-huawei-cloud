import React, {useEffect, useState} from "react";
import {Icon} from "../icons/icon";
import {sizeHandler} from "../utils/utils";

export function S3Dir(props) {
    const [displayKey, setDisplayKey] = useState()

    useEffect(() => {
        const l = props.Prefix.split("/").filter(function (x) {
            return x !== "";
        })
        console.log("dirs:", l)
        setDisplayKey(l[l.length - 1])

    }, [props.Prefix])

    const row = (<tr>
        <td colSpan={4} onClick={props.onClick}>
            <div className={`d-flex flex-row`}>
                <Icon isDir={true} Key={props.Prefix} isLarge={false} imageUrl={null}/>
                <div>&nbsp;{displayKey}</div>
            </div>
        </td>

    </tr>)

    const app = (
        <div className={`col-md-2 d-flex flex-md-fill justify-content-around m-2 clearfix`} onClick={props.onClick}>
            <div>
                <div className={``}>
                    <Icon isDir={true} Key={props.Prefix} isLarge={true} imageUrl={null}/>
                </div>
                <div className={`d-inline-block  justify-content-around`} style={{display: 'inline-block'}}>
                    <span className={`fs-6 text-center text-wrap`}>{displayKey}</span>
                </div>
            </div>
        </div>
    )

    return (
        props.isList ? row : app
    )
}

export function S3Object(props) {
    const imageSupportList = [
        'jpg', 'jpeg', 'png', 'bmp', 'webp', 'gif', 'tiff'
    ]
    const [fileType, setFileType] = useState(null)
    const [displayKey, setDisplayKey] = useState()
    const [isImage, setIsImage] = useState(imageSupportList.includes(props.Key.split('.').pop()))
    const [imageUrl, setImageUrl] = useState(
        props.imageBaseUrl + props.Key + '?x-image-process=image/resize,m_lfit,h_200,w_200'
    )
    const [truncName, setTrunkName] = useState()

    function dateFormat() {
        const date = props.LastModified
        if (date instanceof Date) {
            return date.Format("yyyy-MM-dd")
        } else {
            const newDate = new Date(date)
            return newDate.Format("yyyy-MM-dd")
        }
    }


    useEffect(() => {
        const l = props.Key.split("/")
        setDisplayKey(l[l.length - 1])
        setTrunkName(l[l.length - 1].slice(0, 10))
    }, [props.Key])

    function actionList() {
        return `123`
    }

    const row = <tr>
        <td key={`objkey`}>
            <div className={`d-flex flex-row`}>
                {isImage && <Icon isDir={false} Key={props.Key} isLarge={false} imageUrl={imageUrl}/>}
                {!isImage && <Icon isDir={false} Key={props.Key} isLarge={false} imageUrl={null}/>}
                <div>&nbsp;{displayKey}</div>
            </div>
        </td>
        <td key={`objdate`}>{dateFormat()}</td>
        <td key={`objsize`}>{sizeHandler(props.Size)}</td>
        <td key={`objact`}>{props.children}</td>
    </tr>


    const app = (
        <div className={`col-md-2 d-flex flex-md-fill justify-content-around m-2 clearfix`} onClick={props.onClick}>
            <div>
                <div className={``}>
                    {isImage && <Icon isDir={false} Key={props.Key} isLarge={true} imageUrl={imageUrl}/>}
                    {!isImage && <Icon isDir={false} Key={props.Key} isLarge={true} imageUrl={null}/>}
                </div>

                <div className={`d-inline-block justify-content-around`}
                     style={{display: 'inline-block'}}>
                    <span className={`fs-6 text-center text-wrap`}>{truncName}</span>
                </div>
            </div>

        </div>)

    return (
        props.isList ? row : app
    )
}
