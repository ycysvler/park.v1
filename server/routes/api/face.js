let moment = require('moment');
let uuid = require('uuid');
let path = require('path');
var AipFaceClient = require("baidu-aip-sdk").face;
var http = require('http');
var fs = require('fs');


module.exports = function (router) {

    // PaaS -> test
    router.get('/test', (req, res, next) => {
        // 设置APPID/AK/SK
        var APP_ID = "11207284";
        var API_KEY = "YOLvxo1DDDX1VljwfgwmmhyR";
        var SECRET_KEY = "r9zbvGwuwYV9rtXGaetraF6lR5ONkywQ";

        // 新建一个对象，建议只保存一个对象调用服务接口
        var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);

        var image = "http://pic1.hebei.com.cn/0/14/29/00/14290025_747375.jpg";

        var imageType = "URL";

        client.search(image, imageType,'base')
            .then((result)=>{
                console.log(JSON.stringify(result));
                res.send(200, JSON.stringify(result));
            })
            .catch((err)=>{
                res.send(500, err);
            });
    });

    // PaaS -> test
    router.post('/search', (req, res, next) => {
        // 设置APPID/AK/SK
        let APP_ID = "11207284";
        let API_KEY = "YOLvxo1DDDX1VljwfgwmmhyR";
        let SECRET_KEY = "r9zbvGwuwYV9rtXGaetraF6lR5ONkywQ";

        // 新建一个对象，建议只保存一个对象调用服务接口
        var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);



        let base64Img = req.body.base64Img;
        let imageType = "BASE64";

        client.search(base64Img, imageType,'base')
            .then((result)=>{

                let criminal1 = {name:'赵明军',sex:'男',birthday:'1976-01-25',height:'170',cname:'绰号“松劲”、“绔皮”',href:'http://www.cpd.com.cn/n3547/n3649/n8233/c63417/content.html'};
                let criminal2 = {name:'闫秀玲',sex:'女',birthday:'1963-02-23',height:'165',cname:'绰号“小胖”、“大山驴”',href:'http://www.cpd.com.cn/n3547/n3649/n8233/c63353/content.html'};



                if(result.error_code === 0 && result['result']['user_list'][0]['score'] * 1 > 50){

                    let id = result['result']['user_list'][0]['user_id'];

                    let criminal = criminal1;
                    switch(id){
                        case 'qinkun':
                        case 'liyijun':
                        case 'jiangrui':
                        case 'gedongzhi':
                            criminal = criminal2;
                            break;
                    }

                    res.json(200, {
                        score:result['result']['user_list'][0]['score'],
                        id:id,
                        image:'http://127.0.0.1:8071/vsb/images/' + result['result']['user_list'][0]['user_id'] + '.jpg',
                        criminal:criminal
                    });
                }else{
                    res.send(403);
                }
            })
            .catch((err)=>{
                res.send(500, err);
            });
    });

    // PaaS -> test
    router.post('/detect', (req, res, next) => {
        // 设置APPID/AK/SK
        let APP_ID = "11207284";
        let API_KEY = "YOLvxo1DDDX1VljwfgwmmhyR";
        let SECRET_KEY = "r9zbvGwuwYV9rtXGaetraF6lR5ONkywQ";

        // 新建一个对象，建议只保存一个对象调用服务接口
        var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);

        let base64Img = req.body.base64Img;
        let imageType = "BASE64";


        client.detect(base64Img, imageType)
            .then((result)=>{
                console.log(result);
                res.json(200, result);
            })
            .catch((err)=>{
                res.send(500, err);
            });
    });
}