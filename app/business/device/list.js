/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Icon,Table, Breadcrumb,Button} from 'antd';
import {DeviceActions, DeviceStore} from './reflux.js';
import {NotFound} from '../../notfound';

const {Header, Footer, Sider, Content} = Layout;

export default class DeviceList extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe_user = DeviceStore.listen(this.onStatusChange.bind(this));
        this.state = {items:[]};
    }

    componentWillUnmount() {
        this.unsubscribe_user();
    }

    onStatusChange = (type, data) => {
        if(type === 'getList'){
            console.log('items', data);
            this.setState({items:data.list, total:data.total});
        }
    }

    componentDidMount() {
        DeviceActions.getList();
    }


    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    columns = [

        {
        title: '设备名称',
        dataIndex: 'name',
    }, {
        title: '设备编号',
        dataIndex: 'code',
    }, {
        title: '设备位置',
        dataIndex: 'serviceAddress',
    }, {
            title: '备注',
            dataIndex: 'remark',
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

    onPageChange=(pageNumber)=> {
        OrgActions.getList(pageNumber, 10);
    }

    render() {
        return (<Layout>
                <Breadcrumb>
                    <Breadcrumb.Item>资源管理</Breadcrumb.Item>
                    <Breadcrumb.Item>终端管理</Breadcrumb.Item>
                </Breadcrumb>

                {/*<div className="list-toolbar">*/}

                    {/*<Link to='/main/system/user/info'><Button type="primary">新建用户</Button></Link>*/}
                {/*</div>*/}

                <Table
                    rowKey="id"
                    rowSelection={this.rowSelection} columns={this.columns} dataSource={this.state.items}
                pagination={{showSizeChanger:false,
                    onChange:this.onPageChange,
                    defaultPageSize: 10, total:this.state.total,
                    hideOnSinglePage:true}} size="middle"/>
            </Layout>
        );
    }
}