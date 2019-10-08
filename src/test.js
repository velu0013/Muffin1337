
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
import ReactjsTable from './tableTest.js';
import StudyDBT from './Study.js';

function Testpage(){
	const [studyName, setStudy] = useState('')
    const [data, setData] =useState([ [{value: 0},{value: 0}] , [{value: 0},{value: 0}] ]);
    const [editOrNot, setEdit] = useState(false)

    const [STUDY, setStudyDATA] = useState(new StudyDBT('Tja', [1,1], [1,1]))
    const openEdit = () => setEdit(true)
    const closeEdit = () => setEdit(true)
	return (
    <>
    <NewButton study={STUDY} changeName={setStudyDATA} setEdit={openEdit}/>
    <OpenButton study={studyName} changeName={setStudy} setData={setData} setEdit={openEdit}/>
    <div className="App">
		  <header className="App-header">
		  {editOrNot && <ReactjsTable tableData={data} setData={setData}/>}  
          </header>
	</div>
    </>
	)
}

//////// FUNCTIONS USED IN LATEST VERSION ///////////////////

function FormInput(props){
    let x = 0
    return(
        <input
            type="text"
            value={props.form}
            onChange={event => props.setForm(event.target.value)}
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
			<FormInput form={props.study.name} setForm={props.changeName}/>
			<ConfirmButton label={'Confirm'} f={x => {props.setEdit(); SaveStudy(x,'')}} arg={props.study} close={close}/>
			<ConfirmButton label={'Close'} f={null} arg={null} close={close}/>
			</>
		)}
		</Popup>
	)
}


//<OpenButton study={studyName} changeName={setStudy} setData={setData} startEdit={setEdit}/>
function OpenButton(props){
	return(
		<Popup trigger={<button>Open</button>} position={'center center'}>
		{close=> (
			<>
			<FormInput form={props.study} setForm={props.changeName}/>
			<ConfirmButton label={'Open'} f={name => props.setData(OpenStudy(name))} arg={props.study} close={close}/>
			<ConfirmButton label={'Close'} f={null} arg={null} close={null}/>
			</>
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
			<ConfirmButton label={'No'} f={null} arg={null} close={close}/>
			</>
		)}
		</Popup>	
	)
}



// Performs the function f(arg) and then the function close().
// To disable either function call, set to null.
function ConfirmButton(props){
	return(
		<input
		type="button"
		value={props.label}
		onClick={event => 
			{	
				if(props.f !== null){props.f(props.arg)};
				if(props.close !== null){props.close()};
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

export {Testpage}