import React from 'react';
import { Tag, Input, Tooltip, Form ,message} from 'antd';

class EditableTagGroup extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state={
      tags: props.tags_child||[],
      inputVisible: false,
      inputValue: '',
      error:{
        type:false,
        value:""
      }
    }
  }

  handleClose(removedTag) {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
    this.props.get_tag(tags);
  };

  showInput(){
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange (e) {
    this.setState({ inputValue: Number(e.target.value) });
  };

  handleInputConfirm () {
    const { inputValue } = this.state;
    let { tags } = this.state;
    var gap=this.props.gap;
    if(gap===""){
      message.warn("请先输入每期间隔");
      return;
    }
    this.setState({
      error:{
        type:false,
        value:Number(inputValue)||""
      }
    })
    if(Number(inputValue)>0&&!this.props.limitCancel){
      var temp=gap?Number(inputValue)*Number(gap):Number(inputValue);console.log(temp)
      if(temp<Number(this.props.minLoanTerm)||temp>Number(this.props.maxLoanTerm)){
        this.props.form.setFields({
          totalPeriodList: {
                errors: [new Error('需在产品期限范围内')],
                value: Number(inputValue)||""
            },
        });
        this.setState({
          error:{
            type:true,
            value:Number(inputValue)||""
          }
        })
        return;
    }
    }
    if (inputValue && tags.indexOf(inputValue) === -1&&inputValue>0&&(inputValue.toString()).indexOf(".")===-1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
    this.props.get_tag(tags);
    this.props.form.setFieldsValue({ totalPeriodList: "" })
    
  };
  saveInputRef (input) {this.input = input};

  render() {
    const { tags, inputValue } = this.state;
    const { getFieldDecorator } = this.props.form;
    const type={"DAY":"日","MONTH":"个月","YEAR":"年"};
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
              tagElem
            );
        })}

        <Form.Item style={{ display: "inline-block" ,marginBottom:"0px!important" }} className="tag">


          {getFieldDecorator("totalPeriodList", {
            initialValue: inputValue,
            rules: [{ required: true, message: "请输入" }, { pattern: /^[1-9]\d*$/, message: "格式错误" }]
          })(
            <Input
              ref={this.saveInputRef.bind(this)}
              type="text"
              // size="small"
              style={{ width: 78}}
              // value={inputValue}
              onChange={this.handleInputChange.bind(this)}
              onBlur={this.handleInputConfirm.bind(this)}
              onPressEnter={this.handleInputConfirm.bind(this)}
              placeholder="请输入期数"
            />
          )}
              {!this.props.limitCancel?<div style={{width:"300px",position:"absolute",left:"100%",top:"0"}}>{"（产品期限范围："+this.props.minLoanTerm+"——"+this.props.maxLoanTerm+type[this.props.loanTermType]+"）"}</div>:null}
        </Form.Item>
          <style>{`
            .tag{
              margin-bottom:0px!important
            }
          `}</style>
      </div>
    );
  }
}

// ReactDOM.render(<EditableTagGroup />, mountNode);
export default Form.create()(EditableTagGroup);