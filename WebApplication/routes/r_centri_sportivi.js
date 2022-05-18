const express = require("express")
const utente_amministratore = require("../models/utente_amministratore")
const router = express.Router()

// Get all admins
router.get("/centri_sportivi", async (req, res) => {
	const admin = await utente_amministratore.find()
	res.send(admin)
})

module.exports = router