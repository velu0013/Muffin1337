import React, { useState, useEffect } from 'react';
import Popup from "reactjs-popup";
import { Predict } from '../Methods/ANN.js';
import utils from '../../Study_CRUD/utils.js';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css'


function ParameterRelevance({ study, close }) {
    const [param, setParam] = useState(null)
    const [loadinger, setloadinger] = useState(false)
    const [predictions, setPredicted] = useState(null)

    //Ändra Loadinger till true varje gång vi byter param
    useEffect(() => {
        if (param !== null) {
            setPredicted(null)
            setloadinger(true)
        }
    }, [param, study]
    );
    //Varje gång Loadinger ändras kör Predict, 
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loadinger) {
                setPredicted(Predict(study, param))
                setloadinger(false)
            }

        }, 100);
        return () => clearTimeout(timer);
    }, [loadinger, study, param]
    );
    console.log(predictions);

    return (
        <>
            <ParameterSelector paramList={study.getHeader('consumer')} param={param} setParam={setParam} />
            <br></br>
            {predictions !== null && <ReactDataSheet
                data={predictions}
                className="Table-fix2"
                valueRenderer={(cell) => cell.value}
            />}
            <br></br>
            {loadinger && utils.Loader()}
        </>
    )
}

function ParameterSelector({ paramList, param, setParam }) {
    const label = param === null ? 'Select Parameter' : 'Analyzing: ' + param;
    return (
        <Popup trigger={<button className="button_pop center">{label}</button>}
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
                    {paramList.map((value, index) => {
                        return <ul key={index} className="dropdown-item">
                            {<div onClick={event => { setParam(value); close(); }}>
                                {value}
                            </div>}
                        </ul>
                    })}
                </>
            )}
        </Popup>
    )
}



export default ParameterRelevance;