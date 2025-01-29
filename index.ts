import express from "express";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./server/schema/schema";
import { connectToDatabase } from "./mongo";

// Loading Environment Variables
dotenv.config();

// Port
const port = process.env.PORT || 5000;

// Express App Initialization
const app = express();

/***  MIDDLWARES ***/

// GraphQL Middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development", // Enabling GraphiQL only in development mode for testing purposes
  })
);

// Running the server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
