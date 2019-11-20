// Mixed algorithm i PDF s.9
function consumerClusters(dataIn, k){
    let sorted = sortByType(dataIn); //returns [[sortedData],   [nrNumeric]]
    let data = sorted[0];
    let nrNum = sorted[1]
    //data = standardizeData(data, nrNum);
    //standardize data here
    let clusterCenters = randomizeCenter(data, nrNum, k);
    let oldClusterCenters = randomizeCenter(data, nrNum, k);
    console.log('randomized centers')
    console.log(oldClusterCenters)

    return 5  
}


function randomizeCenter(data, nrNum, k){
    //takes a dataset, it can contain both numeric and catagorical data as long as all numeric are in the beginning
    //nrNum = number of numerical variables
    //k = desired number of clusters
    //returns k randomized centers with nrNum dimensions. Each dimension is uniformly distributed over min-max of data
    let clusterCenters = [];
    let thisVariable = [];
    let i, j, max, min;
    for(i = 0; i < nrNum; i++){
        thisVariable = []
        for(j = 0; j < k; j++){
            min = Math.min.apply(null, data[i]);
            max = Math.max.apply(null, data[i]);
            thisVariable.push(Math.random()*(max - min) + min);
        }
        clusterCenters.push(thisVariable);
    }
    return clusterCenters
}




//////////////Convert data of form [[consumer 1], [consumer2],...] to the form [[age], [gender]] and so on
/////////////Also all numeric vectors will be in the beginning of matrix
/////////////Also standardizes it (i.e mean 0 and stdev 1)

function sortByType(data){
    let i;
    let categData = [];
    let nrNum = 0;
    let sortedData = [];
    for(i = 0; i < data[0].length; i++){
        if(data[0][i] - data[0][i] === 0){
            sortedData.push(getColumn(data, i));
            nrNum = nrNum + 1;
        }else{
            categData.push(getColumn(data, i));
        }
    }

    for(i = 0; i < categData.length; i++){
        sortedData.push(categData[i])
    }

    return [sortedData, nrNum];
}




function getColumn(matrix, column){
    let i;
    let columnVec = [];
    for(i = 0; i < matrix.length; i++){
        columnVec[i] = matrix[i][column];
    }
    return columnVec
}


function standardizeData(data, nrNum){
    //såhär skriver man ej sum! läs hur här https://codeburst.io/javascript-arrays-finding-the-minimum-maximum-sum-average-values-f02f1b0ce332
    let i, mean, stdev;
    let standardData = [];
    for(i = 0; i < nrNum; i++){
        mean = Math.sum(data[i])/data[i].length;
        stdev = Math.sqrt(Math.sum(data[i].map(x => Math.pow((x - 1), 2))))/data[i].length;
        standardData.push(data[i].map(x => (x - mean)/stdev));
    }
    return standardData
    //stdev =sqrt( sum( (x - mean)^2 ) / count(x))
    //let newVec = data[0].map(x => Math.pow((x - 1), 2));
    //data = (data - mean)/stdev;
}




export {consumerClusters}