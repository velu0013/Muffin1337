import React, {useState} from 'react';
import DB from './DB.js';
import utils from './utils.js'
import StudyDBT from './Study.js';
import StudyTable from './StudyTable.js';
import Popup from "reactjs-popup";
import {Redirect} from 'react-router-dom';
import {DownloadButton} from './Filemgmt.js'

//import Popup from "reactjs-popup";
//import StudyDBT from './Study.js';


function Editpage({study, setStudy}){
    if(study === null || study.name === ''){
        const currstudy = DB.getCurrentStudy();
        if(currstudy === null){
            return 'No study selected'//<Redirect to='/MyStudies' />
        }
        setStudy(currstudy);
        return <Redirect to='/Edit' />
    }

    return(
    <>
       
    <FileButton study={study} setStudy={setStudy}/>
    
    {'Now editing: '+study.name}
    <br></br>
    {'Last change: '+study.getEditDate()+', '+study.getEditTime()}
   <header className="App-header">
   
        <br></br>
        Recipe
        <StudyTable 
            tableKey = {'_reci'}
            tableData={study.recipe} 
            setData={x => {
                const newStudy = study.changeRecipe(x)
                DB.setCurrentStudy(newStudy)
                setStudy(newStudy)
            }}
        />
        <br></br>
        Consumer description
        <StudyTable 
            tableKey = {'_cons'}
            tableData={study.consumer} 
            setData={x =>{
                const newStudy = study.changeConsumer(x)
                DB.setCurrentStudy(newStudy)
                setStudy(newStudy)
            }}
        />
        <br></br>
        Consumer preference
        <StudyTable 
            tableKey = {'_pref'}
            tableData={study.preference} 
            setData={x =>{
                const newStudy = study.changePreference(x)
                DB.setCurrentStudy(newStudy)
                setStudy(newStudy)
            }}
        />
        <br></br>
    </header>
    </>
    )
}

function FileButton(props){
	return(
        <Popup trigger={<button className="button_pop left">File</button>} 
            position={'bottom left'}
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            on='hover'
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
        >
		{close => (
            <>
            <SaveButton study={props.study} close={close}/>
            <SaveAsButton study={props.study} setStudy={props.setStudy} close={close}/>
            <DeleteButton study={props.study} setStudy={props.setStudy} close={close}/>
            <DownloadButton study={props.study} trigger={<div className="dropdown-item">Download</div>}/>
            </>
        )}
        </Popup>
	)
}

function SaveButton(props){
	return(
        <div 
            className="dropdown-item"
            onClick={event => {DB.SaveStudy(props.study); props.close()}}
            >Save
        </div>
        
	)
}

function SaveAsButton(props){
    const [string, setString] = useState(props.study.name);
	const [nameAvailable, setAvailable] = useState(true)
	return(
        <Popup trigger={<div className="dropdown-item">Save as...</div>} modal>
        {close => (   
            <div className="Delete-all">
            {nameAvailable ? 'Choose new study name' : 'Name exists'}
            <br></br>
            <input
                className="Text-input"
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
            </div>
        )}
        </Popup>
	)
}


function DeleteButton(props){
	return(
		<Popup trigger={<div className="dropdown-item">Delete</div>} modal>
		{close => (
            <div className="Delete-all">
            {'Delete '}{props.study.name}{'?'}
            <br></br>
            <utils.ConfirmButton label={'Delete'}
                f={arg => 
                {
                    DB.RemoveStudy(arg); 
                    props.setStudy(new StudyDBT()); 
                    props.close()
                }}
                arg={props.study}
            />
            <utils.ConfirmButton label={'Cancel'} f={close}/>
            </div>
		)}
		</Popup>	
	)
}


export {Editpage}