/* Version 1.2
 * Felix Djuphammar
 * En fil till
 *
 */

import React, { useState } from 'react';
import {SaveStudy, OpenStudy, RemoveStudy, ClearAll, GetStudies} from './DB.js';
import Popup from "reactjs-popup";

function Openpage(props){
	const [study, setStudy] = useState('')
	const [data, setData] = useState('')
	return (
        <div className="App">
		  <header className="App-header">
			<p>
				<FormInput form = {study} setForm={setStudy}/>
				<OpenButton study = {study} setData = {setData}/>
				<DeleteButton study = {study} setData = {setData}/>
			</p>
			<p>
				<FormInput form = {data} setForm={setData}/>
				<SaveButton study = {study} data = {data}/>
			</p>
			<p>
				<ClearButton />
			</p>
		  </header>
		</div>
    )
}


function FormInput(props){
    return(
        <input
            type="text"
            value={props.form}
            onChange={event => props.setForm(event.target.value)}
		/>)
}

function OpenButton(props){
	return(
		<input
			type="button"
			value={'Open'}
			onClick={event => props.setData(OpenStudy(props.study))}
		/>
	)
}

function SaveButton(props){
	return(
		<input
			type="button"
			value={'Save'}
			onClick={event => SaveStudy(props.study, props.data)}
		/>
	)
}


function DeleteButton(props){
	return(
		<Popup trigger={<button> Delete</button>} position="right center">
		{close => (
		<div>
			{'Delete '}{props.study}{'?'}
			<br></br>
			<ConfirmButton label={'Yes'} f={RemoveStudy} confirm={true} study={props.study} close={close}/>
			<ConfirmButton label={'No'} f={RemoveStudy} confirm={false} study={props.study} close={close}/>
		</div>
		)}
		</Popup>	
	)
}

function ConfirmButton(props){
	return(
		<input
		type="button"
		value={props.label}
		onClick={event => 
			{	
				props.confirm?props.f(props.study):Dummy();
				props.close()
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

function Dummy(){}


export {Openpage} 