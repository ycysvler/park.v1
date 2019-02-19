/**
 * Created by zhanghongqing on 2018/3/30.
 * 指挥调度 > 警力查询 > 列表控件
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Layout, Pagination} from 'antd';
import {PoliceActions, PoliceStore} from '../reflux.js';
import './nav.less';

export default class PoliceNavList extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe_police = PoliceStore.listen(this.onStatusChange.bind(this));

        this.state = {
            items: this.props.items,
            total: this.props.total,
            current:this.props.current,
            param:{}
        };
    }

    componentWillUnmount() {
        this.unsubscribe_police();
    }

    componentWillReceiveProps(props){
        document.log('police > list > componentWillReceiveProps', props);
        this.setState({param:props.param, current: props.current, items:props.items, total:props.total});
    }

    componentDidMount() {
    }

    onStatusChange = (type, data) => {

    }

    getBorderColor = (type) => {
        if(type == 1){return 'border-xunluo'};
        if(type == 2){return 'border-zhiban'};
        if(type == 3){return 'border-beiqin'};
        if(type == 4){return 'border-chuqin'};
    }

    onSelected = (item) => {
        document.log('police > list > select > id', item);

        this.props.onSelected(item);
    }

    onPageChange = (page) => {
        this.state.current = page;
        let param = this.state.param;

        param.pageIndex = page;
        PoliceActions.getList(param);
    }

    render() {
        let self = this;
        return (<Layout className="alarmnav">

                {
                    this.state.items.map(function (item, index) {
                        return <div className={"list-item-red " + self.getBorderColor(item.workStatus)}
                                    onClick={self.onSelected.bind(self, item)}
                                    key={index}>
                            <div className="spacebetween padding-h-4">
                                <b>{item.name}</b>
                                <span className="content"> {PoliceStore.getWorkStatusText( item.workStatus)}</span>
                            </div>
                            <div className="spacebetween padding-h-4">
                                <span className="content">{item.position}</span>
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