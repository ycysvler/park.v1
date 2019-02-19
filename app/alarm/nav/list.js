/**
 * Created by zhanghongqing on 2018/3/30.
 * 指挥调度 > 警力查询 > 列表控件
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Layout, Pagination} from 'antd';
import moment from 'moment';
import {AlarmActions, AlarmStore} from '../reflux.js';
import './nav.less';

export default class AlarmNavList extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe_alarm = AlarmStore.listen(this.onStatusChange.bind(this));

        this.state = {
            items: this.props.items,
            total: this.props.total,
            current:this.props.current,
            param:{}
        };
    }

    componentWillUnmount() {
        this.unsubscribe_alarm();
    }

    componentWillReceiveProps(props){
        this.setState({param:props.param, current: props.current, items:props.items, total:props.total});
    }

    onStatusChange = (type, data) => {

    }

    componentDidMount() {
    }

    onPageChange = (page) => {
        this.state.current = page;
        let param = this.state.param;

        param.pageIndex = page;
        AlarmActions.getList(param);
    }

    getBorderColor = (type) => {
        // 未处理
        if (type == 0) {
            return 'border-weichuli'
        }
        // 处理中
        if (type == 1) {
            return 'border-chulizhong'
        }
        // 待支援
        if (type == 2) {
            return 'border-zhiyuan'
        }
        // 待审核
        if (type == 3) {
            return 'border-wancheng'
        }
    }

    onSelected = (alarm) => {
        document.log('alarm > list > select > alarm', alarm);

        this.props.onSelected(alarm);
    }

    render() {
        let self = this;
        return (<Layout className="alarmnav">

                {
                    this.state.items.map(function (item, index) {
                        return <div className={"list-item-red " + self.getBorderColor(item.status)}
                                    onClick={self.onSelected.bind(self, item)}
                                    key={index}>
                            <div className="spacebetween padding-h-4">
                                <b>{"[" + AlarmStore.getAlarmTypeText(item.alarmType) + "]"}{item.title}</b>
                                <span className="content">{ moment(item.alarmTime).format('YYYY-MM-DD H:mm:ss')}</span>
                            </div>
                            <div className="spacebetween padding-h-4">
                                <span className="state"
                                      style={{color: AlarmStore.getStatusColor(item.status)}}
                                >{AlarmStore.getStatusText(item.status)}</span>
                                <span className="content">{item.position}</span>
                            </div>
                        </div>
                    })
                }

                {
                    this.state.items.length > 0 ? (<div className="pager">
                        <span>共{this.state.total}条</span>
                        <Pagination size="small" onChange={this.onPageChange}
                                    pageSize={6}
                                    current={this.state.current} total={this.state.total}/>
                    </div>) : (<div style={{textAlign: 'center',padding:8}}>
                        <span>查询结果共 0 条</span>
                    </div>)
                }


            </Layout>
        );
    }
}