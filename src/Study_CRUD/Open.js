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
import {UploadButton} from './Filemgmt.js'

function Openpage({study, setStudy}){
	const [Skey, setKey] = useState('');
	const [select, setSelect] = useState(false)
	return (
    <>
        <NewButton study={study} setStudy={setStudy}/>
		<UploadButton study={study} setStudy={x => {setStudy(x); setSelect(true)}}/>
		<ClearButton study={study} setStudy={setStudy}/>
		<br></br>
		<PrintStudyList study={study} setStudy={setStudy} Skey={Skey} setKey={setKey}/>
		{select && <Redirect to='/Edit' />}
    </>
	)
}


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
		<div className="Delete-all">
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

export {Openpage} 


