export class Fallout implements SystemApi {

    get version() {
        return 2;
    }

    get id() {
        return "fallout";
    }

    async actorRollSkill(actor, skillName): Promise<Roll | null> {
        const item = actor.items.find(i=>i.type==="skill" && i.name === skillName);
        if(item){
            // @ts-ignore
            const result = await fallout.Dialog2d20.createDialog({
                rollName: skillName,
                diceNum: 2,
                attribute: actor.system.attributes[item.system.defaultAttribute].value,
                skill: item.system.value,
                tag: item.system.tag,
                complication: parseInt(actor.system.complication)
            });
            let totalFake = 0;
            result.dicesRolled.forEach(d=>{
                totalFake += d.success;
            });
            result.roll._total = totalFake;
            return result.roll;
        }
        return null;

    }

    async actorRollAbility(actor, abilityId): Promise<Roll | null> {
        throw new Error("can not do this")
    }

    actorCurrenciesGet(actor): Currencies {
        return {caps:actor["system"].currency.caps};
    }

    async actorCurrenciesStore(actor, currencies: Currencies): Promise<void> {
        await actor.update({system: {currency: currencies}});
    }

    actorSheetAddTab(sheet, html, actor, tabData: { id: string, label: string, html: string }, tabBody: string): void {
        const tabs = $(html).find('nav[data-group="primary"]');
        const tabItem = $('<a class="item" data-tab="' + tabData.id + '" title="' + tabData.label + '">' + tabData.html + '</a>');
        tabs.append(tabItem);
        const body = $(html).find(".sheet-body");
        const tabContent = $('<div class="tab flexcol" data-group="primary" data-tab="' + tabData.id + '"></div>');
        body.append(tabContent);
        tabContent.append(tabBody);
    }

    itemSheetReplaceContent(app, html, element): void {
        html.find('.sheet-tabs').remove();
        const sheetBody = html.find('.sheet-body');
        sheetBody.addClass("flexrow");
        sheetBody.empty();
        sheetBody.append(element);
    }

    get configSkills(): SkillConfig[] {
        return game["bsa-fallout"].Settings.packSkills.map(i=>{ // @ts-ignore
            return{id:i.name,label:i.name}});
    }

    get configAbilities(): AbilityConfig[] {
        return Object.entries(CONFIG["FALLOUT"].attributes).map(([key,value]) => {
            return {
                id: key,
                label: game["i18n"].localize(value)
            };
        });
    }

    get configCurrencies(): CurrencyConfig[] {
        return [
            {
                id: "caps",
                factor: 1,
                label: "CAPS",
            }
        ]
    }

    get configCanRollAbility(): boolean {
        return false;
    }

    get configLootItemType(): string {
        return "miscellany";
    }

    get itemPriceAttribute(): string {
        return "system.cost";
    }

    get itemQuantityAttribute(): string {
        return "system.quantity";
    }

}