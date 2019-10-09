/* Version 1.4
 * Responsible: Felix Djuphammar
 *
 * Import:   import DB from './DB.js';
 * Usage ex: DB.SaveStudy(StudyDBT)
 */


import StudyDBT from "./Study";
const StudyListKey = 'DBT_Studies_TAG:ReKlGhAt' 


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
    localStorage.setItem(StudyListKey, JSON.stringify(studies));  
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
            localStorage.setItem(StudyListKey, JSON.stringify(studies));
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
// 1: newest first, 2: oldest first

function GetStudies(){
    return JSON.parse(localStorage.getItem(StudyListKey));
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
    sessionStorage.clear();
    localStorage.clear();
}

function NameFree(name){
    return (name !== '' && FindStudyIndex(name, GetStudies()) === -1)
}

function setCurrentStudy(name){
    sessionStorage.setItem(StudyListKey, name)
}
function getCurrentStudy(){
    return sessionStorage.getItem(StudyListKey)
}

// Exported method structure
const DB = {
    GetStudies: GetStudies,
    SaveStudy: SaveStudy,
    OpenStudy: OpenStudy,
    RemoveStudy: RemoveStudy,
    ClearAll: ClearAll,
    NameFree: NameFree,
    setCurrentStudy: setCurrentStudy,
    getCurrentStudy: getCurrentStudy
}

export default DB