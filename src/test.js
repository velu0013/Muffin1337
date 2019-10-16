
 /*MERGE PAGE
 * 
 *
 *
 

 Version 1.3
 * Responsible: John Isaksson
 *
 *
 *
 */

import React, { useState } from 'react';
import DB from './Study_CRUD/DB.js';
import Popup from "reactjs-popup";
import StudyDBT from './Study_CRUD/Study.js';
import StudyTable from './Study_CRUD/StudyTable.js';

function Testpage(){
	const [studyName, setStudy] = useState('')
    const [data, setData] =useState([ 
	[{value: 'John'},{value: 'Markus'},{value:'Jonas'},{value:'Erik'}],
	[{value: 'Maja'},{value: 'Henrik'},{value:'Markus'},{value:'John'}],
	[{value: 'Linus'},{value: 'Henrik'},{value:'Markus'},{value:'John'}]
	]);
	const [editOrNot, setEdit] = useState(false)
	const arra1 = [
		[{value: 'John'},{value: 'Markus'},{value:'Erik'},{value:'Jonas'}],
		[{value: 'Maja'},{value: 'Henrik'},{value:'Markus'},{value:'John'}],
		[{value: 'Linus'},{value: 'Henrik'},{value:'Markus'},{value:'John'}]
	]
	{console.log(arra1[0][0].value === arra1[0][3].value)}
	const arra2 = [
		['ja','nej','kanske','kanske'],
		['hejdå', 'då', 'hej','va'],
		['ja', 'nej', 'hej','va']
	]
    const [STUDY, setStudyDATA] = useState(new StudyDBT('Tja', [1,1], [1,1]))
    const openEdit = () => setEdit(true)
    const closeEdit = () => setEdit(true)
	return (
    <>
    <NewButton study={STUDY} changeName={setStudyDATA} setEdit={openEdit}/>
    <OpenButton study={studyName} changeName={setStudy} setData={setData} setEdit={openEdit}/>
    <div className="App">
		  <header className="App-header">
		  {editOrNot && <StudyTable tableData={data} setData={setData}/>}  
		<Duplicate_finder arra1 = {data}  />
		
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
			<ConfirmButton label={'Confirm'} f={x => {props.setEdit(); DB.SaveStudy(x,'')}} arg={props.study} close={close}/>
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
			<ConfirmButton label={'Open'} f={name => props.setData(DB.OpenStudy(name))} arg={props.study} close={close}/>
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
			<ConfirmButton label={'Yes'} f={DB.RemoveStudy} arg={props.study} close={close}/>
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
			<ConfirmButton label={'Yes'} f={DB.ClearAll} confirm={true} study={props.study} close={close}/>
			<ConfirmButton label={'No'} f={DB.ClearAll} confirm={false} study={props.study} close={close}/>
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

function Duplicate_finder (props) {
	const result = []
	const rowlist = []
	const collist = []
	const result2 = []
	var message = ""
	var i;
	for (i=0; i < 4; i++) {
		collist.push(props.arra1[0][i].value)
	}

	for (i=0; i < collist.length; i++) {
		if (i != collist.lastIndexOf(collist[i]))
			result.push(collist[i])
	}

	for (i=0; i < props.arra1.length; i++) {
		rowlist.push(props.arra1[i][0].value)
	}
	
	for (i=0; i < rowlist.length; i++) {
		if (i != rowlist.lastIndexOf(rowlist[i]))
			result2.push( rowlist[i])
	}
	result.push(result2)
	
	return result
}




export {Testpage}
