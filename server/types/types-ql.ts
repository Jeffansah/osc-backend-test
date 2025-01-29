import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

// Course Type
export const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    // field function to populate the props of the Course Type object
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    duration: { type: GraphQLString },
    outcome: { type: GraphQLString },
  }),
});
