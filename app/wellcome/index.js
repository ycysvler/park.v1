/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {HashRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap';
import MapInit from './mapinit';
import moment from 'moment';

import {Layout, Icon} from 'antd';

const {Header, Footer, Sider, Content} = Layout;


import './wellcome.less';

export class WellCome extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(next){
        let self = this;
        if(!this.timer) {
            this.timer = setTimeout(
                () => {
                    console.log(moment());
                    self.setState({'time':moment()});
                },
                1000
            );
        }
    }



    //不用的是时候将其解绑
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }


    getDayLink() {
        let result = [];

        for(var i=1;i<31;i++){
            result.push(<a key={i}>{i.toString()}</a>);

        }

        return result;
    }

    render() {
        let simpleMapStyle=
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#ff0000"
                }
            };

        moment.locale('zh-cn');

        return (<Layout className='wellcome'>

                <div className='top'>
                    <h1>六盘水市公安局钟山分局警务云系统</h1>

                    <div>
                        <Link className='link' to='/main/home'>可视化指挥</Link>
                        <Link className='link'  to='/main'>民生服务</Link>
                        <Link className='link'  to='/main'>视频侦查</Link>
                        <Link className='link'  to='/main'>人脸识别</Link>
                        <Link className='link'  to='/main'>综合应用</Link>
                    </div>

                    <div className='daytime'>
                        <div style={{color:'#fff',fontSize:28, fontFamily:'Microsoft YaHei'}}>{moment().format('hh:mm')}</div>
                        <div style={{color:'#fff',fontSize:28}}>{moment().format('dddd')}</div>
                        <div style={{color:'#fff',fontSize:10}}>{moment().format('YYYY年MMMMDo')}</div>
                    </div>
                </div>
                <div className='content'>
                    <div className='laycolumn rshadow' >
                        <div className='bshadow '></div>
                        <div className='bshadow '></div>
                        <div ></div>
                    </div>
                    <div style={{flexGrow:1, padding:8}}>
                        <Map mapStyle={{style: 'midnight'}} style={{width:'100%', height:'100%'}} center={{lng: 116.402544, lat: 39.928216}} zoom="11">
                            <Marker position={{lng: 116.402544, lat: 39.928216}} />
                            <MapInit />
                        </Map>

                    </div>
                    <div className='laycolumn lshadow'>
                        <div className='bshadow'></div>
                        <div className='bshadow'></div>
                        <div ></div>
                    </div>

                </div>
                <div className='bottom'>
                    {this.getDayLink()}

                </div>

            </Layout>
        );
    }
}