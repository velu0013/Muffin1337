// naive k-means kluster analysis, kräver antal kluster

/*To do:
    hur många kluster? vart definiera? gör så att clusterassignment kan ta godtyckligt antal (nu bara 2)
    hur många max iterationer ska jag ta??
    slumpa första klustercenter + i setclustercenter slumpa om ett kluster inte innehåller några datapunkter
    motverka att klustercenter är samma?? (knas i clusterassignmentfunktion annars)
    välj tol i convergencetest
*/



function method2(num){;
    num = [1, 2, 3, 1, 2, 3, 7, 8, 9, 7, 8, 9, 7, 8, 9, 1, 2, 3, 1, 2, 3, 7, 8, 9]; //godtyckligt data
    var oldClusterCenter = [4, 6];
    var clusterCenter = [5, 6];
    var count = 0;

    while(convergenceTest(clusterCenter, oldClusterCenter, count)==false){
        count = count + 1;
        var [c1, c2] = clusterAssignment(num, clusterCenter);
        oldClusterCenter = clusterCenter
        clusterCenter = setClusterCenters(c1, c2);
    }

    return nameClustercenter([c1, c2]);
}


function convergenceTest(clusterCenter, oldClusterCenter, iteration){
    var i = 0;
    const tol = 0.1;
    var maxIterations = 10;
    var isConverged = false;
    if(Math.abs(oldClusterCenter-clusterCenter)<tol) isConverged = true;
    if(iteration==maxIterations) isConverged = true;
    //if(isConverged == false) return 5
    //Se om maxiterationer är nådda
    //Se avstånd mellan förra klustercenter och nytt klustercenter mindre än tol
    return isConverged;

}



function clusterAssignment(data, clusterCenters){
    var c1 = [];
    var c2 = [];
    var i = 0;
    for (i=0; i<=data.length-1; i++){
        if(Math.abs(data[i]-clusterCenters[1])>Math.abs(data[i]-clusterCenters[0])) {
            c1[i] = Math.abs(data[i]-clusterCenters[1]);
            c2[i] = 0;
        }
        if(Math.abs(data[i]-clusterCenters[0])>Math.abs(data[i]-clusterCenters[1])){
            c2[i] = Math.abs(data[i]-clusterCenters[0]);
            c1[i] = 0;
        }
    }

    return [c1, c2];
}



function setClusterCenters(c1, c2){
    var M = [0, 0];
    M[0] = eval(c1.join('+'))/countNonzero(c1);
    M[1] = eval(c2.join('+'))/countNonzero(c2);
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

function nameClustercenter([c1, c2]){
    var clusterName = [];
    var i = 0;
    for (i=0; i<=c1.length-1; i++){
        if(c1[i]==0){
            clusterName[i] = 2;
        }

        if(c2[i]==0){
            clusterName[i] = 1;
        }
    }
    return clusterName;
}


export {method2} 






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

