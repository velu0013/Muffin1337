function LinearCoefficients(preferences, recipes, pow){
    let r_max = [], r_min = [];
    for(let i=1; i<recipes[0].length; i++){
        r_max.push(recipes[0][i]);
        r_min.push(recipes[0][i]);
    }
    for(let r=1; r<recipes.length; r++){
        for(let i=1; i<recipes[0].length; i++){
            if(recipes[r][i] > r_max[i-1]){
                r_max[i-1] = recipes[r][i]
            }
            if(recipes[r][i] < r_min[i-1]){
                r_min[i-1] = recipes[r][i]
            }
        }
    }
    let a,b,c;
    for(let r=0; r<recipes.length; r++){
        if(recipes[r][1] === r_min[0] && recipes[r][2] === r_min[1]){
            a = r;
        }
        if(recipes[r][1] === r_min[0] && recipes[r][2] === r_max[1]){
            b = r;
        }
        if(recipes[r][1] === r_max[0] && recipes[r][2] === r_min[1]){
            c = r;
        }
    }
    const A = [[1, recipes[a][1], recipes[a][2]],
                    [1, recipes[b][1], recipes[b][2]],
                    [1, recipes[c][1], recipes[c][2]]];
    let Ks = [], v;
    for(let cons=0; cons<preferences.length;cons++){
        v = [preferences[cons][a+1], preferences[cons][b+1], preferences[cons][c+1]];
        let k = [0, (v[2]-v[0])/(A[1][2]-A[0][2]), (v[1]-v[0])/(A[2][1]-A[0][1])]
        k[0] = v[0] - k[1]*A[0][1] - k[2]*A[0][2]
        let optimal = false;
        let newK;
        let lr = 0.01;
        while(!optimal){
            optimal = true;
            for(let i=0; i<k.length; i++){
                newK = [...k]
                newK[i] = k[i]*(1+lr) + (!k[i])*0.0001
                if(kError(k, recipes, preferences[cons], pow)>kError(newK, recipes, preferences[cons], pow)){
                    k = [...newK]
                    optimal = false;
                }
                newK[i] = k[i]*(1-lr) - (!k[i])*0.0001
                if(kError(k, recipes, preferences[cons], pow)>kError(newK, recipes, preferences[cons], pow)){
                    k = [...newK]
                    optimal = false;
                }
            }
        }
        Ks.push(k);
    }
    return Ks;
}


function kError(k, recipes, preferences, pow){
    let recipe, prefEstimate, err=0
    for(let r=0; r<recipes.length; r++){
        recipe = recipes[r]
        prefEstimate = k[0]
        for(let i=1; i<recipe.length; i++){
            prefEstimate+=k[i]*recipe[i]
        }
        // console.log(prefEstimate)
        err+=Math.pow(Math.abs(prefEstimate-preferences[r+1]), pow)

    }
    return err
}

export {LinearCoefficients};