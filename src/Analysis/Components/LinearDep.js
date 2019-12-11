import React, { useState, useEffect } from 'react'
import { LinearCoefficients } from '../Methods/LinearCoefficients.js'
import Popup from "reactjs-popup";
import Chart from "react-apexcharts";
import utils from '../../Study_CRUD/utils.js';

const ALL_CONSUMERS = 'All Consumers'
const CATEGORY_AVG = 'Category Average'
const types = [ALL_CONSUMERS, CATEGORY_AVG];
const errs = ['Absolute Error', 'Least Square'];

function LinearDep({ study, setStudy, close }) {
    const [param, setParam] = useState(null)
    const [plotType, setPlotType] = useState(ALL_CONSUMERS)
    const [pow, setPow] = useState(2)
    const [chartData, setChartData] = useState(null)
    const [loadinger, setloadinger] = useState(false)
    const [generate, setGenerate] = useState(false)
    const [bases, setBases] = useState(1)


    //Ändra Loadinger till true varje gång vi byter param
    useEffect(() => {
        if (generate) {
            setChartData(null)
            setloadinger(true)
        }
    }, [generate, study]
    );
    //Varje gång Loadinger ändras kör Predict, 
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loadinger) {
                setChartData(LinearCoefficients(study.getTabular('preference'), study.getTabular('recipe'), pow, bases))
                setGenerate(false)
                setloadinger(false)
            }

        }, 100);
        return () => clearTimeout(timer);
    }, [loadinger, study, param, pow, bases]
    );


    return (
        <>
            <ParameterSelector paramList={study.getHeader('consumer')} param={param} setParam={setParam} />
            <TypeSelector plotType={plotType} setPlotType={setPlotType} />
            <PowSelector pow={pow} setPow={setPow} />
            <Generator setGenerate={setGenerate} setBases={setBases} setChartData={setChartData} />
            <br></br>
            {loadinger && utils.Loader()}
            {chartData !== null && PreferenceChart(plotType, pow, param, study, chartData)}
        </>
    )
}

function Generator({ setGenerate, setBases, setChartData }) {
    return (<Popup trigger={<button className="button_pop">Generate</button>}
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
                    }} />
                <input value="Normal" type="button" className="button_pop"
                    onClick={() => {
                        setBases(12);
                        setChartData(null);
                        setGenerate(true);
                        close();
                    }} />
                <input value="Full" type="button" className="button_pop"
                    onClick={() => {
                        setBases(Infinity);
                        setChartData(null);
                        setGenerate(true);
                        close();
                    }} />
            </>
        )}
    </Popup>
    );
}

function PowSelector({ pow, setPow }) {
    return (
        <Popup trigger={<button className="button_pop">{errs[pow - 1]}</button>}
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
                            {<div onClick={event => { setPow(index + 1); close(); }}>
                                {value}
                            </div>}
                        </ul>
                    })}
                </>
            )}
        </Popup>
    )
}



function TypeSelector({ plotType, setPlotType }) {
    return (
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
                            {<div onClick={event => { setPlotType(value); close(); }}>
                                {value}
                            </div>}
                        </ul>
                    })}
                </>
            )}
        </Popup>
    )
}



function ParameterSelector({ paramList, param, setParam }) {
    const label = param === null ? 'Categorize as' : 'Showing: ' + param;
    return (
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
                            {<div onClick={event => { setParam(value); close(); }}>
                                {value}
                            </div>}
                        </ul>
                    })}
                    {paramList.indexOf('Persona') === -1 &&
                        <ul key={paramList.length} className="dropdown-item inactive">
                            {<div>
                                <utils.InfoPop info={'Use "Consumer Clustering" to generate Personas in order to use this category'} />
                                {' Persona'}
                            </div>}
                        </ul>
                    }
                </>
            )}
        </Popup>
    )
}


function PreferenceChart(plotType, pow, param, study, k) {
    const headers = study.getHeader('recipe');
    const options = {

        xaxis: {
            tickAmount: 2,
            type: 'numeric',
            min: -1,
            max: 1,
            labels: {
                formatter: function (val) {
                    return parseFloat(val).toFixed(2)
                }
            },
            title: {
                text: headers[1]
            }
        },
        yaxis: {
            tickAmount: 2,
            type: 'numeric',
            min: -1,
            max: 1,
            labels: {
                formatter: function (val) {
                    return parseFloat(val).toFixed(2)
                }
            },
            title: {
                text: headers[2]
            }
        },
        grid: {
            show: true,
            borderColor: '#90A4AE',
            strokeDashArray: 0,
            position: 'back',
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            },
            row: {
                colors: undefined,
                opacity: 0.7
            },
            column: {
                colors: undefined,
                opacity: 0.7
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        }
    };
    const clustersLabels = study.getTabular('consumer').map((v, i) => v[study.getHeader('consumer').indexOf(param)])

    let series = {};
    for (let r = 0; r < clustersLabels.length; r++) {
        let label = clustersLabels[r]
        if (series[label]) {
            series[label].data.push([k[r][1], k[r][2]])
        } else {
            series[label] = { name: String(label), type: 'scatter', data: [[k[r][1], k[r][2]]] };
        }
    }


    switch (plotType) {
        case ALL_CONSUMERS: series = Object.values(series);
            break;
        case CATEGORY_AVG: {
            series = Object.keys(series)
                .map((label, index) => ({
                    name: String(label),
                    data: [
                        transpose(series[label].data)
                            .map((value, i) => value
                                .reduce((tot, val) => tot + (val / value.length), 0))
                    ]
                }))
            break;
        }
        default: series = Object.values(series);
    }

    return (
        <Chart className="Cluster-chart" options={options} series={series} type="scatter" height="350" />
    )
}

function transpose(matrix) {
    const rows = matrix.length
    const cols = matrix[0].length
    const matT = [];
    for (let c = 0; c < cols; c++) {
        let matRow = [];
        for (let r = 0; r < rows; r++) {
            matRow.push(matrix[r][c]);
        }
        matT.push(matRow)
    }
    return matT;
}

export default LinearDep