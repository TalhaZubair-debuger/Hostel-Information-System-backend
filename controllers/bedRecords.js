const BedRecords = require("../models/bedRecords");
const Hostel = require("../models/hostel");
const { validationResult } = require("express-validator");
const User = require("../models/user");


exports.getBedRecords = async (req, res, next) => {
    const hostelId = req.params.hostelId;

    try {
        const bedRecords = await BedRecords.find({ hostelId });
        if (bedRecords.length > 0) {
            for (let i = 0; i < bedRecords.length; i++) {
                const convertedDueDate = new Date(bedRecords[i].dueDate);
                const date = new Date();
                if (convertedDueDate < date) {
                    bedRecords[i].previousDues = "Pending"
                    await bedRecords[i].save();
                }
            }
            const bedRecordsFinal = await BedRecords.find({ hostelId });
            res.status(200).json({ Beds: bedRecordsFinal, ownerId: req.userId });
        }
        else {
            const hostel = await Hostel.findById(hostelId);
            if (hostel) {
                if (hostel.occupiedBeds + hostel.vacantBeds === hostel.totalBeds) {
                    for (let i = 0; i < hostel.occupiedBeds; i++) {
                        const newBedRecords = new BedRecords({
                            hostelId,
                            preOccupied: true,
                            occupied: false
                        })
                        await newBedRecords.save();
                    }
                    for (let i = 0; i < hostel.vacantBeds; i++) {
                        const newBedRecords = new BedRecords({
                            hostelId,
                            preOccupied: false,
                            occupied: false
                        })
                        await newBedRecords.save();
                    }
                    const bedRecordsFinal = await BedRecords.find({ hostelId });
                    res.status(200).json({ message: "Beds records created and saved!", Beds: bedRecordsFinal, ownerId: req.userId });
                }
                else {
                    res.status(200).json({ message: "Total beds and Occupied + Vacant beds doesnt match" });
                }
            } else {
                res.status(404).json({ message: "Hostel not found!" });
            }
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.addPreOccupiedBedInfo = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({message: "Validation Failed, data entered in wrong format."})
        return;
    }

    const hosteliteName = req.body.name;
    const contact = req.body.contact;
    const bedId = req.params.bedId;

    try {
        const bedRecord = await BedRecords.findById(bedId);
        if (!bedRecord) {
            res.status(404).json({message: "Bed not found!"})
        return;
        }
        bedRecord.hosteliteName = hosteliteName;
        bedRecord.contact = contact;
        bedRecord.occupied = true;
        await bedRecord.save();
        res.status(200).json({ message: "Bed Record updated successfully!" });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postMakePaymentRequest = async (req, res, next) => {
    const amount = req.body.amount;
    const hostelId = req.params.hostelId;
    try {
        const bed = await BedRecords.findOne({ hostelId: hostelId, occupied: false, preOccupied: false });
        if (!bed) {
            res.status(404).json({ message: "No vacant beds found!" });
            return;
        }
        const hostel = await Hostel.findById(hostelId);
        //Payment Gateway
        const stripe = require('stripe')(hostel.privateKey);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'pkr',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({ paymentIntent: paymentIntent.client_secret });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postMakeOfflinePayment = async (req, res, next) => {
    const hostelId = req.params.hostelId;
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate());
    const formattedDueDate = dueDate.toLocaleDateString("en-US");

    try {
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            res.status(404).json({message: "Hostel not found!"})
        return;
        }
        const bed = await BedRecords.findOne({ hostelId: hostelId, occupied: false, preOccupied: false });
        if (!bed) {
            res.status(404).json({ message: "No vacant beds found!" });
            return;
        }

        const user = await User.findById(req.userId);

        bed.hosteliteName = user.name;
        bed.contact = user.contact;
        bed.rentAmont = hostel.rent;
        bed.dueDate = formattedDueDate;
        bed.previousDues = "Cleared";
        bed.occupied = true;
        bed.occupantId = req.userId;
        bed.offlinePaymentSent = true;
        bed.offlinePaymentRecieved = false;

        const bedResponse = await bed.save();
        if (bedResponse) {
            res.status(200).json({ message: "Bed Offline payment successful! You will be able to see your bed in 'Your Hostels' once hostel owner approves it." });
        } else {
            res.status(400).json({ message: "Unkown error occured!" });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postBookABed = async (req, res, next) => {
    const hostelId = req.params.hostelId;
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate());
    const formattedDueDate = dueDate.toLocaleDateString("en-US");

    try {
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            res.status(404).json({message: "Hostel not found!"})
        return;
        }
        const bed = await BedRecords.findOne({ hostelId: hostelId, occupied: false, preOccupied: false });
        if (!bed) {
            res.status(404).json({message: "No vacant bed found! (Your payment will be returned shortly"})
        return;
        }
        const user = await User.findById(req.userId);

        bed.hosteliteName = user.name;
        bed.contact = user.contact;
        bed.rentAmont = hostel.rent;
        bed.dueDate = formattedDueDate;
        bed.previousDues = "Cleared";
        bed.occupied = true;
        bed.occupantId = req.userId;

        const bedResponse = await bed.save();

        if (bedResponse) {
            res.status(200).json({ message: "Bed booked successfully!" });
        } else {
            res.status(400).json({ message: "Unkown error occured!" });
        }

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getBedsUser = async (req, res, next) => {
    const occupantId = req.params.occupantId;

    try {
        const beds = await BedRecords.find({ occupantId: occupantId });
        if (!beds) {
            res.status(404).json({ message: "User has no hostel booked!" });
            return;
        }
        let hostels = [];
        for (let i = 0; i < beds.length; i++) {
            const hostel = await Hostel.findById(beds[i].hostelId);
            hostels.push(hostel);
        }
        res.status(200).json({ beds: beds, hostels: hostels });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.deleteBed = async (req, res, next) => {
    const bedId = req.params.bedId;

    try {
        const bed = await BedRecords.findById(bedId);
        if (!bed) {
            res.status(404).json({ message: "Could not found the requested bed." });
            return;
        }
        bed.occupied = false;
        bed.dueDate = "";
        bed.hosteliteName = "";
        bed.occupantId = null;
        bed.previousDues = "";
        bed.rentAmont = "";
        await bed.save();
        res.status(200).json({ message: "Bed booking canceled!" });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.patchUpdateDues = async (req, res, next) => {
    const bedId = req.params.bedId;
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate());
    const formattedDueDate = dueDate.toLocaleDateString("en-US");

    try {
        const bed = await BedRecords.findById(bedId);
        if (!bed) {
            res.status(404).json({ message: "Error finding the bed!" });
        }
        bed.previousDues = "Cleared";
        bed.dueDate = formattedDueDate;
        await bed.save();

        res.status(200).json({ message: "Bed Dues Updated!" });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.EditBedInfo = async (req, res, next) => {
    const bedId = req.params.bedId;
    const name = req.body.name;
    const contact = req.body.contact;
    const rent = req.body.rent;

    try {
        const bed = await BedRecords.findById(bedId);
        if (!bed) {
            res.status(404).json({ message: "Could not found the requested bed." });
            return;
        }
        bed.hosteliteName = name;
        bed.contact = contact;
        if (rent) {
            bed.rentAmont = rent;
        }

        await bed.save();
        res.status(200).json({ message: "Bed Info Updated!" });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.pathVerifyOfflinePayment = async (req, res, next) => {
    const bedId = req.params.bedId;

    try {
        const bed = await BedRecords.findById(bedId);
        if (!bed) {
            res.status(500).json({ message: "Error fetching bed details" })
        }
        bed.offlinePaymentRecieved = true;
        await bed.save();
        res.status(200).json({ message: "Payment Verified and bed allocated!" });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}