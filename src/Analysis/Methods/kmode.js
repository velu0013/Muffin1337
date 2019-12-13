// Mixed algorithm i PDF s.9
//hur ska nrclusters defineras?
//hur många unika värden före klustra?
//k får ej vara större än maxUnique!!!
//Tänk om man slumpar gamla centers= centers på en gång??
//MÖJLIGT FIX: hur def k vector?? Hur def goodness?? konvergens om center inte flyttas på flera ggr??
import {kmeans} from '../Methods/kmeans.js'

function consumerClusters(dataIn, k, type){
    let data = convertData(dataIn, type); 
    let IDs;
    if(k === 0){
        IDs = multiCluster(data)
    }else{
        let sol = singleCluster(data, k) 
        IDs = sol[0]
    }

    return IDs
}


function singleCluster(data, k){
    let centers = [];
    let oldCenters = [];
    let i, IDvec;
    let iter = 0;
    for(i = 0; i < k; i++){ //initialize centers and old centers
        centers.push(randomize(data))
        oldCenters.push(randomize(data))
    }

    while(convergenceTest(oldCenters, centers, iter) === false){
        IDvec = [];
        for(i = 0; i < data.length; i++){
            IDvec.push(clusterID(centers, data[i])); //Give each data point an ID that says which cluster it belongs to
        }

        let clusterMatrix;
        oldCenters = [];
        oldCenters = copy(centers);
        centers = [];
        for(i = 0; i < k ; i++){
            clusterMatrix = clusterData(i, IDvec, data); //A matrix with observations that belong to this cluster
            if(clusterMatrix[0] === undefined){ //if no points belong to this cluster, randomize a new center
                centers.push(randomize(data))
            }else{
                centers.push(findMode(clusterMatrix))//otherwise find the mode od this center as most common categories
            }
        }
        iter = iter + 1;
    }
    return [IDvec, centers]
}


//MÖJLIGT FIX: centrena ska inte ha ändrats på flera iterationer?
//Skriv ut meddelande om den når max iterationer?
//Vart definiera max iterationer? ha som input?
/////////////////////////////Functions for the algorithm
function convergenceTest(oldCenters, centers, iteration){
    /*Tests for convergence by seing if all cluster centers have stopped changing (or maximum iterations are reached)
    Inputs: centers from last iteration, latest centers and how many iterations the algorithm has run*/ 
    let maxIteration = 10000; //max allowed iterations before program stopped
    let i;
    let d = 0; //summed distances between old and new centers. Converged if it is zero
    let converged = false; //change this if test shows convergence
    for(i = 0; i < centers.length; i++){ //loop over all centers
        d = d + distance(oldCenters[i], centers[i]); //add distance between old and new of current center
    }
    if(d === 0) converged = true; //If all distances are zero: converged
    if(iteration >= maxIteration) converged = true; //If no more iterations allowed: converged
    return converged; //Return if convergence is true/false
}

//MÖJLIIGT FIX:
//Tänk om flera värden finns lika många gånger?
function findMode(clusterMatrix){
    /*Finds mode of one center. Each variable is assigned the value that appears most in observations in the cluster
    Takes: A matrix of observations that belong to this cluster [[obs1], [obs2],...], each obs is a vector with one
        value per observation
    Returns: A vector of length= nr variables, corresponding to this centers mode*/
    let mode = []; //Will be the returned mode vector
    let i, j, uniqueVals, col, value, thisMode;
    let freq = -1; //How many times most frequent value of a variable appears. Start at -1 to assure assignment.
    for(i = 0; i < clusterMatrix[0].length; i++){ //loop over each variable
        uniqueVals = getColumn(clusterMatrix, i).filter( onlyUnique ); // Vector of unique values for one variable
        freq = -1; //reset for this variable
        col = getColumn(clusterMatrix, i); 
        for(j = 0; j < uniqueVals.length; j++){ //loop over each unique value in this variable
            value = uniqueVals[j]; //How many times this value appears
            if(relFreq(col, value) > freq){ //is it the most appeared value so far?
                freq = relFreq(col, value); //if so: set freq to freq of this value
                thisMode = value;//the mode of this variable is this value
            }
        }
        mode.push(thisMode); //Push in the most appeared value for this variable
    }
    return mode //Return vec of most appearing value for every variable
}


function clusterData(clusterNr, IDvec, data){
    /*Makes a matrix with observations corresponding to ONE cluster
    Takes: which center, vector if IDs for each observation, data vector with vectors corresponding to each observati
    Returns: A vector of vectors corresponding to observations in this cluster*/ 
    let i;
    let clusterMatrix = []; //The matrix of observations in this cluster
    for(i = 0; i < data.length; i++){ //loop over every observation
        if(IDvec[i] === clusterNr){ //is the ID of this observation = this cluster?:
            clusterMatrix.push(data[i]); //thn add this observation to the matrix
        }
    }
    return clusterMatrix //Return matrix with vectors of observations in this cluster
}

//MÖJLIGT FIX:
//Vad bör minDist initieras som? 100 + första dist?
function clusterID(clusters, observation){
    /*Finds which cluster ONE observation belongs to
    Takes: the mode of each center, the mode of the observation
    Gives: A number corresponding to the ID of this observation*/
    let i, ID, coin;
    let minDist = 100; //min distance to a center so far. Set high to assure first value gets assigned.
    for(i = 0; i < clusters.length; i++){ //loop over every center
        if(distance(clusters[i], observation) < minDist){//If dist to this cluster smallest so far:
            minDist = distance(clusters[i], observation);//then minDist is distance to this cluster
            ID = i; //The ID is this cluster
        }
        else if(distance(clusters[i], observation) === minDist){ //if dist to this center = last smallest dist:
            coin = coinFlip(); //Randomize a value either -1 or 1 with same probability
            ID = (ID + coin*ID)/2 + (Math.pow(coin, 2) - coin)*i/2;//ID is either last one or this one dep on coin
        }
    }
    return ID; //Return which cluster is the closest
}

//MÖJLIGT FIX: ANTAR ATT DATA KONVERTERAT TILL 0, 1, 2,... EJ 4, 2, 10 OSV
//Slumpa uniformt över alla möjliga värden, eller sätt fördelning??
function randomize(data){
    /* Randomize a center. It has a value for each variable corresponding to an existing value from observsations 
    Takes: the data to randomize a new point from (so matching nr variables and existing vals)
    Gives: A randomized observation with correct nr variables and only existing values*/
    let center = []; 
    let i, max, randomized;
    let min = 0;
    for(i = 0; i < data[0].length; i++){ //loop over every variable
        max = getColumn(data, i).filter( onlyUnique ).length; //egentligen max möjligt värde + 1, men runda ner sen
        randomized = Math.floor(Math.random()*(max - min) + min); //slumpa ett värde bland de existerande
        center.push(randomized); //push randomized value in to center vector
    }
    return center; //return "mode" (i.e. which category each variable has for this center)
}


///////////////////Data handling functions/////////////////////

function convertData(data, type){
    /*Converts numerical to categorical by k-means, and cateorical to ascending numbers starting from 0 
    Takes: data to convert of form [[a], [b],...] where [a], [b],... correspond to an observation vector
        , and a vector identifying which variables are numerical, i.e. in ex [true, false, false] firat val
        is numerical and the rest categorical
    Returns: Converted data of same form but converted values*/
    let i;
    for(i = 0; i < data[0].length; i++){ //loop over every variable
        if(type[i] === true){    //if type is numeric
            data = transNum(data, i); //transform by function that transforms numeric values
        } 
        else data = transCat(data, i); //If not numeric it is categorical. Then transfer by categorical trans func
    }
    return data; //return transformed data
}

//MÖJLIGT FIX
//Nu pekare. Ändra det???
function transNum(data, index){
    /*Transforms numerical variable in data to categorical by k-means
    Takes: full data matrix (a vector of vectors corresponding to each observation), and index of variable to convert
    Returns: full tata matrix but with transformed values in variable "index"*/
    let i;
    let newCol = kmeans(kmeansColumn(data, index), 0); //create column with values for this var from kmeans
    for(i = 0; i < data.length; i++){ //loop over every observation
        data[i][index] = newCol[i]; //switch value in data ofcurrent observation and this variable
    }
    return data; //return fixed data
}

//MÖJLIGT FIX:
//tänk om... 3e unique entry är 0, först dör om alla i första unique entries = i_1 = 0, sen blir de 2 istället
function transCat(data, index){
    /*catagorical values in data to be ascending integers starting from 0
    Takes: full data matrix (i.e a vector of vectors corresponding to each observation) and index of var to transform
    Returns: full tata matrix but with transformed values in variable "index"*/
    let column = getColumn(data, index); //column of values in this variable
    let uniqueEntries = column.filter( onlyUnique ); //a vector of the unique entries in the vasriable
    let i, j;
    for(i = 0; i < uniqueEntries.length; i++){ //loop over each unique entry
        for(j = 0; j < column.length; j++){ //loop over each observation
            if(column[j] === uniqueEntries[i]) data[j][index] = i; //if val of this observation === this unique entry:
                                                                   // switch the value to i
        }
    }
    return data; //return fixed data
}



///////////////////////////////Math and help functions//////////////////////////////
function getColumn(data, index){
    /*creates a vector with values corresponding to one variable
    Takes:data (a vector of vectors corresponding to each observation) and index of variable to extract*/
    let i;
    let column = []
    for(i = 0; i < data.length; i++){ // loop over every observation
        column.push(data[i][index]); //push value of the variable for this observation
    }
    return column; 
}

function copy(matrix){
    let thisVec, i, j;
    let copy = [];
    for(i = 0; i < matrix.length; i++){
        thisVec = [];
        for(j = 0; j < matrix[0].length; j++){
            thisVec.push(matrix[i][j])
        }
        copy.push(thisVec)
    }
    return copy;
}

function kmeansColumn(data, index){
    /*creates a vector of values corresponding to one variable IN THE FORM THAT KMEANS TAKES IT
    Takes:data (a vector of vectors corresponding to each observation) and index of variable to extract
    Returns: an extracted vector*/
    let i;
    let column = []
    for(i = 0; i < data.length; i++){ //loop over every observation
        column.push([data[i][index]]); //push value of the variable for this observation
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
    /*Finds the distance between two observations (a center is of same form as an observation). Here the distance is
        defined as number of categories that do not match
    Takes: a vector of values corresponding to each valuable for both observations
    Returns: A scalar distance */
    let d = 0;
    let i;
    for(i = 0; i < center.length; i++){
        if(center[i] !== observation[i]) d = d + 1; //If the category in this variable does not match, add 1
    }
    return d;
}


function relFreq(col, value){
    /*Finds how many times a variable appears in a column 
    Takes: a column to count from and a value to count*/
    let i;
    let count = 0;
    for(i = 0; i < col.length; i++){ //loop through entire vector
        if(col[i] === value) count = count+1; //if value in vector is the one to count, add 1
    }
    return count;
}

//////////////////////////Functions for auto/////////////////////////////////
function multiCluster(data){
    let theBest = 0;
    let i, centers, sol, IDvec, IDs;
    let kVec = makeKvec(data);
    for(i = 0; i < kVec.length; i++){
        sol = singleCluster(data, kVec[i]);
        IDvec = sol[0];
        centers = sol[1];
        if(goodness(IDvec, data, centers) > theBest){
            IDs = IDvec;
            theBest = goodness(IDvec, data, centers);
        }
    }
    return IDs
}

function makeKvec(data){
    //it should not test for more clusters than 1/2 the number of observations
    //it should not test for more clusters than 1/2 the number of unique values for the variable with most unique vals
    let max = Math.ceil(data.length/2);
    let i, nrUnique;
    let nrUniqueMax = 0;
    for(i = 0; i < data[0].length; i++){
        nrUnique = getColumn(data, i).filter( onlyUnique ).length;;
        if(nrUnique > nrUniqueMax) nrUniqueMax = nrUnique;
    }
    if(nrUniqueMax < max) max = nrUniqueMax;
    let k = 2;
    let kVec = [];
    while(k <= max){
        kVec.push(k)
        k = k + 1;
    }
    return kVec
}


/*
function makeKvec(data){
    let max = Math.floor(data.length/2)
    let nrUnique = 0;
    let i, thisVar;
    let maxUnique = 0;
    for(i = 0; i < data[0].length; i++){
        thisVar = getColumn(data, i)
        nrUnique = thisVar.filter( onlyUnique ).length;
        if(nrUnique > maxUnique) maxUnique = nrUnique;
    }
    if(maxUnique < max) max = maxUnique;

    let count = 2;
    let kVec = []
    while(count < max + 1){
        kVec.push(count)
        count = count + 1;
    }
    return kVec
}
*/



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
    /*Sums the distance between every point IN TH CLUSTER and ONE cluster 
    Takes: all data IN THE CLUSTER, vector for the center (one val for each variable)
    Returns: the sum*/
    let i;
    let sum = 0;
    for(i = 0; i < clusterMatrix.length; i++){
        sum = sum + distance(clusterMatrix[i], center);
    }
    return sum;
}



function distAll(data, center){
    /*Sums the distance between every point and ONE cluster 
    Takes: all data, vector for the center (one val for each variable)
    Returns: the sum*/
    let i;
    let sum = 0;
    for(i = 0; i < data.length; i++){
        sum = sum + distance(data[i], center)
    }
    return sum;
} 

//Bättre att ha sorterat efter variabel://///////////
//om siffror och < maxUnique unika, gör inget
//om siffror och > maxUnique unika, kmeans
//om bokstäver, omvandla

//Bättre att ha sorterat efter observation: /////////////
//dist mellan center och cluster
//


export {consumerClusters}