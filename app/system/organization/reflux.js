import Reflux from 'reflux';
import $ from 'jquery';
import Config from 'config';
import propx from '../../http/proxy';

const OrgActions = Reflux.createActions([
    'getList'
    ]
);

const OrgStore = Reflux.createStore({
    listenables: [OrgActions],

    //获取用户列表
    onGetList: function (pageIndex, pageSize) {
        let self = this;

        let url = Config.url + "/staffservice/organization/list";

        let param = {pageIndex:pageIndex, pageSize:pageSize};

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
    }

});


exports.OrgActions = OrgActions; 
exports.OrgStore = OrgStore;
