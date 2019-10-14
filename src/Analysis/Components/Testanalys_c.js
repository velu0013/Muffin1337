import React, { useState } from 'react';
import {method1} from '../Methods/Testanalys_m.js'

function Testanalys1({study, close}){
  return (
  <>
  Här analyseras studyn {study.name} genom testfilen som returnerar att 2*2={method1(2)}
  <br></br>
  <input type="button" value="Back" onClick={close}/>
  </>
 ); 
}

export default Testanalys1;