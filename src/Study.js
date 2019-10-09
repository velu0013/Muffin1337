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
    shallowClone(){
        const clone = new StudyDBT('', [0,0], [0,0])
        clone.name = this.name
        clone.recipe = this.recipe
        clone.consumer = this.consumer
        clone.meta = this.meta
        return clone;
    };
    changeName(newName){
        const clone = this.shallowClone();
        clone.name = newName;
        return clone;
    };
    changeRecipe(newRecipe){
        const clone = this.shallowClone();
        clone.recipe = newRecipe;
        return clone;
    };
    changeConsumer(newConsumer){
        const clone = this.shallowClone();
        clone.consumer = newConsumer;
        return clone;
    };
    changeMeta(newMeta){
        const clone = this.shallowClone();
        clone.meta = newMeta;
        return clone;
    };

}


function CreateGrid(rows, cols){
    return Array(rows).fill(
        Array(cols).fill({value:  ''})
    );
}


export default StudyDBT
export {CreateGrid}