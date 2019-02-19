/**
 * Created by zhanghongqing on 2018/3/30.
 */
import React from 'react';
import {Input, Button,Divider,Icon, Select} from 'antd';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Map} from 'react-bmap';

import {AlarmActions, AlarmStore} from '../reflux.js';

import AlarmNavList from './list';
import AlarmNavInfo from './info';

import './nav.less';
const Option = Select.Option;

export default class AlarmNav extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe_police = AlarmStore.listen(this.onStatusChange.bind(this));

        this.state = {
            view:'list',
            keyword:'',
            alarmType:'-1',
            items:[],
            total:0,
            param:{current:1}
        };
    }

    componentWillUnmount() {
        this.unsubscribe_police();
    }

    onStatusChange = (type, data, callfrom) => {
        if (type === 'single' && callfrom === 'list') {
            this.setState({view:'info', info:data});
        }
        if (type === 'getList' || type === 'refresh') {
            this.setState({view:'list', param:data.param, items: data.list, total: data.total});
        }
    }

    componentDidMount() {

    }

    onChangeView=(view)=>{
        this.setState({view:view});
    }

    onShowInfo=(alarm)=>{
        AlarmActions.single(alarm.alarmId,alarm.executeId, 'list');
    }

    // 按类型查询
    alarmTypeChange=(alarmType)=> {
        alarmType = alarmType === "-1" ? null:alarmType;
        this.setState({view:'list',"keyword":'',"alarmType":alarmType});

        let param = {
            "alarmType":alarmType,
            "pageIndex":1
        };

        AlarmActions.getList(param);
    }

    // 按状态查询
    onStatusClick=(status)=>{
        this.setState({view:'list',"keyword":'',"alarmType":"-1"});

        let param = {
            "status":status,
            "pageIndex":1
        };
        AlarmActions.getList(param);
    }

    onKeyworkChange=(e)=>{
        let keyword = e.target.value.trim();
        this.setState({view:'list',"keyword":keyword,"alarmType":"-1"});
        // 为了清空查询内容，查了一个不存在的状态
        let param = keyword.length > 0 ? {
            "keyword":keyword,
            "pageIndex":1
        }:{status:-1};
        AlarmActions.getList(param);
    }


    render() {
        return (
            <div className="alarmnav">
                <div className="main">
                    <div className="search">
                        <Select onChange={this.alarmTypeChange}
                                value={this.state.alarmType}
                                defaultValue="-1" style={{ width: 120,marginRight:8 }} >

                            <Option value="-1">全部类型</Option>
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
                        <Input
                            onChange={this.onKeyworkChange}
                            value={this.state.keyword} addonAfter={<Icon type="search" />} placeholder="输入关键字" />

                    </div>
                    <Divider style={{margin:'0 0 12px 0',boxShadow:'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'}} />
                    <div className="spacearound">
                        <div>
                            <Button className="circle"
                                    onClick={this.onStatusClick.bind(this, 0)}
                                    style={{background:'#F04F69',color:'rgba(255,255,255,0.8)'}} shape="circle" size="large" icon="bell"></Button>
                            <div className="label">未处理</div>
                        </div>
                        <div>
                            <Button className="circle"
                                    onClick={this.onStatusClick.bind(this, 1)}
                                    style={{background:'#FFBB4C',color:'rgba(255,255,255,0.8)'}} shape="circle" size="large" icon="bell"></Button>
                            <div className="label">处理中</div>
                        </div>
                        <div>
                            <Button className="circle"
                                    onClick={this.onStatusClick.bind(this, 2)}
                                    style={{background:'#3987F5',color:'rgba(255,255,255,0.8)'}} shape="circle" size="large" icon="bell"></Button>
                            <div className="label" >待支援</div>
                        </div>
                        <div>
                            <Button className="circle"
                                    onClick={this.onStatusClick.bind(this, 3)}
                                    style={{background:'#8DC653',color:'rgba(255,255,255,0.8)'}} shape="circle" size="large" icon="bell"></Button>
                            <div className="label">待审核</div>
                        </div>
                    </div>
                    <Divider style={{margin:'12px 0 0 0'}} />

                    {this.state.view=='list'?
                        <AlarmNavList param={this.state.param} current={this.state.param.pageIndex} items={this.state.items} total={this.state.total} onSelected={this.onShowInfo}/>:
                        <AlarmNavInfo info={this.state.info}  onChangeView={this.onChangeView} />}
                </div>
            </div>
        );
    }
}