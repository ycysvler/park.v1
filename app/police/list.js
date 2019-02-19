/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Icon,Table, Breadcrumb,Button} from 'antd';

const {Header, Footer, Sider, Content} = Layout;

import {UserActions, UserStore} from './reflux.js';
import {NotFound} from '../notfound';


export default class PoliceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {items:[]};

        this.unsubscribe_user = UserStore.listen(this.onStatusChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe_user();
    }

    onStatusChange = (type, data) => {
        if(type === 'getList'){
            this.setState({items:data});
        }
    }

    componentDidMount() {
        UserActions.getList();
    }


    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    columns = [{
        title: '序号',
        dataIndex: 'key',
        render: text => <a href="#">{text}</a>,
    }, {
        title: '账号',
        dataIndex: 'loginName',
    }, {
        title: '姓名',
        dataIndex: 'name',
    }, {
        title: '部门',
        dataIndex: 'position',
    }, {
        title: '角色',
        dataIndex: 'role',
    }, {
        title: '权限',
        dataIndex: 'root',
    }, {
        title: '电话',
        dataIndex: 'phone',
    }, {
        title: '操作'
    }];
    data = [{
        key: '1',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    },{
        key: '2',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    },{
        key: '3',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    },{
        key: '4',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    },{
        key: '5',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    },{
        key: '6',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    },{
        key: '7',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    },{
        key: '8',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    },{
        key: '9',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    },{
        key: '10',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    },{
        key: '11',
        name: 'John Brown',
        loginName: 'loginName',
        position: '职位',
        role: '角色',
        root: '权限',
        phone: '电话',
        address: 'New York No. 1 Lake Park',
    }];

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
        getCheckboxProps: record => ({
            disabled: record.key === '3',
        }),
    };

    render() {
        return (<Layout>
                <Breadcrumb>
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                </Breadcrumb>

                <div className="list-toolbar">

                    <Link to='/main/system/user/info'><Button type="primary">新建用户</Button></Link>
                </div>

                <Table rowSelection={this.rowSelection} columns={this.columns} dataSource={this.state.items}
                pagination={{showSizeChanger:true,pageSizeOptions:["2", "3", "4", "5"],defaultPageSize: 10,hideOnSinglePage:true}} size="middle"/>
            </Layout>
        );
    }
}