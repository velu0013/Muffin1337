import React, {/* useState */} from 'react';
import DB from './DB.js';
import ReactjsTable from './tableTest.js';

//import Popup from "reactjs-popup";
//import StudyDBT from './Study.js';


function Editpage({study, setStudy}){
    if(study.name === ''){
        const name = DB.getCurrentStudy();
        if(name === null){
            return 'No study selected';
        }
        setStudy(DB.OpenStudy(name));
    }

    return(<>
    <SaveButton study={study}/>
    {'Now editing: '}{study.name}
    <header className="App-header">
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
    </header></>
    )
}


function SaveButton(props){
	return(
        <input
            className="button_pop"
            type="button"
            value="Save"
            onClick={event => DB.SaveStudy(props.study)}
        />
	)
}

export {Editpage}