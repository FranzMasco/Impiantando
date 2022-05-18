const express = require("express")
const utente_prova = require("../models/utente_prova")
const router = express.Router()

// Get all utenti di prova
router.get("/utenti_prova", async (req, res) => {
	const up = await utente_prova.find()
	res.send(up)
})

//Create new utente di prova
router.post("/utenti_prova", async (req, res) => {
	const up = new utente_prova({
		nome: req.body.name,
		cognome: req.body.surname,
	})
	await up.save()
	res.send(up)
})

module.exports = router