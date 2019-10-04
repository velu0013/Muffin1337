import React, {useState} from 'react';
import {SaveStudy, OpenStudy, RemoveStudy, ClearAll} from './DB.js';

const study = 'Some study stuff'


function Testpage(){
    const [studyname, setStudy] = useState('')
    return (
        <div className="App">
		  <header className="App-header">
			Testing environment
            <p>
            <FormInput study={studyname} setStudy={setStudy}/>
            </p>
            <p>
            <SaveButton studyname={studyname}/>    
            </p>
            <ClearButton/>
			{studyname}
		  </header>
		</div>
    )
}



function SaveButton(props){
	return(
		<input
			type="button"
			value={'Save a File'}
			onClick={
                function(event){
                    SaveStudy(props.studyname, study);
                } 
            }
		/>
	)
}

function FormInput(props){
    return(
        <input
            type="text"
            value={props.study}
            onChange={event => props.setStudy(event.target.value)}
		/>)
}

function ClearButton(props){
	return(
		<input
			type="button"
			value={'Clear Storage'}
			onClick={
                function(event){
                    ClearAll();
                } 
            }
		/>
	)
}


export { Testpage }