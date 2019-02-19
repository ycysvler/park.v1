/**
 * Created by zhanghongqing on 2018/3/30.
 * 指挥调度 > 警力查询 > 列表控件
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Layout, Pagination} from 'antd';
import {StationActions, StationStore} from '../reflux.js';
import './nav.less';

export default class StationNavList extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = StationStore.listen(this.onStatusChange.bind(this));

        this.state = {
            items: this.props.items,
            total: this.props.total,
            current:this.props.current,
            param:{}
        };
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidMount() {
    }

    componentWillReceiveProps(props){
        document.log('police > list > componentWillReceiveProps', props);
        this.setState({param:props.param, current: props.current, items:props.items, total:props.total});
    }

    onStatusChange = (type, data) => {

    }

    getBorderColor = (type) => {
        if(type == 3){return 'border-paichusuo'};
        if(type == 2){return 'border-fenju'};
    }

    onSelected = (id) => {
        document.log('station > list > select > id', id);

        this.props.onSelected(id);
    }

    onPageChange = (page) => {
        this.state.current = page;
        let param = this.state.param;

        param.pageIndex = page;
        StationActions.getList(param);
    }

    render() {
        let self = this;
        return (<Layout className="alarmnav">

                {
                    this.state.items.map(function (item, index) {
                        return <div className={"list-item-red " + self.getBorderColor(item.type)}
                                    onClick={self.onSelected.bind(self, item.id)}
                                        key={index}>
                            <div className="spacebetween padding-h-4">
                                <b>{item.name}</b>
                                <span className="content">{StationStore.getStationTypeText( item.type)}</span>
                            </div>
                            <div className="spacebetween padding-h-4">
                                <span className="content">{item.address}</span>
                                <span className="content"></span>
                            </div>
                        </div>
                    })
                }
                {
                    this.state.items.length > 0 ? (<div className="pager">
                        <span>共{this.state.total}条</span>
                        <Pagination size="small" pageSize={6}
                                    onChange={this.onPageChange}
                                    current={this.state.current}
                                    total={this.state.total}/>
                    </div>) : (<div style={{textAlign: 'center',padding:8}}>
                        <span>查询结果共 {this.state.total} 条</span>
                    </div>)
                }
            </Layout>
        );
    }
}