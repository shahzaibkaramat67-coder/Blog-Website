import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { Schema } from 'mongoose';

const SingupSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    gmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role:{
        type:String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });


SingupSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

SingupSchema.methods.isCorrectPassword = async function (password) {

    return await bcrypt.compare(password, this.password)

}

SingupSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            id: this._id,
            firstName: this.firstName
        },
        process.env.generateAccessToken,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

SingupSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            id: this.id,
            firstName: this.firstName
        },
        process.env.generateRefreshToken,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

const User = mongoose.model('User', SingupSchema)

export default User;

