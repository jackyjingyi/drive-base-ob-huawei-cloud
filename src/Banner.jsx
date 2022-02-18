import {GoCloudUpload} from 'react-icons/go'
import {IconContext} from "react-icons";
import React from "react";

const logo = () => {
    return (

        <IconContext.Provider value={{size: '4.5em', color: 'white'}}>
            <div>
                <GoCloudUpload/>&nbsp;&nbsp;
                <span className={`text-bold text-light`}>企业云盘</span>
            </div>
        </IconContext.Provider>
    )
}

const Banner = () => {

    return (
        <div className={`row border border-light rounded-top`}
             style={{backgroundColor: '#282c34',height:'10%'}}>
            <div className="col-md-3">
                {logo()}
            </div>
        </div>
    )

}
export default Banner