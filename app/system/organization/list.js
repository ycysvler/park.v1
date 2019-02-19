/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {Layout, Icon,Table, Breadcrumb,Button} from 'antd';
import {OrgActions, OrgStore} from './reflux.js';
import {NotFound} from '../../notfound';

const {Header, Footer, Sider, Content} = Layout;

export default class OrgList extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe_user = OrgStore.listen(this.onStatusChange.bind(this));
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
        OrgActions.getList();
    }


    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    columns = [

        {
        title: '警所名称',
        dataIndex: 'name',
    }, {
        title: '位置',
        dataIndex: 'address',
    }, {
        title: '电话',
        dataIndex: 'phone',
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
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                </Breadcrumb>

                {/*<div className="list-toolbar">*/}

                    {/*<Link to='/main/system/user/info'><Button type="primary">新建用户</Button></Link>*/}
                {/*</div>*/}

                <Table
                    rowKey="id"
                    rowSelection={this.rowSelection} columns={this.columns} dataSource={this.state.items}
                pagination={{showSizeChanger:true,
                    onChange:this.onPageChange,
                    pageSizeOptions:["2", "3", "4", "5"],
                    defaultPageSize: 10, total:this.state.total,
                    hideOnSinglePage:true}} size="middle"/>
            </Layout>
        );
    }
}