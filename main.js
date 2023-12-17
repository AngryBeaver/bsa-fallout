import {dnd4e} from "./Fallout.ts";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new dnd4e());
});
