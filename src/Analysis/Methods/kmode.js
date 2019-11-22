// Mixed algorithm i PDF s.9
import {kmeans} from '../Methods/kmeans.js'
function consumerClusters(dataIn, k){
    let sorted = sortByType(dataIn); //returns [[sortedData],   [nrNumeric]]
    let dataNum = sorted[0];
    dataNum = clusterNumerical(dataNum);
    let dataCat = sorted[1];
    //standardize data here
    let clusterCenters = randomizeCenter(dataCat, dataNum, k);
    let oldClusterCenters = randomizeCenter(dataCat, dataNum, k);

    return 5
}


function clusterNumerical(data){
    //nrUnique = tempData[i].filter( onlyUnique ).length
    //fel: kmeans tar datat som en samling vectorer där varje vec är för en person, vi skickar vec per variabel
    let i; 
    let clusteredData = [];
    let tempData = data;
    for(i = 0; i < data.length; i++){
        if(tempData[i].filter( onlyUnique ).length > 10) clusteredData.push(kmeans([data[i]], 10));
        else clusteredData.push(data[i]);
    }
    return clusteredData;
}





function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function randomizeCenter(dataCat, dataNum, k){
    //takes a dataset, it can contain both numeric and catagorical data as long as all numeric are in the beginning
    //nrNum = number of numerical variables
    //k = desired number of clusters
    //returns k randomized centers with nrNum dimensions. Each dimension is uniformly distributed over min-max of data
    let centerNum = [];
    let centerCat = [];
    let thisVariable = [];
    let i, j, max, min;
    for(i = 0; i < dataNum.length; i++){
        thisVariable = []
        for(j = 0; j < k; j++){
            min = Math.min.apply(null, dataNum[i]);
            max = Math.max.apply(null, dataNum[i]);
            thisVariable.push(Math.random()*(max - min) + min);
        }
        centerNum.push(thisVariable);
    }

    for(i = 0; i < dataCat.length; i++){
        thisVariable = []
        for(j = 0; j < k; j++){
            thisVariable.push(1);        
        }
        centerCat.push(thisVariable);
    }

    return [centerNum, centerCat];
}




//////////////Convert data of form [[consumer 1], [consumer2],...] to the form [[age], [gender]] and so on
/////////////Also all numeric vectors will be in the beginning of matrix
/////////////Also standardizes it (i.e mean 0 and stdev 1)

function sortByType(data){
    let i;
    let dataNum = [];
    let dataCat = [];
    for(i = 0; i < data[0].length; i++){
        if(data[0][i] - data[0][i] === 0){
            dataNum.push(getColumn(data, i));
        }else{
            dataCat.push(getColumn(data, i));
        }
    }

    return [dataNum, dataCat];
}




function getColumn(matrix, column){
    let i;
    let columnVec = [];
    for(i = 0; i < matrix.length; i++){
        columnVec[i] = matrix[i][column];
    }
    return columnVec
}



function sum(vector){
    let i;
    let sum = 0;
    for(i = 0; i < vector.length; i++){
        sum = sum + vector[i];
    }
    return sum;
}

function test(){
    return 5;
}


export {consumerClusters}