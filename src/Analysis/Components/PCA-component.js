import React from 'react';
import {PCA1,PCA2} from '../Methods/PCA-test'


//{res.map(({eigenvalue,vector})=><div>{eigenvalue}</div>)}
const res = PCA1()
function PCAcomp() {
    /*var i;
    const data = []
    for (i=0; i < res.length; i++) {
        data.push(res[i].eigenvalue)       
    }
    */
   const res = PCA1()
    return res


}

export default PCA1
