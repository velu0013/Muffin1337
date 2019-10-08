import React, { useState } from 'react';
import {SaveStudy, OpenStudy, RemoveStudy, ClearAll, GetStudies} from './DB.js';
import Popup from "reactjs-popup";
import ReactjsTable from './tableTest.js';
import StudyDBT from './Study.js';


function Editpage({study, setStudy}){
    if(study.name == null){
        return 'No study selected';
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

export {Editpage}