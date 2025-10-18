// src/middlewares/validator.middleware.js
import { body, validationResult } from 'express-validator';

export const validatePost = [
  // Title must not be empty and is sanitized
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required."),

  // Content must not be empty and is sanitized
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required."),

  // AuthorId must be a valid integer (>= 1)
  body("authorId")
    .isInt({ min: 1 })
    .withMessage("A valid author ID is required."),

  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateComment = [
  body("text")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment must be between 1 and 500 characters."),

  // Only if you're not using authentication for authorId
  body("authorId")
    .isInt({ min: 1 })
    .withMessage("A valid author ID is required."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// ADD THIS NEW VALIDATOR
export const validateRegistration = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required.'),
    
    body('email')
        .isEmail()
        .withMessage('A valid email is required.'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),
    
    // This part remains the same for all validators
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
];
