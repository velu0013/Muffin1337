import React, {useState} from 'react';
import DB from './DB.js';
import Popup from "reactjs-popup";

// Renders a trigger to a modal popup that lets a user select a file for upload.
// Trigger is by default a button but can be overridden by supplying a trigger prop.
function UploadButton({setStudy, trigger=<button className="button_pop">Upload</button>}){
    const [newStudy, setNewStudy] = useState(null)
	const [nameAvailable, setAvailable] = useState(true)
    return(
		<Popup 
		trigger={trigger} 
		modal
		>
		{close => (
			<div className="modal">
                <input type="file"
                id="file"
                name="file"
                className="inputfile_hidden"
                accept=".dbt"
                onChange={e => {
                    if(e.target.files.length){
                        DB.UploadStudy(e.target.files[0], setNewStudy)
                    }
                }}
                />
                Choose a .dbt file
                <label className="button_pop" for="file">Upload File</label>
                {newStudy !== null && 
                <>
                    {nameAvailable?'Choose study name':'Name exists'}
                    <input
                        className="Text-input"
                        type = 'text'
                        value = {newStudy.name}
                        onChange = {event => setNewStudy(newStudy.changeName(event.target.value))}
                    />
                    <input
                        type="button"
                        className="button_pop"
                        value="Confirm"
                        onClick={() => {
                            if(DB.NameFree(newStudy.name)){	
                                DB.SaveStudy(newStudy);
                                setStudy(newStudy)
                                setAvailable(true)
                                close()
                            }else{
                                setAvailable(false)
                            }
                        }}
                    />
                </>}
            </div>
        )}
		</Popup>
	)
}

// Renders a trigger to a modal popup that lets a user download a study as a file.
// Trigger is by default a button but can be overridden by supplying a trigger prop.
function DownloadButton({study, trigger=<button className="button_pop">Download</button>}){    
	return(
		<Popup 
		trigger={trigger}
		modal
		>
		{close => (
			<div className="modal">
                Download {study.name}
                <a className="button_pop" href={DB.DownloadStudy.dbt(study)} download={study.name+'.dbt'}>DBT File (.dbt)</a>
                <a className="button_pop" href={DB.DownloadStudy.xlsx(study)} download={study.name+'.xlsx'}>Excel File (.xlsx)</a>
            </div>
        )}
		</Popup>
	)
}

export {DownloadButton, UploadButton}