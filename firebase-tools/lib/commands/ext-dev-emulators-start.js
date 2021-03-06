"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkMinRequiredVersion_1 = require("../checkMinRequiredVersion");
const command_1 = require("../command");
const controller = require("../emulator/controller");
const commandUtils = require("../emulator/commandUtils");
const optionsHelper = require("../extensions/emulator/optionsHelper");
const utils = require("../utils");
const error_1 = require("../error");
module.exports = new command_1.Command("ext:dev:emulators:start")
    .description("start the local Firebase extension emulator")
    .before(commandUtils.setExportOnExitOptions)
    .option(commandUtils.FLAG_INSPECT_FUNCTIONS, commandUtils.DESC_INSPECT_FUNCTIONS)
    .option(commandUtils.FLAG_TEST_CONFIG, commandUtils.DESC_TEST_CONFIG)
    .option(commandUtils.FLAG_TEST_PARAMS, commandUtils.DESC_TEST_PARAMS)
    .option(commandUtils.FLAG_IMPORT, commandUtils.DESC_IMPORT)
    .option(commandUtils.FLAG_EXPORT_ON_EXIT, commandUtils.DESC_EXPORT_ON_EXIT)
    .before(checkMinRequiredVersion_1.checkMinRequiredVersion, "extDevMinVersion")
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    const killSignalPromise = commandUtils.shutdownWhenKilled(options);
    const emulatorOptions = yield optionsHelper.buildOptions(options);
    try {
        commandUtils.beforeEmulatorCommand(emulatorOptions);
        yield controller.startAll(emulatorOptions);
    }
    catch (e) {
        yield controller.cleanShutdown();
        if (!(e instanceof error_1.FirebaseError)) {
            throw new error_1.FirebaseError("Error in ext:dev:emulator:start", e);
        }
        throw e;
    }
    utils.logSuccess("All emulators ready, it is now safe to connect.");
    yield killSignalPromise;
}));
