/**
 * Created by zhanghongqing on 2018/3/30.
 */
import React from 'react';
import {Input, Button,Divider,Icon} from 'antd';

import {StationActions, StationStore} from '../reflux.js';

import StationNavList from './list';
import StationNavInfo from './info';


export default class StationNav extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = StationStore.listen(this.onStatusChange.bind(this));

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

    onShowInfo=(id)=>{
        StationActions.single(id);
    }

    // 按状态查询
    onStatusClick=(status)=>{
        this.setState({view:'list',"keyword":''});

        let param = {
            "type":status,
            "pageIndex":1
        };
        StationActions.getList(param);
    }

    onKeyworkChange=(e)=>{
        let keyword = e.target.value.trim();
        this.setState({view:'list',"keyword":keyword});
        // 为了清空查询内容，查了一个不存在的状态
        let param = keyword.length > 0 ? {
            "keyword":keyword,
            "pageIndex":1
        }:{workStatus:-1};
        StationActions.getList(param);
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
                                    onClick={this.onStatusClick.bind(this, 2)}
                                    style={{background:'#296FD2',color:'rgba(255,255,255,0.8)'}} shape="circle" size="large" >局</Button>
                            <div className="label">分局</div>
                        </div>
                        <div>
                            <Button className="circle"
                                    onClick={this.onStatusClick.bind(this, 3)}
                                    style={{background:'#37353E',color:'rgba(255,255,255,0.8)'}} shape="circle" size="large">所</Button>
                            <div className="label">派出所</div>
                        </div>
                        <div style={{width:40}}>

                        </div>
                        <div style={{width:40}}>

                        </div>
                    </div>
                    <Divider style={{margin:'12px 0 0 0'}} />
                    {this.state.view=='list'?
                        <StationNavList param={this.state.param} current={this.state.param.pageIndex}
                                        items={this.state.items} total={this.state.total}
                                        onSelected={this.onShowInfo}/>:
                        <StationNavInfo info={this.state.info}  onChangeView={this.onChangeView} />}
                </div>
            </div>
        );
    }
}