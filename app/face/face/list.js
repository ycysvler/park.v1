/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {Layout,Row,Col, Icon,Table, Breadcrumb,Button} from 'antd';
import {NotFound} from '../../notfound';
import Config from 'config';
const {Header, Footer, Sider, Content} = Layout;

export default class FaceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {items:[]};
    }

    componentWillUnmount() {
    }

    onStatusChange = (type, data) => {

    }

    componentDidMount() {

    }


    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }



    render() {
        let imgStyle={height:160, marginLeft:12, marginTop:12};
        return (<Layout>
                <Breadcrumb>
                    <Breadcrumb.Item>人脸识别</Breadcrumb.Item>
                    <Breadcrumb.Item>图像仓库</Breadcrumb.Item>
                </Breadcrumb>

                <Row>
                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/duanmu.jpg"} />
                    </Col>
                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/gengxingzhi.jpg"} />
                    </Col>
                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/qinkun.jpg"} />
                    </Col>

                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/gedongzhi.jpg"} />
                    </Col>
                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/wangbing.jpg"} />
                    </Col>
                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/liyijun.jpg"} />
                    </Col>
                </Row>
                <Row>
                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/xiaoshilei.jpg"} />
                    </Col>
                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/zhutao.jpg"} />
                    </Col>
                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/pengjilu.jpg"} />
                    </Col>

                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/tianxiaowei.jpg"} />
                    </Col>
                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/zhanghongqing.jpg"} />
                    </Col>

                    <Col span={3} offset={1}>
                        <img style={imgStyle} src={Config.base + "/images/yaojuan.jpg"} />
                    </Col>
                </Row>
            </Layout>
        );
    }
}