/* Version 1.2
 * Responsible: John Isaksson
 *
 *
 */

import React, { useState } from 'react';
import DB from './DB.js';
import utils from './utils.js'
import Popup from "reactjs-popup";
import StudyDBT from './Study.js';
import {NewButton} from './New.js';
import {Redirect} from "react-router-dom";

function Openpage({study, setStudy}){
	const [Skey, setKey] = useState('');
	return (
    <>
        <NewButton study={study} setStudy={setStudy}/>
		<ClearButton study={study} setStudy={setStudy}/>
		<br></br>
		<PrintStudyList study={study} setStudy={setStudy} Skey={Skey} setKey={setKey}/>
    </>
	)
}


/*
//<OpenButton study={studyName} changeName={setStudy} setData={setData} startEdit={setEdit}/>
function OpenButton(props){
	const [select, setSelect] = useState(false)
	const [studyValid, setValid] = useState(true)
	return(
		<>
		{select && <Redirect to='/Edit' />}
		<Popup trigger={<button className="button_pop">Open</button>} position={'bottom center'}>
		{close=> (
			<>
			{studyValid?'Select Study':'No Such Study'}
			<input
				type="text" 
                value={props.study.name} 
				onChange = {event => props.setStudy(props.study.changeName(event.target.value))}
            />


			<ConfirmButton label={'Open'} f={name => 
			{
				if(DB.NameFree(name)){
					// Studyn finns inte, varna här
					setValid(false)
				}else{
					props.setStudy(DB.OpenStudy(name))
					DB.setCurrentStudy(name) // Gör så att sidan går att refresha
					setSelect(true)
					setValid(true)
					close()
				}
			}} arg={props.study.name}/>


			<ConfirmButton label={'Close'} close={close}/>
			</>
		)}
		
		</Popup>
		</>
	)
}

*/




function PrintStudyList({study, setStudy, Skey, setKey}){
	const StudyList = DB.GetStudies(Skey)
	if(StudyList === null){
		return 'You have no studies yet'
	}
	return (
		<>
		<input className="Text-input" type="text" placeholder="Search..." value={Skey} onChange={event => setKey(event.target.value)}/>
		<br></br>
		<ul>
		  {StudyList.map((value, index) => {
			return <ul key={index}>{<RedirectToEdit study={study} setStudy={setStudy} GetStudy={StudyList[index]} />}</ul>
		  })}
		</ul>
		</>
	  )
}




function RedirectToEdit(props){
	const [select, setSelect] = useState(false)
	var Study = props.GetStudy;

    return (
		<> 
			<ConfirmText label={Study} f={name => 
				{
					props.setStudy(DB.OpenStudy(name))
					setSelect(true)
				}} arg={Study} 
			/>

			{select && <Redirect to='/Edit' />}
		</>
    );
}

function ConfirmText({label, f=null, arg, close=null}){
	return(
		<input
		type="button"
		value={label}
		className="button_text"
		onClick={event => 
			{	
				if(f !== null){f(arg)};
				if(close !== null){close()};
			}
		}
		/>
	)	
}


function ClearButton(props){
	return(
		<Popup trigger={<button className="button_pop">Delete All</button>} position="right center">
		{close => (
		<div>
			{'Delete All Entries?'}
			<br></br>
			<utils.ConfirmButton label={'Yes'} f={_ => 
				{
					DB.ClearAll()
					props.setStudy(new StudyDBT('', [0,0], [0,0]))
				}} arg={null} close={close}
			/>
			<utils.ConfirmButton label={'No'} close={close}/>
		</div>
		)}
		</Popup>	
	)
}

/////////////////////////////////////////////////////////////////////////////////////

function SaveButton(props){
	return(
        <Popup trigger={<button>Save</button>} position={'bottom center'}>
		{close=> (
            <input
            type="button"
            value="Confirm"
            onClick={event => {DB.SaveStudy(props.study) && close()}}
            />
        )}
        </Popup>
	)
}


function Back(props) {
    return (  
        <input
            type="button"
            value={'Return'}
            onClick={event => 
            props.setBool(!props.bool)
            }
        />
    );
}




export {Openpage} 


