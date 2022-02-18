import React from "react";
import {IconContext} from "react-icons";
import {AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineArrowUp} from "react-icons/ai";


export function DirectoryLine(props) {

    return [
        <div className={`col-md-2 clearfix`} key={0}>
            <ul className={`list-group list-group-horizontal`}>
                <li className={`list-group-item`} style={{border: 'none'}}>
                    <a onClick={(e) => props.addressClickHandler(e, 1)} data-target='back'>
                        <IconContext.Provider value={{size: '1.5em'}}>
                            <div>
                                <AiOutlineArrowLeft/>
                            </div>
                        </IconContext.Provider>
                    </a>
                </li>
                <li className={`list-group-item`} style={{border: 'none'}}>
                    <a onClick={(e) => props.addressClickHandler(e, 2)} data-target='forward'>
                        <IconContext.Provider value={{size: '1.5em'}}>
                            <div>
                                <AiOutlineArrowRight/>
                            </div>
                        </IconContext.Provider>
                    </a>
                </li>
                <li className={`list-group-item`} style={{border: 'none'}}>
                    <a onClick={(e) => props.addressClickHandler(e, 3)} data-target='up'>
                        <IconContext.Provider value={{size: '1.5em'}}>
                            <div>
                                <AiOutlineArrowUp/>
                            </div>
                        </IconContext.Provider>
                    </a>
                </li>
            </ul>
        </div>,
        <div className={`col-md-10 margin-top-5`} key={1}>
            <input className={`form-control fw-bold`} value={props.currentPrefix} readOnly={true}
            />
        </div>
    ]
}


