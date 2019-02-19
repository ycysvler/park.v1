/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {Layout,Row, Col, Modal,Form,Select,Input,Radio,Button,Avatar,Upload, message} from 'antd';
import {PoliceActions, PoliceStore} from './reflux.js';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class CreatePolice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible:this.props.visible,sex:1,imgUrl: ''};
        this.initvalue = {
            imgUrl: '',
            portrait: '',
            policeName: '',
            role: '0',
            sex: '1',
            phone: '',
            position: '',
            deptId: '0',
            remark: '',
            cloudPlatform: '',
            handler: ''
        };
    }

    componentWillUnmount() {
    }

    onStatusChange = (type, data) => {

    }

    componentDidMount() {

    }

    // 根据新建警情按钮设置状态显示Dialog
    componentWillReceiveProps=(newProps) =>{
        this.setState({visible:newProps.visible});
    }

    // 隐藏Dialog
    handleCancel = (e) => {
        this.props.onClose();
        this.props.form.resetFields();
    }

    mapPropsToFields(props) {
        return {
            sex: Form.createFormField({
                ...props.name,
                value: props.name.value,
            }),
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                values.imgUrl = this.state.imgUrl;
                PoliceActions.create(values);
            }
        });
    }


    render() {
        let self = this;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14, offset: 2},
            },
        };
        const props = {
            name: 'file',
            action: '',
            headers: {
              authorization: 'authorization-text',
            },
            showUploadList:false,
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success('image file uploaded successfully');
                const reader = new FileReader();
                self.setState({imgUrl: info.file.originFileObj})
                reader.readAsDataURL(info.file.originFileObj);
              } else if (info.file.status === 'error') {
                message.error('image file upload failed.');
              }
              self.setState({imgUrl: "..."})
            },
            beforeUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                if (!isJPG) {
                  message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error('Image must smaller than 2MB!');
                }
                return isJPG && isLt2M;
            }
        };
        let state = this.state;

        return (<div>
                <Modal title="新建警员"
                       width={700}
                       visible={this.state.visible}
                       footer={null}
                       onCancel={this.handleCancel}
                >
                    <Form onSubmit={this.handleSubmit} style={{padding:24}}>

                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="编辑头像：" >
                                    {
                                        <Upload { ...props}>
                                            <Avatar src = {this.state.imgUrl? this.state.imgUrl : '/icons/icon_touxiang_jingli@2x.png'}/>
                                        </Upload>
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}></Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="警员姓名：" >
                                {getFieldDecorator('policeName', 
                                {initialValue: self.initvalue.policeName},
                                {
                                    rules: [{
                                        required: true, message: '请输入警员姓名!',
                                    }],
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="角色：">
                                    {getFieldDecorator('role', 
                                    {
                                        valuePropName: "defaultValue",
                                        initialValue: self.initvalue.role
                                    },{
                                        rules: [{required: true, message: '请选择角色!'}],
                                    })(
                                        <Select placeholder="请选择角色">
                                            <Option value="0">警员</Option>
                                            <Option value="1">U.S.A</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}><FormItem
                                {...formItemLayout}
                                label="性别"
                            >
                                {getFieldDecorator('sex',{ initialValue: 1 })(
                                    <RadioGroup >
                                        <Radio value={0}>女</Radio>
                                        <Radio value={1}>男</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem></Col>
                            <Col span={12}></Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="联系方式：" >
                                    {getFieldDecorator('phone', 
                                    {initialValue: self.initvalue.phone},
                                    {
                                        rules: [{
                                            required: true, message: '请输入警员联系方式!',
                                        }],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="职务：">
                                    {getFieldDecorator('position', 
                                    {
                                        initialValue: self.initvalue.position
                                    },{
                                        rules: [{
                                            required: true, message: '请输入职务!',
                                        }],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                            </Col>
                        </Row>

                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="执法记录仪：" >
                                    {getFieldDecorator('remark', {
                                        initialValue: self.initvalue.remark
                                    },{
                                        rules: [{
                                            required: true, message: '请输入编号!',
                                        }],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="所属单位：">
                                    {getFieldDecorator('deptId', {
                                        valuePropName: "defaultValue",
                                        initialValue: self.initvalue.deptId
                                    },{
                                        rules: [{required: true, message: '请选择所属单位!'}],
                                    })(
                                        <Select placeholder="请选择所属单位">
                                            <Option value="0">北京市局</Option>
                                            <Option value="1">U.S.A</Option>
                                        </Select>
                                    )}
                                </FormItem>

                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="车载云台：" >
                                    {getFieldDecorator('cloudPlatform', {
                                        initialValue: self.initvalue.cloudPlatform
                                    },{
                                        rules: [{
                                            required: true, message: '请输入编号!',
                                        }],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="B型手持终端：" >
                                    {getFieldDecorator('handler', {
                                        initialValue: self.initvalue.handler
                                    },{
                                        rules: [{
                                            required: true, message: '请输入编号!',
                                        }],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>

                            </Col>
                        </Row>

                        <Row>
                            <Col span={12}>&nbsp;</Col>
                            <Col span={12}></Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{textAlign: 'center'}}>
                                <Button style={{width:100}} type="primary" htmlType="submit">保存</Button>
                                <Button style={{marginLeft: 8,width:100}} onClick={this.handleCancel}>
                                    取消
                                </Button>
                            </Col>
                        </Row>

                    </Form>

                </Modal>
            </div>
        );
    }
}

export default Form.create()(CreatePolice);