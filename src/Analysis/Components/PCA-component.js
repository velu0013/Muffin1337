import React, {useState , useEffect} from 'react';
import {PCA1,PCA2,Loading} from '../Methods/PCA-test'
import Chart from "react-apexcharts";
import Popup from "reactjs-popup";
import utils from '../../Study_CRUD/utils.js'
import { tsPropertySignature } from '@babel/types';

/*
Problemen just nu:
Osäker ifall score beräknas utifrån det origo som bildas av de två eigenvektorerna

Svårt att få apexcharts visa graferna med samma axelproportioner. Den är alltid bredare än hög

Är osäker ifall mitt sätt att beräkna loadings är korrekt.
*/

//Tar in preference-tabellen och räknar ut egenvärdet/egenvektorerna

function PCAcomp(study,close) {
    const [param, setParam] = useState(null)
    const data = study.study.getTabular('preference')
    const data5 = study.study.getPreferenceHeader()
    const data2 = PCA2(data)
    const test = Loading(data5)
    const test2 = LoadingCalc(data2,test)
    const score = Dot(data,data2)

    const descriptionscore = "Each datapoint is projected onto a two-dimensional plane constructed to cover maximal variance. This makes it possible to graphically visualise multidimensional data and provides a useful overview"
    const descriptionloading = "Hej"
    return(
    <>
    {GetColumn(study.study.getTabular('preference')).length == GetColumn(study.study.getTabular('consumer')).length
        ?
            <>
            <utils.InfoPop info = {descriptionscore}/>  Score plot <ParameterSelector paramList={study.study.getHeader('consumer')} param={param} setParam={setParam} />
            {PCAchart(score,study,param)}
            <br></br>
            <utils.InfoPop info = {descriptionloading}/> Loadingplot
            {Loadingchart(test2)}
            </>
            :
            <>
            <b>
            The preference data and consumer data does not have the same amount of samples. If you want to perform a PCA, please make sure they have the same size
            </b>
            </>
    }
    </>
    )
}

//En funktion som tar datapunkterna samt de två första egenvektorerna.
//Alla datapunkter blir projicerade på de två egenvektorerna och utifrån dessa beräknas scores
function Dot(data, res1) {
    const scores= []
    
    const axis = 
        res1.map(({vector})=>(vector))

    const xaxis = axis[0]
    const yaxis = axis[1]
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

function PCAchart(score, study,param,){
    const options= {
            chart: {
                zoom: {
                    enabled: true,
                    type: 'xy'
                }
            },
            xaxis: {
                tickAmount: 5,
                //min: -10 || Function,
                //max: 10 || Function,
                decimalsInFloat: 1,
                title: {
                    text: "PC1"
                },
            },

            yaxis: {
                tickAmount: 5,
                //min: -10 || Function,
                //max: 10 || Function,
                decimalsInFloat: 2,
                title: {
                    text: "PC2"
                }
            }
         
        };
    const seriescol = []
    for(let s=0; s<score.length; s++){
        var serie1 = []
        for(let i=1; i<3; i++) {
            serie1.push(score[s][i])
        }
    
    seriescol.push(serie1)
    
    }
    let series = {}
    if(param === null) var clustersLabels = GetColumn(study.study.getTabular('consumer'))
    
    else var clustersLabels = study.study.getTabular('consumer').map((v, i) => v[study.study.getHeader('consumer').indexOf(param)])
    for(let s=0; s<clustersLabels.length; s++) {
        let label = clustersLabels[s]

        if(series[label]){ 
            series[label].data.push([seriescol[s][0], seriescol[s][1]])
        }else{
            series[label] = {name: String(label), data: [[seriescol[s][0], seriescol[s][1]]]};
        }
    }
    series = Object.values(series);
    console.log('series')
    console.log(series)
    return(
        <Chart options={options} series={series} type="scatter" className="Cluster-chart"  />

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
            loading.push((Dotproduct(eigenvec[i],axel[j])/eigenval[i]))
        
        }
        loadinglist1.push(loading)
        
    }
    for(i=0; i<loadinglist1[0].length; i++) {
        var cor = [loadinglist1[0][i],loadinglist1[1][i]]
        loadinglist2.push({name:name[i], data: [cor]})

    }
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
            tickAmount: 2,
            //min: -1 || Function,
            //max: 1 || Function,
            //decimalsInFloat: 1
        },
        yaxis: {
            tickAmount: 2,
            //min: -1 || Function,
            //max: 1 || Function,
            //decimalsInFloat: 1
            
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
    }
    
    return(
    <Chart options={options} series={loading} type="scatter" className="Cluster-chart"  width="100%" height="350"/>
    )
}

function GetColumn(data){
    const col = []
    for(let i=0; i<data.length; i++){
        col.push(data[i][0])
        
    }
    return col
}

function ParameterSelector({paramList, param, setParam}){
    const label = param===null?"Showing consumer":'Showing: '+param;
    
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




export default PCAcomp

