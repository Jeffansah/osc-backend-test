import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { courses } from "../../data/dummyData";
import { Course } from "../../mongo/models/CourseModel";

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

// Course Collection Type
export const CollectionType = new GraphQLObjectType({
  name: "Collection",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    courses: {
      type: new GraphQLList(CourseType),
      resolve: (parent) =>
        parent.courseIds.map((id: string) => Course.findById(id)),
    },
  }),
});
