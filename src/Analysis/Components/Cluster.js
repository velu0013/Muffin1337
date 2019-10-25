import React from 'react'
import {kmeans} from '../Methods/kmeans.js'

function ClusterAnalysis({study, close}){



    return (
        <>
        En annan analys på {study.name} som delar in data i kluster. 
        {kmeans(2)}
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