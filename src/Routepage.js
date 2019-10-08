/* Version 1.1
 * 
 *
 *
 */

import React, {useState} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Homepage} from './Home.js';
import {Newpage} from './New.js';
import {Openpage} from './Open.js';
import {Testpage} from './test.js';
import logo from './vonkansmuffin.svg';


function RoutePage() {
    return(
        <div className="App">
        <Router>
            <div className="Header-bar">   
                <ul >
                <Link to="/" className="Header-link" ><img src={logo} className="App-logo-header" alt="logo" /> </Link>
                    <Link to="/" className="Header-link" >Home</Link>
                    <Link to="/New" className="Header-link">My Studies</Link>
                    <Link to="/Open" className="Header-link">Edit Study</Link>
                    <Link to="/Test" className="Header-link">Test</Link>
                </ul>
            </div>
            <div className="App-body">
                <Route exact path="/" component={Homepage} />
                <Route path="/New" component={Newpage} />
                <Route path="/Open" component={Openpage} />            
                <Route path="/Test" component={Testpage} />
                
            </div>
        </Router>
        </div>
    );
}


export {RoutePage};