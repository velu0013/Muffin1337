// new StudyDTB('myStudy', [w,h], [w,h])
class StudyDBT{
    constructor(name, dim_recipe, dim_consumer){
        this.name = name;
        this.recipe = CreateGrid(dim_recipe[0], dim_recipe[1]);
        this.consumer = CreateGrid(dim_consumer[0], dim_consumer[1]);
        //this.preference = CreateGrid(dim_preference[0], dim_preference[1]);
        this.meta = {
            create_date: currDate('-'),
            create_time: currTime(':'),
            edit_date: currDate('-'),
            edit_time: currTime(':')
        }
    }

    shallowClone(){
        const clone = new StudyDBT('', [0,0], [0,0])
        clone.name = this.name
        clone.recipe = this.recipe
        clone.consumer = this.consumer
        clone.meta.create_date = this.meta.create_date
        clone.meta.create_time = this.meta.create_time
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

function currDate(sep){
    const d = new Date();
    let date = [d.getFullYear(),'',d.getMonth()+1,'',d.getDate()];
    date[2]<10 ? date[1] = [sep, "0"] : date[1] = sep;
    date[4]<10 ? date[3] = [sep, "0"] : date[3] = sep;
    return date;
}

function currTime(sep){
    const d = new Date(); 
    let logon = [d.getHours(),"", d.getMinutes()];
	logon[2]<10 ? logon[1] = [sep, "0"] : logon[1] = sep;
	return logon;
}


export default StudyDBT
export {CreateGrid}