/* ANN related codes */

const reruns = 1;
const epochs = 2000;
const lr = x => 0.005 * (1 + 10 * Math.exp(-(x - epochs / 20) * (x - epochs / 20)));

function Predict(study, param) {
    const data = getData(study, 'preference')
    const [labels, uniques, counts] = getLabels(study, param)
    let result = [
        [{
            value: 'Parameter'
        }, {
            value: 'Recall'
        }, {
            value: 'Precision'
        }]
    ];
    uniques.forEach(label => {
        result.push([{
            value: label
        }, {
            value: 0
        }, {
            value: 0
        }]);
    });

    let resultA = {},
        resultB = {};
    for (let run = 0; run < reruns; run++) {
        let networkA = Network(uniques, data[0].length)
        let networkB = Network(uniques, data[0].length)
        let [setA, setB] = dataDivider(data, labels, uniques, counts)
        for (let e = 0; e < epochs; e++) {
            trainNetwork(networkA, setA.data, setA.labels, e)
            trainNetwork(networkB, setB.data, setB.labels, e)
        }
        resultA = testNetwork(networkA, setB.data, setB.labels, uniques)
        resultB = testNetwork(networkB, setA.data, setA.labels, uniques)
        // eslint-disable-next-line no-loop-func
        uniques.forEach((label, i) => {
            result[i + 1][1].value += (resultA[label]['Recall'] + resultB[label]['Recall']) / (2 * reruns);
            result[i + 1][2].value += (resultA[label]['Precision'] + resultB[label]['Precision']) / (2 * reruns);
        });
    }

    return result;
}

function dataDivider(data, labels, uniques, counts) {
    const order = randomOrder(labels.length);
    let occur = {}
    for (let i = 0; i < uniques.length; i++) {
        occur[uniques[i]] = 0
    }
    const trainSet = {
        data: [],
        labels: []
    }
    const testSet = {
        data: [],
        labels: []
    }
    for (let i = 0; i < data.length; i++) {
        let index = order[i];
        let dataRow = data[index];
        let labelRow = labels[index]

        if (counts[labels[index]] <= 2 * occur[labels[index]]) {
            trainSet.data.push(dataRow)
            trainSet.labels.push(labelRow)
            occur[labels[index]]++
        } else {
            testSet.data.push(dataRow)
            testSet.labels.push(labelRow)
            occur[labels[index]]++
        }
    }
    return [trainSet, testSet];
}

function randomOrder(stop) {
    let i = stop,
        temp, ri;
    let arr = new Array(stop).fill(0).map((value, index) => index)
    while (i) {
        ri = Math.floor(Math.random() * i--);
        temp = arr[i];
        arr[i] = arr[ri];
        arr[ri] = temp;
    }
    return arr;
}

function getData(study, tabular) {
    let baseData = study.getTabular(tabular).map(x => {
        x.shift();
        return x
    });
    let maxValue = 0
    baseData.forEach((row, row_nr) => {
        row.forEach((elem, elem_nr) => {
            if (Math.abs(elem) > maxValue) {
                maxValue = Math.abs(elem);
            }
        })
    })
    return baseData.map(x => x.map(y => y / maxValue));
}

function getLabels(study, param) {
    const tableName = 'consumer';
    const col = study.getHeader(tableName).indexOf(param)
    const tableData = study.getTabular(tableName)
    const uniques = [];
    const labels = [];
    let counts = {};
    for (let r = 0; r < tableData.length; r++) {
        let elem = tableData[r][col];
        let isUnique = true;
        for (let i = 0; i < uniques.length && isUnique; i++) {
            if (elem === uniques[i]) {
                isUnique = false;
            }
        }
        if (isUnique) {
            uniques.push(elem);
            counts[elem] = 0;
        }
        counts[elem]++;
        labels.push(elem);
    }
    return [labels, uniques, counts];
}


function Network(labels, node_size) {
    let network = []
    for (let i = 0; i < labels.length; i++) {
        network.push(new ANN_Node(labels[i], node_size))
    }
    return network;
}

class ANN_Node {
    constructor(label = null, size = 0) {
        this.label = label;
        this.weights = new Array(size).fill(0.5);
        this.act = x => sigmoid(dot(x, this.weights));
    }
}

const sigmoid = x => 1 / (1 + Math.exp(-x));

function trainNetwork(network, data, labels, epoch) {
    network.forEach((node, node_nr) => {
        labels.forEach((label, label_nr) => {
            let target_output = 1 * (label === node.label)
            let w = node.weights
            let d = data[label_nr]
            let error = target_output - node.act(d)
            let dw = d.map(x => lr(epoch) * error * x)
            node.weights = w.map((x, i) => x + dw[i])
        })
    })
}

function dot(v, w) {
    let mydot = 0
    for (let i = 0; i < v.length; i++) {
        mydot = mydot + v[i] * w[i]
    }
    return mydot
}


function testNetwork(network, data, labels, uniques) {
    let labels_result = {},
        netwrk_result = {};
    uniques.forEach(label => labels_result[label] = {
        score: [0, 0]
    })
    uniques.forEach(label => netwrk_result[label] = {
        score: [0, 0]
    })
    console.log('START')
    console.log(labels_result)
    console.log(netwrk_result)
    data.forEach((row, row_nr) => {
        let maxProb = 0;
        let likely_label = '';
        let actual_label = labels[row_nr];
        // console.log('### Finding label: '+labels[row_nr])
        network.forEach((node, node_nr) => {
            let prob = node.act(row)
            // console.log('Prob of node '+node.label+': '+prob)
            if (prob > maxProb) {
                likely_label = node.label
                maxProb = prob;
            }
        })
        let scoreIndex = 1 * (likely_label !== labels[row_nr]);
        console.log(likely_label + " == " + actual_label + ' =|=> i = ' + String(scoreIndex))
        console.log(labels_result)
        console.log(netwrk_result)
        let a = labels_result[actual_label].score[scoreIndex] + 1;
        labels_result[actual_label].score[scoreIndex] = a;
        let b = netwrk_result[likely_label].score[scoreIndex] + 1;
        netwrk_result[likely_label].score[scoreIndex] = b;
    })
    let result = {};
    uniques.forEach((label, i) => {
        result[label] = {
            Recall: 100 * labels_result[label].score[0] / (labels_result[label].score[0] + labels_result[label].score[1]),
            Precision: 100 * netwrk_result[label].score[0] / (netwrk_result[label].score[0] + netwrk_result[label].score[1])
        };
    })
    console.log(result)
    return result
}



export {
    Predict
}