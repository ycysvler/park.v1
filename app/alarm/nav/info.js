/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import {Layout, Button, Divider, message, Checkbox, Input ,Row,Col, Tooltip, Modal} from 'antd';
import {AlarmActions, AlarmStore} from '../reflux.js';
import ChoicePolice from './choicepolice';
import ChoiceOragnization from './choiceorganization';
import moment from 'moment';

export default class AlarmNavInfo extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe_alarm = AlarmStore.listen(this.onStatusChange.bind(this));
        this.state = {
            reject:'',
            reject_visible:false,
            info: props.info,
            police_visible: false,
            oragnization_visible: false,
            uuid:new Date().getTime()
        };
    }

    componentWillUnmount() {
        this.unsubscribe_alarm();
    }

    componentWillReceiveProps(props) {
        this.setState({police_visible: false, oragnization_visible: false});
        this.setState({info: props.info});
    }

    onStatusChange = (type, data,uuid) => {
        if (type === 'reject' && uuid === this.state.uuid) {

            message.info('已驳回！');
            this.setState({reject_visible:false});

            let param = {
                "status": 3,
                "pageIndex": 1
            };

            AlarmActions.getList(param);
        }

        if (type === 'closure' && uuid === this.state.uuid) {
            message.info('已归档！');
            let param = {
                "status": 0,
                "pageIndex": 1
            };

            AlarmActions.getList(param);
        }
    }

    componentDidMount() {
    }

    onBack = () => {
        // 设置没有选中效果
        AlarmActions.refresh();
    }

    // 获取处理结果View
    getCompleteView = () => {
        let view = null;
    }

    // 获取出警信息View
    getStageView = (item, index) => {
        let itemStyle = {marginTop:8, marginLeft:-12, paddingLeft:12, borderLeft:'solid 3px #e8e8e8'};

        switch (item.stageStatus) {
            case 0:
                return (<div key={index}>
                    <div className="spacebetween">
                        <b>派警时间：</b>
                        <span>{item.createTime}</span>
                    </div>
                    {
                        item.police ? item.police.map((police, i) => {
                            return (
                                <div key={i} className="spacebetween">
                                    <b>派警人员{i + 1}：</b>
                                    <span><a>{police.empName}</a>&nbsp;&nbsp;{AlarmStore.getPoliceStatusText(police.status)}&nbsp;&nbsp;{police.acceptTime}</span>
                                </div>
                            );
                        }) : null
                    }

                    <div className="spacebetween">
                        <b></b>
                        <span></span>
                    </div>
                </div>);
            case 1:
            return (<div key={index} style={itemStyle}>
                <div className="spacebetween">
                    <b>派警时间：</b>
                    <span>{item.createTime}</span>
                </div>
                {
                    item.police ? item.police.map((police, i) => {
                        return (
                            <div key={i} className="spacebetween">
                                <b>派警人员{i + 1}：</b>
                                <span><a>{police.empName}</a>&nbsp;&nbsp;{AlarmStore.getPoliceStatusText(police.status)}&nbsp;&nbsp;{police.acceptTime}</span>
                            </div>
                        );
                    }) : null
                }

                <div className="spacebetween">
                    <b></b>
                    <span></span>
                </div>
            </div>);
            case 12:
                return (<div key={index} style={itemStyle}>
                    <div className="spacebetween">
                        <b>支援时间：</b>
                        <span>{item.createTime}</span>
                    </div>
                    {
                        item.police ? item.police.map((police, i) => {
                            return (
                                <div key={i} className="spacebetween">
                                    <b>支援警员{i + 1}：</b>
                                    <span><a>{police.empName}</a>&nbsp;&nbsp;{AlarmStore.getPoliceStatusText(police.status)}&nbsp;&nbsp;{police.acceptTime}</span>
                                </div>
                            );
                        }) : null
                    }

                    <div className="spacebetween">
                        <b></b>
                        <span></span>
                    </div>
                </div>);
            case 11:
                return (<div key={index} style={itemStyle}>
                    <div className="spacebetween">
                        <b>驳回申请：</b>
                        <span>{item.createTime}</span>
                    </div>
                    <div className="spacebetween">
                        <b>驳回原因：</b>
                        <span>{item.remark}</span>
                    </div>

                    <div className="spacebetween">
                        <b></b>
                        <span></span>
                    </div>
                </div>);
            case 2:
                return (<div key={index} style={itemStyle}>
                    <div className="spacebetween">
                        <b>支援申请：</b>
                        <span>{item.createTime}</span>
                    </div>
                    <div className="spacebetween">
                        <b>申请警员：</b>
                        <span><a>{item.empName}</a></span>
                    </div>
                    <div className="spacebetween">
                        <b>申请理由：</b>
                        <span>{item.remark}</span>
                    </div>

                    <div className="spacebetween">
                        <b></b>
                        <span></span>
                    </div>
                </div>);
            case 3:
                return (<div key={index} style={itemStyle}>
                    <div className="spacebetween">
                        <b>提交审核：</b>
                        <span>{item.createTime}</span>
                    </div>
                    <div className="spacebetween">
                        <b>申请警员：</b>
                        <span><a>{item.empName}</a></span>
                    </div>

                    <div className="spacebetween">
                        <b></b>
                        <span></span>
                    </div>
                </div>);


            default:
                return null;
        }
    }

    // 派警
    sendPolice = () => {
        this.setState({police_visible: true});
    }

    // 移交
    sendOrganization = () => {
        this.setState({oragnization_visible: true});

    }

    // 归档
    onClosure = () => {
        AlarmActions.closure(this.state.info.alarmId, this.state.info.executeId,this.state.uuid);
    }

    // 显示驳回窗口
    onShowReject = () => {
        this.setState({reject_visible:true});
    }

    onReject = () => {
        AlarmActions.reject(this.state.info.alarmId, this.state.info.executeId, this.state.reject, this.state.uuid);

    }
    handleCancel = (e) => {
        this.setState({reject_visible:false});
    }



    render() {
        let self = this;

        return (<Layout className="infopage">
                <div className="padding-33">
                    <div className="spacebetween">
                        <h3>[{AlarmStore.getAlarmTypeText(this.state.info.alarmType)}]{this.state.info.title}</h3>

                        <Tooltip placement="right" title="显示周边的警情、警员和警所。">
                            <Checkbox>显示周边</Checkbox>
                        </Tooltip>

                    </div>
                    <div className="spacebetween">
                        <b>警情状态：</b>
                        <span
                            style={{color: AlarmStore.getStatusColor(this.state.info.status)}}>{AlarmStore.getStatusText(this.state.info.status)}</span>
                    </div>
                    <div className="spacebetween">
                        <b>报警类型：</b>
                        <span>{AlarmStore.getAlarmTypeText(this.state.info.alarmType)}</span>
                    </div>
                    <div className="spacearound margin-v-12">
                        {this.state.info.status === 3 ? <Button onClick={this.onShowReject} style={{width: 85}} type="primary">驳回</Button> : null}
                        {this.state.info.status === 0 || this.state.info.status === 1 || this.state.info.status === 2 ?
                            <Button onClick={this.sendPolice} style={{width: 85}} type="primary">派警</Button> : null}
                        {this.state.info.status === 0 || this.state.info.status === 3 || this.state.info.status === 4 ?
                            <Button onClick={this.sendOrganization} style={{width: 85}}
                                    type="primary">移交</Button> : null}
                        {this.state.info.status === 0 || this.state.info.status === 3 ?
                            <Button onClick={this.onClosure} style={{width: 85}} type="primary">归档</Button> : null}

                    </div>
                </div>
                <Divider/>
                <div className="padding-33">
                    <div className="spacebetween">
                        <h3>报警信息</h3>
                        <span></span>
                    </div>
                    <div className="spacebetween">
                        <b>警情编号：</b>
                        <span>{this.state.info.empId}</span>
                    </div>
                    <div className="spacebetween">
                        <b>报警人员：</b>
                        <span>{this.state.info.empName} - {this.state.info.empPhone}</span>
                    </div>
                    <div className="spacebetween">
                        <b>报警时间：</b>
                        <span>{moment(this.state.info.alarmTime).format('YYYY-MM-DD H:mm:ss')}</span>
                    </div>
                    <div className="spacebetween">
                        <b>案件描述：</b>
                        <span>{this.state.info.describes}</span>
                    </div>
                    <div className="spacebetween">
                        <b>案发地点：</b>
                        <span>{this.state.info.position}</span>
                    </div>
                </div>
                <Divider/>
                <div className="padding-33">
                    <div className="spacebetween">
                        <h3>出警信息</h3>
                        <span></span>
                    </div>
                    {
                        this.state.info.stage ? this.state.info.stage.map((item, index) => {
                            return self.getStageView(item, index);
                        }) : null
                    }

                </div>

                {/*<Divider/>*/}
                {/*<div className="padding-33">*/}
                    {/*<div className="spacebetween">*/}
                        {/*<h3>采集信息</h3>*/}
                        {/*<span></span>*/}
                    {/*</div>*/}

                    {/*<div className="spacebetween">*/}
                        {/*<b>完成时间：</b>*/}
                        {/*<span>2018-03-05 10:12</span>*/}
                    {/*</div>*/}
                    {/*<div className="spacebetween">*/}
                        {/*<b>处理结果：</b>*/}
                        {/*<span>团伙作案，已抓获作案分子</span>*/}
                    {/*</div>*/}
                    {/*<div className="spacebetween">*/}
                        {/*<b>图片资料：</b>*/}
                        {/*<div className="images">*/}

                            {/*<img*/}
                                {/*src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=176864112,3408693995&fm=173&app=12&f=JPEG?w=218&h=146&s=29EAF304041105D412797D9203008096"/>*/}
                            {/*<img*/}
                                {/*src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=176864112,3408693995&fm=173&app=12&f=JPEG?w=218&h=146&s=29EAF304041105D412797D9203008096"/>*/}
                            {/*<img*/}
                                {/*src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=176864112,3408693995&fm=173&app=12&f=JPEG?w=218&h=146&s=29EAF304041105D412797D9203008096"/>*/}
                            {/*<img*/}
                                {/*src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=176864112,3408693995&fm=173&app=12&f=JPEG?w=218&h=146&s=29EAF304041105D412797D9203008096"/>*/}
                            {/*<img*/}
                                {/*src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=176864112,3408693995&fm=173&app=12&f=JPEG?w=218&h=146&s=29EAF304041105D412797D9203008096"/>*/}
                            {/*<img*/}
                                {/*src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=176864112,3408693995&fm=173&app=12&f=JPEG?w=218&h=146&s=29EAF304041105D412797D9203008096"/>*/}

                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {this.props.hideback ? null :
                    <div className="spacearound "><Button onClick={this.onBack} icon="left">返回</Button></div>}

                <div className="padding-33">
                    <div className="spacebetween margin-v-8">
                        <b>&nbsp;</b>
                        <span></span>
                    </div>
                </div>

                <ChoicePolice visible={this.state.police_visible}
                              alarmId={this.state.info.alarmId}
                              executeId={this.state.info.executeId}
                ></ChoicePolice>
                <ChoiceOragnization visible={this.state.oragnization_visible}
                                    alarmId={this.state.info.alarmId}
                                    executeId={this.state.info.executeId}></ChoiceOragnization>
                <Modal title="驳回"
                       visible={this.state.reject_visible}
                       footer={null}
                       width={500}
                       onCancel={this.handleCancel}
                >
                    <Layout className="main" style={{padding:12}}>
                        <Row style={{padding:4}}>
                            <Col span={6} style={{textAlign:'right'}}>
                                <span>驳回原因</span>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={17}>
                                <Input.TextArea
                                    onChange={e=>{
                                        this.setState({reject:e.target.value})
                                    }}
                                    value={this.state.reject }
                                    placeholder="输入驳回原因"
                                    autosize={{ minRows: 2, maxRows: 4 }}
                                />
                            </Col>
                        </Row>
                        <Row style={{padding:4}}>
                            <Col span={6} style={{textAlign:'right'}}>
                                <span></span>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={17}>
                                <Button disabled={this.state.reject.length === 0}  onClick={this.onReject} type="primary">发送</Button>
                            </Col>
                        </Row>
                    </Layout>
                </Modal>
            </Layout>
        );
    }
}