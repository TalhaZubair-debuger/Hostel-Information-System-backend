const express = require("express");
const hostelController = require("../controllers/hostel");
const { body } = require("express-validator")
const Hostel = require("../models/hostel");
const multer = require("multer");
const isAuth = require("../middlewares/is-auth");

const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
        cb(null, Date.now()+file.originalname);
    }
})

const uploadImage = multer({
    storage: storage
})
const router = express.Router();

//Owner Routes
// body("description")
//     .trim()
//     .isLength({ min: 5 }),
// body("rent")
//     .notEmpty()
//     .isNumeric()
//     .withMessage("Rent must be enetered correctly numbers!"),
// body("roomSize")
//     .notEmpty()
//     .trim()
//     .withMessage("Must enter room size!"),
// body("totalBeds")
//     .notEmpty()
//     .isNumeric()
//     .withMessage("Must enter total beds correctly!"),
// body("occupiedBeds")
//     .notEmpty()
//     .isNumeric()
//     .withMessage("Must enter occupied beds correctly!"),
// body("vacantBeds")
//     .notEmpty()
//     .isNumeric()
//     .withMessage("Must enter vacant beds correctly!"),
// body("facilities")
//     .notEmpty()
//     .withMessage("Must enter Facilites!"),
// body("address")
//     .trim()
//     .notEmpty()
//     .withMessage("Must enter address correctly!"),
// body("university")
//     .trim()
//     .notEmpty()
//     .withMessage("Must enter university name correctly!")

router.put("/add-hostel", isAuth, hostelController.addHostel);

router.get("/hostels", isAuth, hostelController.getOwnerHostels);

router.get("/hostel/:hostelId", isAuth, hostelController.getOwnerHostel);

router.put("/edit-hostel/:hostelId", [
        // body("description")
    //     .trim()
    //     .isLength({ min: 5 }),
    // body("rent")
    //     .notEmpty()
    //     .isNumeric()
    //     .withMessage("Rent must be enetered correctly numbers!"),
    // body("roomSize")
    //     .notEmpty()
    //     .trim()
    //     .withMessage("Must enter room size!"),
    // body("totalBeds")
    //     .notEmpty()
    //     .isNumeric()
    //     .withMessage("Must enter total beds correctly!"),
    // body("occupiedBeds")
    //     .notEmpty()
    //     .isNumeric()
    //     .withMessage("Must enter occupied beds correctly!"),
    // body("vacantBeds")
    //     .notEmpty()
    //     .isNumeric()
    //     .withMessage("Must enter vacant beds correctly!"),
    // body("facilities")
    //     .notEmpty()
    //     .withMessage("Must enter Facilites!"),
    // body("address")
    //     .trim()
    //     .notEmpty()
    //     .withMessage("Must enter address correctly!"),
    // body("university")
    //     .trim()
    //     .notEmpty()
    //     .withMessage("Must enter university name correctly!")
], isAuth, uploadImage.single("image"), hostelController.updateHostel);

router.delete("/delete-hostel/:hostelId", isAuth, hostelController.deleteHostel);

//User Routes
router.get("/all-hostels", isAuth, hostelController.getAllHostels);

router.get("/top-hostels", isAuth, hostelController.getTopHostels);

router.get("/hostels-city", isAuth, hostelController.getHostelsWithCity);

router.get("/hostels-with-filter", isAuth, hostelController.getHostelsWithFilter);

router.get('/hostel-user/:hostelId', isAuth, hostelController.getHostel);

router.post("/favorites/add-to-favorite", isAuth);


module.exports = router;