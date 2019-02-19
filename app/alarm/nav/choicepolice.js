/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Modal,message, Checkbox, Button, Avatar} from 'antd';

import Common from '../../common';

import {AlarmActions, AlarmStore} from '../reflux.js';
import {PoliceStore} from '../../police/reflux.js';

import './nav.less';

export default class ChoicePolice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: this.props.visible,
            items: [],
            alarmId:null,
            executeId:null,
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
            AlarmActions.police(props.alarmId, props.executeId);

        }
    }


    onStatusChange = (type, data, param) => {
        if (type === 'police' && this.state.visible) {
            document.log('alarm > choice police > police', data);
            this.setState({items: data, visible: true, alarmId:param.alarmId, executeId:param.executeId});
        }
        if(type === 'send' && this.state.visible){
            console.log('send',data);
            if (data.statusCode === 200) {
                message.success('已派警！');
                let param = {
                    "status": 0,
                    "pageIndex": 1
                };

                AlarmActions.getList(param);
                this.setState({visible: false});
            }else{
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

        this.setState({employee:this.state.employee});

    }

    send=()=>{
        AlarmActions.send(
            this.state.alarmId,
            this.state.executeId,
            this.state.employee
        );
    }


    render() {
        let self = this;

        return (
            <Modal title="派警"
                   visible={this.state.visible}
                   footer={null}
                   onCancel={this.handleCancel}
            >
                {this.state.items.length > 0 ?
                    <div className="police">
                        {
                            this.state.items.map((item, index) => {
                                return <div className="chioseitem" key={index}>
                                    <div style={{width: 30}}>
                                        <Checkbox value={item.empId} onChange={self.selectPolice}/>
                                    </div>
                                    <div style={{width: 40}}>
                                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                                    </div>
                                    <div style={{width: 70}}>{item.empName}</div>

                                    <div
                                        style={{flexGrow: 1}}>{item.parentOrgName ? item.parentOrgName + " > " : null}{item.orgName}</div>
                                    <div style={{width: 120}}>{item.distance}米</div>
                                    <div>正在{PoliceStore.getWorkStatusText(item.workStatus)}</div>
                                </div>
                            })
                        }

                        <div className="submit-bar">
                            <Button type="primary"
                                    onClick={this.send}
                                    disabled={this.state.employee.length>0?false:true}
                            >立即派警</Button>
                        </div>
                    </div>
                    : <div style={{padding: 12, textAlign: 'center'}}>无警可用！</div>}

            </Modal>
        );
    }
}