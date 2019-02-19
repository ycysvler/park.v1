import React from 'react';
import ReactDOM from "react-dom";
import {HashRouter as Router,Redirect, Switch, Route} from 'react-router-dom';


import {Main} from './main/main.js';
import {WellCome} from './wellcome/index.js';
import {Login} from './login/login.js';
import {MapDemo} from './map/index.js';
import {RongCloudDemo} from './rongcloud/index';

import './index.less';

ReactDOM.render((
    <Router>
        <Switch>
            <Redirect exact from='/' to='/login'/>
            <Route path="/login" component={Login}/>
            <Route path="/main" component={Main}/>
            <Route path="/map" component={MapDemo}/>
            <Route path="/wellcome" component={WellCome}/>
            <Route path='/rong' component={RongCloudDemo}/>
        </Switch>
    </Router>
), document.getElementById('root'));


