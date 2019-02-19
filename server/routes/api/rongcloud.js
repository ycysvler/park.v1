let moment = require('moment');
let uuid = require('uuid');
let path = require('path');
let http = require('http');
let fs = require('fs');

let RongSDK = require('rongcloud-sdk')({
    appkey: '82hegw5u8yp1x',
    secret: 'X4mPU3wErphS'
});

let User = RongSDK.User;

module.exports = function (router) {

    // PaaS -> token
    router.get('/rongcloud/token', (req, res, next) => {
        var user = {
            id: 'ujadk90ha',
            name: 'Maritn',
            portrait: 'http://7xogjk.com1.z0.glb.clouddn.com/IuDkFprSQ1493563384017406982'
        };

        if(req.query.id){
            user.id = req.query.id;
        }
        if(req.query.name){
            user.name = req.query.name;
        }

        User.register(user).then(result => {
            console.log(result);
            res.send(result);
        }, error => {
            console.log(error);
        });
    });


}