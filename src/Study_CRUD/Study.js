// new StudyDTB('myStudy', [w,h], [w,h])
class StudyDBT{
    constructor(name = '', dim_recipe = [0,0], dim_consumer = [0,0], dim_preference = [0,0]){
        this.name = name;
        this.recipe = CreateGrid(dim_recipe[0], dim_recipe[1]);
        this.consumer = CreateGrid(dim_consumer[0], dim_consumer[1]);
        this.preference = CreateGrid(dim_preference[0], dim_preference[1]);
        this.meta = {
            create: new Date(),
            edit: new Date()
        }
    }

    shallowClone(){
        const clone = new StudyDBT('', [0,0], [0,0])
        clone.name = this.name
        clone.recipe = this.recipe
        clone.consumer = this.consumer
        clone.preference = this.preference
        clone.meta.create = this.meta.create
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
    changePreference(newPreference){
        const clone = this.shallowClone();
        clone.preference = newPreference;
        return clone;
    };
    changeMeta(newMeta){
        const clone = this.shallowClone();
        clone.meta = newMeta;
        return clone;
    };

    getCreateTime(){
        return(getTime(new Date(this.meta.create)));
    }
    getCreateDate(){
        return(getDate(new Date(this.meta.create)));
    }
    getEditTime(){
        return(getTime(new Date(this.meta.edit)));
    }
    getEditDate(){
        return(getDate(new Date(this.meta.edit)));
    }
}

function getTime(d){
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const secs = d.getSeconds();
    const time = [hours<10?'0'+hours:hours,minutes<10?'0'+minutes:minutes,secs<10?'0'+secs:secs];
    return time.join(':')
}
function getDate(d){
    const year = d.getFullYear();
    const month = d.getMonth()+1;
    const day = d.getDate();
    const date = [year,month<10?'0'+month:month,day<10?'0'+day:day];
    return date.join('-')
}




function CreateGrid(rows, cols){
    return Array(rows).fill(
        Array(cols).fill({value:  ''})
    );
}


export default StudyDBT
export {CreateGrid}