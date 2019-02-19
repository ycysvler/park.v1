/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Button, Popover, Modal,Icon} from 'antd';
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap';
import {StationActions, StationStore} from '../../station/reflux.js';
import Config from 'config';
import AlarmNavInfo from '../../alarm/nav/info';

import '../index.less';

export default class StationMarker extends React.Component {
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
    }
    handleCancel = (e) => {
        this.setState({dialog_visibility:false,visible: false});
    }


    render() {
        let icon = "/icons/icon_gonganju_map_map@2x.png";
        let active = this.state.active ? this.state.active : false;

        switch (this.props.item.type) {
            case 1:
                icon = active ? "/icons/icon_gonganju_map@3x.png" : "/icons/icon_gonganju_map@2x.png";
                break;
            case 2:
                icon = active ? "/icons/icon_gonganju_map@3x.png" : "/icons/icon_gonganju_map@2x.png";
                break;
            case 3:
                icon = active ? "/icons/icon_paichusuo_map@3x.png" : "/icons/icon_paichusuo_map@2x.png";
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
                                    <h4>{this.props.item.name}</h4>
                                    <Icon  onClick={this.handleCancel} type="close" />
                                </div>

                                <div className="spacebetween">
                                    <h4>类型：</h4>
                                    <span >{StationStore.getStationTypeText(this.props.item.type)}</span>
                                </div>
                                <div className="spacebetween">
                                    <h4>地址：</h4>
                                    <span>{this.props.item.address}</span>
                                </div>
                                <div className="spacebetween">
                                    <h4>电话：</h4>
                                    <span>{this.props.item.phone}</span>
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
                        <AlarmNavInfo hideback/>
                    </div>
                </Modal>

            </div>
        );
    }
}