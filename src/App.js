/* Version 1.0
 * 
 *
 *
 */

import React, { useState } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {RoutePage} from './Study_CRUD/Routepage.js';
import {Homepage} from './Study_CRUD/Home.js';


function App() {
  return (
    <Router>
      <RoutePage/>
    </Router>);
}



export default App;