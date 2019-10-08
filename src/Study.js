// ...

// new StudyDTB('myStudy', [w,h], [w,h])
class StudyDBT{
    constructor(name, dim_recipe, dim_consumer){
        this.name = name;
        this.recipe = CreateGrid(dim_recipe[0], dim_recipe[1]);
        this.consumer = CreateGrid(dim_consumer[0], dim_consumer[1]);
        this.meta = {
            create_date: 1,
            edit_date: 2
        }
    }
}

function CreateGrid(rows, cols){
    let grid=[]
    let row=[]
    for(let c=0; c<cols; c++){
        row.push({value:  ''})
    }
    for(let r=0; r<rows; r++){
        grid.push(row)
    }
    return grid
}

export default StudyDBT