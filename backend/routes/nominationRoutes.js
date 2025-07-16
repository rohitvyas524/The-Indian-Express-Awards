const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const nominationController = require("../controllers/nomination.controller");

router.post("/", auth, nominationController.createNomination);
router.get("/", auth, nominationController.getUserNominations);
router.get("/all", auth, nominationController.getAllNominations);
router.get("/:id", auth, nominationController.getNominationById);
router.put("/:id", auth, nominationController.updateNomination);
router.delete("/:id", auth, nominationController.deleteNomination);

module.exports = router;
