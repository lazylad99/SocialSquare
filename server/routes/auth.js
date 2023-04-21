import express from "express";
import { login } from "../controllers/auth.js";
import { body } from "express-validator";

const router = express.Router();

router.post("/login",
    [
        body("email", "Enter a valid email!").isEmail(),
        body("password", "Password cannot be blank!").exists(),
    ], login)

export default router;