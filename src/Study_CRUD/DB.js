/* Version 1.4
 * Responsible: Felix Djuphammar
 *
 * Import:   import DB from './DB.js';
 * Usage ex: DB.SaveStudy(StudyDBT)
 */


import StudyDBT from "./Study";
import * as XLSX from 'xlsx';
const StudyListKey = 'DBT_Studies_TAG:ReKlGhAt';
const ext = '.dbt';


// ----------- Private Functions (Not exported) ------------
function RecordStudy(name) {
    var studies = GetStudies();
    if (studies === null) {
        studies = [name]
    } else if (FindStudyIndex(name, studies) === -1) {
        studies.push(name)
        studies.sort()
    } else {
        return;
    }
    localStorage.setItem(StudyListKey, JSON.stringify(studies));
}

function DeleteStudy(name) {
    let studies = GetStudies();
    if (studies === null) {
        return;
    } else {
        const i = FindStudyIndex(name, studies)
        if (i > -1) {
            studies.splice(i, 1);
            localStorage.setItem(StudyListKey, JSON.stringify(studies));
        }
        return;
    }
}

function FindStudyIndex(name, studies) {
    if (studies === null) {
        return -1
    } else {
        return GetStudies().findIndex(studyName => studyName === name)
    }
}

function LoadStudy(StudyJSON) {
    const data = JSON.parse(StudyJSON)
    const study = new StudyDBT(data.name)
        .changeFullTable('recipe', data.recipe)
        .changeFullTable('consumer', data.consumer)
        .changeFullTable('preference', data.preference)
        .changeMeta(data.meta);
    setCurrentStudy(null);
    setCurrentStudy(study);
    setCurrentTable(null, '_reci')
    setCurrentTable(study.recipe, '_reci')
    setCurrentTable(null, '_cons')
    setCurrentTable(study.consumer, '_cons')
    setCurrentTable(null, '_pref')
    setCurrentTable(study.preference, '_pref')
    return study;
}


// ------------- Public Functions (Exported in DB) ---------------
// Returns a list of existing studies
function GetStudies(search = null, sort = null) {
    let studies = JSON.parse(localStorage.getItem(StudyListKey))
    if (search !== null && search !== '') {
        const letters = search.length;
        studies = studies.filter(name => {
            for (let i = 0; i < letters; i++) {
                if (search[i] !== name[i]) {
                    return false;
                }
            }
            return true;
        })
    }
    return studies;
}

// Saves a study to storage with the provided name and set extension
function SaveStudy(study) {
    setCurrentStudy(study)
    RecordStudy(study.name);
    localStorage.setItem(study.name + ext, JSON.stringify(study));
}

// Opens a study with the requested name from storage, nulls if not available
function OpenStudy(name) {
    if (NameFree(name)) {
        return null;
    }
    return LoadStudy(localStorage.getItem(name + ext));
}

// Removes a study from storage and workspace
function RemoveStudy(study) {
    DeleteStudy(study.name)
    if (study.name === getCurrentStudy().name) {
        sessionStorage.removeItem(StudyListKey);
    }
    localStorage.removeItem(study.name + ext)
}

// Completely clears local and session storage
function ClearAll() {
    sessionStorage.clear();
    localStorage.clear();
}

// Checks if a name is free
function NameFree(name) {
    return (name !== null && name !== '' && FindStudyIndex(name, GetStudies()) === -1)
}

// Sets the current workspace study
function setCurrentStudy(study) {
    sessionStorage.setItem(StudyListKey + '_old', sessionStorage.getItem(StudyListKey))
    sessionStorage.setItem(StudyListKey, JSON.stringify(study))
}

// Returns the current workspace study, can look back in time with offset
function getCurrentStudy(offset = 0) {
    let storageKey;
    if (offset) {
        storageKey = StudyListKey + '_old'
    } else {
        storageKey = StudyListKey
    }
    const data = JSON.parse(sessionStorage.getItem(storageKey))
    if (data === null) {
        return null
    }
    const study = new StudyDBT(data.name)
        .changeFullTable('recipe', data.recipe)
        .changeFullTable('consumer', data.consumer)
        .changeFullTable('preference', data.preference)
        .changeMeta(data.meta);
    return study
}

// Sets the current workspace table
function setCurrentTable(tableData, tableKey) {
    sessionStorage.setItem(StudyListKey + tableKey + '_old', sessionStorage.getItem(StudyListKey + tableKey))
    sessionStorage.setItem(StudyListKey + tableKey, JSON.stringify(tableData))
}

// Gets the current workspace table
function getCurrentTable(offset = 0, tableKey) {
    let storageKey;
    if (offset) {
        storageKey = StudyListKey + tableKey + '_old'
    } else {
        storageKey = StudyListKey + tableKey
    }
    return JSON.parse(sessionStorage.getItem(storageKey))
}

// Returns a study in the form of a file URL for the browser to download as a file
const DownloadStudy = {
    dbt: study => {
        return URL.createObjectURL(new File([JSON.stringify(study)], {
            type: 'plain/text',
            endings: 'native'
        }))
    },
    xlsx: study => {
        const toCSV = (header, table) => {
            let CSVdata = [];
            for (let r = 0; r < table.length; r++) {
                let CSVrow = {}
                for (let c = 0; c < header.length; c++) {
                    CSVrow[header[c]] = table[r][c]
                }
                CSVdata.push(CSVrow)
            }
            return CSVdata;
        }
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const recp = XLSX.utils.json_to_sheet(toCSV(study.getRecipeHeader(), study.getRecipeTabular()));
        const cons = XLSX.utils.json_to_sheet(toCSV(study.getConsumerHeader(), study.getConsumerTabular()));
        const pref = XLSX.utils.json_to_sheet(toCSV(study.getPreferenceHeader(), study.getPreferenceTabular()));

        const wb = {
            Sheets: {
                'Recipe': recp,
                'Consumer Description': cons,
                'Consumer Preference': pref
            },
            SheetNames: ['Recipe', 'Consumer Description', 'Consumer Preference']
        };
        const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array'
        });
        const data = new Blob([excelBuffer], {
            type: fileType
        });
        return (URL.createObjectURL(data))
    }
}

// Accepts a file and and reads to the current workspace study
const UploadStudy = {
    dbt: (file, setStudy) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            const uploadedStudy = LoadStudy(e.target.result)
            setStudy(uploadedStudy)
        }
        fileReader.readAsText(file)
    },
    xlsx: (file, setStudy) => {
        const fromCSV = (Sheet, SheetName) => {
            const header = Object.keys(Sheet[0]).map(x => ({
                value: x
            }))
            const tabular = Sheet.map(rowObj => Object.values(rowObj).map(x => ({
                value: x
            })))
            return [header, ...tabular];
        }
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            const studyName = file.name.substr(0, file.name.lastIndexOf('.'))

            const studyData = XLSX.read(new Uint8Array(e.target.result), {
                type: 'array'
            });
            const recipe = fromCSV(XLSX.utils.sheet_to_json(studyData.Sheets['Recipe']))
            const consum = fromCSV(XLSX.utils.sheet_to_json(studyData.Sheets['Consumer Description']))
            const prefer = fromCSV(XLSX.utils.sheet_to_json(studyData.Sheets['Consumer Preference']))
            const uploadedStudy = new StudyDBT()
                .changeName(studyName)
                .changeFullTable('recipe', recipe)
                .changeFullTable('consumer', consum)
                .changeFullTable('preference', prefer)
            setStudy(uploadedStudy)
        }
        fileReader.readAsArrayBuffer(file)
    }
}

// Exported method structure
const DB = {
    GetStudies: GetStudies,
    SaveStudy: SaveStudy,
    OpenStudy: OpenStudy,
    UploadStudy: UploadStudy,
    DownloadStudy: DownloadStudy,
    RemoveStudy: RemoveStudy,
    ClearAll: ClearAll,
    NameFree: NameFree,
    setCurrentStudy: setCurrentStudy,
    getCurrentStudy: getCurrentStudy,
    setCurrentTable: setCurrentTable,
    getCurrentTable: getCurrentTable
}

export default DB