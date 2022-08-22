import React, { Component } from 'react';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.min.css';

// source https://fengyuanchen.github.io/viewer/
class ImageViewer extends Component {
    componentDidMount() {
        let options = { index: 1, show: false };
        this.viewer = new Viewer(document.getElementById(this.props.placeholder), options);
    }
    componentDidUpdate() {
        this.viewer.update();
    }
    render() {
        return <div>
            <ul id={this.props.placeholder} className="image-preview-content">
                {this.props.imgs.map(img => <li key={img.src}>
                    <span style={{ backgroundImage: "url(" + img.src + ")" }}>
                        <img src={img.src} alt={img.des} />
                    </span>
                    <div> {img.des} </div>
                </li>)}
            </ul>
            <style>{`
                    .image-preview-content{
                        overflow:hidden;
                    }
                    .image-preview-content li div{
                        position: absolute;
                        bottom: 0px;
                    }
                    .image-preview-content li>span{
                        background-position: center;
                        background-size: cover;
                    }
                    .image-preview-content li{
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        justify-content: center;
                        position: relative;
                        padding-bottom: 20px;
                        width:160px;
                        height:160px;
                        overflow:hidden;
                        float:left;
                        margin-right:15px;
                        margin-bottom:10px;
                    }
                    .image-preview-content li img{
                        max-width:100%;
                        max-height:90%;
                        opacity: 0;
                    }
            `}</style>
        </div>
    }
}
ImageViewer.defaultProps = {
    placeholder: "image-viewer"
}
export default ImageViewer;