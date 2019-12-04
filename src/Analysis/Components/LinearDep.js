import React, { useState , useEffect} from 'react'
import {LinearCoefficients} from '../Methods/LinearCoefficients.js'
import Popup from "reactjs-popup";
import Chart from "react-apexcharts";
import utils from '../../Study_CRUD/utils.js';

const ALL_CONSUMERS = 'All Consumers'
const CATEGORY_AVG = 'Category Average'
const types = [ALL_CONSUMERS, CATEGORY_AVG];
const errs  = ['Absolute Error', 'Least Square'];

function LinearDep({study, close}){
    const [param, setParam] = useState(null)
    const [plotType, setPlotType] = useState(ALL_CONSUMERS)
    const [pow, setPow] = useState(2)
    const [chartData, setChartData] = useState(null)
    const [loadinger, setloadinger] = useState(false)
    const [generate, setGenerate] = useState(false)
    const [bases, setBases] = useState(1)


    //Ändra Loadinger till true varje gång vi byter param
    useEffect(() => {
        if(generate){
            setChartData(null)
            setloadinger(true)
        }
    },[generate,study]
    );
    //Varje gång Loadinger ändras kör Predict, 
    useEffect(() => {
        const timer = setTimeout(() => {
            if(loadinger){
                setChartData(LinearCoefficients(study.getTabular('preference'), study.getTabular('recipe'), pow, bases))
                setGenerate(false)
                setloadinger(false)
            }

        }, 100);
        return () => clearTimeout(timer);
    }, [loadinger,study,param, pow, bases]
    );




    return(
        <>
        <ParameterSelector paramList={study.getHeader('consumer')} param={param} setParam={setParam} />
        <TypeSelector plotType={plotType} setPlotType={setPlotType} />
        <PowSelector pow={pow} setPow={setPow} />
        <Generator setGenerate={setGenerate} setBases={setBases} setChartData={setChartData}/>
        <br></br>
        {loadinger && utils.Loader()}
        {chartData !== null && PreferenceChart(plotType, pow, param, study, chartData)}
        </>
    )
}

function Generator({setGenerate, setBases, setChartData}){
    return(<Popup trigger={<button className="button_pop">Generate</button>} 
            position={'bottom left'}
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
            modal
        >
        {close => (
            <>
            <input value="Quick" type="button" className="button_pop"
                onClick={() => {
                setBases(2);
                setChartData(null);
                setGenerate(true);
                close();
            }}/>
            <input value="Normal" type="button" className="button_pop"
                onClick={() => {
                setBases(12);
                setChartData(null);
                setGenerate(true);
                close();
            }}/>
            <input value="Full" type="button" className="button_pop"
                onClick={() => {
                setBases(Infinity);
                setChartData(null);
                setGenerate(true);
                close();
            }}/>
            </>
        )}
        </Popup>
    );
}

function PowSelector({pow, setPow}){
	return(
        <Popup trigger={<button className="button_pop">{errs[pow-1]}</button>} 
            position={'bottom left'}
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



function TypeSelector({plotType, setPlotType}){
	return(
        <Popup trigger={<button className="button_pop">{plotType}</button>} 
            position={'bottom left'}
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
                    {<div onClick={event => {setPlotType(value); close();}}>
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
            position={'bottom left'}
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


function PreferenceChart(plotType, pow, param, study, k){
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
            series[label] = {name: String(label), type: 'scatter', data: [[k[r][1], k[r][2]]]};
        }
    }

    options.xaxis.min = axis[0][0]
    options.xaxis.max = axis[0][1]
    options.yaxis.min = axis[1][0]
    options.yaxis.max = axis[1][1]


    switch(plotType){
        case ALL_CONSUMERS: series = Object.values(series);
            break;
        case CATEGORY_AVG: {
            series = Object.keys(series)
                .map((label, index) => ({
                    name: String(label), 
                    data: [
                        transpose(series[label].data)
                            .map((value, i) => value
                                .reduce((tot, val) => tot+(val/value.length), 0))
                    ]
                }))
            break;
        }
        default: series = Object.values(series);
    }

    // series.push({
    //     name: 'vline',
    //     type: 'line',
    //     data: [
    //         {
    //         x: 0,
    //         y: options.yaxis.min
    //         }, {
    //         x: 0,
    //         y: 0
    //         }, {
    //         x: 0,
    //         y: options.yaxis.max
    //       }]
    //     });
    // series.push({
    //     name: 'hline',
    //     type: 'line',
    //     data: [
    //         {
    //         x: options.xaxis.min,
    //         y: 0
    //         }, {
    //         x: 0,
    //         y: 0
    //         }, {
    //         x: options.xaxis.max,
    //         y: 0
    //         }]
    //     });

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