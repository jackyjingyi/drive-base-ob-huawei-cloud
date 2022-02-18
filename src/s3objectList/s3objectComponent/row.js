import React from "react";
import {sizeHandler} from "../../utils/utils";
import {Icon} from '../../icons/icon'

export class Row extends React.Component {
    imageSupportList = [
        'jpg', 'jpeg', 'png', 'bmp', 'webp', 'gif', 'tiff'
    ]

    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            isImage: this.imageSupportList.includes(this.props.Key.split('.').pop()),
        }

    }

    componentDidMount() {
        if (this.state.isImage) {
            +
                this.setState({
                    imageUrl: 'https://' + this.props.bucketName + '.' + this.props.server + '/' + this.props.Key + '?x-image-process=image/resize,m_lfit,h_200,w_200',
                })
        }
    }

    actionList() {
        if (this.state.isImage) {
            // is image call getImageUrl
            return (
                <div>
                    <button onClick={this.props.onClick}>下载</button>
                    <span>&nbsp;</span>
                    <a className={`btn`}>查看</a>
                </div>
            )
        } else {
            return (
                <div>
                    <button onClick={this.props.onClick}>下载</button>
                </div>
            )
        }
    }

    dateFormat() {
        const date = this.props.LastModified
        if (date instanceof Date) {
            return date.Format("yyyy-MM-dd")
        } else {
            const newDate = new Date(date)
            return newDate.Format("yyyy-MM-dd")
        }
    }

    viewImage() {
        if (this.state.isImage) {
            return (
                <img
                    src={this.state.imageUrl}
                    // alt={this.props.Key}
                />
            )
        } else {
            return (<Icon isDir={false} Key={this.props.Key} isLarge={false}/>)
        }
    }

    render() {
        return (
            <tr>
                <td>
                    <div>
                        {this.viewImage()}
                        <span className={`d-inline-block text-truncate`}>
                            {this.props.currentKey}
                        </span>
                    </div>
                </td>
                <td>
                    {this.dateFormat()}
                </td>
                <td>
                    {sizeHandler(this.props.Size)}
                </td>
                <td>
                    {this.actionList()}
                </td>
            </tr>
        )
    }

}