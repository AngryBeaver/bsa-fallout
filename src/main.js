import {Fallout} from "./Fallout.js";
import {Settings} from "./Settings.js";

Hooks.on("beavers-system-interface.init", async function(){
    game["bsa-fallout"] = game["bsa-fallout"] || {};
    beaversSystemInterface.register(new Fallout());
});

Hooks.on("ready", async function(){
    game["bsa-fallout"].Settings = new Settings();
});
