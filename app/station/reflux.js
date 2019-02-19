import Reflux from 'reflux';
import propx from '../http/proxy';
import Config from 'config';

const StationActions = Reflux.createActions([
    'single',
    'getList',
    'refresh',
    'getInfo',
    'showInfo'
    ]
);

const StationStore = Reflux.createStore({
    listenables: [StationActions],

    current: null,
    items: [],

    // 刷新列表
    onRefresh:function(){
        let self = this;

        let url = Config.url + "/staffservice/organization/list";

        let param = this.list_param;

        propx.post(url,param, (code, data)=>{
            document.log('police > reflux > refresh > param & code & data' , param, code, data);

            let total = 0;
            // 没有数据
            if(data.statusCode=== 404){
                self.items = [];
            }
            else{
                self.items = data.body.list;
                total = data.body.total;
            }

            self.trigger('refresh', {total: total, list: self.items, param:param});
        });
    },

    onGetList: function (param) {

        let self = this;


        let items = [
            {
                id: 23,
                name: '大屯派出所',
                letter: '字母',
                images: '',
                shortName: '大派',
                parentId:2,
                parentName:'朝阳分局',
                sort: 2,
                type: 3,
                status: 1,
                address: '通顺路马坡镇马坡花园',
                contact: '通顺路马坡镇马坡花园',
                phone: '13811107022',
                phoneList: '13811107022',
                bdLng: 116.432544,
                bdLat: 39.928216,
            },
            {
                id: 24,
                name: '北苑派出所',
                letter: '字母',
                images: '',
                shortName: '北派',
                parentId:2,
                parentName:'朝阳分局',
                sort: 2,
                type: 2,
                status: 1,
                address: '通顺路马坡镇马坡花园',
                contact: '通顺路马坡镇马坡花园',
                phone: '13811107022',
                phoneList: '13811107022',
                bdLng: 116.442544,
                bdLat: 39.938216,
            },
        ];

        let url = Config.url + "/staffservice/organization/list";

        param.pageSize = 6;

        this.list_param = param;

        propx.post(url, param, (code, data) => {
            document.log('station > reflux > getList > param & code & data', param, code, data);

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

    getStationTypeText: function (code) {
        let result = "";
        switch (code) {
            case 0:
                result = "未知";
                break;
            case 1:
                result = "市局";
                break;
            case 2:
                result = "分局";
                break;
            case 3:
                result = "派出所";
                break;
            case 4:
                result = "大队";
                break;
            case 5:
                result = "其他";
                break;
        }

        return result;
    },
});


exports.StationActions = StationActions;
exports.StationStore = StationStore;
