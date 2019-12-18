import React, { useState } from 'react';
import DB from './DB.js';
import utils from './utils.js'
import StudyDBT from './Study.js';
import StudyTable from './StudyTable.js';
import Popup from "reactjs-popup";
import { Redirect } from 'react-router-dom';
import { DownloadButton } from './Filemgmt.js'

//import Popup from "reactjs-popup";
//import StudyDBT from './Study.js';


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'
const contentStyle = {
    marginLeft: "42.5%",
	background: "#F0F0F0",
	width: "300px",
	border: "none"
};

function Editpage({ study, setStudy, updateStudyList }) {
    if (study === null || study.name === '') {
        const currstudy = DB.getCurrentStudy();
        if (currstudy === null) {
            return 'No study selected'//<Redirect to='/MyStudies' />
        }
        setStudy(currstudy);
        return <Redirect to='/Edit' />
    }

    return (
        <>

            <FileButton study={study} setStudy={setStudy} updateStudyList={updateStudyList} />

            <div className="Edit-fix">
                {'Now editing: ' + study.name}

                <br></br>
            </div>
            {//'Last change: ' + study.getEditDate() + ', ' + study.getEditTime()}
            } <header className="Table-fix2">
                <Tabs>
                    <TabList>
                        <Tab>Recipe</Tab>
                        <Tab>Description</Tab>
                        <Tab>Preference</Tab>
                    </TabList>
                    <TabPanel>
                        Recipe
                <StudyTable
                            tableKey={'_reci'}
                            tableData={study.recipe}
                            tableQQ={study.recipeQQ}
                            setData={x => {
                                const newStudy = study.changeFullTable('recipe', x)
                                DB.setCurrentStudy(newStudy)
                                setStudy(newStudy)
                            }}
                            setQQ={x => {
                                const newStudy = study.changeQQ('recipe', x)
                                DB.setCurrentStudy(newStudy)
                                setStudy(newStudy)
                            }}
                        />
                    </TabPanel>
                    <TabPanel>
                        Consumer description
                <StudyTable
                            tableKey={'_cons'}
                            tableData={study.consumer}
                            tableQQ={study.consumerQQ}
                            setData={x => {
                                const newStudy = study.changeFullTable('consumer', x)
                                DB.setCurrentStudy(newStudy)
                                setStudy(newStudy)
                            }}
                            setQQ={x => {
                                const newStudy = study.changeQQ('consumer', x)
                                DB.setCurrentStudy(newStudy)
                                setStudy(newStudy)
                            }}
                        />
                    </TabPanel>
                    <TabPanel>
                        Consumer preference
                <StudyTable
                            tableKey={'_pref'}
                            tableData={study.preference}
                            tableQQ={study.preferenceQQ}
                            setData={x => {
                                const newStudy = study.changeFullTable('preference', x)
                                DB.setCurrentStudy(newStudy)
                                setStudy(newStudy)
                            }}
                            setQQ={x => {
                                const newStudy = study.changeQQ('preference', x)
                                DB.setCurrentStudy(newStudy)
                                setStudy(newStudy)
                            }}
                        />
                    </TabPanel>
                </Tabs>
            </header>
        </>
    )
}

function FileButton(props) {
    return (
        <Popup trigger={<button className="button_pop right">File</button>}
            position={'bottom right'}
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            on='hover'
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
        >
            {close => (
                <>
                    <SaveButton study={props.study} close={close} />
                    <SaveAsButton study={props.study} setStudy={props.setStudy} updateStudyList={props.updateStudyList} close={close} />
                    <DeleteButton study={props.study} setStudy={props.setStudy} updateStudyList={props.updateStudyList} close={close} />
                    <DownloadButton study={props.study} trigger={<div className="dropdown-item">Download</div>} />
                </>
            )}
        </Popup>
    )
}

function SaveButton(props) {
    return (
        <div
            className="dropdown-item"
            onClick={event => { DB.SaveStudy(props.study); props.close() }}
        >Save
        </div>

    )
}

function SaveAsButton(props) {
    const [string, setString] = useState(props.study.name);
    const [nameAvailable, setAvailable] = useState(true)
    return (
        <Popup trigger={<div className="dropdown-item">Save as...</div>} 
        modal
        contentStyle={contentStyle}>
            {close => (
                <div className="Text-color-fix">

               <p className="Stud2"> 
                    {nameAvailable ? 'Choose new study name' : 'Name exists'}</p>
                    
                    <input
                        className="Text-input"
                        type="text"
                        value={string}
                        onChange={event => setString(event.target.value)}
                    />
                    <br></br>
                    <utils.ConfirmButton label={'Save'}
                        f={arg => {
                            if (DB.NameFree(arg.name)) {
                                DB.SaveStudy(arg);
                                props.setStudy(DB.OpenStudy(arg.name))
                                setAvailable(true)
                                props.updateStudyList();
                                props.close()
                            } else {
                                setAvailable(false)
                            }
                        }}
                        arg={props.study.changeName(string)}
                    />
                    <utils.ConfirmButton label={'Cancel'} f={close} />
                </div>
            )}
        </Popup>
    )
}


function DeleteButton(props) {
    return (
        <Popup trigger={<div className="dropdown-item">Delete</div>} 
        modal
        contentStyle={contentStyle}
        >
            {close => (
                <div className="Text-color-fix">

               <p className="Stud2">
                    {'Delete '}{props.study.name}{'?'}
                 </p>
                    <utils.ConfirmButton label={'Delete'}
                        f={arg => {
                            DB.RemoveStudy(arg);
                            props.setStudy(new StudyDBT());
                            props.updateStudyList();
                            props.close()
                        }}
                        arg={props.study}
                    />
                    <utils.ConfirmButton label={'Cancel'} f={close} />
                </div>
            )}
        </Popup>
    )
}


export { Editpage }