/* Version 1.2
 * Responsible: John Isaksson
 *
 *
 */

import React, { useState } from 'react';
import {SaveStudy, OpenStudy, RemoveStudy, ClearAll} from './DB.js';
import { breakStatement } from '@babel/types';


function Newpage(){
  const [StudyList, setStudyList] = useState('')
  const [study, setStudy] = useState('')
  const [NameConfirmed, setBool] = useState(false)
  const [bool2, setBool2] = useState(true)
  const [data, setData] =useState('')
  const [data2, setData2] =useState('')
  return (
    <div className="App">
      <header className="App-header">
        {NameConfirmed ?
        <EnterData  setData = {setData} bool = {NameConfirmed} setBool = {setBool} bool2 ={bool2} setBool2 = {setBool2} data = {data} setData2 ={setData2}/>
        : //else
        <EnterName study={study} setStudy={setStudy} list={StudyList} setStudyList={setStudyList} setBool ={setBool} bool = {NameConfirmed}/>
        }
  
        <p>
          File name: {StudyList}    
        </p>

        <p>
          Data: {data2}
        </p>
        <br/>
        <SaveButton data2 = {data2} StudyList = {StudyList} />
		  </header>
          
		</div>
  )
}
function EnterName(props){
  return(
    <> 
    {'Enter your file name'}
    <p>
      <FormInput study={props.study} setStudy={props.setStudy}/>
      <NewButton study={props.study} setStudy={props.setStudy} list={props.StudyList} setStudyList={props.setStudyList} setBool ={props.setBool} bool = {props.bool}/> 
    </p>
    <p>{''}</p>
    </>
  )
}

function EnterData(props){
  return(
    <> 
    {'Enter your data below'}
    <p>
      <Back bool = {props.bool} setBool = {props.setBool} /> 
    </p>
    <p>
      <FormInput study ={props.data} setStudy = {props.setData}/> 
      <Enter bool2 ={props.bool2} setBool2 = {props.setBool2} data = {props.data} setData2 ={props.setData2} /> 
    </p>
    </> 
  )
}

function FormInput(props){
    return(
        <input
            type="text"
            value={props.study}
            onChange={event => props.setStudy(event.target.value)}
		/>)
}

function NewButton(props){
	return(
		<input
			type="button"
			value={'Confirm'}
			onClick={
                function(event){
                props.setStudyList(props.study)
                props.setBool(!props.bool)    
                    {/*const newlist = props.list
                    newlist.push(props.study)
                    props.setList(newlist)
                    props.setStudy('') 
                    props.setBool(!props.bool) */}
                } 
            }
    />
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
function Enter(props) {
  return (  
    <input
      type="button"
      value={'Enter'}
      onClick={
        function(event){
        props.setBool2(!props.bool2)
        props.setData2(props.data)
        }
    }
    />
  );
}

function SaveButton(props){
	return(
		<input
			type="button"
			value={'Save a File'}
			onClick={
                function(event){
                    SaveStudy(props.StudyList, props.data2);
                } 
            }
		/>
	)
}



export {Newpage}

