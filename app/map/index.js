/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap';
import {Layout, Icon} from 'antd';
import Config from 'config';
const {Header, Footer, Sider, Content} = Layout;

import NavList from '../police/nav/list.js';
import PoliceNavInfo from '../police/nav/info.js';
import PoliceNav from '../police/nav/index.js';
import StationNav from '../station/nav/index.js';
import AlarmNav from '../alarm/nav/index.js';


export class MapDemo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    render() {

        var myIcon = new BMap.Icon(Config.base + "/icons/icon_beiqin_map@2x.png", new BMap.Size(100,100));

        return (<div>
                <div style={{position:'absolute',left:0,top:0,bottom:0,right:0}}>
                    <Map style={{width: '100%', height: '100%'}} center={{lng: 116.402544, lat: 39.928216}} zoom="11">
                        <Marker icon={myIcon} position={{lng: 116.402544, lat: 39.928216}}/>
                    </Map>
                </div>
                {/*<PoliceNav/>*/}
                {/*<StationNav/>*/}
                {/*<AlarmNav/>*/}
                {/*<div style={{position: 'absolute', width: '100%', height: '100%'}}>*/}
                   {/**/}
                   {/**/}

                {/*</div>*/}
            </div>
        );
    }
}