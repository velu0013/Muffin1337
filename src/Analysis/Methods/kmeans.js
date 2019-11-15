// naive k-means kluster analysis, kräver antal , klarar hur många dim som helst

/*
To do: 
    - fix randomizer so all vals aren't the same..
    - print "did not converge" if max iterations??
    - if no point belongs to cluster, randomize its position
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


function kmeans(data, k){
    //data dim = nrObservations*nrVariabler
        const tol = Math.abs(getSpan(data)[0] - getSpan(data)[1])/100; //Choose what to divide the smallest distance by
        const maxIterations = 1000; //How many iterations before it stops if it doesn't converge
        let count = 0; //count iterations for convergence test
        let clusterCenters = initializeCluster(data,k);
        let oldClusterCenters = initializeCluster(data, k);
    
        while(convergencetest(clusterCenters, oldClusterCenters, count, tol, maxIterations)===false){
            let ID = assignToCluster(data, clusterCenters);
            clusterCenters = findClusterCenter(data, ID, k); 
            count = count + 1; 
        }
    
        console.log('ClusterID:')
        console.log(assignToCluster(data, clusterCenters))
        return assignToCluster(data, clusterCenters);
    }
    
    
    
    function assignToCluster(data, clusterCenters){
        let i, j;
        let clusterID = [];
        for(i = 0; i < data.length; i++){
            let thisObservation = new Array(clusterCenters.length).fill(data[i])
            let diffVec = vecDistances(clusterCenters, thisObservation);
            for(j = 0; j < clusterCenters.length; j++){
                if(Math.min.apply(null, diffVec) === diffVec[j]) clusterID[i] = j;
            }
        }
        return clusterID;
    }
    
    
    
    
    function convergencetest(clusterCenters, oldClusterCenters, count, tol, maxIterations){
        let isConverged = false;
        let diffVec = vecDistances(clusterCenters, oldClusterCenters);
        if (count >= maxIterations) isConverged = true; //Break if too many iterations have gone by without convergence
        if(Math.max.apply(null, diffVec) < tol) isConverged = true;
        return isConverged;   
    }
    
    
    
    
    function findClusterCenter(data, clusterID, k){
        let i, j;
        let clusterCenters = [];
        let divider = 0;
    
        for(i = 0; i < k; i++){
            divider = 0;
            clusterCenters[i] = new Array(data[0].length).fill(0);
            for(j = 0; j < clusterID.length; j++){
                if(clusterID[j] == i){                 //if observation[j] belongs to cluster[i]
                    divider = divider + 1;
                    clusterCenters[i] = vecAdd(clusterCenters[i], data[j]); //add observation[j] to center[i]
                } 
            }
            if(divider !== 0) clusterCenters[i] = vecDiv(clusterCenters[i], divider);
            else clusterCenters[i] = initializeCluster(data, k)[0];
        }
        return clusterCenters;
    }
    
    
    
    
    
    //////////////////////Math functions: max/min of matrix, vecnorm, settol, randomize center////////////////////
    
    function initializeCluster(data, k){
        let i, j;
        let cluster = [];
        let thisObservation = [];
        const span = getSpan(data);
        for(i = 0; i < k; i++){
            thisObservation = [];
            for(j = 0; j < data[0].length; j++){
                thisObservation[j] = Math.random()*(span[1] - span[0]) + span[0];
            }
            cluster[i] = thisObservation;
        }
        return cluster;
    }
    
    
    function getSpan(data){
        //takes a vector of vectors
        //returns the smalles and largest value in the entire matrix
        const maxVec = data.map(x => Math.max.apply(null, x));
        const minVec = data.map(x => Math.min.apply(null, x));
        const span= [Math.min.apply(null, minVec), Math.max.apply(null, maxVec)];
        return span;
    }
    
    function vecDistances(matrixA, matrixB){
        //takes two vectors of vectors
        //returns a vector of the distance between each matching vector, i.e norm(matrixA[1]- mattrixB[1]) and so on
        let i; 
        let diffVec = [];
        for(i = 0; i < matrixA.length; i++){
            diffVec[i] = (vecNorm(vecSubtraction(matrixA[i], matrixB[i])));
        }
        return diffVec;
    }
    
    function vecNorm(vec){
        //takes a vector of scalars and returns the norm of that vector
        let vecSquared = vec.map(x => Math.pow(x, 2)); //square all elements in vector
        const arrSum = arr => arr.reduce((a,b) => a + b, 0); //function that sums elements in array
        let sum = arrSum(vecSquared); //sum the vector of squared values
        let norm = Math.sqrt(sum); //take the square root of the sum
        return norm;
    }
    
    function vecSubtraction(vecA, vecB){
        //takes 2 vectors of same size and subtracts them element by element
        //returns a vector of same size
        var x = vecA.map(function(n, i) {return n - vecB[i];})
        return x;
    }
    
    function vecAdd(vecA, vecB){
        //takes 2 vectors of same size and adds them element by element
        //returns a vector of same size
        var x = vecA.map(function(n, i) {return n + vecB[i];})
        return x;
    }
    
    function vecDiv(vec, divider){
        //takes a vector and a value to divide each element by
        //returns a vector of same size:  vec/divider
        let i;
        let x = [];
        for(i = 0; i < vec.length; i++){
            x[i] = vec[i] / divider;
        }
        return x;
    }

export {kmeans} 




