const { z } = require("zod");

const email = z.string().trim().toLowerCase().email();
const password = z.string().min(8).max(128);

const registerSchema = z.object({
  body: z.object({
    email,
    password,
    name: z.string().trim().min(1).max(120).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const loginSchema = z.object({
  body: z.object({
    email,
    password,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const googleCallbackSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    code: z.string().min(1),
    state: z.string().min(1),
  }),
});

module.exports = {
  googleCallbackSchema,
  loginSchema,
  registerSchema,
};
