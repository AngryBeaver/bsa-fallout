
class SkillTest implements TestClass<"skill"|"complexity"> {
    public type:string =  "SkillTest"
    _choices:{[key:string]:{text:string, img?:string}} = {};
    constructor(){
        this._choices = beaversSystemInterface.configSkills.reduce((object, skill) => {
            object[skill.id] = { text: skill.label };
            return object;
        }, {})
    }
    public create(data:Record<"skill"|"complexity",any>){
        const result = new SkillTestCustomized();
        result.data = data;
        result.parent = this;
        return result;
    }
    public informationField:InfoField = {
        name: "type",
        type: "info",
        label: game['i18n'].localize("beaversSystemInterface.tests.skillTest.info.label"),
        note: game['i18n'].localize("beaversSystemInterface.tests.skillTest.info.note")
    }

    get customizationFields(): Record<"skill"|"complexity",InputField>{
        return {
            skill: {
                name: "skill",
                label: "skill",
                note: "Skill",
                type: "selection",
                choices: this._choices
            },
            complexity: {
                name: "complexity",
                label: "complexity",
                note: "Complexity",
                type: "number",
            }
        };
    }

}

class SkillTestCustomized implements Test<"skill"|"complexity"> {

    parent: SkillTest
    data:{skill:"",complexity:1}

    public action = async (initiatorData: InitiatorData):Promise<TestResult> => {
        const actor = beaversSystemInterface.initiator(initiatorData).actor;
        const item = actor.items.find(i=>i.type==="skill" && i.name === this.data.skill);
        if(item){

            // @ts-ignore
            const result = await fallout.Dialog2d20.createDialog({
                rollName: this.data.skill,
                diceNum: 2,
                attribute: actor.system.attributes[item.system.defaultAttribute].value,
                skill: item.system.value,
                tag: item.system.tag,
                complication: parseInt(actor.system.complication)
            });
            var neededSuccesses = Math.max(0,this.data.complexity-item.system.value);
            let rolledSuccess = 0;
            let rolledComplications = 0;
            result.dicesRolled.forEach(d=>{
                rolledSuccess += d.success;
                rolledComplications += d.complication
            });
            if(neededSuccesses <= rolledSuccess){
                return {
                    success:1,
                    fail: 0
                }
            }
            return {
                success:0,
                fail: 1
            }
        }else{
            // @ts-ignore
            ui.notifications.warn("Skill not found: "+this.data.skill)
            throw new Error("Skill not found: "+this.data.skill);
        }
    }

    public render = (): string => {
        const skill = this.parent._choices[this.data.skill]?.text||"process";
        return `${skill} vs ${this.data.complexity}`;
    };

}

beaversSystemInterface.registerTestClass(new SkillTest());