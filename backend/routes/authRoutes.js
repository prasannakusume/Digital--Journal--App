const express = require("express");
const router = express.Router();
const User = require("../models/User");
router.get("/hello", (req,res)=>{
    res.send("Auth Route Working");
});
router.post("/register", async (req, res) => {

    console.log(req.body);

    try {
        const { name, email, password } = req.body;

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: "User Registered Successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: error.message
        });
    }
});
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User Not Found"
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        res.status(200).json({
            message: "Login Successful"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
});
console.log("Auth Routes File Loaded ✅");
module.exports = router;