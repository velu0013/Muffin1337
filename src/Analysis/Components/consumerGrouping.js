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
    const uniques = [], counts = {};
    clusters.forEach((cluster, i) => {
        if (uniques.indexOf(cluster) === -1) {
            uniques.push(cluster);
            counts[cluster] = 0;
        }
        counts[cluster]++;
    })
    const tabular = study.getConsumerTabular(offset);
    const stats = {};

    uniques.forEach(cluster => {
        
    })



    uniques.forEach((val, i) => {
        stats[String(val)] = new Array(tabular[0].length).fill({ category: '', stat: 0 });
    })
    console.log('Before')
    console.log(stats)
    for (let c = 0; c < tabular[0].length; c++) {
        if (study.isQuant('consumer', c + offset)) {
            for (let r = 0; r < tabular.length; r++) {
                stats[String(clusters[r])][c].stat += tabular[r][c] / counts[clusters[r]]
            }
        } else {
            let categories = [];
            for (let r = 0; r < tabular.length; r++) {
                if (categories.indexOf(tabular[r][c]) === -1) {
                    categories.push(tabular[r][c])
                }
            }
            uniques.forEach((cluster, i) => {
                cluster = String(cluster);
                let catCount = {}, tot = 0;
                categories.forEach(cat => {
                    catCount[String(cat)] = 0;
                })
                for (let r = 0; r < tabular.length; r++) {
                    catCount[String(tabular[r][c])] += 1;
                    tot++;
                }
                categories.forEach((cat, i) => {
                    if (catCount[String(cat)] > stats[cluster][c].stat) {
                        stats[cluster][c].category = cat;
                        stats[cluster][c].stat = catCount[String(cat)]
                    }
                });
                stats[cluster][c].stat = Math.round(stats[cluster][c].stat * (100 / tot))
            })
        }
    }
    console.log('After')
    console.log(stats)

    return (<div>
        <DisplayHeaders study={study} offset={offset} />
        <br></br>
        {uniques.map((label, index) => {
            return <ul key={index}><LabelTable label={label} stats={stats[uniques[index]]} />
            </ul>
        })}
        <span>{uniques}</span>
    </div>);
}

const valueify = x => { return { value: x } };

function DisplayHeaders({ study, offset }) {
    const headers = [study.getConsumerHeader(offset).map(valueify)];
    return (<ReactDataSheet
        data={headers}
        className="Table-fix2"
        valueRenderer={(cell) => cell.value}
    />)
}



function LabelTable({ label, stats }) {

    const descriptions = stats.map(val => val.category)
    const ratios = stats.map(val => val.stat)

    const tableData = [[...descriptions].map(valueify), [...ratios].map(valueify)];


    return (<div>
        <span>{label + ':'}</span>
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