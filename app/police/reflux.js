import Reflux from 'reflux';
import propx from '../http/proxy';
import Config from 'config';

const PoliceActions = Reflux.createActions([
        'single',
        'getList',
        'refresh',
        'getInfo',
        'showInfo',
        'showCommandDialog',
        'create',
        'sendInstructions'
    ]
);

const PoliceStore = Reflux.createStore({
    listenables: [PoliceActions],

    current: null,
    items: [],

    onSendInstructions:function(employee,text){
        let self = this;

        let url = Config.url + "/service/user/sendInstructions";

        let param = { "employee":employee, "text":text };

        propx.post(url, param, (code, data) => {
            document.log('police > reflux > sendInstructions > param & code & data', param, code, data);


        });
    },

    onShowCommandDialog:function(info){
      this.trigger('showCommandDialog', info);
    },
    // 刷新列表
    onRefresh: function () {
        let self = this;

        let url = Config.url + "/staffservice/employee/list";

        let param = this.list_param;

        propx.post(url, param, (code, data) => {
            document.log('police > reflux > refresh > param & code & data', param, code, data);

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

    onGetList: function (param) {
        let self = this;

        let items = [
            {
                id: 0,
                orgId: 1,
                orgName: '机构名',
                deptId: 0,
                deptName: '部门名',
                number: '9404-0943',
                name: '刘备',
                pinyin: 'liubei',
                sex: 1,
                position: '通顺路马坡镇马坡花园',
                birthday: '2018/2/25',

                bdLng: 116.432544,
                bdLat: 39.928216,

                cardNo: '230948576859484731',
                remark: '',
                workStatus: 1,
                empName: '刘备',
                phone: '13811107022',
                istemp: 0,
                portrait: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=176864112,3408693995&fm=173&app=12&f=JPEG?w=218&h=146&s=29EAF304041105D412797D9203008096',
                address: '',

            },
            {
                id: 1,
                orgId: 1,
                orgName: '机构名',
                deptId: 0,
                deptName: '部门名',
                number: '9404-0943',
                name: '张飞',
                pinyin: 'zhangfei',
                sex: 0,
                position: '北京市顺义区',
                birthday: '2018/2/25',
                bdLng: 116.412544,
                bdLat: 39.938216,
                cardNo: '230948576859484731',
                remark: '',
                workStatus: 4,
                empName: '刘备',
                phone: '13811107022',
                istemp: 0,
                portrait: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=176864112,3408693995&fm=173&app=12&f=JPEG?w=218&h=146&s=29EAF304041105D412797D9203008096',
                address: '',

            },
        ];

        let url = Config.url + "/staffservice/employee/list";

        param.pageSize = 6;

        this.list_param = param;

        propx.post(url, param, (code, data) => {
            document.log('police > reflux > getList > param & code & data', param, code, data);

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

    // 查看详情，由警情列表点击单行发起
    onSingle: function (id) {
        let temp = null;
        for (let index in this.items) {
            let item = this.items[index];
            if (item.id === id) {
                temp = item;
            }
        }
        this.current = temp;
        this.trigger('single', temp);
    },

    getWorkStatusText: function (code) {
        let result = "";
        switch (code) {
            case 0:
                result = "默认";
                break;
            case 1:
                result = "巡逻";
                break;
            case 2:
                result = "值班";
                break;
            case 3:
                result = "备勤";
                break;
            case 4:
                result = "出勤";
                break;
        }

        return result;
    },
    //新建警员
    onCreate: function (data) {
        let self = this;

        let url = Config.url + "/staffservice/employee/create";
        let param = {
            "name": data.policeName, //警员姓名
            "orgId": data.deptId, //所属单位
            "deptId": data.role, //角色
            "number": "",
            "sex": data.sex, //性别
            "position": data.position, //职务
            "birthday": "",
            "cardNo": "",
            "phone": data.phone, //联系方式
            "address": "",
            "istemp": "1",
            "remark": "",
            "portrait": "",
            "role": [
                {"roleId": "1", "loginDevice": "pl_pc"},
                {"roleId": "1", "loginDevice": "yjt_app"}
            ]
        };
        document.log(param, "========新建警员==========")
        propx.post(url, param, (code, data) => {
            self.current = data;
            self.trigger('create', data);
        });
    }
});


exports.PoliceActions = PoliceActions;
exports.PoliceStore = PoliceStore;
