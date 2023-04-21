import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required: true,
            min: 2,
            max: 30,
        },
        lastName:{
            type: String,
            required: true,
            min: 2,
            max: 30,
        },
        email:{
            type: String,
            required: true,
            max: 30,
            unique: true
        },
        password:{
            type: String,
            required: true,
        },
        picturePath:{
            type: String,
            default: "",
        },
        friends:{
            type: Array,
            default: []
        },
        location: String,
        occupation: String,
        age:{
            type: Number,
            required: true,
        },
    },
    { timestamps: true}
);

const User = mongoose.model("User", UserSchema);

export default User;