/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {Layout, Row, Col, Modal, Form, Select, Input, DatePicker, Button,message} from 'antd';
import moment from 'moment';
import {Map} from 'react-bmap';
import {AlarmActions, AlarmStore} from './reflux.js';

const FormItem = Form.Item;
const Option = Select.Option;

class CreateAlarm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: this.props.visible};
        this.initvalue = {
            title: '',
            alarmType: '1',
            alarmTime: new moment(),
            position: '',
            bdLng: 0,
            bdLat: 0,
            empName: '',
            empPhone: ''
        };

        this.unsubscribe_police = AlarmStore.listen(this.onStatusChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe_police();
    }

    onStatusChange = (type, data) => {
        if(type === "create"){
            if(this.refs.position){
                this.refs.position.input.value = "";
                this.state.bdLng = 0;
                this.state.bdLat = 0;
            }

            this.handleCancel();

            message.success('新建警情成功！');
        }
    }

    componentDidMount = () => {
        // 构造一下百度地图的提示功能
        this.initBaiduSuggest();

    }

    initBaiduSuggest = () => {
        let self = this;
        var suggestId = this.refs.position;
        if (suggestId && !this.state.baiduinit) {
            this.state.baiduinit = true;
            var ac = new BMap.Autocomplete(
                {
                    "input": suggestId.input
                    , "location": document.bdmap
                });

            ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;

                var myValue = _value.province + _value.city + _value.district + _value.street + _value.business;

                var myGeo = new BMap.Geocoder();

                self.state.position = myValue;

                myGeo.getPoint(myValue, function (point) {
                    if (point) {
                        self.state.point = point;

                    }
                }, _value.city);


            });
        }
    }

    // 根据新建警情按钮设置状态显示Dialog
    componentWillReceiveProps = (newProps) => {
        // 构造一下百度地图的提示功能
        this.initBaiduSuggest();

        this.setState({visible: newProps.visible});
    }

    // 隐藏Dialog
    handleCancel = (e) => {
        this.props.onClose();
        this.props.form.resetFields();
    }

    handleSubmit = (e) => {
        let self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                document.log('alarm > create', values);
                values.bdLng = self.state.point.lng;
                values.bdLat = self.state.point.lat;
                values.position = self.state.position;

                console.log('position', values);

                AlarmActions.create(values);
            }
        });
    }

    render() {
        const {getFieldDecorator, getFieldProps, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
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

        let self = this;

        return (<div>
                <Modal title="新建警情" width={700}
                       visible={this.state.visible}
                       footer={null}
                       onCancel={this.handleCancel}
                >
                    <Form style={{padding: 24}} onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="警情名称：">
                                    {getFieldDecorator('title',
                                        {initialValue: self.initvalue.title},
                                        {
                                            rules: [{
                                                required: true, message: '请输入警情名称!',
                                            }],
                                        })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="报警时间：">
                                    {getFieldDecorator('alarmTime',
                                        {initialValue: this.initvalue.alarmTime},
                                        {
                                            rules: [{
                                                required: true, message: '请输入报警时间!',
                                            }],
                                        })(
                                        <DatePicker style={{width: '100%'}} showTime format="YYYY-MM-DD HH:mm:ss"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="案件类型：">
                                    {getFieldDecorator('alarmType',
                                        {
                                            valuePropName: "defaultValue",
                                            initialValue: this.initvalue.alarmType
                                        },
                                        {
                                            rules: [{required: true, message: '请选择案件类型!'}],
                                        })(
                                        <Select placeholder="请选择案件类型">
                                            <Option value="1">两抢一盗</Option>
                                            <Option value="2">刑事警情</Option>
                                            <Option value="3">治安警情</Option>
                                            <Option value="4">交通事故</Option>
                                            <Option value="5">火灾事故</Option>
                                            <Option value="6">群众救助</Option>
                                            <Option value="7">举报投诉</Option>
                                            <Option value="8">群体活动</Option>
                                            <Option value="9">灾害事故</Option>
                                            <Option value="10">其他</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <Row className="nt-form-item">
                                    <Col className="ant-form-item-label" span={8}><label
                                        className="ant-form-item-required">案发地点</label></Col>
                                    <Col className="ant-form-item-control-wrapper" span={14} offset={2}>
                                        <div className="ant-form-item-control">
                                        <span className="ant-form-item-children">
                                            <Input ref="position"  type="text"/></span>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="报警人员：">
                                    {getFieldDecorator('empName',
                                        {initialValue: this.initvalue.empName},
                                        {
                                            rules: [{
                                                required: true, message: '请输入报警人员!',
                                            }],
                                        })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="联系电话：">
                                    {getFieldDecorator('empPhone',
                                        {initialValue: this.initvalue.empPhone},
                                        {
                                            rules: [{
                                                required: true, message: '请输入联系电话!',
                                            }],
                                        })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <FormItem
                                    labelCol={{xs: {span: 24}, sm: {span: 4}}}
                                    wrapperCol={{xs: {span: 24}, sm: {span: 19, offset: 1}}}
                                    label="案情描述：">
                                    {getFieldDecorator('describes',
                                        {initialValue: this.initvalue.describes},
                                        {
                                        rules: [],
                                    })(
                                        <Input.TextArea placeholder="案情描述" autosize={{minRows: 2, maxRows: 6}}/>
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
                                <Button style={{width: 100}} type="primary" htmlType="submit">保存</Button>
                                <Button style={{marginLeft: 8, width: 100}} onClick={self.handleCancel}>
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

export default Form.create()(CreateAlarm);