import { GraphQLSchema } from "graphql";
import { RootQuery } from "../queries/RootQuery";

// Setting Schema
const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
