import React, { useState } from 'react';
import {SaveStudy, OpenStudy, getCurrentStudy, RemoveStudy, ClearAll, GetStudies} from './DB.js';
import Popup from "reactjs-popup";
import ReactjsTable from './tableTest.js';
import StudyDBT from './Study.js';


function Editpage({study, setStudy}){
    if(study.name === ''){
        const name = getCurrentStudy();
        if(name === null){
            return 'No study selected';
        }
        setStudy(OpenStudy(name));
    }

    return(<header className="App-header"> 
        {study.name}
        <SaveButton study={study}/>
        <br></br>
        <ReactjsTable 
            key = {study.name+'reci'}
            tableData={study.recipe} 
            setData={x => setStudy(study.changeRecipe(x))}
        />
        <br></br>
        <ReactjsTable 
            key = {study.name+'cons'}
            tableData={study.consumer} 
            setData={x => setStudy(study.changeConsumer(x))}
        />
    </header>
    )
}


function SaveButton(props){
	return(
        <input
            className="button_pop"
            type="button"
            value="Save"
            onClick={event => SaveStudy(props.study)}
        />
	)
}

export {Editpage}