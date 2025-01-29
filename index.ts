import express, { Request } from "express";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./server/schema/schema";
import { connectToDatabase } from "./mongo";
import cookieParser from "cookie-parser";
import { validateToken } from "./utils/validateToken";

// Loading Environment Variables
dotenv.config();

// Port
const port = process.env.PORT || 5000;

// Express App Initialization
const app = express();

/***  MIDDLWARES ***/

// Cookie Parser Middleware
app.use(cookieParser());

// Validate Token on Each Request
app.use(async (req: Request, _, next) => {
  await validateToken(req);
  next();
});

// GraphQL Middleware
app.use(
  "/graphql",
  graphqlHTTP((req, res): any => ({
    schema,
    graphiql: process.env.NODE_ENV === "development", // Enabling GraphiQL only in development mode for testing purposes
    context: {
      req,
      res,
      user: (req as any).user,
    },
  }))
);

// Running the server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
