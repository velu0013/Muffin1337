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
    setCurrentStudy(study)
    RecordStudy(study.name);
    localStorage.setItem(study.name+ext, JSON.stringify(study));
}

function OpenStudy(name){
    if(NameFree(name)){
        return null;
    }
    const data = JSON.parse(localStorage.getItem(name+ext))
    setCurrentTable(null, '_reci')
    setCurrentTable(data.recipe, '_reci')
    setCurrentTable(null, '_cons')
    setCurrentTable(data.consumer, '_cons')
    setCurrentTable(null, '_pref')
    setCurrentTable(data.preference, '_pref')
    const study = new StudyDBT(data.name)
        .changeRecipe(data.recipe)
        .changeConsumer(data.consumer)
        .changePreference(data.preference)
        .changeMeta(data.meta);
    setCurrentStudy(null);
    setCurrentStudy(study);
    return study;        
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

function setCurrentStudy(study){
    sessionStorage.setItem(StudyListKey+'_old', sessionStorage.getItem(StudyListKey))
    sessionStorage.setItem(StudyListKey, JSON.stringify(study))
}
function getCurrentStudy(offset = 0){
    let storageKey;
    if(offset){
        storageKey = StudyListKey+'_old'
    }else{
        storageKey = StudyListKey
    }
    const data = JSON.parse(sessionStorage.getItem(storageKey))
    if(data === null){
        return null
    }
    const study = new StudyDBT(data.name)
        .changeRecipe(data.recipe)
        .changeConsumer(data.consumer)
        .changePreference(data.preference)
        .changeMeta(data.meta);
    return study
}

function setCurrentTable(tableData, tableKey){
    sessionStorage.setItem(StudyListKey+tableKey+'_old', sessionStorage.getItem(StudyListKey+tableKey))
    sessionStorage.setItem(StudyListKey+tableKey, JSON.stringify(tableData))
}

function getCurrentTable(offset = 0, tableKey){
    let storageKey;
    if(offset){
        storageKey = StudyListKey+tableKey+'_old'
    }
    else{
        storageKey = StudyListKey+tableKey
    }
    return JSON.parse(sessionStorage.getItem(storageKey))
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
    getCurrentStudy: getCurrentStudy,
    setCurrentTable: setCurrentTable,
    getCurrentTable: getCurrentTable
}

export default DB