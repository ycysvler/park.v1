/**
 * Created by yanggang on 2017/3/6.
 */
var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser')
var favicon = require('serve-favicon');
var cors = require('cors');
var loader = require('./server/loader');
var log4js = require('log4js');

log4js.configure({
    appenders: {
        out: { type: 'stdout' },//设置是否在控制台打印日志
        info: { type: 'file', filename: './logs/info.log',layout:{type: 'pattern',pattern: '%m'} }
    },
    categories: {
        default: { appenders: [ 'out', 'info' ], level: 'info' }//去掉'out'。控制台不打印日志
    }
});

var logger = log4js.getLogger('info');
let logcontent =JSON.stringify({server:'server01',interface:'int1',param:{name:'haha',age:23}, desc:'this is deacription'});
logger.error(logcontent);

var app = express();


console.log(__dirname);
//app.use(compression())
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session({
    name:'sid.dovelet',
    cookie:{ path: '/', httpOnly: true, maxAge: 1000*60*60*24*10 },
    secret: 'K5EfWMujNTunxFlOfDT3PP7NPLY',
    resave: false,
    saveUninitialized: true
}));

var corsOptionsDelegate = function(req, callback){
    var corsOptions;
    corsOptions = {
        origin: req.headers.origin,
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true // Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted.
    };
    callback(null, corsOptions); // callback expects two parameters: error and options
};
// 处理跨域
app.use(cors(corsOptionsDelegate));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());

// paas 相关接口
app.use('/vsb/api', loader(path.join(__dirname, './server/routes/api'), true));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/vsb/*', function (req, res) {
     res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


var PORT = process.env.PORT || 8071;
app.listen(PORT, function() {
    console.log('Express server running at localhost:' + PORT);
});


