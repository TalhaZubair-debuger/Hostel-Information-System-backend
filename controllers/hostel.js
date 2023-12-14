const Hostel = require("../models/hostel.js");
const { validationResult, check } = require("express-validator");
const fs = require("fs");
const User = require("../models/user.js");
const BedRecords = require("../models/bedRecords.js");

//Owner Hostel APIs
exports.addHostel = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed, data entered in wrong format.");
        error.statusCode = 422;
        throw error;
    }

    const image = req.body.image;
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
    const owner = req.userId;
    const privateKey = req.body.privateKey;
    const publishableKey = req.body.publishableKey;

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
            owner,
            privateKey,
            publishableKey
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
    const owner = req.userId;//production

    try {
        const hostels = await Hostel.find({ owner: owner });
        if (!hostels) {
            const error = new Error("No hostel found!");
            error.statusCode = 404;
            throw error;
        }
        res.status(201).json({ message: "Hostels found!", hostels: hostels })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getOwnerHostel = async (req, res, next) => {
    const owner = req.userId;
    const hostelId = req.params.hostelId;

    try {
        const hostel = await Hostel.findOne({ owner: owner, _id: hostelId });
        if (!hostel) {
            const error = new Error("Couldn't find the hostel");
            error.statusCode = 404;
            throw error;
        }
        res.status(201).json({ message: "Hostel found!", hostel: hostel })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
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

    try {
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            const error = new Error("No hostel found!");
            error.statusCode = 404;
            throw error;
        }

        const bedRecords = await BedRecords.find({ hostelId });
        if (bedRecords) {
            for (let i = 0; i < bedRecords.length; i++) {
                await BedRecords.findOneAndDelete({ hostelId });
            }
        }

        await Hostel.findOneAndDelete({ _id: hostelId });
        res.status(201).json({ message: "Hostel deleted!" })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
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

        res.status(201).json({ message: "Hostels found!", hostels: hostels })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.getTopHostels = async (req, res, next) => {
    try {
        const hostels = await Hostel.find().limit(5);//testing
        if (!hostels) {
            const error = new Error("No hostel found!");
            error.statusCode = 404;
            throw error;
        }
        res.status(201).json({ message: "Hostels found!", hostels: hostels })
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
        if (hostels.length === 0) {
            res.status(201).json({ message: "No Hostels found!" })
            return;
        }
        res.status(201).json({ message: "Hostels found!", hostels: hostels })
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
        console.log(city + roomSize + facilities + beds + university);
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
        res.status(200).json({ message: "Hostels found!", hostels: hostels })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getHostel = async (req, res, next) => {
    const hostelId = req.params.hostelId;
    try {
        const hostel = await Hostel.findOne({ _id: hostelId });
        if (!hostel) {
            const error = new Error("Couldn't find the hostel");
            error.statusCode = 404;
            throw error;
        }
        res.status(201).json({ message: "Hostel found!", hostel: hostel })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.addToFavorites = async (req, res, next) => {
    const user = req.userId;
    const hostelId = req.params.hostelId;

    try {
        const checkUser = await User.findById(user);
        if (!checkUser) {
            const error = new Error("No authorized user found!");
            error.statusCode = 409;
            throw error;
        }
        checkUser.favorites.push(hostelId);
        await checkUser.save()
        res.status(200).json({ message: "Hostel added to favorites!" });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.removeFromFavorites = async (req, res, next) => {
    const user = req.userId;
    const hostelId = req.params.hostelId;

    try {
        const checkUser = await User.findById(user);
        if (!checkUser) {
            const error = new Error("No authorized user found!");
            error.statusCode = 409;
            throw error;
        }
        checkUser.favorites.pop(hostelId);
        await checkUser.save()
        res.status(200).json({ message: "Hostel removed from favorites!" });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getFavoriteHostels = async (req, res, next) => {

    try {
        const user = await User.findById(req.userId);
        if (!user.favorites) {
            const error = new Error("User does not have any favorites!");
            error.statusCode = 409;
            throw error;
        }
        let hostels = [];
        for (let i = 0; i < user.favorites.length; i++) {
            const response = await Hostel.findById(user.favorites[i])
            if (response) {
                hostels.push(response);
            }
        }
        if (hostels.length === 0) {
            res.status(200).json({ message: "No hostels in favorites" });
        }
        else {
            res.status(200).json({ message: "Favorite hostels found!", hostels: hostels });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postAddReview = async (req, res, next) => {
    const hostelId = req.params.hostelId;
    const feedback = req.body.feedback;
    const rating = req.body.rating;
    const userId = req.userId;

    try {
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            res.status(404).json({ message: "No hostel found!" });
        }
        const user = await User.findById(userId);

        hostel.reviews.push({
            feedback,
            rating,
            user: userId,
            name: user.name
        })

        await hostel.save();
        res.status(200).json({ message: "Review added!" });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}