import React, { useState } from 'react';
import DB from './DB.js';
import Popup from "reactjs-popup";
import StudyDBT from './Study.js';
import {NewButton, ConfirmButton} from './New.js';

function Analysispage({study, setStudy}){
    if(study.name === ''){
        const name = DB.getCurrentStudy();
        if(name === null){
            return 'No study selected to analyze';
        }
        setStudy(DB.OpenStudy(name));
    }
	return (
    <>
        {study.name+' will be analyzed here'}

    </>
	)
}

export {Analysispage}