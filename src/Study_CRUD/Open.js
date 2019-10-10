/* Version 1.2
 * Responsible: John Isaksson
 *
 *
 */

import React, { useState } from 'react';
import DB from './DB.js';
import Popup from "reactjs-popup";
import StudyDBT from './Study.js';
import {NewButton, ConfirmButton} from './New.js';
import {Redirect} from "react-router-dom";

function Openpage({study, setStudy}){
	return (
    <>
        <NewButton study={study} setStudy={setStudy}/>
		<ClearButton study={study} setStudy={setStudy}/>
		<br></br>
		<PrintStudyList study={study} setStudy={setStudy}/>
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




function PrintStudyList({study, setStudy}){
	const StudyList = DB.GetStudies()


	if(StudyList === null){
		return 'You have no studies yet'
	}


	return (
		<ul>
		  {StudyList.map((value, index) => {
			return <ul key={index}>{<RedirectToEdit study={study} setStudy={setStudy} GetStudy={StudyList[index]} />}</ul>
		  })}
		</ul>
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
		className="button_pop"
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
			<ConfirmButton label={'Yes'} f={_ => 
				{
					DB.ClearAll()
					props.setStudy(new StudyDBT('', [0,0], [0,0]))
				}} arg={null} close={close}
			/>
			<ConfirmButton label={'No'} close={close}/>
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

function DeleteButton(props){
	return(
		<Popup trigger={<button> Delete</button>} position={'right center'}>
		{close => (
			<>
			{'Delete'}{props.study}{'?'}
			<br></br>
			<ConfirmButton label={'Yes'} f={DB.RemoveStudy} arg={props.study} close={close}/>
			<ConfirmButton label={'No'} close={close}/>
			</>
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


