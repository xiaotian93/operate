import React ,{ Component } from 'react';
import Editor from 'react-umeditor';
 
class Demo extends Component {
    constructor(props){
        super(props);
        this.state = {
            content: ""
        }
    }
    handleChange(content){
        this.setState({
            content: content
        })
    }
    getIcons(){
        var icons = [
            "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
            "paragraph fontfamily fontsize | superscript subscript | ",
            "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
            "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
            "horizontal date time  | image emotion spechars | inserttable"
        ]
        return icons;
    }
    getPlugins(){
        return {
            "image": { 
                "uploader": { 
					"name":"file", 
					"filter":this.uploadBack,
                    "url": "http://cxfq.api.ltest3.baimaodai.cn/chexianfenqi/api/storage/manage_upload" 
                } 
            } 
        }
	}
	uploadBack(res){
		console.log(res);
		return "http://www.pptok.com/wp-content/uploads/2012/08/xunguang-4.jpg"
	}
    render(){
        var icons = this.getIcons();
        var plugins = this.getPlugins();
        return (<Editor ref={(e)=>{this.editor = e}} icons={icons} value={this.state.content} onChange={this.handleChange.bind(this)} plugins={plugins} />)
    }
}

export default Demo;