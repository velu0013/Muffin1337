import React, { useState , useEffect} from 'react'
import {consumerClusters} from '../Methods/kmode.js'
import Popup from "reactjs-popup";
import Chart from "react-apexcharts";
import StudyTable from '../../Study_CRUD/StudyTable.js';

function consumerGroups({study, close}){
    let consumerData = study.getConsumerTabular();


    ///////////////////////////Variables to define in advanced settings////////////////////////////
    let categIndices = consumerData[0].length + 1; //this can be changed in advanced settings
    let onlyCateg = 1; //this can be changed in advanced settings
    ///////////////////////////////////////////////////////////////////////////////////////////////

    

    let k = 2;
    // manually define categs, ex. categIndices = [1, 3]
    
    return (
        <>
            Goddag {consumerClusters(consumerData, k)}
        </>
    ); 
}



function makeConsumerTable(consumer, clusterID, clusterChoice, study){
    //clusterID= output från k-means, consumer= consumertabellen, clusterChoice= vilket cluster man vill titta på.
    let displayTable = [];
    displayTable[0] = study.getConsumerHeader();
    let i;
        for(i = 1; i < clusterID.length + 1; i++){
            if(clusterID[i] === clusterChoice) displayTable.push(consumer[i]);
        }
    console.log('displaytable')
    console.log(displayTable)
    return displayTable;
}

//clusteredConsumers
function displayConsumerTable(clusteredConsumers){   
        console.log('clusteredTable')
        console.log(clusteredConsumers)
        return(
        <>
        <br></br>
       <header className="Table-fix">
            <br></br>
            Consumerdata cluster A
            <StudyTable 
                tableKey = {'_cons'}
                tableData={clusteredConsumers} 
            />
            <br></br>
        </header>
        </>
        )   
}
/*
                setData={x =>{
                    const newStudy = study.changeConsumer(x)
                    DB.setCurrentStudy(newStudy)
                    setStudy(newStudy)
                }}
*/


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
    console.log('series:')
    console.log(series)
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








export default consumerGroups


























   // return <input type="button" value="Ctrl+Z" onClick={close}/>
    //let recipe = study.getRecipe()
    //recipe[0][0]
    //rows = recipe.length
    // cols = recipe[0].length