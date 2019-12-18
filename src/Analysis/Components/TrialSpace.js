import React from 'react'
import Chart from "react-apexcharts";

// Only displays the recipe space
function TrialSpace({ study, setStudy, close }) {
    const headers = study.getHeader('recipe',1);
    const tableData = study.getTabular('recipe',1);
    const labels = study.getTabular('recipe').map(val => val[0]);

    const options = {

        xaxis: {
            tickAmount: 2,
            type: 'numeric',
            labels: {
                formatter: function (val) {
                    return parseFloat(val).toFixed(2)
                }
            },
            title: {
                text: headers[0]
            }
        },
        yaxis: {
            tickAmount: 2,
            type: 'numeric',
            labels: {
                formatter: function (val) {
                    return parseFloat(val).toFixed(2)
                }
            },
            title: {
                text: headers[1]
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

    let series = {};
    let limits = {x: {min: Infinity, max: -Infinity}, y: {min: Infinity, max: -Infinity}}
    
    for (let r = 0; r < labels.length; r++) {
        let xval = tableData[r][0];
        let yval = tableData[r][1];
        if(xval > limits.x.max){
            limits.x.max = xval
        }
        if(xval < limits.x.min){
            limits.x.min = xval
        }
        if(yval > limits.y.max){
            limits.y.max = yval
        }
        if(yval < limits.y.min){
            limits.y.min = yval
        }
        
        let label = labels[r]
        if (series[label]) {
            series[label].data.push([...tableData[r]])
        } else {
            series[label] = { name: String(label), type: 'scatter', data: [[...tableData[r]]] };
        }
    }

    let xspread = (limits.x.max - limits.x.min)/10
    let yspread = (limits.x.max - limits.x.min)/10
    options.xaxis.max = limits.x.max + xspread
    options.xaxis.min = limits.x.min - xspread
    options.yaxis.max = limits.y.max + yspread
    options.yaxis.min = limits.y.min - yspread



    return (
        <Chart className="Cluster-chart" options={options} series={Object.values(series)} type="scatter" height="350" />
    )
}

export default TrialSpace;