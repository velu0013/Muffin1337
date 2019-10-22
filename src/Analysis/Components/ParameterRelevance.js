import React, { useState } from 'react';
import Popup from "reactjs-popup";
import {Predict} from '../Methods/ANN.js';

function ParameterRelevance({study, close}){
    const [param, setParam] = useState(null)
    
    return(
        <>
        <ParameterSelector paramList={study.getHeader('consumer')} param={param} setParam={setParam}/>
        {param !== null && 'Correctly predicted: '+Predict(study, param)}
        </>
    )
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



export default ParameterRelevance;