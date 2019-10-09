import React, { useState } from 'react';
import {SaveStudy, OpenStudy, RemoveStudy, ClearAll, GetStudies} from './DB.js';
import Popup from "reactjs-popup";
import StudyDBT, {CreateGrid} from './Study.js';



// <NewButton changeName={setStudy} empty={setData} startEdit={setEdit}/>
//   f={RemoveStudy} confirm={true} study={props.study} close={close}
//		  <NewButton study={studyName} changeName={setStudy} empty={setData} startEdit={setEdit}/>
function NewButton(props){
	return(
		<Popup trigger={<button>Create</button>} position={'bottom center'}>
		{close =>(
			<>
            <input
                type="text"
                value={props.study.name}
                onChange={event => props.setStudy(props.study.changeName(event.target.value))}
		    />
            <ConfirmButton label={'Confirm'} f=
            {x => {
                SaveStudy(props.study.changeRecipe(CreateGrid(2,5)).changeConsumer(CreateGrid(3,4)))
                props.setStudy(OpenStudy(props.study.name))
            }} arg={props.study} close={close}
            />
			<ConfirmButton label={'Close'} close={close}/>
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


export  {NewButton, ConfirmButton}