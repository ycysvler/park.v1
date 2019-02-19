/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Modal, Checkbox, Button, Avatar} from 'antd';


import {PoliceActions, PoliceStore} from './reflux.js';

import './index.less';

export default class ChoiceStation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: this.props.visible,
            items: PoliceStore.items,
            total: 0
        };
        this.unsubscribe = PoliceStore.listen(this.onStatusChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange = (type, data) => {
        if (type === 'getList') {
            document.log('police > choice > getList', data);
            this.setState({items: data.list, total: data.count});
        }
    }

    componentDidMount() {
        PoliceActions.getList();
    }

    handleCancel = (e) => {
        this.setState({visible:false});
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    render() {
        return (
            <Modal title="移交"
                   visible={this.state.visible}
                   footer={null}
                   onCancel={this.handleCancel}
            >
                <div className="police">
                    {
                        this.state.items.map((item, index) => {
                            return <div className="chioseitem" key={index}>
                                <div style={{width: 30}}><Checkbox/></div>
                                <div style={{width: 40}}>
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                                </div>
                                <div style={{width: 70}}>{item.name}</div>

                                <div style={{flexGrow: 1}}>{item.orgName} &gt; {item.deptName}</div>
                                <div style={{width: 70}}>120米</div>
                                <div>正在{PoliceStore.getWorkStatusText(item.workStatus)}</div>

                            </div>
                        })
                    }

                    <div className="submit-bar"><Button type="primary">立即派警</Button></div>
                </div>

            </Modal>
        );
    }
}