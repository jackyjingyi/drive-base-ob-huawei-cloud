import {GoCloudUpload} from 'react-icons/go'
import {IconContext} from "react-icons";
import React from "react";
import {useNavigate} from "react-router-dom";

const logo = () => {

    return (

        <IconContext.Provider value={{size: '4.5em', color: 'white'}}>
            <div >
                <GoCloudUpload/>&nbsp;&nbsp;
                <span className={`text-bold text-light`} >企业云盘</span>
            </div>
        </IconContext.Provider>
    )
}

const Banner = () => {
    const navigate = useNavigate()
    return (
        <div className={`row border border-light rounded-top`}
             style={{backgroundColor: '#282c34',height:'100%'}}>
            <div className="col-md-3" onClick={()=>{
                navigate('/')
            }}>
                {logo()}
            </div>
        </div>
    )

}
export default Banner