import PCA from 'pca-js'

//PCA1 använder en egen matris för test

/*
Problemen just nu:
Mina "scores" är inte beräknade med eigenvektorerna som axlar
utan det är det "gamla" origo som ger koordinaterna. Ett sätt att 
lösa detta hade kunnat vara att beräkna sträckan mellan punkten på eigenvektorn
och origo. Vet dock inte hur man ska skilja på positiva och negativa datapunkter 
relativt till eigenvektorerna

apexcharts gör det svårt att ha en serie med endast datapunkt i. Den tolkar detta som
två y-koordinater istället för att se det som ett x och ett y. Jag kan skapa scatter-plots
, men där har datapunkterna ingen form av identifikation

Är osäker ifall mitt sätt att beräkna loadings är korrekt.
*/
function PCA1() {
    const vec = [[{value: 2}, {value: 5}, {value: 4},{value: 4}],
                [{value:3}, {value: 7}, {value: 7}, {value: 7}],
                [{value:3}, {value: 9}, {value: 8},{value: 7}],
                [{value:3}, {value: 2}, {value: 9},{value: 4}]]
    
    const data2 = []
    var i;
    
    const data3 = vec.map(row => row.map(cell => cell.value))

    for (i=1; i < data3.length; i++) {
        var j;
        var dat = []
        for (j=1; j < data3[i].length; j++) {
            dat.push( data3[i][j])
        }   
    data2.push(dat)
    }
    const vectors = PCA.getEigenVectors(data2);
    const topTwo = PCA.computePercentageExplained(vectors,vectors[0])
   
    return vectors
}

//PCA2 förutsätter att man skickar in tabelldata

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
    const devscore = PCA.computeDeviationScores(MeanMatrix)
    console.log(MeanMatrix)
    const vectors = PCA.getEigenVectors(MeanMatrix);
    const topTwo = PCA.computePercentageExplained(vectors,vectors[0])
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
    console.log(header)
    return header
}


export {PCA1, PCA2, Loading }