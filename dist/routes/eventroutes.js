"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const auth_1 = require("../auth/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.protect, event_controller_1.createEvent);
exports.default = router;
