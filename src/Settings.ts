export class Settings {

    packSkills:Item[] = [];

    constructor() {
        if (!(game instanceof Game)) {
            throw new Error("Settings called before game has been initialized");
        }
        void this.gatherSkills();
    }

    async gatherSkills(){
        let skillsCompendium = game["settings"].get(
            "fallout", "skillsCompendium"
        );
        if (!skillsCompendium) skillsCompendium = "fallout.skills";
        this.packSkills = await game["packs"].get(skillsCompendium).getDocuments();
    }
}