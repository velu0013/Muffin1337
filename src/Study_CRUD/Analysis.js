import React, { useState } from 'react';
import DB from './DB.js';
import Popup from "reactjs-popup";
import { Redirect } from "react-router-dom";
import Analyzers from '../Analysis/Analysis_Master.js'
import utils from './utils.js'
import {GetColumn} from '../Analysis/Components/PCA-component'

function Analysispage({ study, setStudy }) {
    const [analyzer, setAnalyzer] = useState(null);

    if (study === null || study.name === '') {
        const currstudy = DB.getCurrentStudy();
        if (currstudy === null) {
            return 'No study selected'//<Redirect to='/MyStudies' />
        }
        setStudy(currstudy);
        return <Redirect to='/Analysis' />
    }

    return (
        <>
        {study.getTabular('preference').length == 0 || (GetColumn(study.getTabular('preference')).length != GetColumn(study.getTabular('consumer')).length)
            ?
            <>
            <br></br>
            No preference/consumer tables. Please add these in order to start your analysis
            <br></br>

            <AltAnalyzeSelector setAnalyzer={setAnalyzer} />
            </>
            :
            <>
            Plots of data from study 
            <span className="studyname"> {study.name}</span> can be analyzed here

            <input type="button" value="Back" className="button_pop right" onClick={() => setAnalyzer(null)} />
            <br></br>

            {analyzer === null ? <AnalyzeSelector setAnalyzer={setAnalyzer} /> :
                    <>
                    <br></br>
                    <analyzer.component study={study} setStudy={setStudy} close={() => setAnalyzer(null)} />
                    </>
                }
            </>
            }
        </>
    
    )
}

function AnalyzeSelector(props) {
    return (
        <Popup trigger={<button className="button_pop">Select analysis type</button>}
            position={'right top'}
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            on='hover'
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
        >
            {close => (
                <>
                    {Analyzers.map((value, index) => {
                        return <ul key={index} className="dropdown-item">
                            {<div onClick={event => { props.setAnalyzer(value) }}>
                                <utils.InfoPop info={value.description} />
                                {value.name}
                            </div>}
                        </ul>
                    })}
                </>
            )}
        </Popup>
    )
}

function AltAnalyzeSelector(props) {
    return (
        <Popup trigger={<button className="button_pop">View analysis types</button>}
            position={'right top'}
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            on='hover'
            contentStyle={{ padding: "0px", border: "none" }}
            arrow={false}
        >
            {close => (
                <>
                    {Analyzers.map((value, index) => {
                        return <ul key={index} className="dropdown-item">
                            {<div>
                                <utils.InfoPop info={value.description} />
                                {value.name}
                            </div>}
                        </ul>
                    })}
                </>
            )}
        </Popup>
    )
}


export { Analysispage }