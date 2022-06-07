const getArgv = require("./getProcessArgv");
module.exports = function () {
    let arg = [];
    try {
        arg = JSON.parse(process.env.npm_config_argv).original;
    } catch (e) {
        arg = process.argv;
    }

    let mode = getArgv("mode", arg) || "default";
    try {
        require("../main-config/spec_config/" + mode + "_config");
    } catch (e) {
        console.log(`cant find mode file\n↓↓↓`);
        mode = "default";
    }
    return mode;
}