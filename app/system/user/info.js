/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Menu, Form, Input, Select, Button, Breadcrumb} from 'antd';

import {UserActions, UserStore} from './userapi.js';
import {NotFound} from '../../notfound';

const {Header, Footer, Sider, Content} = Layout;
const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
const Option = Select.Option;


class UserInfo extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe_user = UserStore.listen(this.onStatusChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe_user();
    }

    onStatusChange = (type, data) => {

    }

    componentDidMount() {
        //this.props.form.validateFields();
    }


    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                document.log('Received values of form: ', values);
                UserActions.create(values)
            }
        });
    }
    handleConfirmMobile = (rule, value, callback) => {
        const mobileReg = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))[0-9]{8}$/;
        if (!value) {
            callback('请输入电话!')
        } else if (!mobileReg.test(value)) {
            callback('请输入正确格式!')
        }
        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback()
    }
    render() {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
        };

        return (<Layout>
                <Breadcrumb>
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/main/system/users">用户管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>新建用户</Breadcrumb.Item>
                </Breadcrumb>
                <Form onSubmit={this.handleSubmit} style={{marginTop: 24}}>
                    <FormItem {...formItemLayout} label="账号" hasFeedback>
                        {getFieldDecorator('account', {
                            rules: [{
                                required: true, message: '请输入账号!',
                            }],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="部门">
                        {getFieldDecorator('place', {
                            rules: [{required: true, message: '请输入部门!'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="姓名">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入姓名!'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="职务">
                        {getFieldDecorator('position', {
                            rules: [{
                                required: true, message: '请输入职务!',
                            }],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="电话" hasFeedback>
                        {getFieldDecorator('mobile', {
                            rules: [{
                                required: true,validator: this.handleConfirmMobile
                            }],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="角色">
                        {getFieldDecorator('role', {
                            initialValue: 0
                        })(
                            <Select>
                                <Option value={0}>超级管理员</Option>
                                <Option value={1}>局领导</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 12, offset: 6 }}
                    >
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </FormItem>

                </Form>
            </Layout>
        );
    }
}

export default Form.create()(UserInfo);