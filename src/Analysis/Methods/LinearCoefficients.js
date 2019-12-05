import {
    det,
    multiply,
    inv
} from 'mathjs'

function LinearCoefficients(preferences, recipes, pow, bases) {
    const inits = MakeInits(recipes, bases);
    let Ks = [],
        optimal;
    for (let cons = 0; cons < preferences.length; cons++) {
        let k_opt = [0, 0, 0];
        for (let i = 0; i < inits.length; i++) {
            let k = initModel(preferences[cons], recipes, inits[i])
            let lr = 0.05;
            do {
                [k, optimal] = trainModel(k, recipes, preferences[cons], lr, pow)
                if (optimal && lr > 0.001) {
                    optimal = false;
                    lr /= 10;
                }
            } while (!optimal);
            if (kError(k, recipes, preferences[cons], pow) < kError(k_opt, recipes, preferences[cons], pow)) {
                k_opt = [...k]
            }
        }
        Ks.push(k_opt);
    }
    normalizeKs(Ks);
    return Ks;
}

function initModel(preference, recipes, [a, b, c]) {
    const A = [
        [1, recipes[a][1], recipes[a][2]],
        [1, recipes[b][1], recipes[b][2]],
        [1, recipes[c][1], recipes[c][2]]
    ];
    let v = [preference[a + 1], preference[b + 1], preference[c + 1]];

    if (det(A)) {
        return multiply(inv(A), v);
    } else {
        return [0, 0, 0]
    }
}


function MakeInits(recipes, bases) {
    let basis = []
    for (let a = 0; a < recipes.length; a++) {
        for (let b = 0; b < recipes.length; b++) {
            for (let c = 0; c < recipes.length; c++) {
                if (a !== b && a !== c && b !== c) {
                    basis.push([a, b, c])
                }
            }
        }
    }
    let indices = basis.map((v, i) => i);
    let inits = []
    if (bases >= basis.length) {
        inits = basis
    } else {
        for (let i = 0; i < bases; i++) {
            let index
            do {
                index = Math.floor(Math.random() * basis.length)
            } while (indices[index] < 0);
            indices[index] = -1
            inits.push(basis[index])
        }
    }
    return inits;
}


function trainModel(k, recipes, preference, lr, pow) {
    let changed = false;
    for (let i = 0; i < k.length; i++) {
        let dir = -1;
        let newK = [...k]
        do {
            newK[i] = k[i] * (1 + dir * lr) + dir * (!k[i]) * 0.001
            if (kError(k, recipes, preference, pow) > kError(newK, recipes, preference, pow)) {
                k = [...newK]
                changed = true;
            }
            dir = -dir
        } while (dir > 0)
    }
    return [k, !changed];
}


function kError(k, recipes, preference, pow) {
    let recipe, prefEstimate, err = 0
    for (let r = 0; r < recipes.length; r++) {
        recipe = recipes[r]
        prefEstimate = k[0]
        for (let i = 1; i < recipe.length; i++) {
            prefEstimate += k[i] * recipe[i]
        }
        err += Math.pow(Math.abs(prefEstimate - preference[r + 1]), pow)
    }
    return err
}


function normalizeKs(Ks) {
    let maxK = [-Infinity, -Infinity];
    for (let i = 0; i < Ks.length; i++) {
        let Ki = [Math.abs(Ks[i][1]), Math.abs(Ks[i][2])];
        if (Ki[0] > maxK[0]) {
            maxK[0] = Ki[0];
        }
        if (Ki[1] > maxK[1]) {
            maxK[1] = Ki[1];
        }
    }
    for (let i = 0; i < Ks.length; i++) {
        Ks[i][1] /= maxK[0] * 1.05
        Ks[i][2] /= maxK[1] * 1.05
    }
}

export {
    LinearCoefficients
};