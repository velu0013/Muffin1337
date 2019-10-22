/* ANN related codes */

const reruns = 20;
const epochs = 2500;


function Predict(study, param){
    const data = getData(study, 'preference')
    const [labels, uniques] = getLabels(study, param)
    let accuracy = 0
    for(let run=0; run<reruns; run++){
        let network = Network(uniques, data[0].length)
        // let [trainData, trainLabels] = dataDivider(data, labels, )
        // let [testData, testLabels]
        for(let e=0; e<epochs; e++){
            trainNetwork(network, data, labels)
        }
        accuracy = accuracy + testNetwork(network, data, labels)/reruns
    }
    return accuracy;
}

function getData(study, tabular){
    let baseData = study.getTabular(tabular).map(x => {x.shift(); return x});
    let maxValue = 0
    baseData.forEach((row, row_nr) => {
        row.forEach((elem, elem_nr) => {
            if(Math.abs(elem)>maxValue){
                maxValue = Math.abs(elem);
            }
        })
    })
    return baseData.map(x => x.map(y => y/maxValue));
}

function getLabels(study, param){
    const tableName = 'consumer';
    const col = study.getHeader(tableName).indexOf(param)
    const tableData = study.getTabular(tableName)
    const uniques = [];
    const labels= [];
    for(let r=0; r<tableData.length; r++){
        let elem = tableData[r][col];
        let isUnique = true;
        for(let i=0; i<uniques.length && isUnique; i++){
            if(elem === uniques[i]){
                isUnique = false;
            }
        }
        if(isUnique){
            uniques.push(elem);
        }
        labels.push(elem)
    }
    return [labels, uniques];
}


function Network(labels, node_size){
    let network = []
    for(let i=0; i<labels.length; i++){
        network.push(new ANN_Node(labels[i], node_size))
    }
    return network;
}

class ANN_Node{
    constructor(label = null, size = 0){
        this.label = label;
        this.weights = new Array(size).fill(0.5);
        this.act = x => sigmoid(dot(x, this.weights));
    }
}

const sigmoid = x => 1/(1+Math.exp(-x));

function trainNetwork(network, data, labels){
    network.forEach((node, node_nr) => {
        labels.forEach((label, label_nr) => {
            let target_output = 1*(label === node.label)
            let w = node.weights
            let d = data[label_nr]
            let error = target_output - node.act(d)
            let dw = d.map(x => 0.005 * error * x)
            node.weights = w.map((x, i) => x+dw[i])
        })
    })
}

function dot(v,w){
    let mydot = 0
    for(let i=0; i<v.length; i++){
        mydot = mydot + v[i]*w[i]
    }
    return mydot
}

function testNetwork(network, data, labels){
    let correct_guesses = 0;
    data.forEach((row, row_nr) => {
        let likely_label = ['', 0];
        // console.log('### Finding label: '+labels[row_nr])
        network.forEach((node, node_nr) => {
            let prob = node.act(row)
            // console.log('Prob of node '+node.label+': '+prob)
            if(prob > likely_label[1]){
                likely_label = [node.label, prob]
            }
        })
        correct_guesses = correct_guesses + (likely_label[0] === labels[row_nr])
    })
    return correct_guesses/labels.length*100
}



export {Predict}