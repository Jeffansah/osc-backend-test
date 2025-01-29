import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { Course } from "../../mongo/models/CourseModel";

// Course Type
export const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    // field function to populate the props of the Course Type object
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    duration: { type: GraphQLString },
    outcome: { type: GraphQLString },
  }),
});

// Course Input Type
export const CourseInputType = new GraphQLInputObjectType({
  name: "CourseInput",
  fields: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    duration: { type: GraphQLString },
    outcome: { type: GraphQLString },
  },
});

// Course Collection Type
export const CollectionType = new GraphQLObjectType({
  name: "Collection",
  fields: () => ({
    name: { type: GraphQLString },
    courses: {
      type: new GraphQLList(CourseType),
      resolve: (parent) =>
        parent.courseIds.map((id: string) => Course.findById(id)),
    },
  }),
});
