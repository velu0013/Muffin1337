/* Version 1.1
 * 
 *
 *
 */

import React, {useState} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import StudyDBT from './Study.js';
import {Homepage} from './Home.js';
import {Openpage} from './Open.js';
import {Editpage} from './Edit.js';
import {Testpage} from './test.js';
import logo from './vonkansmuffin.svg';


function RoutePage() {
    const [study, setStudy] = useState(new StudyDBT('', [2,3], [3,2]))
    return(
        <div className="App">
        <Router>
            <div className="Header-bar">   
                <ul >
                <Link to="/" className="Header-link" ><img src={logo} className="App-logo-header" alt="logo" /> </Link>
                    <Link to="/" className="Header-link" >Home</Link>
                    <Link to="/MyStudies" className="Header-link">My Studies</Link>
                    <Link to="/Edit" className="Header-link">Edit Study</Link>
                    <Link to="/Test" className="Header-link">Test</Link>
                </ul>
            </div>
            <div className="App-body">
                <Route exact path="/" component={Homepage} />
                <Route path="/MyStudies">
                    <Openpage study={study} setStudy={setStudy}/>
                </Route>   
                <Route path="/Edit"> 
                    <Editpage study={study} setStudy={setStudy}/>
                </Route>          
                <Route path="/Test" component={Testpage} />
                
            </div>
        </Router>
        </div>
    );
}


export {RoutePage};