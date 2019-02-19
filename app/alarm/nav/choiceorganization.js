/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Modal, message, Checkbox, Button, Tree} from 'antd';
import Common from '../../common';

import {AlarmActions, AlarmStore} from '../reflux.js';
import {PoliceStore} from '../../police/reflux.js';
import './nav.less';

const TreeNode = Tree.TreeNode;

export default class ChoiceOrganization extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            treeData: [],
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            visible: this.props.visible,
            items: [],
            alarmId: null,
            executeId: null,
            employee: []
        };
        this.unsubscribe = AlarmStore.listen(this.onStatusChange.bind(this));
    }


    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillReceiveProps(props){
        this.state.visible= props.visible;
        this.state.alarmId = props.alarmId;
        this.state.executeId = props.executeId;
        if(props.visible){
            AlarmActions.organization(props.alarmId, props.executeId);
        }
    }


    onExpand = (expandedKeys) => {
        console.log('onExpand', arguments);

        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onCheck = (checkedKeys, e) => {

        let data = e.node.props.dataRef ? e.node.props.dataRef : e.node.props;

        this.setState(
            {
                checkedKeys: [data.id.toString()],
                otype: data.type
            });
    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({selectedKeys});
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode multiple={false} type={item.type} title={item.title} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }

    getTreeRootNode = (items) => {
        for (let i in items) {
            let item = items[i];
            if (!item.parentId) {
                return {id: item.id, title: item.name, type: item.type}
            }
        }
    }

    adapterTreeData = (node, items) => {
        node.children = [];

        for (let i in items) {
            let item = items[i];

            if (item.parentId === node.id) {
                let child = {id: item.id, key: item.id, title: item.name, type: item.type};
                node.children.push(child);
                this.adapterTreeData(child, items);
            }
        }
        if (node.children.length === 0)
            delete node.children;
    }

    onStatusChange = (type, data, param) => {
        if (type === 'organization'&& this.state.visible) {
            document.log('alarm > choice organization > organization', data, param);

            let treeData = [];

            let node = this.getTreeRootNode(data.list);
            this.adapterTreeData(node, data.list);

            treeData.push(node);

            this.setState({treeData: treeData, visible: true, alarmId: param.alarmId, executeId: param.executeId});
        }
        if (type === 'transfer'&& this.state.visible) {

            if (data.statusCode === 200) {
                message.success('已移交！');
                let param = {
                    "status": 0,
                    "pageIndex": 1
                };

                AlarmActions.getList(param);
                this.setState({visible: false});
            }
            else {
                message.error(data.reason);
            }

        }
    }

    componentDidMount() {

    }

    handleCancel = (e) => {
        this.setState({visible: false});
    }

    selectPolice = (e) => {
        if (e.target.checked) {
            this.state.employee.push(e.target.value);
        } else {
            this.state.employee = Common.arrayRemove(this.state.employee, e.target.value);
        }

        this.setState({employee: this.state.employee});

    }

    send = () => {
        let orgId = this.state.checkedKeys[0] * 1;
        AlarmActions.transfer(
            this.state.alarmId,
            this.state.executeId,
            orgId, this.state.otype
        );
    }


    render() {
        let self = this;

        return (
            <Modal title="移交"
                   visible={this.state.visible}
                   footer={null}
                   onCancel={this.handleCancel}
            >
                {this.state.treeData.length > 0 ?
                    <div className="choiceorganization">
                        <div className="tree">
                            <Tree
                                checkable
                                multiple={true}
                                checkStrictly={true}
                                onCheck={this.onCheck}
                                checkedKeys={this.state.checkedKeys}
                                onSelect={this.onSelect}
                                selectedKeys={this.state.selectedKeys}
                            >
                                {this.renderTreeNodes(this.state.treeData)}
                            </Tree>
                        </div>
                        <div className="submit-bar">
                            <Button type="primary"
                                    onClick={this.send}
                                    disabled={this.state.checkedKeys.length > 0 ? false : true}
                            >移交</Button>
                        </div>
                    </div>
                    : <div style={{padding: 12, textAlign: 'center'}}>无可用移交部门！</div>}

            </Modal>
        );
    }
}