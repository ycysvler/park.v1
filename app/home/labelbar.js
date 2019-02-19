import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';

import {Layout, Icon, Badge} from 'antd';

const {Header, Footer, Sider, Content} = Layout;


import './index.less';

export class LabelBar extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (<div className='labelbar'>
                <div className='labeldiv'>
                    <div className='labelcontent'>
                        <div>
                            <Badge dot>
                                <span>未处理 3</span>
                            </Badge>
                        </div>
                    </div>

                    <div style={{marginTop: 4, height: 3, background: '#E40025'}}></div>
                </div>
                <div className='labeldiv'>
                    <div className='labelcontent'>
                        <div>
                            <Badge>
                                <span>处理中 4</span>
                            </Badge>
                        </div>
                    </div>

                    <div style={{marginTop: 4, height: 3, background: '#F5A623'}}></div>
                </div>
                <div className='labeldiv'>
                    <div className='labelcontent'>
                        <div>
                            <Badge >
                                <span>支援 3</span>
                            </Badge>
                        </div>
                    </div>

                    <div style={{marginTop: 4, height: 3, background: '#296FD2'}}></div>
                </div>
                <div className='labeldiv'>
                    <div className='labelcontent'>
                        <div>
                            <Badge>
                                <span>完成 10</span>
                            </Badge>
                        </div>
                    </div>

                    <div style={{marginTop: 4, height: 3, background: '#7ED321'}}></div>
                </div>
            </div>
        );
    }
}