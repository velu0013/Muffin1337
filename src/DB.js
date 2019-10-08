import StudyDBT from "./Study";

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
//1: newest first, 2: oldest first
function GetStudies(sort){
    return JSON.parse(localStorage.getItem(StudyList));
}

function SaveStudy(study){
    RecordStudy(study.name);
    localStorage.setItem(study.name, JSON.stringify(study));
}

function OpenStudy(name){
    const data = JSON.parse(localStorage.getItem(name))
    const study = new StudyDBT(data.name,[0,0],[0,0]);
    return study
        .changeRecipe(data.recipe)
        .changeConsumer(data.consumer)
        .changeMeta(data.meta);
}

function RemoveStudy(name){
    DeleteStudy(name)
    localStorage.removeItem(name)
}

function ClearAll(){
    localStorage.clear();
}

export {SaveStudy, OpenStudy, RemoveStudy, ClearAll, GetStudies};