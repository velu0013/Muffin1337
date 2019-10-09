import React, { useState } from 'react';
import DB from './DB.js';
import Popup from "reactjs-popup";
import {CreateGrid} from './Study.js';
import {Redirect} from "react-router-dom";

const contentStyle = {
	background: "#F0F0F0",
	width: "400px",
	border: "none"
};

// <NewButton changeName={setStudy} empty={setData} startEdit={setEdit}/>
//   f={RemoveStudy} confirm={true} study={props.study} close={close}
//		  <NewButton study={studyName} changeName={setStudy} empty={setData} startEdit={setEdit}/>
function NewButton(props){
	const [select, setSelect] = useState(false)
	const [nameAvailable, setAvailable] = useState(true)
	const [dims, setDims] = useState([[0,0],[0,0]])
	return(
		<>
		{select && <Redirect to='/Edit' />}
		<Popup 
		trigger={<button className="button_pop">Create</button>} 
		modal
		contentStyle={contentStyle}
		>
		{close =>(
			<div className="modal">
			{nameAvailable ? 'Choose study name' : 'Name exists'}
            <input
				type="text"
				className="Text-input"
                value={props.study.name}
                onChange={event => props.setStudy(props.study.changeName(event.target.value))}
		    />

			Recipe datasheet dimensions
			<div className="pop_div">
			<DimInput  dim={[0,0]} dims={dims} setDims={setDims}/>
			<DimInput dim={[0,1]} dims={dims} setDims={setDims}/>
			</div>
			Consumer datasheet dimensions
			<div className="pop_div">
			<DimInput dim={[1,0]} dims={dims} setDims={setDims}/>
			<DimInput dim={[1,1]} dims={dims} setDims={setDims}/>
			</div>
			{/* CONFIRMATION BUTTONS */}
			<div className="pop_div">
			<ConfirmButton label={'Confirm'} 
			f = {arg => {
				if(DB.NameFree(arg))
				{	
					DB.SaveStudy(props.study
						.changeRecipe(CreateGrid(dims[0][0],dims[0][1]))
						.changeConsumer(CreateGrid(dims[1][0],dims[1][1])));
					props.setStudy(DB.OpenStudy(arg))
					setAvailable(true)
					setSelect(true)
					close()
				}else{
					setAvailable(false)
				}
            }} arg={props.study.name}
            />
			<ConfirmButton label={'Close'} close={close}/>
			</div>
			</div>
		)}
		</Popup>
		</>
	)
}


// Performs the function f(arg) and then the function close().
// To disable either function call, set to null.
function ConfirmButton({label, f=null, arg, close=null}){
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

function DimInput({dim, dims, setDims}){
	return(
		<input
			className="Dimmer"
			type="number"
			value={dims[dim[0]][dim[1]]>0?dims[dim[0]][dim[1]]:''}
			onChange={event => 
			{
				if(parseInt(event.target.value, 10)>=0){
					let newDims = dimsCopy(dims)
					newDims[dim[0]][dim[1]] = parseInt(event.target.value, 10)
					setDims(newDims)
				}
			}}
		/>
	)
}

function dimsCopy(dims){
	let newDims = [[0,0],[0,0]]
	newDims[0][0] = parseInt(dims[0][0], 10)
	newDims[0][1] = parseInt(dims[0][1], 10)
	newDims[1][0] = parseInt(dims[1][0], 10)
	newDims[1][1] = parseInt(dims[1][1], 10)
	return newDims;
}

export  {NewButton, ConfirmButton}