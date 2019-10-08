
/* MERGE PAGE
 * 
 *
 *
 */

/* Version 1.2
 * Responsible: John Isaksson
 *
 *
 */

import React, { useState } from 'react';
import {SaveStudy, OpenStudy, RemoveStudy, ClearAll, GetStudies} from './DB.js';
import Popup from "reactjs-popup";
import StudyDBT from './Study.js';

function Openpage({study, setStudy}){
	return (
    <>
        <NewButton study={study} setStudy={setStudy}/>
        <OpenButton study={study} setStudy={setStudy}/>
        <SaveButton study={study}/>
    </>
	)
}
//////// FUNCTIONS USED IN LATEST VERSION ///////////////////

function FormInput({form, setForm}){
    return(
        <input
            type="text"
            value={form}
            onChange={event => setForm(event.target.value)}
		/>)
}

// <NewButton changeName={setStudy} empty={setData} startEdit={setEdit}/>
//   f={RemoveStudy} confirm={true} study={props.study} close={close}
//		  <NewButton study={studyName} changeName={setStudy} empty={setData} startEdit={setEdit}/>
function NewButton(props){
	return(
		<Popup trigger={<button>Create</button>} position={'bottom center'}>
		{close =>(
			<>
            <FormInput 
                form={props.study.name} 
                setForm={x => props.setStudy(props.study.changeName(x))}
            />
			<ConfirmButton label={'Confirm'} f={x => {SaveStudy(props.study)}} arg={props.study} close={close}/>
			<ConfirmButton label={'Close'} close={close}/>
			</>
		)}
		</Popup>
	)
}


//<OpenButton study={studyName} changeName={setStudy} setData={setData} startEdit={setEdit}/>
function OpenButton(props){
	return(
		<Popup trigger={<button>Open</button>} position={'bottom center'}>
		{close=> (
			<>
			<FormInput 
                form={props.study.name} 
                setForm={x => props.setStudy(props.study.changeName(x))}
            />
			<ConfirmButton label={'Open'} f={name => {props.setStudy(OpenStudy(name))}} arg={props.study.name} close={close}/>
			<ConfirmButton label={'Close'} close={close}/>
			</>
		)}
		
		</Popup>
	)
}

function SaveButton(props){
	return(
        <Popup trigger={<button>Save</button>} position={'bottom center'}>
		{close=> (
            <input
            type="button"
            value="Confirm"
            onClick={event => {SaveStudy(props.study) && close()}}
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
			<ConfirmButton label={'Yes'} f={RemoveStudy} arg={props.study} close={close}/>
			<ConfirmButton label={'No'} close={close}/>
			</>
		)}
		</Popup>	
	)
}



// Performs the function f(arg) and then the function close().
// To disable either function call, set to null.
function ConfirmButton({label, f=null, arg, close=null}){
	return(
		<input
		type="button"
		value={label}
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
		<Popup trigger={<button> Delete All</button>} position="right center">
		{close => (
		<div>
			{'Delete All Entries?'}
			<br></br>
			<ConfirmButton label={'Yes'} f={ClearAll} confirm={true} study={props.study} close={close}/>
			<ConfirmButton label={'No'} f={ClearAll} confirm={false} study={props.study} close={close}/>
		</div>
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