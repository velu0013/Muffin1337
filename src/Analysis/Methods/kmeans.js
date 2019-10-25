// naive k-means kluster analysis, kräver antal , klarar hur många dim som helst

/*To do:
    hur många kluster? vart definiera? gör så att clusterassignment kan ta godtyckligt antal (nu bara 2)
    hur många max iterationer ska jag ta??
    slumpa första klustercenter + i setclustercenter slumpa om ett kluster inte innehåller några datapunkter
    motverka att klustercenter är samma?? (knas i clusterassignmentfunktion annars)
    välj tol i convergencetest
    gör 2d
*/



function kmeans(num){;
    num = [1, 2, 3, 1, 2, 3, 7, 8, 9, 7, 8, 9, 7, 8, 9, 1, 2, 3, 1, 2, 3, 7, 8, 9]; //godtyckligt data
    const num2 = [1, 2, 3, 1, 2, 3, 7, 8, 9, 7, 8, 9, 7, 8, 9, 1, 2, 3, 1, 2, 3, 7, 8, 9]; //godtyckligt data
    const data = [num, num2]

    var oldClusterCenter = [[4, 6], [4, 6]]; //vector with length number of clusters. Each entry contains vec length *dim*
    var clusterCenter = [[5, 6], [5, 6]];

    var count = 0;
    while(convergenceTest(clusterCenter[0], oldClusterCenter, count)==false){
        count = count + 1;
        var c = clusterAssignment(data, clusterCenter[0]);
        oldClusterCenter = clusterCenter[0]
        clusterCenter = setClusterCenters(c);
    }

    return nameClustercenter(c);
}



function convergenceTest(clusterCenter, oldClusterCenter, iteration){
    var i = 0;
    const tol = 0.1;
    var maxIterations = 1;
    var isConverged = false;
    if(Math.abs(oldClusterCenter-clusterCenter)<tol) isConverged = true;
    if(iteration==maxIterations) isConverged = true;
    return isConverged;
}



function clusterAssignment(data, clusterCenters){
    /*
        Nu är data en vektor med värden. Gör till en vektor med vektorer
    */ 

    data = data[0]

   const k = clusterCenters.length; //number of clusters
   var vectorOfLengths = [];
   var c = []; // vektor med vektorer av avstånd till klustercenter. Varje center har egen vec. data till andra center = 0
   var i = 0;
    for (i = 0; i<=k-1; i++){
        var temp = [];
        var j = 0;
        for (j = 0; j<=data.length-1; j++){ //loopa över varje datapunkt
            var l = 0
            for (l = 0; l<=k-1; l++){
                vectorOfLengths[l] = Math.abs(data[j] - clusterCenters[l])
            }
            var nearest = Math.min.apply(null, vectorOfLengths)
            if(nearest == Math.abs(data[j] - clusterCenters[i])){
                temp[j] = Math.abs(data[j] - clusterCenters[i]); //Temp ska va ci[j]. är den det? ja :(
            } else {
                temp[j] = 0;
            }
        }
        c[i] = temp;
    }
    return c;
}



function findDistance(A, B){
    //A is an arrays corresponding to one datapoint. length is length of analysisdimension. Usually 2.
    //B is array corresponding to one cluster.  -||-
    var i = 0;
    var distance = 0;
    for (i = 0; i <=A.length-1; i++){ //loop over every dimension. Usually 2.
        var diff = A[i] - B[i];
        distance = distance + Math.pow(diff,2);
    }
    return Math.sqrt(distance);
}

/*
    skriv om    Math.abs(data[j] - clusterCenters[l]) till
    sqrt(   (data[1][1]-clustercenters[1][1])^2     +    (data[1][2]-clustercenters[1][2])^2    +...    )
 */




function setClusterCenters(c){
    var M = [];
    var i = 0;
    for(i = 0; i<= c.length-1; i++){
        M[i] = eval(c[i].join('+'))/countNonzero(c[i]);
    }
    return M;
}




function countNonzero(vector){
    var count = 0;
    var i = 0;
    for (i=0; i<=vector.length-1; i++){
        if(Math.abs(vector[i])>0) count = count + 1;
    }
    return count;
}




function nameClustercenter(c){
    var clusterName = [];
    // för varje kluster: gå igenom motsvarande c. om c inte = 0 sätt clustername[m(datapnkt)] = det klustret
    var i = 0;
    for(i = 0; i<= c.length-1; i++){
        var j = 0;
        var temp = c[i];
        for(j = 0; j<= c[0].length; j++){
            if(temp[j]!=0){
                clusterName[j] = i;
            }
        }
    }
    return clusterName;
}




export {kmeans} 
