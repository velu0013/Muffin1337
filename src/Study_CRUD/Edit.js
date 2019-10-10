import React, {useState} from 'react';
import DB from './DB.js';
import utils from './utils.js'
import StudyTable from './StudyTable.js';
import Popup from "reactjs-popup";

//import Popup from "reactjs-popup";
//import StudyDBT from './Study.js';


function Editpage({study, setStudy}){
    if(study.name === ''){
        const name = DB.getCurrentStudy();
        if(name === null){
            return 'No study selected to edit';
        }
        setStudy(DB.OpenStudy(name));
    }

    return(<>
    <FileButton study={study} setStudy={setStudy}/>
    {'Now editing: '+study.name}<br></br>{'Last change: '+study.getEditDate()+', '+study.getEditTime()}
    <header className="App-header">
        <br></br>
        <StudyTable 
            key = {study.name+'reci'}
            tableData={study.recipe} 
            setData={x => setStudy(study.changeRecipe(x))}
        />
        <br></br>
        <StudyTable 
            key = {study.name+'cons'}
            tableData={study.consumer} 
            setData={x => setStudy(study.changeConsumer(x))}
        />
    </header></>
    )
}



function FileButton(props){
	return(
        <Popup trigger={<button className="button_pop">File</button>} position={'bottom left'}>
		{close => (
            <>
            <SaveButton study={props.study} close={close}/>
            <SaveAsButton study={props.study} setStudy={props.setStudy} close={close}/>
            </>
        )}
        </Popup>
	)
}

function SaveButton(props){
	return(
        <input
            className="button_pop"
            type="button"
            value="Save"
            onClick={event => {DB.SaveStudy(props.study); props.close()}}
        />
	)
}

function SaveAsButton(props){
    const [string, setString] = useState(props.study.name);
	const [nameAvailable, setAvailable] = useState(true)
	return(
        <Popup trigger={<button className="button_pop">Save as...</button>} modal>
        {close => (   
            <>
            {nameAvailable ? 'Choose new study name' : 'Name exists'}
            <br></br>
            <input
                type="text"
                value={string}
                onChange={event => setString(event.target.value)}
            />
            <br></br>
            <utils.ConfirmButton label={'Save'}
                f={arg => {
                    if(DB.NameFree(arg.name))
                    {	
                        DB.SaveStudy(arg);
                        props.setStudy(DB.OpenStudy(arg.name))
                        setAvailable(true)
                        props.close()
                    }else{
                        setAvailable(false)
                    }
                }} 
                arg={props.study.changeName(string)}
            />
            <utils.ConfirmButton label={'Cancel'} f={close}/>
            </>
        )}
        </Popup>
	)
}

export {Editpage}