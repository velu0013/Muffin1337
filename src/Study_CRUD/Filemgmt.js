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
	const [select, setSelect] = useState(false)
	const [nameAvailable, setAvailable] = useState(true)
	return(
		<Popup 
		trigger={<button className="button_pop">Downloadload</button>} 
		modal
		>
		{close => (
			<div className="modal">
                Under construction
            </div>
        )}
		</Popup>
	)
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
                console.log('Loading File: '+e.target.files[0].name)
            }
        }}
        />
    </div>
}

export {DownloadButton, UploadButton}