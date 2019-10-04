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

const linkDivider = ''

function RoutePage() {
    return(
        <Router>
            <div className="App-header">
                <ul>
                    <Link to="/" className="Header-link" >Home</Link>
                    {linkDivider}
                    <Link to="/New" className="Header-link">Create Study</Link>
                    {linkDivider}
                    <Link to="/Open" className="Header-link">Open Study</Link>
                    {linkDivider}
                    <Link to="/Test" className="Header-link">Test</Link>
                </ul>

                <hr />
                <Route exact path="/" component={Homepage} />
                <Route path="/New" component={Newpage} />
                <Route path="/Open" component={Openpage} />
                
                <Route path="/Test" component={Testpage} />
            </div>
        </Router>

    );
}


export {RoutePage};