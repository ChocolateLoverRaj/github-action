"use strict";
exports.__esModule = true;
var core_1 = require("@actions/core");
var str = core_1.getInput('str', { required: true });
core_1.setOutput('str', str.toUpperCase());
