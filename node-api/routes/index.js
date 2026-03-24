const express = require("express");
const router = express.Router();
const sampleController = require("../controllers/sample.controller");

// Example route: GET /api/hello
router.get("/hello", sampleController.getHello);

// Example route: POST /api/data
router.post("/data", sampleController.postData);

module.exports = router;
