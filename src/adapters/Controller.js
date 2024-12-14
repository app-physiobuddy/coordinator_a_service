require("dotenv").config();
const ErrorTypes = require("../utils/errors/ErrorTypes");
const axios = require("axios");
const entitiesServiceURL = process.env.ENTITIES_SERVICE_URL
const authServiceURL = process.env.AUTH_SERVICE_URL
const exerciseServiceURL = process.env.EXERCISE_SERVICE_URL
const gatewayServiceURL = process.env.GATEWAY_SERVICE_URL

class Controller {

    async addTherapist2Company(req, res) {
        console.log("addTherapist2Company")
        console.log(req.body.data)
        const email = req.body.data.therapistEmail;
        const authGateway = `${authServiceURL}/auth/user/${email}`
        let user = {}
        try {
            const result = await axios.get(authGateway)
            user = result.data.message
        } catch (error) {
            //console.log(error)
            console.log(authGateway)

            return res.status(500).json({
                success: false,
                message: "Error getting user"
            });
        }
        console.log(user.id)
        // NOW he have therapist data, lets create a new therapist on entities
        const user_id_company = req.body.data.user_id_company
        const newTherapist = {
            name: req.body.data.name,
            email: req.body.data.therapistEmail,
            user_id : user.id,
            phone: req.body.data.phone,

        }
        req.body.data = newTherapist
        const entitiesGateway = `${entitiesServiceURL}/companies/${user_id_company}/therapist/`
        console.log(entitiesGateway, req.body.data)
        try {
          const response = await axios.post(entitiesGateway, req.body)
          res.status(response.status).send(response.data)
        } catch (error) {
          //console.log(error)
          res.status(error.response.status).send(error.response.data);
        }
    }

    async addPatient2Therapist(req, res) {
        console.log("addPatient2Therapist")
        console.log(req.body.data)
        const email = req.body.patientEmail;
        console.log(email)

        const authGateway = `${authServiceURL}/auth/user/${email}`
        let user = {}
        try {
            const result = await axios.get(authGateway)
            user = result.data.message
        } catch (error) {
            //console.log(error)
            console.log(authGateway)

            return res.status(500).json({
                success: false,
                message: "Error getting user"
            });
        }
        const user_id_therapist = req.body.data.user_id_therapist
        const newPatient = {
            id: Number(user.id),
            name: req.body.data.name,
            email: email,
            phone_numb: req.body.data.phone_numb,
            age: Number(req.body.data.age),
            nif: Number(req.body.data.nif)

        }
        req.body.data = newPatient
        const entitiesGateway = `${entitiesServiceURL}/therapists/${user_id_therapist}/patients/`
        console.log(entitiesGateway, req.body.data)
        try {
          const response = await axios.post(entitiesGateway, req.body)
          res.status(response.status).send(response.data)
        } catch (error) {
          //console.log(error)
          res.status(error.response.status).send(error.response.data);
        }
    }

    async asTherapistGetCompanyId(req, res) {
        if (!req.params.therapist_id) throw ErrorTypes.UnauthorizedAccess("therapist_id param is required");
        const therapist_id = Number(req.params.therapist_id);
        const entitiesGateway = `${entitiesServiceURL}/companies/therapist/${therapist_id}`
        let therapist = {}
        try {
            const result = await axios.get(entitiesGateway)
            therapist = result.data
            console.log("therapist Coord A", therapist)

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error therapist's company"
            });
        }
    }

}

module.exports = Controller