/**
 * Created by zhanghongqing on 2018/3/30.
 */
import React from 'react';
import {Input, Button,Divider,Icon, Select} from 'antd';

import {PoliceActions, PoliceStore} from '../reflux.js';

import PoliceNavList from './list';
import PoliceNavInfo from './info';


const Option = Select.Option;

export default class PoliceNav extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = PoliceStore.listen(this.onStatusChange.bind(this));

        this.state = {
            view:'list',
            keyword:'',
            alarmType:'-1',
            items:[],
            total:0,
            info :{},
            param:{current:1}
        };
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange = (type, data) => {
        if (type === 'single') {
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

    onShowInfo=(item)=>{
        PoliceActions.single(item.id);
    }

    // 按类型查询
    alarmTypeChange=(alarmType)=> {
        alarmType = alarmType === "-1" ? null:alarmType;
        this.setState({view:'list',"keyword":'',"alarmType":alarmType});

        let param = {
            "alarmType":alarmType,
            "pageIndex":1
        };

        PoliceActions.getList(param);
    }

    // 按状态查询
    onStatusClick=(status)=>{
        this.setState({view:'list',"keyword":''});

        let param = {
            "workStatus":status,
            "pageIndex":1
        };
        PoliceActions.getList(param);
    }

    onKeyworkChange=(e)=>{
        let keyword = e.target.value.trim();
        this.setState({view:'list',"keyword":keyword});
        // 为了清空查询内容，查了一个不存在的状态
        let param = keyword.length > 0 ? {
            "keyword":keyword,
            "pageIndex":1
        }:{workStatus:-1};
        PoliceActions.getList(param);
    }

    render() {
        return (
            <div className="alarmnav">
                <div className="main">
                    <div className="search">

                        <Input
                            onChange={this.onKeyworkChange}
                            addonAfter={<Icon type="search" />} placeholder="输入关键字" />

                    </div>
                    <Divider style={{margin:'0 0 12px 0',boxShadow:'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'}} />
                    <div className="spacearound">
                        <div>
                            <Button className="circle"
                                    onClick={this.onStatusClick.bind(this, 0)}
                                    style={{background:'#53C667',color:'rgba(255,255,255,0.8)'}} shape="circle" size="large" >巡</Button>
                            <div className="label">巡逻</div>
                        </div>
                        <div>
                            <Button className="circle"
                                    onClick={this.onStatusClick.bind(this, 1)}
                                    style={{background:'#53C6BB',color:'rgba(255,255,255,0.8)'}} shape="circle" size="large">值</Button>
                            <div className="label">值班</div>
                        </div>
                        <div>
                            <Button className="circle"
                                    onClick={this.onStatusClick.bind(this, 2)}
                                    style={{background:'#53A0C6',color:'rgba(255,255,255,0.8)'}} shape="circle" size="large">备</Button>
                            <div className="label" >备勤</div>
                        </div>
                        <div>
                            <Button className="circle"
                                    onClick={this.onStatusClick.bind(this, 3)}
                                    style={{background:'#537FC6',color:'rgba(255,255,255,0.8)'}} shape="circle" size="large">出</Button>
                            <div className="label">出勤</div>
                        </div>
                    </div>
                    <Divider style={{margin:'12px 0 0 0'}} />
                    {this.state.view=='list'?<PoliceNavList
                        param={this.state.param} current={this.state.param.pageIndex}
                        items={this.state.items} total={this.state.total}
                        onSelected={this.onShowInfo}/>:
                        <PoliceNavInfo info={this.state.info} onChangeView={this.onChangeView} />}
                </div>
            </div>
        );
    }
}