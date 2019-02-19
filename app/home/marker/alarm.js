/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Button, Popover, Modal, Icon} from 'antd';
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap';
import {AlarmActions, AlarmStore} from '../../alarm/reflux.js';
import Config from 'config';
import AlarmNavInfo from '../../alarm/nav/info';

import '../index.less';

export default class AlarmMarker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: false, dialog_visibility: false, active: this.props.active};
    }

    componentWillUnmount() {
    }

    onStatusChange = (type, data) => {
    }

    componentDidMount() {
    }

    onClick = () => {
        this.setState({dialog_visibility: !this.state.dialog_visibility});
    }

    showInfo = (event) => {

        this.setState({dialog_visibility:false, visible: true});
        // AlarmActions.showInfo(this.props.item.id);
    }
    handleCancel = (e) => {
        this.setState({dialog_visibility:false,visible: false});
    }

    content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );

    render() {
        let icon = "/icons/icon_weichuli_map.png";
        let active = this.state.active ? this.state.active : false;

        switch (this.props.item.status) {
            case 0:
                icon = active ? "/icons/icon_weichuli_map@2x.png" : "/icons/icon_weichuli_map.png";
                break;
            case 1:
                icon = active ? "/icons/icon_chulizhong_map@2x.png" : "/icons/icon_chulizhong_map.png";
                break;
            case 2:
                icon = active ? "/icons/icon_zhiyuan_map@2x.png" : "/icons/icon_zhiyuan_map.png";
                break;
            case 3:
                icon = active ? "/icons/icon_daishenhe_map@2x.png" : "/icons/icon_daishenhe_map.png";
                break;
        }


        return (
            <div  className="marker">


                <div className="img">
                    <Popover
                        title={null} visible={this.state.dialog_visibility}
                        content={

                        <div className="marker">
                            <div className="popover">
                                <div className="spacebetween">
                                    <h4></h4>
                                    <Icon className="close" onClick={this.handleCancel} type="close" />
                                </div>

                                <div className="spacebetween">
                                    <h4>{this.props.item.title}</h4>
                                    <a onClick={this.showInfo}>查看详情</a>
                                </div>
                                <div className="spacebetween">
                                    <h4>警情状态：</h4>
                                    <span
                                        style={{color: AlarmStore.getStatusColor(this.props.item.status)}}>{AlarmStore.getStatusText(this.props.item.status)}</span>
                                </div>
                                <div className="spacebetween">
                                    <h4>报警类型：</h4>
                                    <span>{AlarmStore.getAlarmTypeText(this.props.item.alarmType)}</span>
                                </div>

                            </div>
                        </div>
                    } >
                        <img onClick={this.onClick} src={Config.base + icon}/>
                    </Popover>

                </div>


                <Modal width={388}
                       title="警情" footer={null}
                       visible={this.state.visible}
                       onCancel={this.handleCancel}
                >
                    <div className="alarmnav">
                        <AlarmNavInfo info={this.props.item}  hideback/>
                    </div>
                </Modal>

            </div>
        );
    }
}