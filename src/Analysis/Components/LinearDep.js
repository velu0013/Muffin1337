import React, { useState , useEffect} from 'react'
import {LinearCoefficients} from '../Methods/LinearCoefficients.js'
import Popup from "reactjs-popup";
import Chart from "react-apexcharts";

function LinearDep({study, close}){
    const [param, setParam] = useState(null)
    return(
        <>
        <ParameterSelector paramList={study.getHeader('consumer')} param={param} setParam={setParam} />
        {param !== null && PreferenceChart(param, study, LinearCoefficients(study.getTabular('preference'), study.getTabular('recipe')))}
        </>
    )
}



function ParameterSelector({paramList, param, setParam}){
    const label = param===null?'Categorize as':'Showing: '+param;
	return(
        <Popup trigger={<button className="button_pop">{label}</button>} 
            position={'right top'}
            closeOnDocumentClick
            mouseLeaveDelay={30}
            mouseEnterDelay={0}
            on='hover'
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
        >
		{close => (
            <>
            {paramList.map((value, index) => {
                return <ul key={index} className="dropdown-item">
                    {<div onClick={event => {setParam(value); close();}}>
                        {value}
                    </div>}
                </ul>
            })}
            </>
        )}
        </Popup>
	)
}

function PreferenceChart(param, study, k){
    const options= {
            chart: {
                zoom: {
                    enabled: true,
                    type: 'xy'
                }
            },
            xaxis: {
                tickAmount: 10,
                labels: {
                    formatter: function(val) {
                        return parseFloat(val).toFixed(1)
                    }
                }
            },
            yaxis: {
                tickAmount: 7
            }
        };
    const clustersLabels = study.getTabular('consumer').map((v, i) => v[study.getHeader('consumer').indexOf(param)])
    let series = {};
    for (let r=0; r<clustersLabels.length; r++){
        let label = clustersLabels[r]
        if(series[label]){ 
            series[label].data.push([k[r][1], k[r][2]])
        }else{
            series[label] = {name: label, data: [[k[r][1], k[r][2]]]};
        }
    }
    return(
        <Chart options={options} series={Object.values(series)} type="scatter" height="350" />
    )
}


export default LinearDep