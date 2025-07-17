const express = require("express");
const router = express.Router();
const nominationController = require("../controllers/nomination.controller");
const authMiddleware = require("../middleware/auth.middleware");

//  All these routes require the user to be authenticated
router.post("/", authMiddleware, nominationController.createNomination);
router.get("/", authMiddleware, nominationController.getUserNominations);
router.get("/all", authMiddleware, nominationController.getAllNominations);
router.get("/:id", authMiddleware, nominationController.getNominationById);
router.put("/:id", authMiddleware, nominationController.updateNomination);
router.delete("/:id", authMiddleware, nominationController.deleteNomination);

module.exports = router;
