import React, {useContext, useEffect, useReducer, useState} from 'react'
import {Outlet, useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {RepoContext} from "../contextManager";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import './productDetail.css'
import Stack from "@mui/material/Stack";
import {cdnBaseURL, thumbnailList, imageDIR, companyProductDir,bucketName} from "../config";

const match = {
    G: 'highBuilding',
    ZG: 'medianBuilding',
    XG: 'lowBuilding',

}

function getInfo(name) {
    for (let i = 0; i <= thumbnailList.length; i++) {
        if (thumbnailList[i].name === name) {
            return thumbnailList[i]
        }
    }

}

export default function ProductDetail() {
    // display image
    const {obsClient} = useContext(RepoContext)
    console.log(obsClient)
    const params = useParams()
    const productID = params.productID
    const navigate = useNavigate()
    const info = getInfo(productID)


    function handleDownload(e) {
        const [reg, type] = productID.split('(')[0].split('-')
        const baseKey = companyProductDir(params.regionCompanyID, match[type])
        obsClient.getObject({
            Bucket: bucketName,
            Key: `${baseKey}${info.dir}/${info[e.target.dataset.target]}`,
            SaveByType: 'file',
        }).then((res) => {
            console.log(res.InterfaceResult.Content.SignedUrl)
            window.open(res.InterfaceResult.Content.SignedUrl)
        }).catch((err)=>{
            console.log(err.response)
        })

        // window.open(signedUrl)
    }

    return (<Box sx={{padding: '1vmin'}}>
        <Stack direction={`row`}>
            <ButtonGroup variant={`contained`} size={`large`}>
                <Button
                    sx={{
                        backgroundColor: '#333854', width: '12vw', height: '3vh'
                    }}
                >楼型框架</Button>
                <Button
                    sx={{
                        backgroundColor: '#333854', width: '12vw', height: '3vh'
                    }}
                    data-target={`pdf`}
                    onClick={(e) => handleDownload(e)}

                >PDF</Button>
                <Button
                    sx={{
                        backgroundColor: '#333854', width: '12vw', height: '3vh'
                    }}
                    data-target={`dwg`}
                    onClick={(e) => handleDownload(e)}

                >CAD</Button>
            </ButtonGroup>
        </Stack>
        <img className={`fullImage`} src={`${cdnBaseURL}${imageDIR}${params.productID}.png`}/>
    </Box>)
}

// <img className={`fullImage`} src = {`${cdnBaseURL}${imageDIR}${params.productID}.png`}/>