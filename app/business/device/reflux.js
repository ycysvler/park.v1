import Reflux from 'reflux';
import $ from 'jquery';
import Config from 'config';
import propx from '../../http/proxy';

const DeviceActions = Reflux.createActions([
    'getList'
    ]
);

const DeviceStore = Reflux.createStore({
    listenables: [DeviceActions],

    //获取用户列表
    onGetList: function (pageIndex, pageSize) {
        let self = this;

        let url = Config.url + "/service/device/list";

        let param = {pageIndex:pageIndex, pageSize:pageSize};

        propx.post(url, param, (code, data) => {
            document.log('device > reflux > getList > param & code & data', param, code, data);

            let total = 0;
            // 没有数据
            if (data.statusCode === 404) {
                self.items = [];
            }
            else {
                self.items = data.body.deviceList;
                total = data.body.total;
            }

            self.trigger('getList', {total: total, list: self.items, param: param});
        });
    }

});


exports.DeviceActions = DeviceActions; 
exports.DeviceStore = DeviceStore;
