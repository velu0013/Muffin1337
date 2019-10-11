import React, { useState } from 'react';
import DB from './DB.js';
import Popup from "reactjs-popup";
import StudyDBT from './Study.js';
import gender from '../img/Demo_Gender.svg';
import drink from '../img/Demo_Drink.svg';
import trial from '../img/Demo_TrialPlan.svg';
import age from '../img/Demo_Age.svg';

function Analysispage({study, setStudy}){
    const [image, setimage] = useState(0);
    if(study.name === ''){
        const name = DB.getCurrentStudy();
        if(name === null){
            return 'No study selected to analyze';
        }
        setStudy(DB.OpenStudy(name));
    }
	return (
    <>
        {'Plots of data from study '}
        <span className="studyname"> {study.name}</span>{' can be analyzed here'} 
        <br></br>
        <PlotSelector image={image} setimage={setimage}/>
        <br></br>
        <ShowImg img={image}/> 
    </>
	)
}

function PlotSelector(props){
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
            <div 
                className="dropdown-item"
                onClick={event => {props.setimage(1)}}
                >Gender
            </div>
            <div 
                className="dropdown-item"
                onClick={event => {props.setimage(2)}}
                >Drink
            </div>
            <div 
                className="dropdown-item"
                onClick={event => {props.setimage(3)}}
                >Age
            </div>
            <div 
                className="dropdown-item"
                onClick={event => {props.setimage(4)}}
                >Trial Plan
            </div>
            </>
        )}
        </Popup>
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