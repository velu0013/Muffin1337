//antal clusters och nr unique???
// naive k-means kluster analysis, kräver antal , klarar hur många dim som helst

/*
To do: 
    - print "did not converge" if max iterations??
    - print om den ger för få kluster?

Algorithm:
    1: randomize clustercenters
    2: assign each observation to nearest center
    3: recalculate center based on data in that cluster
    Repeat until old clusters = new clusters 


//Möjliga fel: 
    - initierade "oldClusterCenters" slumpmässigt, kan de hamna för nära?
    - ska den kunna returnera ett kluster utan tillhörande datapunkter?
*/


//Ta med antal unika för att inte testa så många kluster att det blir fel!!
//Ta inte med första vektorn!!


function kmeans(dataIn, k){
    //k = 0;
    let data = standardize(dataIn)
    let IDvec, single, kVec, multi;
    if(k === 0){
        kVec = makeKvec(dataIn) //[2, 3, 4, 5, 6, 7, 8, 9];
        multi = multiK(data, kVec)
        IDvec = multi[0];
        k = multi[1];
    }else{
        single = singeK(data, k)
        IDvec = single[0];
    }

    kVec = [k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k, k]
    multi = multiK(data, kVec)
    IDvec = multi[0];
    return IDvec
}





function makeKvec(data){
    let max = Math.floor(data.length/3)
    let nrUnique = 0;
    let i, thisVar;
    for(i = 0; i < data[0].length; i++){
        thisVar = getColumn(data, i)
        nrUnique = thisVar.filter( onlyUnique ).length;
        if(nrUnique < max) max = nrUnique;
    }

    let count = 2;
    let kVec = []
    while(count < max ){
        kVec.push(count)
        count = count + 1;
    }
    return kVec
}

function standardize(data){
    let i,j;
    //standardisera varje variabel var för sig
    let stdev = []; //sqrt( sum( (x - mean)^2 ) / count(x))
    let mean = [];
    for(i = 0; i < data[0].length; i++){
        mean[i] = 0;
        for(j = 0; j < data.length; j++){
            mean[i] = mean[i] + data[j][i];
        }
        mean[i] = mean[i]/data.length;
    }


    for(i = 0; i < data[0].length; i++){
        stdev[i] = 0;
        for(j = 0; j < data.length; j++){
            stdev[i] = stdev[i] + Math.pow(data[j][i]-mean[i], 2);
        }
        stdev[i] = Math.sqrt(stdev[i])/data.length;
    }


    let newData = [];
    let thisObservation = [];
    for(i = 0; i < data.length; i++){
        thisObservation = [];
        for(j = 0; j < data[0].length; j++){
            thisObservation.push((data[i][j] - mean[j])/stdev[j])
        }
        newData.push(thisObservation);
    }
    return newData;
}


function multiK(dataIn, kVec){
    //let kVec = [2, 3, 4];
    let single, IDvec, centers, howGood, theBest, bestIDvec, k, i;
    theBest = 0;
    for(i = 0; i < kVec.length; i++){
        single = singeK(dataIn, kVec[i])
        IDvec = single[0];
        centers = single[1]
        howGood = goodness(IDvec, dataIn, centers)
        if(howGood > theBest){
            theBest = howGood;
            bestIDvec = IDvec;
            k = kVec[i]
        }
    }
    return [bestIDvec, k]
}

function goodness(IDvec, data, centers){
    // abs(sum(all) - 2*sum(within))
    // average over all centers!!
    let i, clusterMatrix, center; 
    let goodness = 0;
    for(i = 0; i < centers.length; i++){
        clusterMatrix = clusterData(i, IDvec, data);
        center = centers[i];
        goodness = goodness + distAll(data, center) - 2*distWithin(clusterMatrix, center);
    }
    goodness = goodness / centers.length;
    //clusterMatrix = clusterData(i, IDvec, data); i vilket center
    return goodness;
}

function distWithin(clusterMatrix, center){
    //for ONE cluster: sum dist from each point to center
    let i;
    let sum = 0;
    for(i = 0; i < clusterMatrix.length; i++){
        sum = sum + distance(clusterMatrix[i], center);
    }
    return sum;
}

function distAll(data, center){
    //for ONE center: sum dist from each point to that center
    let i;
    let sum = 0;
    for(i = 0; i < data.length; i++){
        sum = sum + distance(data[i], center)
    }
    return sum;
} 

/*
0:  1, 2, 3, 4, 5
1:  2, 3, 4, 5
2:  3, 4, 5, 
3:  4, 5
4:  5
5:  
*/

///////////////////////////////////// kmeans huvudfunktion ///////////////////////////////////
function singeK(dataIn, k){
    let data = copy(dataIn);

    let i;
    let centers = [];
    let IDvec = [];
    let oldCenters = [];
    let ktest = k;
    let nrUnique = 0;
    while(nrUnique < ktest){
        centers = []
        oldCenters = []
        for(i = 0; i < ktest; i++){
            centers.push(randomize(data))           //initiate centers
            oldCenters.push(randomize(data))        //initiate old centers
        }
    
        IDvec = [];
        for(i = 0; i < data.length; i++){
            IDvec.push(clusterID(centers, data[i]));
        }
        nrUnique = IDvec.filter( onlyUnique ).length;
    }

    let iteration = 0;
    let clusterMatrix;
    let randval;
    nrUnique = 0;
    while(convergenceTest(oldCenters, centers, iteration) === false){
        iteration = iteration + 1;
        while(nrUnique < ktest){
            for(i = 0; i < centers.length; i++){
                oldCenters[i] = centers[i];
                clusterMatrix = clusterData(i, IDvec, data);
                if(clusterMatrix = []){
                    randval = Math.floor(Math.random()*data.length);
                    IDvec[randval] = i;
                    clusterMatrix = clusterData(i, IDvec, data);
                };
                centers[i] = findCenter(clusterMatrix); /////////////////////
            }
            IDvec = [];
            for(i = 0; i < data.length; i++){
                IDvec.push(clusterID(centers, data[i]));
            }
            nrUnique = IDvec.filter( onlyUnique ).length;
        }

    }
    return [IDvec, centers]
}
//////////////////////////////////////////////////////////////////////////////

function randomize(data){
    //randomizes ONE center
    let center = [];
    let i, max, randomized;
    let min = 0;
    for(i = 0; i < data[0].length; i++){
        max = getColumn(data, i).filter( onlyUnique ).length;
        randomized = Math.random()*(max - min) + min;
        center.push(randomized);
    }
    return center;
}

function clusterID(clusters, observation){
    //Finds the clusterID of ONE observation
    let i, ID, coin;
    let count = 100000000000000;
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

function convergenceTest(oldCenters, centers, iteration){
    let maxIteration = 10000;
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

function findCenter(clusterMatrix){
    //takes an observation matrix corresponding to ONE cluster
    let i, j, thisVar, sum;
    let center = [];
    for(i = 0; i < clusterMatrix[0].length; i++){
        thisVar = getColumn(clusterMatrix, i);
        sum = 0;
        for(j = 0; j < clusterMatrix.length; j++){
            sum = sum + thisVar[j];
        }
        center.push(sum/clusterMatrix.length)
    }

    return center;
}

//////////////////////////////////////////////////////////////////////////
function copy(data){
    let i;
    let copy = [];
    for(i = 0; i < data.length; i++){
        copy.push(data[i])
    }
    return copy;
}

function getColumn(data, index){
    let i;
    let column = []
    for(i = 0; i < data.length; i++){
        column.push(data[i][index]);
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
    //square distance between one center and one observation
    let d = 0;
    let i;
    for(i = 0; i < center.length; i++){
        d = d + Math.pow(center[i] - observation[i], 2)
    }
    return d;
}



export {kmeans} 