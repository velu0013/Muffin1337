import PCA from 'pca-js'


function PCA1() {
    const vec = [[{value: 2}, {value: 5}, {value: 4}],
                [{value:3}, {value: 7}, {value: 7}],
                [{value:3}, {value: 9}, {value: 8}]]
    
    const data2 = []
    var i;
    
    const data3 = vec.map(row => row.map(cell => cell.value))

    for (i=1; i < data3.length; i++) {
        var j;
        var dat = []
        for (j=1; j < data3[i].length; j++) {
            dat.push( data3[i][j])
        }   
    data2.push(dat)
    }
    const vectors = PCA.getEigenVectors(data2);
    const topTwo = PCA.computePercentageExplained(vectors,vectors[0],vectors[1])
    console.log(vectors)
    return topTwo
}


function PCA2(props) {

    const data2 = []
    var i;
    
    const data3 = props.vec.map(row => row.map(cell => cell.value))

    for (i=1; i < data3.length; i++) {
        var j;
        var dat = []
        for (j=1; j < data3[i].length; j++) {
            dat.push( data3[i][j])
        }   
    data2.push(dat)
    }
    const vectors = PCA.getEigenVectors(data2);
    const topTwo = PCA.computePercentageExplained(vectors,vectors[0])
    return vectors
}
export {PCA1, PCA2}