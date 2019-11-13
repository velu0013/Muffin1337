import React, { useState , useEffect} from 'react'
import {kmeans} from '../Methods/kmeans.js'
import Popup from "reactjs-popup";
import Chart from "react-apexcharts";

function ClusterAnalysis({study, close}){
    const [k, setK] = useState(2);
    const nrParams = 2;
    const [param, setParam] = useState(Array(nrParams).fill(null))
    let recipe = study.getRecipeTabular();
    let consumer = study.getConsumerTabular();
    let preference = study.getPreferenceTabular();
    
    let data = null;
    if(param.indexOf(null) === -1){
        let indices = [];
        for (let i=0; i < param.length; i++){
            indices.push(study.getHeader('preference').indexOf(param[i]))
        }
        data = setData(preference, indices);
    }
    
    return (
        <>
        <KSelector k={k} setK={setK}/>
        {param.map((value, index) => {
        return (<ul key={index} className="NEWCLASSHEREPLEASE">
            {<ParameterSelector paramList={study.getHeader('preference')} param={param[index]} setParam={p => setParam(new Array(nrParams).fill(0).map((v, i) => param[i]).fill(p, index, index+1))}/>}
            </ul>)
        })}
        En analys på {study.name} som delar in data i kluster. 
        {data !== null && makeSeries(kmeans(data, k),k,data,param)}
        <br></br>
        <input type="button" className="button_pop" value="Back" onClick={close}/>
        </>
    ); 
}

function makeSeries(clustersLabels, k, data, headers){
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
    let series = [];
    for(let s=0; s<k; s++){
        series.push({name: headers[s],
        data: []})
    }
    for (let r=0; r<clustersLabels.length; r++){
        series[clustersLabels[r]].data.push(data[r])
    }
    return(
        <Chart options={options} series={series} type="scatter" className="Cluster-chart"  width="98%" height="350"/>

    )
}


function setData(input, indices){
    var i = 0, c = 0;
    var data = [];
    let row = [];
    for(i = 0; i < input.length; i++){
        row = [];
        for (c = 0; c < indices.length; c++){
            row.push(input[i][indices[c]])
        }
        data.push(row);
    }
    return data;
}

function KSelector({k, setK}){
    const ks = [2,3,4,5];
    const label = 'Using k: '+k;
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
            {ks.map((value, index) => {
                return <ul key={index} className="dropdown-item">
                    {<div onClick={event => {setK(value); close();}}>
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
    const label = param===null?'Select Parameter':'Analyzing: '+param;
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

//Funk för vad som händer på onclick:

export default ClusterAnalysis

   // return <input type="button" value="Ctrl+Z" onClick={close}/>
    //let recipe = study.getRecipe()
    //recipe[0][0]
    //rows = recipe.length
    // cols = recipe[0].length


