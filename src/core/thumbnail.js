import React from 'react'
import {useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import './thumbnail.css'
import {cdnBaseURL, thumbnailList, thumbnailDir} from "../config";

export default function Thumbnail() {
    const params = useParams()
    const navigate = useNavigate()

    function handleImageClick(e) {
        console.group('Image Clicked')
        console.log(e.target.dataset.target)
        navigate(`/region-company/${params.regionCompanyID}/${e.target.dataset.target}/`)
        console.groupEnd()
    }

    return (
        <Box sx={{
            height: '70vh', width: "100%",
            minHeight: '70vh', display: 'table-cell',
            margin: '1.5vmin', padding: '0.5vmin'
        }}>
            <Grid container spacing={2}>
                {thumbnailList.map((item, index) => {
                    return (
                        <Grid item xs={3} key={item.name}>
                            <img data-target={item.name} className={`thumbnailImg`}
                                 onClick={(e) => handleImageClick(e)}
                                 src={`${cdnBaseURL}${thumbnailDir}${item.thumbnail}`}/>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>

    )
}
//https://oct-img-cdn.obs.myhuaweicloud.com/realstate-assests/thumbnail/HD-G(19-33F)-2T4-390-SL.png
//https://oct-img-cdn.obs.myhuaweicloud.com/realstate-assests/thumbnail/HD-G%2819-33F%29-2T4-460-SL.png