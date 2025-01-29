import { GraphQLSchema } from "graphql";
import { RootQuery } from "../queries/CourseQueries";

// Setting Schema
const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
