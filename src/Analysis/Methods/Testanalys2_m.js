// naive k-means kluster analysis, kräver antal kluster

/*To do:
    hur många kluster? vart definiera? gör så att clusterassignment kan ta godtyckligt antal (nu bara 2)
    hur många max iterationer ska jag ta??
    slumpa första klustercenter + i setclustercenter slumpa om ett kluster inte innehåller några datapunkter
    motverka att klustercenter är samma?? (knas i clusterassignmentfunktion annars)
    välj tol i convergencetest
*/



function method2(data, nrClusters){;
    var oldClusterCenter = generateRandom(data, nrClusters); //vector with length number of clusters. Each entry contains vec length *dim*
    var clusterCenters = generateRandom(data, nrClusters);
    var count = 0;

    while(convergenceTest(clusterCenters, oldClusterCenter, count, data)==false){
        count = count + 1;
        var c = clusterAssignment(data, clusterCenters);
        oldClusterCenter = clusterCenters
        clusterCenters = setClusterCenters(c, data);

    }


    //return c;
    return nameClustercenter(c); 
}








function generateRandom(data, nrClusters){
    var min = [];
    var max = [];
    var j = 0;
    for(j = 0; j < data[0].length; j++){
        min[j] = Math.min.apply(null, data[j]);
        max[j] = Math.max.apply(null, data[j]);
    }
    const MIN = Math.min.apply(null, min);
    const MAX = Math.max.apply(null, max);


    var clusterCenters = [];
    var i = 0;
    for(i = 0; i <= nrClusters - 1; i++){
        var clusterCoordinates = [];
        var j = 0;
        for(j = 0; j <= data[0].length - 1; j++){
            clusterCoordinates[j] = Math.random()*MAX;
            while(clusterCoordinates[j] < MIN){
                clusterCoordinates[j] = Math.random()*MAX; 
            }
        }
        clusterCenters[i] = clusterCoordinates;
    }
    return clusterCenters;
}



function convergenceTest(clusterCenter, oldClusterCenter, iteration, data){
    const tol = setTol(data);
    var maxIterations = 1000;
    var isConverged = true;
    var i = 0;
    for(i = 0; i<=clusterCenter.length - 1; i++){
        if(findDistance(oldClusterCenter[i], clusterCenter[i])>tol) isConverged = false;
    }

    if(iteration==maxIterations) isConverged = true;
    return isConverged;
}

function setTol(data){
    // gå igenom varje punkt: loopa genom alla andra och kolla avstånd
    // spara varje avstånd i en vek med dim nrobserv*nrobserv
    // tol = min(distances)/100
    var minDistance = findDistance(data[0], data[1]);
    var i = 0;
    for(i = 0; i < data.length; i++){
        var j = 0;
        for(j = 0; j < data.length; j++){
            if(findDistance(data[i], data[j]) < minDistance && i != j && findDistance(data[i], data[j]) > 0){
                minDistance = findDistance(data[i], data[j]);
            }
        }
    }
    var tol = minDistance/10;
    return tol;
}



function clusterAssignment(data, clusterCenters){
        // Returnera en matris c: 
        //c har en vektor för varje klustercenter
        //varje klusters vektor innehåller längden från varje datapkt till centret. 0 för de som inte tillhör det klustret 
        //kom ihåg! Varje datapunkt kan ha flera dims
        //behandla data som vektor med en vektor för varje datapunkt. 
        //data[0].length = antal variabler
        //data.length = antal observationer
        var c = [];
        var i = 0;
        for(i = 0; i<=clusterCenters.length - 1; i++){
            var distFromPoint = [];
            var j = 0;
            for(j = 0; j<=data.length - 1; j++){
                //distFromPoint[j] = findDistance(clusterCenters[j], data[i]);
                distFromPoint[j] = findDistance(clusterCenters[i], data[j]);
            }
            c[i] = distFromPoint;
        }

        var i = 0;
        for(i = 0; i <= data.length - 1; i++){
            var observationToCenter = [];
            var j = 0;
            for(j = 0; j <= clusterCenters.length - 1; j++){
                observationToCenter[j] = c[j][i];
            }
 
            var j = 0;
            for(j = 0; j <= clusterCenters.length - 1; j++){
                if(Math.min.apply(null, observationToCenter) == c[j][i]) c[j][i] = c[j][i];
                else c[j][i] = 0;
            }
        
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



//gå igenom varje kluster, c har en vek för varje kluster
//för visst kluster, gå igenom varje variabel och summera för den variabeln
//dela varje summa med antal non zero
// M = en vek/kluster, varje vek har ett värde per variabel



//c = (antalkluster, antalobservationer)
//c = [[längd varje obs till det klustret],     [-||-],...]
//M = (antal kluster, antal variabler)
//M = [[kluster1 koordinater],      [kluster2koordinater],...]
function setClusterCenters(c, data){
    var M = [];
    var i = 0;
    for(i = 0; i <= c.length - 1; i++){ //gå igenom varje kluster
        var clusterCoordinates = [];
        var j = 0;
        for(j = 0; j <= data[0].length - 1; j++){ //gå igenom varje variabel
            clusterCoordinates[j] = 0;
            var k = 0;
            for(k = 0; k <= data.length - 1; k++){ //gå igenom varje datapunkt
                if(c[i][k] !== 0)    clusterCoordinates[j] = clusterCoordinates[j] + data[k][j];
            }
            if(countNonzero(c[i]) != 0) clusterCoordinates[j] = clusterCoordinates[j]/countNonzero(c[i]);
            else clusterCoordinates[j] = 0;
        }
        M[i] = clusterCoordinates;
    }

    var i = 0;
    for(i = 0; i < c.length; i++){
        if(countNonzero(c[i]) === 0) M[i] = generateRandom(data, c.length)[0];
    }

    return M;
}
/*
function setClusterCenters(c, data){
    //c = [avst variabel1 för varje observation]    [avst variabel1 för varje observation] ...
    var M = [];
    var temp = [];
    var i = 0;
    for(i = 0; i <= c.length - 1; i++){ //gå igenom varje kluster
        var j = 0;
        for(j = 0; j <= data.length - 1; j++){ // gå igenom varje observation
            var k = 0;
            for(k = 0; k <= data[0].length - 1; k++){ //gå igenom varje variabel i den observationen
                M[i][k] = M[i][k] + data[j][k]; 
            }
        }
        M[i] = M[i]/countNonzero(c[i]);

    }
    return M;
}
*/


function countNonzero(vector){
    var count = 0;
    var i = 0;
    for (i = 0; i<=vector.length-1; i++){
        if(Math.abs(vector[i])>0) count = count + 1;
    }
    return count;
}



function nameClustercenter(c){
    var clusterName = [];
    // för varje kluster: gå igenom motsvarande c. om c inte = 0 sätt clustername[m(datapnkt)] = det klustret
    //c har en vek per kluster. Varje vek innehåller dist från viss observation
    var i = 0;
    for(i = 0; i <= c[0].length - 1; i++){
        var j = 0;
        for (j = 0; j <= c.length - 1; j++){
            if(c[j][i] != 0) clusterName[i] = j;
        }
    }

    return clusterName;
}


export {method2} 

/*
    var i = 0;
    for(i = 0; i < c.length; i++){
        var nrPtsInCluster = 0;
        var j = 0;
        for(j = 0; j < clusterName.length; j++){
            if(clusterName[j] === i) nrPtsInCluster = nrPtsInCluster + 1;
        }

        if(nrPtsInCluster === 0) clusterName[i] = i;
    }
    */ 






/*
    Definitioner:
    -x_i: datapunkt i
    -c_i: avstång från datapunkt i till närmsta klustercenter
    -M_j: klustercenter j


    Algoritm:
    -Placera slumpmässigt ut klustercenter M_1, M_2,...

    Tills convergence (max iterationer eller kluster slutar ändras)
        for i = 1:antal datapunkter
            c_i = avstånd närmsta center
        end


        for j = 1:antal kluster
            M_j = medelvärdet av varje datapunkt i det klustret
            om inga datapunkter finns, assigna slumpmässigt värde
        end
*/

