/**
 * Created by zhanghongqing on 2018/4/3.
 */
import React from 'react';
import {Layout, Button, Divider, Checkbox} from 'antd';
import {StationActions, StationStore} from '../reflux.js';

export default class StationNavInfo extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = StationStore.listen(this.onStatusChange.bind(this));

        this.state = {
            info:props.info
        };
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange = (type, data) => {
        document.log('station > info > componentWillReceiveProps', props);
        this.setState({info:props.info});
    }

    componentDidMount() {
    }

    onBack=()=>{
        // 设置没有选中效果
        StationActions.refresh();
    }


    render() {
        return (<Layout className="infopage">

                <div className="padding-33">
                    <div className="spacebetween">
                        <h3>{this.state.info.name}</h3>
                        <span></span>
                    </div>
                    <div className="spacebetween">
                        <b>电话：</b>
                        <span>{this.state.info.phone}</span>
                    </div>
                    <div className="spacebetween">
                        <b>位置：</b>
                        <span>{this.state.info.address}</span>
                    </div>

                </div>

                <div className="spacearound "><Button onClick={this.onBack} icon="left" >返回</Button></div>

            </Layout>
        );
    }
}