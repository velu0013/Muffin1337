import React from 'react';
import {PCA1,PCA2} from '../Methods/PCA-test'
import Chart from "react-apexcharts";

//Tar in preference-tabellen och räknar ut egenvärdet/egenvektorerna

function PCAcomp(study) {
    const data = study.study.getTabular('preference')
    const data2 = PCA2(data)
    
    
    
    const res1= 
        data2.map(({vector})=>(vector))
    
    const xaxis = res1[0]
    const yaxis = res1[1]
    const score = Dot(data,xaxis,yaxis)

    return PCAchart(score)
}

function Dot(data, xaxis, yaxis) {
    const scores= []
    var i 
    for (i=0; i < data.length; i++){
        var scorerow = []
        var j
        var xscore = 0
        var yscore = 0
        for(j=0; j < data[0].length; j++){

            if (j==0) scorerow.push(data[i][0])
            
            else if(j>0) {
                
                xscore = xscore + (data[i][j]*xaxis[j-1])
                yscore = yscore + (data[i][j]*yaxis[j-1])
            }
            if(j == (data[i].length-1)) {
                scorerow.push(xscore)
                scorerow.push(yscore)
            }
        }
    scores.push(scorerow)

        
    }
    return scores
}

function PCAchart(score){
    const options= {
            chart: {
                zoom: {
                    enabled: true,
                    type: 'xy'
                }
            },
            xaxis: {
                tickAmount: 5,
                
            },
            yaxis: {
                tickAmount: 5
            }
         
        };
    let series = []
    const seriescol = []
    for(let s=0; s<score.length; s++){
        var serie1 = []
        for(let i=1; i<3; i++) {
            serie1.push(score[s][i])
        }
    //seriescol.push({name:score[s][0],data:serie1})
    seriescol.push(serie1)
    
    }
    
    series.push({name:'John',data:seriescol})
    
    
    
    
    console.log('series')
    console.log(seriescol)
    return(
        <Chart options={options} series={series} type="scatter" className="Cluster-chart"  width="98%" height="350"/>

    )
}

export default PCAcomp

