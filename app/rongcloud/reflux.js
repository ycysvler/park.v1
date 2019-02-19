import Reflux from 'reflux';
import propx from '../http/proxy';
import Config from 'config';

const RongCloudActions = Reflux.createActions([
        'token',
        'new',
        'remove',
        'transfer'
    ]
);

const RongCloudStore = Reflux.createStore({
    listenables: [RongCloudActions],

    token: null,
    messages:[],

    // 刷新列表
    onToken: function (id, name) {
        let self = this;

        let url = Config.url + "/service/user/getToken";

        let param = {id:id, name:name,"portrait":"http://www.rongcloud.cn/images/logo.png"};

        propx.post(url,param, (code, data)=>{

            if(data.statusCode === 200){

                if(data.body.code === 200){
                    document.log('rongcloud > gettoken > ', param);
                    // 没有数据
                    self.token = data.body.token;

                    self.trigger('token', data.body);
                }
            }

        });
        // url = Config.base + "/api/rongcloud/token";
        // propx.get(url, param, (code, data) => {
        //     document.log('rongcloud > gettoken > ', param);
        //     // 没有数据
        //     self.token = data;
        //
        //     console.log('typeof ', typeof data);
        //
        //     self.trigger('token', data);
        // });
    },

    onNew:function(msg){
        this.messages.push(msg);
        this.trigger('new', this.messages);
    },

    onRemove:function(index){
        this.messages.splice(index, 1);
        this.trigger('new', this.messages);
    },

    onClear: function () {
        this.items = [];

        this.trigger('getList', {total: 0, list: this.items, param: this.list_param});
    }
});


exports.RongCloudActions = RongCloudActions;
exports.RongCloudStore = RongCloudStore;
