/* Version 1.1
 * 
 *
 *
 */

import React, {useState} from "react";
import {BrowserRouter as Router, Route, Link, useLocation} from "react-router-dom";
import StudyDBT from './Study.js';
import {Homepage} from './Home.js';
import {Openpage} from './Open.js';
import {Editpage} from './Edit.js';
import {Analysispage} from './Analysis.js';
import {Muffinpage} from './Muffingroup.js';
import {Testpage} from '../test.js';
import logo from '../img/vonkansmuffin.svg';

const Home = '/'
const Stud = '/MyStudies'
const Edit = '/Edit'
const Anys = '/Analysis'
const Test = '/Test'

const Muff = '/MuffinGroup'

function RoutePage() {
    const [study, setStudy] = useState(new StudyDBT())
    const web = useLocation().pathname
    return(
        <div className="App">
            <div className="Header-bar">   
                <ul >
                    <Link to={Muff} className="Header-link" ><img src={logo} className="App-logo-header" alt="logo" /> </Link>
                    <Link to={Home} className={Home===web?"Header-link-active":"Header-link"}>
                        Home
                    </Link>
                    <Link to={Stud} className={Stud===web?"Header-link-active":"Header-link"}>
                        My Studies
                    </Link>
                    <Link to={Edit} className={Edit===web?"Header-link-active":"Header-link"}>
                        Edit Study
                    </Link>
                    <Link to={Anys} className={Anys===web?"Header-link-active":"Header-link"}>
                        Analyze
                    </Link>
                    <Link to={Test} className={Test===web?"Header-link-active":"Header-link"}>
                        Test
                    </Link>
                </ul>
            </div>
            <div className="App-body">
                <Route path="/MuffinGroup">
                    <Muffinpage/>
                </Route>
                <Route exact path="/">
                    <Homepage/>
                </Route>
                <Route path="/MyStudies">
                    <Openpage study={study} setStudy={setStudy}/>
                </Route>   
                <Route path="/Edit"> 
                    <Editpage study={study} setStudy={setStudy}/>
                </Route>
                <Route path="/Analysis">
                    <Analysispage study={study} setStudy={setStudy}/>
                </Route>             
                <Route path="/Test" component={Testpage} />
                
            </div>
        </div>
    );
}


export {RoutePage};