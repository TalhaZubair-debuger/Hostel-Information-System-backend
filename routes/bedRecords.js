const express = require("express");
const isAuth = require("../middlewares/is-auth");
const bedRecordsController = require("../controllers/bedRecords");
const { body } = require("express-validator")


const router = express.Router();

router.get("/get-bed-records/:hostelId", isAuth, bedRecordsController.getBedRecords);

router.get("/get-bed/:occupantId", isAuth, bedRecordsController.getBedsUser);

router.post("/add-bed-info/:bedId", [
    // body("hosteliteName")
    //     .trim()
    //     .isAlphanumeric(),
    // body("contact")
    //     .isNumeric()
    //     .trim()
], isAuth, bedRecordsController.addPreOccupiedBedInfo);

router.post("/make-payment/:hostelId", isAuth, bedRecordsController.postMakePaymentRequest);

router.post("/make-offline-payment/:hostelId", isAuth, bedRecordsController.postMakeOfflinePayment);

router.post("/book-bed/:hostelId", isAuth, bedRecordsController.postBookABed);

router.delete("/delete-bed/:bedId", isAuth, bedRecordsController.deleteBed);

router.patch("/update-dues/:bedId", isAuth, bedRecordsController.patchUpdateDues);

router.patch("/update-data/:bedId", isAuth, bedRecordsController.EditBedInfo);

router.patch("/verify-offline-payments/:bedId", isAuth, bedRecordsController.pathVerifyOfflinePayment);

module.exports = router;