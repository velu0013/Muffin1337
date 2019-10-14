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
import {Analysispage} from './Analysis.js';
import {Testpage} from '../test.js';
import logo from '../img/vonkansmuffin.svg';

const Home = '/'
const Stud = '/MyStudies'
const Edit = '/Edit'
const Anys = '/Analysis'
const Test = '/Test'

function RoutePage() {
    const [study, setStudy] = useState(new StudyDBT())
    const [hi, ha] = ["Header-link", "Header-link-active"]
    const [web, setPath] = useState(window.location.pathname)
    return(
        <div className="App">
        <Router>
            <div className="Header-bar">   
                <ul >
                <Link to="/" className="Header-link" ><img src={logo} className="App-logo-header" alt="logo" /> </Link>
                    <Link to={Home} className={Home===web?ha:hi} onClick={event => setPath(Home)}>
                        Home
                    </Link>
                    <Link to={Stud} className={Stud===web?ha:hi} onClick={event => setPath(Stud)}>
                        My Studies
                    </Link>
                    <Link to={Edit} className={Edit===web?ha:hi} onClick={event => setPath(Edit)}>
                        Edit Study
                    </Link>
                    <Link to={Anys} className={Anys===web?ha:hi} onClick={event => setPath(Anys)}>
                        Analyze
                    </Link>
                    <Link to={Test} className={Test===web?ha:hi} onClick={event => setPath(Test)}>
                        Test
                    </Link>
                </ul>
            </div>
            <div className="App-body">
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
        </Router>
        </div>
    );
}


export {RoutePage};