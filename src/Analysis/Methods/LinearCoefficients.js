import {matrix, divide} from 'mathjs'

function LinearCoefficients(preferences, recipes){
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
    const A = matrix([[1, recipes[a][1], recipes[a][2]],
                    [1, recipes[b][1], recipes[b][2]],
                    [1, recipes[c][1], recipes[c][2]]]);
    let k = [], v;
    for(let cons=0; cons<preferences.length;cons++){
        v = [preferences[cons][a+1], preferences[cons][b+1], preferences[cons][c+1]];
        k.push(divide(v, A)._data);
    }
    return k;
}

export {LinearCoefficients};