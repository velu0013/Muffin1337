import React, { useState , useEffect} from 'react'
import {kmeans} from '../Methods/kmeans.js'
import Popup from "reactjs-popup";

function ClusterAnalysis({study, close}){
    const [param, setParam] = useState(null)
    let recipe = study.getRecipeTabular();
    let consumer = study.getConsumerTabular();
    let preference = study.getPreferenceTabular();
    const nrClusters = 2;
    const data = setData(preference);


    return (
        <>
        <ParameterSelector paramList={study.getHeader('preference')} param={param} setParam={setParam}/>
        <ParameterSelector paramList={study.getHeader('recipe')} param={param} setParam={setParam}/>
        En annan analys på {study.name} som delar in data i kluster. 
        {kmeans(data, nrClusters)}
        {console.log(recipe)}
        <br></br>
        <input type="button" className="info_pop" value="Back" onClick={close}/>
        </>
    ); 
}

function setData(input){
    var i = 0;
    var data = [];
    for(i = 0; i <= input.length - 1; i++){
        data[i] = [input[i][6], input[i][7]];
    }
    return data;
}

function ParameterSelector({paramList, param, setParam}){
    const label = param===null?'Select Parameter':'Analyzing: '+param;
	return(
        <Popup trigger={<button className="button_pop">{label}</button>} 
            position={'right top'}
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

//Funk för vad som händer på onclick:

export default ClusterAnalysis

   // return <input type="button" value="Ctrl+Z" onClick={close}/>
    //let recipe = study.getRecipe()
    //recipe[0][0]
    //rows = recipe.length
    // cols = recipe[0].length