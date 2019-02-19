import Reflux from 'reflux';
import $ from 'jquery';
import Config from 'config';
import propx from '../../http/proxy';

const UserActions = Reflux.createActions([
    'login',
    'goLogin',
    'create',
    'getList'
    ]
);

const UserStore = Reflux.createStore({
    listenables: [UserActions],

    current:null,

    getUser:function(){
        let current = this.current ? this.current : JSON.parse(sessionStorage.getItem('user'));
        return current;
    },

    onLogin: function (username, password) {
        let self = this;

        let data = {"userName":username,"userPwd":password};

        data.statusCode = 200;
        data.employeeDto = {
            "account":"ccc", //账号
            "place": "运营部",//部门
            "name": "王力",//姓名
            "position": "",//职务
            "mobile": "13811107022",//电话
            "role":[ //角色
                {"roleId":"","loginDevice":"pl_pc"}
            ]
        };

        sessionStorage.setItem('user',JSON.stringify(data));
        self.current = data.body;
        self.trigger("login",data);
        return;


        //let url = "http://10.10.212.180:8090" + "/logonserver/login/pl";
        let url = Config.url + "/logonserver/login/pl";
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify( data),
            cache: false,
            processData: false,        //不可缺参数 
            contentType:"application/json; charset=utf-8",
            beforeSend: function (xhr) {
            },
            success: function (data, status) {
                document.log('user action > login > success > data',data);

                if(data.statusCode === 200){
                    sessionStorage.setItem('user',JSON.stringify(data.body));
                    self.current = data.body;

                }

                self.trigger("login",data);
            },
            error: function (msg) {
                console.log("上传失败！");
            }
        });
    },

    onGoLogin:function () {
        this.trigger('goLogin');
    },
    //新建用户
    onCreate: function (data) {
        let self = this;

        let url = Config.url + "";
        let param = {
            "account":data.account, //账号
            "place": data.place,//部门
            "name": data.name,//姓名
            "position": data.position,//职务
            "mobile": data.mobile,//电话
            "role":[ //角色
                {"roleId":data.role,"loginDevice":"pl_pc"}
            ]
        };
        document.log(param, "========新建用户==========")
        return;
        propx.post(url,param, (code, data)=>{
            self.current = data;
            self.trigger('create', data);
        });
    },
    //获取用户列表
    onGetList: function (pageIndex, pageSize) {
        let self = this;

        let url = Config.url + "/staffservice/employee/list";

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


exports.UserActions = UserActions; 
exports.UserStore = UserStore;
