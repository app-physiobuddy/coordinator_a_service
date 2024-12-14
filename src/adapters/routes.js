const router = require('express').Router()

const Contoller = require("./Controller")
const controller = new Contoller()

router.get('/', (req, res) => {
    res.send('coordinator A service')
})




// IMPLEMENTADOS
router.post("/coordinator-a/add-therapist", (req, res) => {
    controller.addTherapist2Company(req, res)
})

router.post("/coordinator-a/add-patient", (req, res) => {
    controller.addPatient2Therapist(req, res)
})



module.exports = router