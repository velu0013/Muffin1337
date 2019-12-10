import PCA from 'pca-js'



//PCA2 förutsätter att man skickar in tabelldata. Den beräknar en centrerad matris som sedan eigenvektorer och eigenvärden beräknas ur.

function PCA2(vec) {

    const data2 = []
    var i;
    
    //const data3 = vec.map(row => row.map(cell => cell.value))
   const data3 = vec
    for (i=0; i < data3.length; i++) {
        var j;
        var dat = []
        for (j=1; j < data3[i].length; j++) {
            dat.push( data3[i][j])
        }   
    data2.push(dat)
    }
    
    const MeanMatrix = PCA.computeDeviationMatrix(data2)
    const varia = PCA.computeVarianceCovariance(MeanMatrix,true)
    const devscore = PCA.computeDeviationScores(MeanMatrix)
    const vectors = PCA.getEigenVectors(MeanMatrix);
    const adjust = PCA.computeAdjustedData(data2,vectors[0],vectors[1])
    const Toptwo = PCA.computePercentageExplained(vectors,vectors[0],vectors[1])
    vectors.push({percentexp: Toptwo})
    return vectors
}

//Loading-funktionen tar in namnet för varje kolumn samt skapar en
//vektor som ska representera axeln kolumnen utgör
function Loading(data) {
    var i
    const header = []
    for(i=1;i<data.length; i++) {
        var arr = Array.apply(null, new Array(data.length-1)).map(Number.prototype.valueOf,0);
        arr[i-1] = 1

        header.push({name:data[i], axis:arr})
        
    }
    return header
}


export {PCA2, Loading}