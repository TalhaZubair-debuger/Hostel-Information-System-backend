const Hostel = require("../models/hostel.js");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fs = require("fs");

//Owner Hostel APIs
exports.addHostel = async (req, res, next) => {

    const errors = validationResult(req);
    const image = req.file.filename;
    console.log(image + "Line 10 Hostel Controller");
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed, data entered in wrong format.");
        error.statusCode = 422;
        throw error;
    }

    const description = req.body.description;
    const rent = req.body.rent;
    const roomSize = req.body.roomSize;
    const totalBeds = req.body.totalBeds;
    const bedsInRoom = req.body.bedsInRoom;
    const occupiedBeds = req.body.occupiedBeds;
    const vacantBeds = req.body.vacantBeds;
    const facilities = req.body.facilities;
    const city = req.body.city;
    const university = req.body.university;
    const owner = req.body.userId;//testing

    try {
        const hostel = new Hostel({
            image,
            description,
            rent,
            roomSize,
            totalBeds,
            bedsInRoom,
            occupiedBeds,
            vacantBeds,
            facilities,
            city,
            university,
            owner
        })
        await hostel.save();
        res.status(201).json({ message: "Hostel added successfully!", hostel: hostel });//testing
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getOwnerHostels = async (req, res, next) => {
    const owner = req.body.userId;//testing

    try {
        const hostels = await Hostel.find({ owner: owner });
        if (!hostels) {
            const error = new Error("No hostel found!");
            error.statusCode = 404;
            throw error;
        }
        let images = [];

        hostels.map(hostel => {
            console.log(hostel.image);
            const imagePath = `public/images/${hostel.image}`;
            if (fs.existsSync(imagePath)) {
                const image = fs.readFileSync(imagePath);
                const base64Image = Buffer.from(image).toString('base64');
                images.push(base64Image);
            }
        })

        res.status(201).json({ message: "Hostels found!", hostels: hostels, images })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getOwnerHostel = async (req, res, next) => {
    const owner = req.body.userId;//testing
    const hostelId = req.params.hostelId;

    try {
        const hostel = await Hostel.findOne({ owner: owner, _id: hostelId });
        if (!hostel) {
            const error = new Error("Couldn't find the hostel");
            error.statusCode = 404;
            throw error;
        }
        const imagePath = `public/images/${hostel.image}`;
        let image;
        if (fs.existsSync(imagePath)) {
            const Image = fs.readFileSync(imagePath);
            const base64Image = Buffer.from(Image).toString('base64');
            image = base64Image;
        }
        res.status(201).json({ message: "Hostels found!", hostel: hostel, image: image })
    } catch (error) {

    }
}

exports.updateHostel = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed, data entered in wrong format.");
        error.statusCode = 422;
        throw error;
    }

    const hostelId = req.params.hostelId;
    const image = req.file.filename;
    const description = req.body.description;
    const rent = req.body.rent;
    const roomSize = req.body.roomSize;
    const totalBeds = req.body.totalBeds;
    const bedsInRoom = req.body.bedsInRoom;
    const occupiedBeds = req.body.occupiedBeds;
    const vacantBeds = req.body.vacantBeds;
    const facilities = req.body.facilities;
    const city = req.body.city;
    const university = req.body.university;
    const owner = req.body.userId;//testing

    try {
        const hostel = await Hostel.findOne({ owner: owner, _id: hostelId });
        if (!hostel) {
            const error = new Error("Couldn't find the hostel");
            error.statusCode = 404;
            throw error;
        }
        hostel.image = image;
        hostel.description = description;
        hostel.rent = rent;
        hostel.roomSize = roomSize;
        hostel.totalBeds = totalBeds;
        hostel.bedsInRoom = bedsInRoom;
        hostel.occupiedBeds = occupiedBeds;
        hostel.vacantBeds = vacantBeds;
        hostel.facilities = facilities;
        hostel.city = city;
        hostel.university = university;
        await hostel.save();
        res.status(201).json({ message: "Hostel updated successfully!", hostel: hostel });//testing
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.deleteHostel = async (req, res, next) => {
    const hostelId = req.params.hostelId;
    const owner = req.body.userId;//testing
    if (!owner) {
        const error = new Error("User Not Found!");
        error.statusCode = 404;
        throw error;
    }

    try {
        const hostel = await Hostel.findOne({ owner, _id: hostelId });
        if (!hostel) {
            const error = new Error("No hostel found!");
            error.statusCode = 404;
            throw error;
        }

        const image = hostel.image;
        fs.unlink(`public/images/${image}`, (err) => {
            if (err) {
                console.log("Error while deleting the image: ", err)
            }
            else {
                console.log("Image deleted successfully!");
            }
        })

        await Hostel.findOneAndDelete({ owner, _id: hostelId });
        res.status(201).json({ message: "Hostel deleted!" })
    } catch (error) {

    }


}

//User Hostel APIs
exports.getAllHostels = async (req, res, next) => {

    try {
        const hostels = await Hostel.find();
        if (!hostels) {
            const error = new Error("No hostel found!");
            error.statusCode = 404;
            throw error;
        }
        let images = [];

        hostels.map(hostel => {
            console.log(hostel.image);
            const imagePath = `public/images/${hostel.image}`;
            if (fs.existsSync(imagePath)) {
                const image = fs.readFileSync(imagePath);
                const base64Image = Buffer.from(image).toString('base64');
                images.push(base64Image);
            }
        })

        res.status(201).json({ message: "Hostels found!", hostels: hostels, images: images })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.getHostelsWithCity = async (req, res, next) => {
    const city = req.query.city;
    if (!city) {
        const error = new Error("No city is provided!");
        error.statusCode = 403;
        throw error;
    }

    try {
        const hostels = await Hostel.find({ city: city });
        if (!hostels) {
            const error = new Error("No hostel found!");
            error.statusCode = 404;
            throw error;
        }
        let images = [];

        hostels.map(hostel => {
            console.log(hostel.image);
            const imagePath = `public/images/${hostel.image}`;
            if (fs.existsSync(imagePath)) {
                const image = fs.readFileSync(imagePath);
                const base64Image = Buffer.from(image).toString('base64');
                images.push(base64Image);
            }
        })

        res.status(201).json({ message: "Hostels found!", hostels: hostels, images: images })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.getHostelsWithFilter = async (req, res, next) => {
    const city = req.query.city;
    const roomSize = req.query.roomSize;
    const facilities = req.query.facilities;
    const beds = req.query.beds;
    const university = req.query.university;
    if (!city) {
        const error = new Error("No city is provided!");
        error.statusCode = 403;
        throw error;
    }
    if (!roomSize) {
        const error = new Error("No room size is provided!");
        error.statusCode = 403;
        throw error;
    }
    if (!facilities) {
        const error = new Error("No facilities is provided!");
        error.statusCode = 403;
        throw error;
    }
    if (!beds) {
        const error = new Error("No beds is provided!");
        error.statusCode = 403;
        throw error;
    }
    if (!university) {
        const error = new Error("No university is provided!");
        error.statusCode = 403;
        throw error;
    }

    try {
        const hostels = await Hostel.find({ 
            city: city, 
            roomSize: roomSize, 
            facilities: facilities, 
            bedsInRoom: beds, 
            university: university
        });
        if (!hostels) {
            const error = new Error("No hostel found!");
            error.statusCode = 404;
            throw error;
        }
        let images = [];

        hostels.map(hostel => {
            console.log(hostel.image);
            const imagePath = `public/images/${hostel.image}`;
            if (fs.existsSync(imagePath)) {
                const image = fs.readFileSync(imagePath);
                const base64Image = Buffer.from(image).toString('base64');
                images.push(base64Image);
            }
        })

        res.status(200).json({ message: "Hostels found!", hostels: hostels, images: images })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getHostel = async(req, res, next) => {
    const hostelId = req.params.hostelId;

    try {
        const hostel = await Hostel.findOne({ _id: hostelId });
        if (!hostel) {
            const error = new Error("Couldn't find the hostel");
            error.statusCode = 404;
            throw error;
        }
        const imagePath = `public/images/${hostel.image}`;
        let image;
        if (fs.existsSync(imagePath)) {
            const Image = fs.readFileSync(imagePath);
            const base64Image = Buffer.from(Image).toString('base64');
            image = base64Image;
        }
        res.status(201).json({ message: "Hostel found!", hostel: hostel, image: image })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}