
class SkillTest implements TestClass<"skill"> {
    public type:string =  "SkillTest"
    _choices:{[key:string]:{text:string, img?:string}} = {};
    constructor(){
        this._choices = beaversSystemInterface.configSkills.reduce((object, skill) => {
            object[skill.id] = { text: skill.label };
            return object;
        }, {})
    }
    public create(data:Record<"skill",any>){
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

    get customizationFields(): Record<"skill",InputField>{
        return {
            skill: {
                name: "skill",
                label: "skill",
                note: "Skill",
                type: "selection",
                choices: this._choices
            }
        };
    }

}

class SkillTestCustomized implements Test<"skill"> {

    parent: SkillTest
    data:{skill:""}

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
            let success = 0;
            let fail = 0;
            result.dicesRolled.forEach(d=>{
                success += d.success;
                fail += d.complication
            });
            if(success == 0 && fail == 0){
                fail=1;
            }
            return {
                success:success,
                fail: fail
            }
        }else{
            // @ts-ignore
            ui.notifications.warn("Skill not found: "+this.data.skill)
            throw new Error("Skill not found: "+this.data.skill);
        }
    }

    public render = (): string => {
        const skill = this.parent._choices[this.data.skill]?.text||"process";
        return `${skill}`;
    };

}

beaversSystemInterface.registerTestClass(new SkillTest());