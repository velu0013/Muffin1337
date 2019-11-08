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
            <div>
            <FileSelector type='.dbt'  label='DBT File' setStudy={setNewStudy}/>
            <FileSelector type='.xlsx' label='Excel File' setStudy={setNewStudy}/>
            </div>
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
                </>
            }
            </div>
        )}
		</Popup>
	)
}

function FileSelector({type, label, setStudy}){
    return(<div className="modal">
                <input type="file"
                id={'file'+type}
                name={'file'+type}
                className="inputfile_hidden"
                accept={type}
                onChange={e => {
                    if(e.target.files.length){
                        DB.UploadStudy[type.substr(1)](e.target.files[0], setStudy)
                    }
                }}
                />
                <label className="button_pop" for={'file'+type}>{label+' ('+type+')'}</label>
            </div>);
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