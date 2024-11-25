import { createInboundValidatorByJoi } from './validatorBuilder'
import Joi from 'joi';
const STRONG_PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const STRONG_PASSWORD_MESSAGE = 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character'

const validateUserUpdate = createInboundValidatorByJoi(
    Joi.object({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        gender: Joi.boolean().required(),
        phone: Joi.number().required(),
        dayOfBirth: Joi.date().required(),
        profileImage: Joi.string()
    })
);
const validatePasswordReset = createInboundValidatorByJoi(
    Joi.object({
        password: Joi.string().required()
            .regex(STRONG_PASSWORD_REGEX)
            .message(STRONG_PASSWORD_MESSAGE),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required()
            .messages({ 'any.only': 'Confirm password must match password' })
    })
);
const validateChangePassword = createInboundValidatorByJoi(
    Joi.object({
        password: Joi.string().required(),
        newPassword: Joi.string().required()
            .regex(STRONG_PASSWORD_REGEX)
            .message(STRONG_PASSWORD_MESSAGE),
        confirmNewPassword: Joi.any().valid(Joi.ref('newPassword')).required()
            .messages({ 'any.only': 'Confirm password must match password' })
    })
);

const validateStatusUser = createInboundValidatorByJoi(
    Joi.object({
        isActive: Joi.string().required().valid('active', 'blockposting', 'blockcomment', 'banner'),
    })
);
const validateUserRegister = createInboundValidatorByJoi(
    Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
            .regex(STRONG_PASSWORD_REGEX)
            .message(STRONG_PASSWORD_MESSAGE),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required()
            .messages({ 'any.only': 'Confirm password must match password' })
    })
);
const validateUpdateBlogs = createInboundValidatorByJoi(
    Joi.object({
        title: Joi.string(),
        content: Joi.string(),
        blogImage: Joi.string(),
        category: Joi.string(),
        reaction: Joi.string().valid('like', 'dislike'),
    })
);
export {
    validateUserRegister,
    validateUserUpdate,
    validateStatusUser,
    validatePasswordReset,
    validateChangePassword,
    validateUpdateBlogs
};