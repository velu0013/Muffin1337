import React, { useState } from 'react';
import DB from './DB.js';
import Popup from "reactjs-popup";
import {CreateGrid} from './Study.js';
import {Redirect} from "react-router-dom";
import utils from './utils.js'

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
	const [dims, setDims] = useState([[0,0],[0,0],[0,0]])
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

			Recipe dimensions
			<div className="pop_div">
			<DimInput  dim={[0,0]} dims={dims} setDims={setDims}/>
			<DimInput dim={[0,1]} dims={dims} setDims={setDims}/>
			</div>
			Consumer description
			<div className="pop_div">
			<DimInput dim={[1,0]} dims={dims} setDims={setDims}/>
			<DimInput dim={[1,1]} dims={dims} setDims={setDims}/>
			</div>
			Consumer preference 
			<div className="pop_div">
			<DimInput dim={[2,0]} dims={dims} setDims={setDims}/>
			<DimInput dim={[2,1]} dims={dims} setDims={setDims}/>
			</div>
			{/* CONFIRMATION BUTTONS */}
			<div className="pop_div">
			<utils.ConfirmButton label={'Confirm'} 
			f = {arg => {
				if(DB.NameFree(arg))
				{	
					DB.SaveStudy(props.study
						.changeRecipe(CreateGrid(dims[0][0],dims[0][1]))
						.changeConsumer(CreateGrid(dims[1][0],dims[1][1]))
						.changePreference(CreateGrid(dims[2][0],dims[2][1])));
					props.setStudy(DB.OpenStudy(arg))
					setAvailable(true)
					setSelect(true)
					close()
				}else{
					setAvailable(false)
				}
            }} arg={props.study.name}
            />
			<utils.ConfirmButton label={'Close'} close={close}/>
			<br></br>
			{'9,3 | 26,7 | 26,9'}
			</div>
			</div>
		)}
		</Popup>
		</>
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
	let newDims = [[0,0],[0,0],[0,0]]
	newDims[0][0] = parseInt(dims[0][0], 10)
	newDims[0][1] = parseInt(dims[0][1], 10)
	newDims[1][0] = parseInt(dims[1][0], 10)
	newDims[1][1] = parseInt(dims[1][1], 10)
	newDims[2][0] = parseInt(dims[2][0], 10)
	newDims[2][1] = parseInt(dims[2][1], 10)
	return newDims;
}

export  {NewButton}