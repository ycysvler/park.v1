/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';

import {Layout, Icon,Input} from 'antd';
import {LabelBar} from "./labelbar";

const {Header, Footer, Sider, Content} = Layout;


import './index.less';

export class TopBar extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {

        return (<div className='topbar'>
                <div className='label'>
                    <LabelBar/>


                </div>
                <div className='bar'>
                    <ul>
                        <li><Icon type="switcher" />&nbsp;地图切换</li>
                        <li><Icon type="appstore-o" />&nbsp;地图工具</li>
                        <li><Icon type="environment-o" />&nbsp;围栏设置</li>
                        <li><Icon type="select" />&nbsp;拉框搜索</li>
                        <li><Icon type="scan" />&nbsp;全屏</li>
                    </ul>

                </div>
                <div className='search'>
                    <Input.Search
                        placeholder="地域搜索"
                        onSearch={value => console.log(value)}
                        style={{ width: 200}}
                    />

                </div>
            </div>
        );
    }
}