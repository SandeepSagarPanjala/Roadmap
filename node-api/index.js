import express from "express";
import cors from "cors";
import Joi from "joi";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

// Helmet helps secure your Node.js application by setting various HTTP headers.
// It's highly recommended for production applications.
app.use(
  helmet({
    // Since this is an API that is likely consumed by cross-origin frontends,
    // we set the Cross-Origin-Resource-Policy to cross-origin to permit it.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Apply rate limiting middleware to all requests.
// Industry standard: limit each IP to 100 requests per 15-minute window.
// This helps mitigate brute-force and denial-of-service attacks.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: "draft-8", // Set modern RateLimit header (draft-8)
  legacyHeaders: false, // Disable older X-RateLimit-* headers
  message: {
    status: 429,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

app.use(limiter);

app.use(cors());
app.use(express.json());

const users = [
  { id: 1, name: "Sandeep" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
];

app.get("/", (req, res) => {
  res.send("WELCOME TO NODE API");
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const user = users.find((x) => x.id == parseInt(req.params.id));
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  res.status(200).json(user);
});

app.post("/users/add", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error);
    return;
  }

  let user = {
    id: users.length + 1,
    name: req.body.name,
  };

  users.push(user);
  res.status(201).json(user);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
