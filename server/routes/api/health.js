let moment = require('moment');
let uuid = require('uuid');
let path = require('path');
var AipFaceClient = require("baidu-aip-sdk").face;
var http = require('http');
var fs = require('fs');


module.exports = function (router) {

    // PaaS -> test
    router.get('/health', (req, res, next) => {
        res.json({"status":"UP"})
    });

}