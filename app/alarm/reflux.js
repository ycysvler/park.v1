import Reflux from 'reflux';
import propx from '../http/proxy';
import Config from 'config';
import {UserActions, UserStore} from '../system/user/userapi.js';

const AlarmActions = Reflux.createActions([
        'single',
        'getList',
        'refresh',
        'getInfo',
        'police',
        'organization',
        'showInfo',
        'create',
        'clear',
        'reject',
        'send',
        'closure',
        'transfer'
    ]
);

const AlarmStore = Reflux.createStore({
    listenables: [AlarmActions],

    current: null,
    items: [],
    list_param: {},

    // 刷新列表
    onRefresh: function () {
        let self = this;

        let url = Config.url + "/alarmservice/alarm/list";

        let param = this.list_param;

        propx.post(url, param, (code, data) => {
            document.log('alarm > reflux > refresh > param & code & data', param, code, data);

            let total = 0;
            // 没有数据
            if (data.statusCode === 404) {
                self.items = [];
            }
            else {
                self.items = data.body.list;
                total = data.body.total;
            }

            self.trigger('refresh', {total: total, list: self.items, param: param});
        });
    },

    onClear: function () {
        this.items = [];

        this.trigger('getList', {total: 0, list: this.items, param: this.list_param});
    },

    // 驳回
    onReject: function (alarmId,executeId,reason, uuid) {
        this.items = [];

        let self = this;

        let url = Config.url + "/alarmservice/alarm/reject";

        let param = {alarmId: alarmId, executeId: executeId, reason: reason};

        propx.post(url, param, (code, data) => {
            document.log('alarm > reflux > reject > param & code & data', param, code, data);

            self.trigger('reject', data, uuid);
        });
    },

    // 获取列表
    onGetList: function (param) {
        let self = this;
        let items = [ ];

        let url = Config.url + "/alarmservice/alarm/list";

        param.pageSize = 6;

        this.list_param = param;

        propx.post(url, param, (code, data) => {
            document.log('alarm > reflux > getList > param & code & data', param, code, data);

            let total = 0;
            // 没有数据
            if (data.statusCode === 404) {
                self.items = [];
            }
            else {
                self.items = data.body.list;
                total = data.body.total;
            }

            self.trigger('getList', {total: total, list: self.items, param: param});
        });
    },

    onOrganization: function (alarmId,executeId) {
        let self = this;
        let url = Config.url + "/staffservice/organization/list";

        let param = {
            "pageIndex": "1",
            "pageSize": "99",
            "alarmId":alarmId,
            "executeId":executeId
        };

        propx.post(url, param, (code, data) => {
            document.log('alarm > reflux > organization > param & code & data', param, code, data);

            self.trigger('organization',
                {
                    total: data.body.total,
                    list: data.body.list,
                    param: param
                },param);
        });
    },

    // 派警
    onSend: function (alarmId, executeId, employee) {
        let self = this;

        let url = Config.url + "/alarmservice/alarm/send";

        let param = {alarmId: alarmId, executeId: executeId, employee: employee};

        propx.post(url, param, (code, data) => {
            document.log('alarm > reflux > send > param & code & data', param, code, data);

            self.trigger('send', data);
        });
    },

    // 归档
    onClosure: function (alarmId, executeId, uuid) {
        let self = this;

        let url = Config.url + "/alarmservice/alarm/closure";

        let param = {alarmId: alarmId, executeId: executeId};

        propx.post(url, param, (code, data) => {
            document.log('alarm > reflux > closure > param & code & data', param, code, data);

            self.trigger('closure', data.body, uuid);
        });
    },

    // 移交
    onTransfer: function (alarmId, executeId, orgId, type) {
        let self = this;

        let url = Config.url + "/alarmservice/alarm/transfer";

        // 关于type， 1：本系统机构、2：兄弟机构
        let param = {alarmId: alarmId, executeId: executeId, type:1, orgId: orgId};

        propx.post(url, param, (code, data) => {
            document.log('alarm > reflux > transfer > param & code & data', param, code, data);

            self.trigger('transfer', data);
        });
    },

    // 获取派警列表
    onPolice: function (alarmId, executeId) {
        let self = this;

        let url = Config.url + "/alarmservice/alarm/police";

        let param = {alarmId: alarmId, executeId: executeId, "radius": 1000000, "count": 5000000};

        propx.post(url, param, (code, data) => {
            document.log('alarm > reflux > police > param & code & data', param, code, data);

            if (data.statusCode === 404)
                data.body = [];

            self.trigger('police', data.body, param);
        });
    },

    // 查看详情，由警情列表点击单行发起
    onSingle: function (alarmId, executeId, callfrom) {
        let self = this;

        let url = Config.url + "/alarmservice/alarm/info";
        let param = {
            "alarmId": alarmId,
            "executeId": executeId
        };
        propx.post(url, param, (code, data) => {
            //document.log('alarm > flux > single', code, data);
            self.current = data.body;
            self.current.executeId = executeId;
            self.trigger('single', self.current, callfrom);
        });
    },

    onCreate: function (data) {
        let self = this;

        let url = Config.url + "/alarmservice/alarm/create";
        let param = {
            "alarmType": data.alarmType,
            "alarmTime": data.alarmTime.format(),
            "position": data.position,
            "describes": data.describes,
            "bdLng": data.bdLng,
            "bdLat": data.bdLat,
            "empName": data.empName,
            "empPhone": data.empPhone,
            "orgId":UserStore.getUser().employeeDto.orgId,
            "position": data.position,
            "fromType": "pl",
            "title": data.title
        };
        propx.post(url, param, (code, data) => {
            //document.log('alarm > flux > single', code, data);
            self.current = data;
            self.trigger('create', data);
        });
    },

    // 查看详情，由地图发起
    onShowInfo: function (id) {
        let alarm = null;
        for (let index in this.items) {
            let item = this.items[index];
            if (item.id === id) {
                alarm = item;
            }
        }
        this.current = alarm;
        this.trigger('single', alarm);
    },

    getAlarmTypeText: function (code) {
        let result = "";
        switch (code) {
            case 1:
                result = "两抢一盗";
                break;
            case 2:
                result = "刑事警情";
                break;
            case 3:
                result = "治安警情";
                break;
            case 4:
                result = "交通事故";
                break;
            case 5:
                result = "火灾事故";
                break;
            case 6:
                result = "群众救助";
                break;
            case 7:
                result = "举报投诉";
                break;
            case 8:
                result = "群体活动";
                break;
            case 9:
                result = "灾害事故";
                break;
            case 10:
                result = "其他";
                break;
        }

        return result;
    },

    getStatusText: function (code) {
        let result = "";
        switch (code) {
            case 0:
                result = "未处理";
                break;
            case 1:
                result = "处理中";
                break;
            case 2:
                result = "需支援";
                break;
            case 3:
                result = "待审核";
                break;
            case 4:
                result = "已归档";
                break;
            case 5:
                result = "已移交";
                break;
        }

        return result;
    },

    getPoliceStatusText: function (code) {
        let result = "";
        switch (code) {
            case 0:
                result = "未操作";
                break;
            case 1:
                result = "已接警";
                break;
            case 2:
                result = "已拒警";
                break;
            case 3:
                result = "提交审核";
                break;
        }

        return result;
    },

    getStatusColor: function (status) {
        switch (status) {
            case 0:
                return '#F04F69';
            case 1:
                return '#FFBB4C';
            case 2:
                return '#3987F5';
            case 3:
                return '#8DC653';
        }
    }
});


exports.AlarmActions = AlarmActions;
exports.AlarmStore = AlarmStore;
