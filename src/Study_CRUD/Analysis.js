import React, { useState } from 'react';
import DB from './DB.js';
import Popup from "reactjs-popup";
import {Redirect} from "react-router-dom";
import Analyzers from '../Analysis/Analysis_Master.js'


function Analysispage({study, setStudy}){
    const [analyzer, setAnalyzer] = useState(null);

    if(study === null || study.name === ''){
        const name = DB.getCurrentStudy();
        if(name === null){
            return <Redirect to='/MyStudies' />
        }
        setStudy(DB.OpenStudy(name));
        return <Redirect to='/Analysis' />
    }

	return (
    <>
        {'Plots of data from study '}
        <span className="studyname"> {study.name}</span>{' can be analyzed here'}
        
        <input type="button" value="Back" className="button_pop" onClick={() => setAnalyzer(null)}/>
        <br></br>
        
        {analyzer === null ? <AnalyzeSelector setAnalyzer={setAnalyzer}/>:
        <>
            <br></br>
            {analyzer.name+' demo:'} 
            <br></br>
            <analyzer.component study={study} close={() => setAnalyzer(null)}/>
        </>
        }
    </>
	)
}

function AnalyzeSelector(props){
	return(
        <Popup trigger={<button className="button_pop">Select analysis type</button>} 
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
            {Analyzers.map((value, index) => {
                return <ul key={index} className="dropdown-item">
                    {<div onClick={event => {props.setAnalyzer(value)}}>
                        <Popup trigger={<button className="info_pop">i</button>} 
                            position={'left top'}
                            closeOnDocumentClick
                            mouseLeaveDelay={100}
                            mouseEnterDelay={0}
                            on='hover'
                            >{value.description}
                        </Popup>
                        {value.name}
                    </div>}
                </ul>
            })}
            </>
        )}
        </Popup>
	)
}


export {Analysispage}