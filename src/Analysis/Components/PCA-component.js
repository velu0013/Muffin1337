import React from 'react';
import {PCA1,PCA2,Loading} from '../Methods/PCA-test'
import Chart from "react-apexcharts";

//Tar in preference-tabellen och räknar ut egenvärdet/egenvektorerna

function PCAcomp(study) {
    const data = study.study.getTabular('preference')
    const data5 = study.study.getPreferenceHeader()
    const data2 = PCA2(data)
    const test = Loading(data5)
    
    const test2 = LoadingCalc(data2,test)
    const res1= 
        data2.map(({vector})=>(vector))
    
    const xaxis = res1[0]
    const yaxis = res1[1]
    const score = Dot(data,xaxis,yaxis)
    return(
    <>
    Scoreplot
    {PCAchart(score)}
    <br></br>
    Loadingplot
    {Loadingchart(test2)}
    </>
    )
}

//En funktion som tar datapunkterna samt de två första egenvektorerna.
//Alla datapunkter blir projicerade på de två egenvektorerna och utifrån dessa beräknas scores
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
    
    
    
    
    //console.log('series')
    //console.log(seriescol)
    return(
        <Chart options={options} series={series} type="scatter" className="Cluster-chart"  width="98%" height="350"/>

    )
}
function Dotproduct(tal1,tal2){
    var i; 
    const prod = []
    var prod1 = 0
    for(i=0; i<tal1.length; i++){
        prod1= prod1 + (tal1[i]*tal2[i])
        
    }
    prod.push(prod1)
    return prod
}


function LoadingCalc(eig, load) {
    const loadinglist1 = []
    const loadinglist2 = []
    var i;
    const eigenval= 
        eig.map(({eigenvalue})=>(eigenvalue))
    const eigenvec= 
        eig.map(({vector})=>(vector))
    const axel=
        load.map(({axis})=>(axis))
    const name=
        load.map(({name})=>(name))
    for(i=0; i<2; i++){
        var j;
        var loading = []
        for(j=0; j<axel.length; j++){
            loading.push((Dotproduct(eigenvec[i],axel[j])/eigenval[j]))
        
        }
        loadinglist1.push(loading)
    }
    const testlist = []
    for(i=0; i<loadinglist1[0].length; i++) {
         testlist.push([loadinglist1[0][i],loadinglist1[1][i]])
        //loadinglist2.push({name:name[i], data: cor})

    }
    loadinglist2.push({name: 'John',data:testlist })
    return loadinglist2
}

function Loadingchart(loading) {
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
    return(
    <Chart options={options} series={loading} type="scatter" className="Cluster-chart"  width="98%" height="350"/>
    )
}

export default PCAcomp

