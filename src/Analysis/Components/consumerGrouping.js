import React, { useState, useEffect } from 'react'
import { consumerClusters } from '../Methods/kmode.js'
import Popup from "reactjs-popup";
import Chart from "react-apexcharts";
import StudyTable from '../../Study_CRUD/StudyTable.js';
import ReactDataSheet from 'react-datasheet';

function ConsumerGroups({ study, setStudy, close }) {
    const [clusters, setClusters] = useState(null);
    const [k, setK] = useState(0);
    //let varType = [1, 1, 0, 1, 1, 1];


    ///////////////////////////Variables to define in advanced settings////////////////////////////
    // let categIndices = consumerData[0].length + 1; //this can be changed in advanced settings
    let onlyCateg = 1; //this can be changed in advanced settings
    ///////////////////////////////////////////////////////////////////////////////////////////////

    // manually define categs, ex. categIndices = [1, 3]

    return (
        <>
            <KSelector k={k} setK={setK} />
            <Genetator k={k} study={study} setClusters={setClusters} />
            <SaveToStudy clusters={clusters} study={study} setStudy={setStudy} />
            {clusters !== null && <ClusterTables clusters={clusters} study={study} />}
        </>
    );
}





function KSelector({ k, setK }) {
    const ks = [0, 2, 3, 4, 5];
    const label = 'Clusters: ' + (k === 0 ? 'Auto' : k);
    return (
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
                            {<div onClick={event => { setK(value); close(); }}>
                                {value === 0 ? 'Auto' : value}
                            </div>}
                        </ul>
                    })}
                </>
            )}
        </Popup>
    )
}

function Genetator({ k, study, setClusters }) {
    return (<button
        className="button_pop"
        onClick={() => {
            let consumerData = study.getConsumerTabular(1);
            let varType = study.isQuantFull('consumer', 1);
            setClusters(consumerClusters(consumerData, k, varType));
        }}
    >
        Generate
        </button>
    );

}

const contentStyle = {
    background: "#F0F0F0",
    width: "400px",
    border: "none"
};
function SaveToStudy({ clusters, study, setStudy }) {
    if (clusters === null) {
        return (<Popup trigger={<button className="button_pop">Save to study</button>}
            closeOnDocumentClick
            mouseLeaveDelay={30}
            mouseEnterDelay={0}
            on='hover'
            contentStyle={{ padding: "0px", border: "none" }}
        >
            <span className="DeleteStudy_inactive">Generate to save</span>
        </Popup>);
    } else {
        return (<Popup
            trigger={<button className="button_pop">Save to study</button>}
            modal
            contentStyle={contentStyle}
        >{close => (
            <button className="button_pop"
                onClick={() => {
                    setStudy(study.addPersona('consumer', LabelArray(clusters), true));
                    close();
                }}>
                Save
            </button>
        )}
        </Popup>);
    }
}

function LabelArray(clusters) {
    const mapping = {};
    let cat = 'A';
    return clusters.map(val => {
        let clust = String(val);
        if (Object.keys(mapping).indexOf(clust) === -1) {
            mapping[clust] = cat;
            cat = String.fromCharCode(cat.charCodeAt(0) + 1);
        }
        return mapping[clust];
    });
}


function ClusterTables({ clusters, study }) {
    clusters = LabelArray(clusters);
    const offset = 1;
    const uniques = [];
    let counts = {};
    clusters.forEach((cluster, i) => {
        if (uniques.indexOf(cluster) === -1) {
            uniques.push(cluster);
            counts[cluster] = 0;
        }
        let c = counts[cluster] + 1;
        counts[cluster] = c;
    })
    const tabular = study.getConsumerTabular(offset);
    const stats = {};

    uniques.forEach(cluster => {
        let clusterData = tabular.filter((row, index) => (clusters[index] === cluster));
        let clusterStats = new Array(clusterData[0].length).fill(0).map(() => { return ({ category: '', stat: 0 }) });
        let nrConsumers = clusterData.length;
        for (let c = 0; c < clusterStats.length; c++) {
            if (study.isQuant('consumer', c + offset)) {
                let maxVal = -Infinity, minVal = Infinity;
                for (let r = 0; r < nrConsumers; r++) {
                    clusterStats[c].stat += clusterData[r][c] / nrConsumers;
                    maxVal = clusterData[r][c] > maxVal ? clusterData[r][c] : maxVal;
                    minVal = clusterData[r][c] < minVal ? clusterData[r][c] : minVal
                }
                clusterStats[c].stat = Math.round(clusterStats[c].stat * 10) / 10;
                clusterStats[c].category = 'Spread: ' + String(Math.round(maxVal - minVal));
            } else {
                let catStats = {};
                for (let r = 0; r < nrConsumers; r++) {
                    if (Object.keys(catStats).indexOf(String(clusterData[r][c])) === -1) {
                        catStats[clusterData[r][c]] = 0;
                    }
                }
                for (let r = 0; r < nrConsumers; r++) {
                    catStats[clusterData[r][c]] += 1;
                }
                let peak = Math.max(...Object.values(catStats));
                clusterStats[c].stat = String(Math.round(peak / nrConsumers * 1000) / 10) + '%';
                clusterStats[c].category = Object.keys(catStats)[Object.values(catStats).indexOf(peak)];
            }
        }
        stats[cluster] = clusterStats;
    })

    return (<div>
        {uniques.map((label, index) => {
            return <ul key={index}><LabelTable label={label} count={counts[label]} stats={stats[uniques[index]]} study={study} offset={offset}/>
            </ul>
        })}
        <span>{uniques}</span>
    </div>);
}

const valueify = x => { return { value: x } };

function LabelTable({ label, count, stats, study, offset}) {

    const descriptions = stats.map(val => val.category)
    const ratios = stats.map(val => val.stat)
    const headers = study.getConsumerHeader(offset).map(valueify);
    const tableData = [headers,[...descriptions].map(valueify), [...ratios].map(valueify)];


    return (<div>
        <span>{label +' '+String(count)+ ':'}</span>
        <ReactDataSheet
            data={tableData}
            className="Table-fix2"
            valueRenderer={(cell) => cell.value}
        />
    </div>
    );
}



function makeConsumerTable(consumer, clusterID, clusterChoice, study) {
    //clusterID= output från k-means, consumer= consumertabellen, clusterChoice= vilket cluster man vill titta på.
    let displayTable = [];
    displayTable[0] = study.getConsumerHeader();
    let i;
    for (i = 1; i < clusterID.length + 1; i++) {
        if (clusterID[i] === clusterChoice) displayTable.push(consumer[i]);
    }
    //console.log('displaytable')
    //console.log(displayTable)
    return displayTable;
}

//clusteredConsumers
function displayConsumerTable(clusteredConsumers) {
    //console.log('clusteredTable')
    //console.log(clusteredConsumers)
    return (
        <>
            <br></br>
            <header className="Table-fix">
                <br></br>
                Consumerdata cluster A
            <StudyTable
                    tableKey={'_cons'}
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


function makeSeries(clustersLabels, k, data, headers) {
    const options = {
        chart: {
            zoom: {
                enabled: true,
                type: 'xy'
            }
        },
        xaxis: {
            tickAmount: 10,
            labels: {
                formatter: function (val) {
                    return parseFloat(val).toFixed(1)
                }
            }
        },
        yaxis: {
            tickAmount: 7
        }
    };
    let series = [];
    for (let s = 0; s < k; s++) {
        series.push({
            name: headers[s],
            data: []
        })
    }
    for (let r = 0; r < clustersLabels.length; r++) {
        series[clustersLabels[r]].data.push(data[r])
    }
    //console.log('series:')
    //console.log(series)
    return (
        <Chart options={options} series={series} type="scatter" className="Cluster-chart" width="98%" height="350" />

    )
}


function setData(input, indices) {
    var i = 0, c = 0;
    var data = [];
    let row = [];
    for (i = 0; i < input.length; i++) {
        row = [];
        for (c = 0; c < indices.length; c++) {
            row.push(input[i][indices[c]])
        }
        data.push(row);
    }
    return data;
}




function ParameterSelector({ paramList, param, setParam }) {
    const label = param === null ? 'Select Parameter' : 'Analyzing: ' + param;
    return (
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
                            {<div onClick={event => { setParam(value); close(); }}>
                                {value}
                            </div>}
                        </ul>
                    })}
                </>
            )}
        </Popup>
    )
}








export default ConsumerGroups


























   // return <input type="button" value="Ctrl+Z" onClick={close}/>
    //let recipe = study.getRecipe()
    //recipe[0][0]
    //rows = recipe.length
    // cols = recipe[0].length