// new StudyDTB('myStudy', [w,h], [w,h])
const QuantLabel = 'Quant';
const QualLabel = 'Qual';


class StudyDBT {
    constructor(name = '', dim_recipe = [0, 0], dim_consumer = [0, 0], dim_preference = [0, 0]) {
        this.name = name;
        this.recipe = CreateGrid(dim_recipe[0], dim_recipe[1]);
        this.consumer = CreateGrid(dim_consumer[0], dim_consumer[1]);
        this.preference = CreateGrid(dim_preference[0], dim_preference[1]);
        this.recipeQQ = [];
        this.consumerQQ = [];
        this.preferenceQQ = [];
        this.meta = {
            create: new Date(),
            edit: new Date()
        }
    }

    shallowClone() {
        const clone = new StudyDBT('', [0, 0], [0, 0])
        clone.name = this.name
        clone.recipe = this.recipe
        clone.recipeQQ = this.recipeQQ
        clone.consumer = this.consumer
        clone.consumerQQ = this.consumerQQ
        clone.preference = this.preference
        clone.preferenceQQ = this.preferenceQQ
        clone.meta.create = this.meta.create
        return clone;
    };

    changeName(newName) {
        const clone = this.shallowClone();
        clone.name = newName;
        return clone;
    };
    changeMeta(newMeta) {
        const clone = this.shallowClone();
        clone.meta = newMeta;
        return clone;
    };

    changeRecipe(newRecipe) {
        return this.changeFullTable('recipe', newRecipe);
    };
    changeConsumer(newConsumer) {
        return this.changeFullTable('consumer', newConsumer);
    };
    changePreference(newPreference) {
        return this.changeFullTable('preference', newPreference);
    };
    changeFullTable(table, tableData) {
        const clone = this.shallowClone();
        clone[table] = tableData;
        if (clone[table + 'QQ'].length === 0) {
            initQQ(clone, table);
        }
        return clone;
    }

    changeQQ(table, QQdata) {
        const clone = this.shallowClone();
        clone[table + 'QQ'] = QQdata;
        return clone;
    }

    addPersona(table, personas, overwrite = false) {
        const personaColumnLabel = 'Persona';
        const clone = this.shallowClone();

        if (clone[table].length !== personas.length + 1) {
            return this.shallowClone();
        }

        let personaIndex = clone.getHeader(table).indexOf(personaColumnLabel);
        if (personaIndex === -1) {
            personaIndex = clone[table][0].length;
            clone[table] = clone[table].map((value, index) => {
                value.push(index === 0 ? {
                    value: personaColumnLabel
                } : {
                    value: personas[index - 1]
                });
                return value;
            });
            clone[table + 'QQ'][personaIndex] = QualLabel;
        } else if (overwrite) {
            clone[table] = clone[table].map((value, index) => {
                value[personaIndex].value = index === 0 ? personaColumnLabel : personas[index - 1];
                return value;
            });
            console.log(clone[table + 'QQ'][personaIndex])
            clone[table + 'QQ'][personaIndex] = QualLabel;
        }
        return clone;
    }

    isQual(table, column) {
        return (!this.isQuant(table, column));
    }
    isQuant(table, column) {
        if (this[table + 'QQ'].length === 0) {
            return false;
        }
        return (this[table + 'QQ'][0][column].value === QuantLabel);
    }
    isQualFull(table, offset = 0) {
        return this.isQuantFull(table, offset).map(x => !x);
    }
    isQuantFull(table, offset = 0) {
        const QQ = this[table + 'QQ'];
        if (QQ.length === 0) {
            return false;
        }
        let bools = [];
        for (let col = offset; col < this[table + 'QQ'][0].length; col++) {
            bools.push(QQ[0][col].value === QuantLabel)
        }
        return bools;
    }

    getHeader(tabular, offset = 0) {
        let head = [];
        for (let i = offset; i < this[tabular][0].length; i++) {
            head.push(this[tabular][0][i].value);
        }
        return head;
    }
    getRecipeHeader(offset = 0) {
        return (this.getHeader('recipe', offset));
    }
    getConsumerHeader(offset = 0) {
        return (this.getHeader('consumer', offset));
    }
    getPreferenceHeader(offset = 0) {
        return (this.getHeader('preference', offset));
    }

    getTabular(tabular, offset = 0) {
        let tableData = [];
        for (let r = 1; r < this[tabular].length; r++) {
            let row = [];
            for (let c = offset; c < this[tabular][0].length; c++) {
                let elem = parseFloat(this[tabular][r][c].value)
                if (isNaN(elem)) {
                    elem = this[tabular][r][c].value;
                }
                row.push(elem);
            }
            tableData.push(row);
        }
        return tableData;
    }
    getRecipeTabular(offset = 0) {
        return (this.getTabular('recipe', offset));
    }
    getConsumerTabular(offset = 0) {
        return (this.getTabular('consumer', offset));
    }
    getPreferenceTabular(offset = 0) {
        return (this.getTabular('preference', offset));
    }


    getCreateTime() {
        return (getTime(new Date(this.meta.create)));
    }
    getCreateDate() {
        return (getDate(new Date(this.meta.create)));
    }
    getEditTime() {
        return (getTime(new Date(this.meta.edit)));
    }
    getEditDate() {
        return (getDate(new Date(this.meta.edit)));
    }


}

function getTime(d) {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const secs = d.getSeconds();
    const time = [hours < 10 ? '0' + hours : hours, minutes < 10 ? '0' + minutes : minutes, secs < 10 ? '0' + secs : secs];
    return time.join(':')
}

function getDate(d) {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const date = [year, month < 10 ? '0' + month : month, day < 10 ? '0' + day : day];
    return date.join('-')
}

function initQQ(clone, table) {
    if (clone[table].length < 2) {
        return;
    }
    let input = clone[table][1];
    let QQ = [];
    for (let i = 0; i < input.length; i++) {
        if (isNaN(parseFloat(input[i].value))) {
            QQ.push({
                value: QualLabel
            });
        } else {
            QQ.push({
                value: QuantLabel
            });
        }
    }
    clone[table + 'QQ'] = [QQ];
}

function CreateGrid(rows, cols) {
    return Array(rows).fill(
        Array(cols).fill({
            value: ''
        })
    );
}


export default StudyDBT
export {
    CreateGrid
}