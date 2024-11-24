import { User } from "../../database/models";
import { signJwt } from "../../service";
import { mailService } from "../../service";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
class AuthenticationService {
    constructor() {

    }
    async register(password, email) {
        const existingUser = await User.findOne({ email: email, deleted: false });
        if (existingUser) {
            const error: any = new Error("Email already exists");
            error.status = 400;
            throw error;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPasswordUser = bcrypt.hashSync(password, salt);

        const passwordResetToken = crypto.randomBytes(20).toString('hex');
        await User.create({ email: email, password: hashPasswordUser, passwordResetToken: passwordResetToken });
        return;
    }


    async login(email, password) {
        try {
            const user = await User.findOne({ email: email, deleted: false });
            if (user === null) {
                throw new Error("Email not exists");
            }

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                throw Error("Password not match");
            }
            const token = await signJwt(user, email);
            return token;
        } catch (error) {
            throw error;
        }
    }
    async forgotPassword(email) {
        const user = await User.findOne({ email: email, deleted: false });
        if (user === null) {
            const error: any = new Error("Email not exists");
            error.status = 404;
            throw error;
        }
        const htmlTemplate = 
        `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
            </head>
            <body style="font-family: 'Roboto', sans-serif; background-color: #f7fafc; padding: 20px;">
                <div style="max-width: 32rem; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">
                    <h1 style="font-size: 1.5rem; font-weight: 700; color: #2d3748; margin-bottom: 16px;">Password Reset Request</h1>
                    <p style="color: #4a5568; margin-bottom: 16px;">Hello,</p>
                    <p style="color: #4a5568; margin-bottom: 16px;">We received a request to reset your password. Please use the code below to reset it:</p>
                    <div style="background-color: #ebf8ff; color: #2b6cb0; border: 1px solid #bee3f8; border-radius: 0.5rem; padding: 12px; font-weight: 700; text-align: center; margin-bottom: 16px;">${ user.passwordResetToken }</div>
                    <p style="color: #4a5568; margin-bottom: 16px;">Enter this code on the password reset page to create a new password.</p>
                    <p style="color: #4a5568; margin-bottom: 16px;">If you did not request a password reset, please ignore this email.</p>
                    <p style="color: #4a5568; margin-bottom: 16px;">Thank you,</p>
                    <p style="color: #4a5568; margin-bottom: 16px;">S-Forum</p>
                </div>
                <div style="text-align: center; color: #a0aec0; font-size: 0.875rem; margin-top: 24px;">
                    <p>&copy; 2024 S-Forum. All rights reserved.</p>
                </div>
            </body>
        </html>`;
        try {
            mailService.sendMail(email, "[S-Forum] Forgot Password", htmlTemplate);
        } catch (error: any) {
            throw error;
        }
    }

    async resetPassword(tokenResetPassword, password) {
        try {
            const user = await User.findOne({ passwordResetToken: tokenResetPassword, deleted: false });
            if (user === null) {
                throw new Error("Token not exists");
            }
            const salt = bcrypt.genSaltSync(10);
            const hashPasswordUser = bcrypt.hashSync(password, salt);
            await user.set({ password: hashPasswordUser });
            await user.save();
            return;
        }
        catch (error) {
            throw error;
        }
    }
    async findAccountByEmail(email) {
        try {

        }
        catch (error) {
            throw error;
        }
    }
    async findNamePermissionById(ids) {
        try {


        } catch (error) {
            throw error;
        }
    }
}

export default new AuthenticationService();
