const { z } = require("zod");

const zodSchemaSignUp = z.object({
  userName: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(5, { message: "Must be 5 or more characters long" })
    .max(100, { message: "Name cannot be longer than 100 words" }),
  password: z
    .string()
    .min(8, { message: "Must be 8 or more characters long" })
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character"
    ),
  firstName: z
    .string()
    .trim()
    .max(100, { message: "Name cannot be longer than 100 words" }),
  lastName: z
    .string()
    .trim()
    .max(100, { message: "Name cannot be longer than 100 words" }),
});


const zodSchemaForLogin = z.object({
    userName: z
      .string({ required_error: "Name is requires" })
      .trim()
      .min(5, { message: "Must be 5 or more characters long" })
      .max(100, { message: "Name cannot be longer than 100 words" }),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "something is incorrect"
      ),
  });
  
  module.exports = {
    zodSchemaSignUp,
    zodSchemaForLogin,
  };
  
