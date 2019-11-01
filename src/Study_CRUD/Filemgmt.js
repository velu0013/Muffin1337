import React, { useState } from 'react';
import DB from './DB.js';
import Popup from "reactjs-popup";
import {CreateGrid} from './Study.js';
import {Redirect} from "react-router-dom";
import utils from './utils.js'

function UploadButton(props){
	const [select, setSelect] = useState(false)
	const [nameAvailable, setAvailable] = useState(true)
	return(
		<Popup 
		trigger={<button className="button_pop">Upload</button>} 
		modal
		>
		{close => (
			<div className="modal">
                <ImportFromFile setStudy={x => {props.setStudy(x); close();}}/>
            </div>
        )}
		</Popup>
	)
}



function DownloadButton(props){    
	return(
		<Popup 
		trigger={<div className="dropdown-item">Download as .dbt</div>} 
		modal
		>
		{close => (
			<LinkToDL study = {props.study}/>
        )}
		</Popup>
	)
}


function LinkToDL(props){
    const studyFile = URL.createObjectURL(new File([JSON.stringify(props.study)], {type: 'plain/text', endings: 'native'}))
    return(
        <div className="modal">
            <a href={studyFile} download={props.study.name+'.dbt'}>Download {props.study.name}</a>
        </div>
    );
}


function ImportFromFile({setStudy}){
    let fileReader;
    const handleFileRead = (e) => {
        const uploadedStudy = DB.LoadStudy(fileReader.result)
        DB.SaveStudy(uploadedStudy)
        setStudy(uploadedStudy)
    }
    const handleFileChosen = (file) => {
        fileReader = new FileReader();
        fileReader.onloaded = handleFileRead;
        fileReader.readAsText(file)
    }

    return <div>
        <input type="file"
        id="file"
        className="input-file"
        accept=".dbt"
        onChange={e => {
            if(e.target.files.length){
                handleFileChosen(e.target.files[0])
                fileReader = new FileReader();
                fileReader.onload = handleFileRead;
                fileReader.readAsText(e.target.files[0])
            }
        }}
        />
    </div>
}

export {DownloadButton, UploadButton}