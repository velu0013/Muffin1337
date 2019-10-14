import React, { useState } from 'react';
import DB from './DB.js';
import Popup from "reactjs-popup";
import StudyDBT from './Study.js';
import {Redirect} from "react-router-dom";
import Analyzer from '../Analysis/Analysis_Master.js'

import gender from '../img/Demo_Gender.svg';
import drink from '../img/Demo_Drink.svg';
import trial from '../img/Demo_TrialPlan.svg';
import age from '../img/Demo_Age.svg';

function Analysispage({study, setStudy}){
    const [image, setimage] = useState(0);
    console.log(study)
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
        
        <br></br>
        <PlotSelector study={study} image={image} setimage={setimage}/>
        <br></br>
        <ShowImg img={image}/>
        {Analyzer[0].name+' demo:'} 
        <br></br>
        <Analyzer[0].component study={study} params={['Param1', 'Param2']} />
    </>
	)
}

function PlotSelector(props){
    const consHead = props.study.getConsumerHeader();
	return(
        <Popup trigger={<button className="button_pop">Select property to analyze</button>} 
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
            {consHead.map((value, index) => {
                return <ul key={index} className="dropdown-item">
                    {<AnaButton label={value} img={index} setimage={props.setimage}/>}
                </ul>
            })}
            </>
        )}
        </Popup>
	)
}

// <AnaButton label={value} img={index} setimage={props.setimage}/
function AnaButton(props){
    return(<div 
            onClick={event => {
                props.setimage(props.img)
            }}
            >{props.label}
        </div>
    )
}

function ShowImg({img}){
    switch(img){
        case 1: 
            return(<img src={gender} alt="Gender" />)
        case 2: 
            return <img src={drink} alt="Drink" /> 
        case 3: 
            return <img src={age} alt="Age" />
        case 4: 
            return <img src={trial} alt="Trial Plan" /> 
        default: 
            return ('Please select a property above')
    }  
}

export {Analysispage}