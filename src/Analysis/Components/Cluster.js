import React from 'react'
import {kmeans} from '../Methods/kmeans.js'

function ClusterAnalysis({study, close}){
    let recipe = study.getRecipeTabular()
    let consumer = study.getConsumerTabular()
    let preference = study.getPreferenceTabular()
    let testdata = [1, 2, 3, 1, 2, 3, 7, 8, 9, 7, 8, 9, 7, 8, 9, 1, 2, 3, 1, 2, 3, 7, 8, 9];
    return (
        <>
        En annan analys på {study.name} som delar in data i kluster. 
        {kmeans(testdata)}
        <br></br>
        <input type="button" className="info_pop" value="Back" onClick={close}/>
        </>
    ); 
}

export default ClusterAnalysis

   // return <input type="button" value="Ctrl+Z" onClick={close}/>
    //let recipe = study.getRecipe()
    //recipe[0][0]
    //rows = recipe.length
    // cols = recipe[0].length