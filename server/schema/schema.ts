import { GraphQLSchema } from "graphql";
import { RootQuery } from "../queries/RootQuery";
import { mutation } from "../mutations/RootMutations";

// Setting Schema
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
