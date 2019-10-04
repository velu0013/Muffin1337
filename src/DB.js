/* Version 1.4
 * Responsible: Felix Djuphammar
 *
 * Import command: import {SaveStudy, OpenStudy, RemoveStudy, ClearAll, GetStudies} from './DB.js';
 */

const StudyList = 'DBT_Studies_TAG:ReKlGhAt' 


// Private Functions (Not exported) 


function RecordStudy(name){
    var studies = GetStudies();
    if(studies===null){
        studies=[name]
    }else if(FindStudyIndex(name, studies) === -1){
        studies.push(name)
    }else{
        return;
    }
    localStorage.setItem(StudyList, JSON.stringify(studies));  
}

function DeleteStudy(name){
    let studies= GetStudies();
    if(studies === null){
        return;
    }
    else{
        const i = FindStudyIndex(name, studies)
        if(i > -1){
            studies.splice(i,1);
            localStorage.setItem(StudyList, JSON.stringify(studies));
        }
        return;
    }   
}

function FindStudyIndex(name, studies){
    if(studies === null){
        return -1
    }else{
        return GetStudies().findIndex(studyName => studyName === name)
    }
}


// Public Functions (Exported)

function GetStudies(){
    return JSON.parse(localStorage.getItem(StudyList));
}

function SaveStudy(name, data){
    RecordStudy(name);
    localStorage.setItem(name, JSON.stringify(data));
}

function OpenStudy(name){
    return JSON.parse(localStorage.getItem(name));
}

function RemoveStudy(name){
    DeleteStudy(name)
    localStorage.removeItem(name)
}

function ClearAll(){
    localStorage.clear();
}

export {SaveStudy, OpenStudy, RemoveStudy, ClearAll, GetStudies};