import React from 'react';
import {PCA1,PCA2} from '../Methods/PCA-test'

//Tar in preference-tabellen och räknar ut egenvärdet/egenvektorerna

function PCAcomp(study) {
    const data = study.study.getTabular('preference')
    const data2 = PCA2(data)
    
    const res1= 
        data2.map(({eigenvalue},index)=>
        <div key = {index}>{eigenvalue}</div>);

    return res1


}

export default PCAcomp
