import React, { useState , useEffect} from 'react'
import {LinearCoefficients} from '../Methods/LinearCoefficients.js'
import Popup from "reactjs-popup";
import Chart from "react-apexcharts";

const types = ['All Consumers', 'Category Average'];
const errs  = ['Absolute Error', 'Least Square'];

function LinearDep({study, close}){
    const [param, setParam] = useState(null)
    const [plot, setPlot] = useState(types[0])
    const [pow, setPow] = useState(2)
    return(
        <>
        <ParameterSelector paramList={study.getHeader('consumer')} param={param} setParam={setParam} />
        <TypeSelector plot={plot} setPlot={setPlot} />
        <PowSelector pow={pow} setPow={setPow} />
        {param !== null && PreferenceChart(plot, pow, param, study)}
        </>
    )
}

function PowSelector({pow, setPow}){
	return(
        <Popup trigger={<button className="button_pop">{errs[pow-1]}</button>} 
            position={'top top'}
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            on='hover'
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
        >
		{close => (
            <>
            {errs.map((value, index) => {
                return <ul key={index} className="dropdown-item">
                    {<div onClick={event => {setPow(index+1); close();}}>
                        {value}
                    </div>}
                </ul>
            })}
            </>
        )}
        </Popup>
	)
}



function TypeSelector({plot, setPlot}){
	return(
        <Popup trigger={<button className="button_pop">{plot}</button>} 
            position={'top top'}
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            on='hover'
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
        >
		{close => (
            <>
            {types.map((value, index) => {
                return <ul key={index} className="dropdown-item">
                    {<div onClick={event => {setPlot(value); close();}}>
                        {value}
                    </div>}
                </ul>
            })}
            </>
        )}
        </Popup>
	)
}



function ParameterSelector({paramList, param, setParam}){
    const label = param===null?'Categorize as':'Showing: '+param;
	return(
        <Popup trigger={<button className="button_pop">{label}</button>} 
            position={'top top'}
            closeOnDocumentClick
            mouseLeaveDelay={300}
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

function PreferenceChart(plot, pow, param, study){
    const k =  LinearCoefficients(study.getTabular('preference'), study.getTabular('recipe'), pow);
    const headers = study.getHeader('recipe');
    const options= {
            chart: {
                height: 1000,
                width: '100%',
                zoom: {
                    enabled: true,
                    type: 'xy'
                }
            },
            xaxis: {
                tickAmount: 5,
                type: 'numeric',
                labels: {
                    formatter: function(val) {
                        return parseFloat(val).toFixed(2)
                    }
                },
                title: {
                    text: headers[1]
                }
            },
            yaxis: {
                type: 'numeric',
                tickAmount: 5,
                labels: {
                    formatter: function(val) {
                        return parseFloat(val).toFixed(2)
                    }
                },
                title: {
                    text: headers[2]
                }
            }
        };
    const clustersLabels = study.getTabular('consumer').map((v, i) => v[study.getHeader('consumer').indexOf(param)])
    let series = {};
    let axis = [[Infinity, -Infinity],[Infinity, -Infinity]]
    for (let r=0; r<clustersLabels.length; r++){
        let label = clustersLabels[r]
        for(let dim=0; dim<2; dim++){
            if(k[r][dim+1] < axis[dim][0]){
                axis[dim][0] = k[r][dim+1]
            }
            if(k[r][dim+1] > axis[dim][1]){
                axis[dim][1] = k[r][dim+1]
            }
        }
        if(series[label]){ 
            series[label].data.push([k[r][1], k[r][2]])
        }else{
            series[label] = {name: String(label), data: [[k[r][1], k[r][2]]]};
        }
    }

    options.xaxis.min = axis[0][0]
    options.xaxis.max = axis[0][1]
    options.yaxis.min = axis[1][0]
    options.yaxis.max = axis[1][1]


    switch(types.indexOf(plot)){
        case 0: series = Object.values(series);
        console.log(series)
        break;
        case 1: series = Object.keys(series).map((label, index) => ({name: String(label), data: [transpose(series[label].data).map((value, i) => value.reduce((tot, val) => tot+(val/value.length), 0))]}) )
        console.log(series)
        break;
        default: series = Object.values(series);
    }



    return(
        <Chart className="Cluster-chart" options={options} series={series} type="scatter" height="350" />
    )
}

function transpose(matrix){
    const rows = matrix.length
    const cols = matrix[0].length
    const matT = [];
    for(let c=0; c<cols; c++){
        let matRow=[];
        for(let r=0; r<rows; r++){
            matRow.push(matrix[r][c]);
        }
        matT.push(matRow)
    }
    return matT;
}

export default LinearDep