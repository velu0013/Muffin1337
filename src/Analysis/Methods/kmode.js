// Mixed algorithm i PDF s.9
//hur ska nrclusters defineras?
//hur många unika värden före klustra?
//k får ej vara större än maxUnique!!!
//Tänk om man slumpar gamla centers= centers på en gång??
import {kmeans} from '../Methods/kmeans.js'
import {standardStats} from '../Methods/standardStats.js'
function consumerClusters(dataIn, k, type){
    //let oldData = dataIn.slice();
    let oldData = saveOldData(removeNames(dataIn));
    let randval;

    let kNum = 0;
    let data = convertData(removeNames(dataIn), kNum, type);             //convert num data to cat data and letters to integers
    let i;
    let centers = [];
    let IDvec = [];
    let oldCenters = [];
    let clusterMatrix;
    let ktest = k;
    let nrUnique = 0;
    while(nrUnique < ktest){
        for(i = 0; i < ktest; i++){
            centers.push(randomize(data))           //initiate centers
            oldCenters.push(randomize(data))        //initiate old centers
        }
    
        IDvec = [];
        for(i = 0; i < data.length; i++){
            IDvec.push(clusterID(centers, i));
        }

        nrUnique = IDvec.filter( onlyUnique ).length;
    }

    let iteration = 0;
    nrUnique = 0;
    while(convergenceTest(oldCenters, centers, iteration) === false){
        iteration = iteration + 1;
        while(nrUnique < ktest){
            for(i = 0; i < centers.length; i++){
                oldCenters[i] = centers[i];
                clusterMatrix = clusterData(i, IDvec, data);
                if(clusterMatrix = []){
                    randval = Math.floor(Math.random()*oldData.length);
                    IDvec[randval] = i;
                    clusterMatrix = clusterData(i, IDvec, data);
                };
                centers[i] = findMode(clusterMatrix); /////////////////////
            }
            IDvec = [];
            for(i = 0; i < data.length; i++){
                IDvec.push(clusterID(centers, i));
            }
            nrUnique = IDvec.filter( onlyUnique ).length;
        }

    }

    groupStats(IDvec, data, ktest)
    return IDvec
}

function removeNames(dataIn){
    let thisObs = [];
    let fixedData = [];
    let i, j;
    for(i = 0; i < dataIn.length; i++){
        thisObs = []
        for(j = 1; j < dataIn[0].length; j++){
            thisObs.push(dataIn[i][j])
        }
        fixedData.push(thisObs);
    }
    return fixedData
}

function saveOldData(data){
    let oldData = [];
    let i, j, thisObservation;
    for( i = 0; i < data.length; i++){
        thisObservation = [];
        for(j = 0; j < data[0].length; j++){
            thisObservation.push(data[i][j])
        }
        oldData.push(thisObservation);
    }
    return oldData;
}

function groupStats(IDvec, data, k){
    let stat1 = {'percent smokers': 50};
    let stat2 = {'percentage men': 20};
    let stats = [{'stat1':stat1}, {'stat2': stat2}];
    let i;
    for(i = 0; i < k; i++){

    }

}

/////////////////////////////Functions for the algorithm
function convergenceTest(oldCenters, centers, iteration){
    let maxIteration = 100;
    let i;
    let d = 0;
    let converged = false;
    for(i = 0; i < centers.length; i++){
        d = d + distance(oldCenters[i], centers[i]);
    }
    if(d === 0) converged = true;
    if(iteration >= maxIteration) converged = true;
    return converged;
}


function findMode(clusterMatrix){
    //takes an observation matrix corresponding to ONE cluster
    let mode = [];
    let i, j, uniqueVals, col, value, thisMode;
    let freq = -1;
    for(i = 0; i < clusterMatrix[0].length; i++){
        uniqueVals = getColumn(clusterMatrix, i).filter( onlyUnique );
        freq = -1;
        col = getColumn(clusterMatrix, i);
        for(j = 0; j < uniqueVals.length; j++){
            value = uniqueVals[j];
            if(relFreq(col, value) > freq){
                freq = relFreq(col, value);
                thisMode = value;
            }
        }
        mode.push(thisMode);
    }
    return mode
}


function clusterData(clusterNr, IDvec, data){
    //Gets all datapoints coresponding to ONE cluster
    let i;
    let clusterMatrix = [];
    for(i = 0; i < data.length; i++){
        if(IDvec[i] === clusterNr){
            clusterMatrix.push(data[i]);
        }
    }
    return clusterMatrix
}


function clusterID(clusters, observation){
    //Finds the clusterID of ONE observation
    let i, ID, coin;
    let count = 100;
    for(i = 0; i < clusters.length; i++){
        if(distance(clusters[i], observation) < count){
            count = distance(clusters[i], observation);
            ID = i;
        }
        else if(distance(clusters[i], observation) === count){
            coin = coinFlip();
            ID = (ID + coin*ID)/2 + (Math.pow(coin, 2) - coin)*i/2;
        }
    }
    return ID;
}



function randomize(data){
    let center = [];
    let i, max, randomized;
    let min = 0;
    for(i = 0; i < data[0].length; i++){
        max = getColumn(data, i).filter( onlyUnique ).length;
        randomized = Math.floor(Math.random()*(max - min) + min);
        center.push(randomized);
    }
    return center;
}


///////////////////Data handling functions/////////////////////

function convertData(data, k, type){
    //let data = dataIn;
    let i;
    for(i = 0; i < data[0].length; i++){
        if(type[i] === true){    //if(data[0][i] - data[0][i] === 0){
            data = transNum(data, i, k);
        } 
        else data = transCat(data, i);
    }
    return data;
}


function transNum(data, index, k){
    let i;
    let newCol = kmeans(kmeansColumn(data, index), k);
    for(i = 0; i < data.length; i++){
        data[i][index] = newCol[i];
    }
    return data;
}


function transCat(data, index){
    let column = getColumn(data, index);
    let uniqueEntries = column.filter( onlyUnique );
    let i, j;
    for(i = 0; i < uniqueEntries.length; i++){
        for(j = 0; j < column.length; j++){
            if(column[j] === uniqueEntries[i]) data[j][index] = i;
        }
    }
    return data;
}



///////////////////////////////Math and help functions//////////////////////////////
function getColumn(data, index){
    let i;
    let column = []
    for(i = 0; i < data.length; i++){
        column.push(data[i][index]);
    }
    return column;
}

function kmeansColumn(data, index){
    let i;
    let column = []
    for(i = 0; i < data.length; i++){
        column.push([data[i][index]]);
    }
    return column;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function coinFlip(){
    let coin = Math.random()
    if(coin < 0.5) coin = -1;
    else coin = 1;
    return coin;
}

function distance(center, observation){
    let d = 0;
    let i;
    for(i = 0; i < center.length; i++){
        if(center[i] !== observation[i]) d = d + 1;
    }
    return d;
}

function relFreq(clusterCol, value){
    //takes a column with values of one variable corresponding to one cluster
    //value= the value to find the frequency of
    let i;
    let count = 0;
    for(i = 0; i < clusterCol.length; i++){
        if(clusterCol[i] === value) count = count+1;
    }
    return count;
}

//Bättre att ha sorterat efter variabel://///////////
//om siffror och < maxUnique unika, gör inget
//om siffror och > maxUnique unika, kmeans
//om bokstäver, omvandla

//Bättre att ha sorterat efter observation: /////////////
//dist mellan center och cluster
//


export {consumerClusters}