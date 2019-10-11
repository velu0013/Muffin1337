/* Version 1.4
 * Responsible: Felix Djuphammar
 *
 * Import:   import DB from './DB.js';
 * Usage ex: DB.SaveStudy(StudyDBT)
 */


import StudyDBT from "./Study";
const StudyListKey = 'DBT_Studies_TAG:ReKlGhAt';
const ext = '.dbt';


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

function GetStudies(search = null, sort = null){
    let studies = JSON.parse(localStorage.getItem(StudyListKey))
    if(search !== null && search !== ''){
        const letters = search.length;
        studies = studies.filter(name => {
            for(let i=0; i<letters; i++){
                if(search[i] !== name[i]){
                    return false;
                }
            }
            return true;
        })
    }
    return studies;
}

function SaveStudy(study){
    setCurrentStudy(study.name)
    RecordStudy(study.name);
    localStorage.setItem(study.name+ext, JSON.stringify(study));
}

function OpenStudy(name){
    if(NameFree(name)){
        return null;
    }
    setCurrentStudy(name)
    const data = JSON.parse(localStorage.getItem(name+ext))
    const study = new StudyDBT(data.name,[0,0],[0,0]);
    return study
        .changeRecipe(data.recipe)
        .changeConsumer(data.consumer)
        .changeMeta(data.meta);
}

function RemoveStudy(study){
    DeleteStudy(study.name)
    if(study.name === getCurrentStudy()){
        sessionStorage.removeItem(StudyListKey);
    }
    localStorage.removeItem(study.name+ext)
}

function ClearAll(){
    sessionStorage.clear();
    localStorage.clear();
}

function NameFree(name){
    return (name !== null && name !== '' && FindStudyIndex(name, GetStudies()) === -1)
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