import {useEffect, useState} from "react";
import div from '../images/div.png'
import dir from '../images/folderfile.png'
import excel from '../images/excel.png'
import jpg from '../images/jpg.png'
import mp3 from '../images/mp3.png'
import mp4 from '../images/mp4.png'
import png from '../images/png.png'
import ppt from '../images/ppt.png'
import zip from '../images/zip.png'
import txt from '../images/txt.png'
import word from '../images/word.png'

const imageDir = {
    div: div,
    dir: dir,
    excel: excel,
    jpg: jpg,
    mp3: mp3,
    mp4: mp4,
    png: png,
    ppt: ppt,
    zip: zip,
    txt: txt,
    word: word
}


export function Icon(props) {
    // name = props.name

    const [type, setType] = useState(props.Key.split('.').pop() || 'dir')
    const [image, setImage] = useState()

    function getImageUrl() {
        if (props.imageUrl !== null) {
            return setImage(props.imageUrl)
        } else {
            if (props.isDir) {
                return setImage(imageDir.dir)
            } else {
                switch (type) {
                    case 'xlsx':
                        return setImage(imageDir.excel)
                    case 'xls':
                        return setImage(imageDir.excel)
                    case 'dir':
                        return setImage(imageDir.dir)
                    case 'jpg':
                        return setImage(imageDir.jpg)
                    case 'mp3':
                        return setImage(imageDir.mp3)
                    case 'mp4':
                        return setImage(imageDir.mp4)
                    case 'png':
                        return setImage(imageDir.png)
                    case 'ppt':
                        return setImage(imageDir.ppt)
                    case 'pptx':
                        return setImage(imageDir.ppt)
                    case 'txt':
                        return setImage(imageDir.txt)
                    case 'doc' || 'docx':
                        return setImage(imageDir.word)
                    case 'zip':
                        return setImage(imageDir.zip)
                    default:
                        return setImage(imageDir.div)
                }
            }
        }

    }

    useEffect(() => {
        getImageUrl();
    }, [])
    const largeImage = <div>
        <img className={`img-thumbnail rounded`} src={image} style={{width: '70px', height: '70px'}}/>
    </div>


    const smallImage = <div className={`no-padding`}>
        <img className={`img-thumbnail rounded`} src={image} style={{width: '20px', height: '20px'}}/>
    </div>

    return (
        props.isLarge ? largeImage : smallImage
    )

}
