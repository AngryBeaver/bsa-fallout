export class Settings {

    packSkills:Item[] = [];

    constructor() {
        if (!(game instanceof Game)) {
            throw new Error("Settings called before game has been initialized");
        }
        void this.gatherSkills();
    }

    async gatherSkills(){
        let skillsCompendium:string = "";
        try{
            skillsCompendium = game["settings"].get(
              "fallout", "skillsCompendium"
            );
        }catch(e){
            console.warn("this seems TO HAVE WORKED someday maybe still needed for old systems ?",e)
        }

        if (!skillsCompendium) skillsCompendium = "fallout.skills";
        this.packSkills = await game["packs"].get(skillsCompendium).getDocuments();
    }
}