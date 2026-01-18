import Volunteer from "./Models/Volunteer.js";
import Event from "../events/Models/Event.js";

// Sign Up (User)
export async function signUpVolunteer(req) {
    const { fullName, email, phone, volunteerType, selected_event, areasOfInterest, consent } = req.body;
    try {
        const event_id = volunteerType === "event" ? selected_event : null;
        const volunteer = await Volunteer.create({
            fullName,
            email,
            phone,
            volunteerType,
            event_id,
            areasOfInterest,
            consent
        });
        return { statusCode: 201, message: "Volunteer sign up successful", data: volunteer };
    } catch (err) {
        return { statusCode: 500, message: err.message, data: null };
    }
}

// Get All Volunteers (Admin)
export async function getAllVolunteers() {
    try {
        const volunteers = await Volunteer.findAll({
            include: [{
                model: Event,
                attributes: ['id', 'title']
            }]
        });
        return { statusCode: 200, message: "Volunteers fetched successfully", data: volunteers };
    } catch (err) {
        return { statusCode: 500, message: err.message, data: null };
    }
}

// Get Volunteers by Event (Admin)
export async function getVolunteersByEvent(req) {
    const { event_id } = req.params;
    try {
        const volunteers = await Volunteer.findAll({
            where: { event_id },
            include: [{
                model: Event,
                attributes: ['id', 'title']
            }]
        });
        return { statusCode: 200, message: "Volunteers for event fetched successfully", data: volunteers };
    } catch (err) {
        return { statusCode: 500, message: err.message, data: null };
    }
}
