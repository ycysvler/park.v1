/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap';
import {Layout, Icon, Modal, Button} from 'antd';
import Config from 'config';
import {LeftMenu} from "../home/leftmenu";
import {TopBar} from "./topbar";
import MapInit from './mapinit';
import CreateAlarm from '../alarm/create';
import CreatePolice from '../police/create';
import {AlarmActions, AlarmStore} from '../alarm/reflux.js';
import {PoliceActions, PoliceStore} from '../police/reflux.js';
import {StationActions, StationStore} from '../station/reflux.js';
import './index.less';
import AlarmMarker from './marker/alarm';
import PoliceMarker from './marker/police';
import StationMarker from './marker/station';

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            center: {lng: 116.402544, lat: 39.928216},
            active_alarm: null,
            active_police: null,
            active_station: null,
            create_alarm: false,
            create_police: false,
            create_station: false,
            alarms: [],
            polices: [],
            stations:[]
        };

        this.unsubscribe_alarm = AlarmStore.listen(this.onAlarmChange.bind(this));
        this.unsubscribe_police = PoliceStore.listen(this.onPoliceChange.bind(this));
        this.unsubscribe_station = StationStore.listen(this.onStationChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe_alarm();
        this.unsubscribe_police();
        this.unsubscribe_station();
    }

    onAlarmChange = (type, data) => {
        if (type === 'getList') {
            //this.state.alarms = [];
            this.state.polices = [];
            this.state.stations = [];
            document.log('map > alarms', data);
            this.setState({alarms: data.list});
        }
        if (type === 'single') {
            let center = data ? {lng: data.bdLng, lat: data.bdLat} : this.state.center;
            this.setState({active_alarm: data, center: center});
        }
        if (type === 'showInfo') {
            this.setState({active_alarm: data});
        }
    }

    onPoliceChange = (type, data) => {
        if (type === 'getList') {
            this.state.alarms = [];
            //this.state.polices = [];
            this.state.stations = [];
            document.log('map > polices', data);
            this.setState({polices: data.list});
        }
        if (type === 'single') {
            let center = data ? {lng: data.bdLng, lat: data.bdLat} : this.state.center;
            this.setState({active_police: data, center: center});
        }
        if (type === 'showInfo') {
            this.setState({active_police: data});
        }
    }

    onStationChange = (type, data) => {
        if (type === 'getList') {
            this.state.alarms = [];
            this.state.polices = [];
            //this.state.stations = [];
            document.log('map > polices', data);
            this.setState({stations: data.list});
        }
        if (type === 'single') {
            let center = data ? {lng: data.bdLng, lat: data.bdLat} : this.state.center;
            this.setState({active_station: data, center: center});
        }
        if (type === 'showInfo') {
            this.setState({active_station: data});
        }
    }

    // 显示新建警情
    onCreateAlarmDialog = () => {
        this.setState({create_alarm: true});
    }
    // 关闭新建警情
    onCloseAlarmDialog = () => {
        this.setState({create_alarm: false});
    }

    // 显示新建警情
    onCreatePoliceDialog = () => {
        this.setState({create_police: true});
    }
    // 关闭新建警情
    onClosePoliceDialog = () => {
        this.setState({create_police: false});
    }


    onTabChange = (code) => {
        this.setState({
            active_alarm: null,
            active_police: null,
            active_station: null,
            create_alarm: false,
            create_police: false,
            create_station: false,
            alarms: [],
            polices: [],
            stations:[]
        });
        switch (code) {
            case 'alarm':
                AlarmActions.getList();
                break;
            case 'police':
                PoliceActions.getList();
                break;
            case 'station':
                StationActions.getList();
                break;
        }
    }

    render() {
        let self = this;

        return (<Layout className="home">
                <Map style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                     center={{lng: self.state.center.lng, lat: self.state.center.lat}} zoom="13">
                    <MapInit/>
                    {
                        // 警情 markers
                        this.state.alarms.map((item, index) => {
                            let active = self.state.active_alarm ? item.alarmId === self.state.active_alarm.alarmId : false;
                            return <Marker key={item.alarmId}
                                           position={{lng: item.bdLng, lat: item.bdLat}}>
                                <AlarmMarker active={active} item={item}/>
                            </Marker>
                        })
                    }

                    {
                        // 警察 markers
                        this.state.polices.map((item, index) => {
                            let active = self.state.active_police ? item.id === self.state.active_police.id : false;
                            return <Marker key={item.id}
                                           position={{lng: item.bdLng, lat: item.bdLat}}>
                                <PoliceMarker active={active} item={item}/>
                            </Marker>
                        })
                    }

                    {
                        // 警局 markers
                        this.state.stations.map((item, index) => {
                            let active = self.state.active_station ? item.id === self.state.active_station.id : false;

                            return <Marker key={item.id}
                                           position={{lng: item.bdLng, lat: item.bdLat}}>
                                <StationMarker active={active} item={item}/>
                            </Marker>
                        })
                    }
                </Map>

                <LeftMenu onTabChange={this.onTabChange}/>
                <div className="rightmenu">
                    <Button onClick={this.onCreateAlarmDialog} style={{height: 48}} icon="bell">新建警情</Button>
                    <Button onClick={this.onCreatePoliceDialog} style={{height: 48}} icon="user">新建警员</Button>

                    <CreateAlarm onClose={this.onCloseAlarmDialog} visible={this.state.create_alarm}/>
                    <CreatePolice sex={1} name="liuzhong" onClose={this.onClosePoliceDialog} visible={this.state.create_police} />
                </div>

            </Layout>
        );
    }
}