import React, { useState } from 'react';
import Chart from "react-apexcharts";

import {method2} from '../Methods/Testanalys2_m.js'
import { SSL_OP_TLS_ROLLBACK_BUG } from 'constants';

/* images examples 
import gender from '../../img/Demo_Gender.svg';
import drink from '../../img/Demo_Drink.svg';
import trial from '../../img/Demo_TrialPlan.svg';
import age from '../../img/Demo_Age.svg'; 
*/

function Testanalys2({study, close}){
  const cstate = {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        labels:{
          style:{
            colors: '#2980b9',
            cssClass: 'Chart_bar'
          }
        }
      }
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  };




  return (
  <>
  En annan analys på {study.name} som visar att 2^3={method2(2)}
  <br></br>
  <input type="button" className="info_pop" value="Back" onClick={close}/>
  <Chart
    className="Chart_bar"
    options={cstate.options}
    series={cstate.series}
    type="bar"
    width="700"
  />
  </>
 ); 
}

export default Testanalys2;