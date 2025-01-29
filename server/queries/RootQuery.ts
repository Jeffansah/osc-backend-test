import { GraphQLID, GraphQLList, GraphQLObjectType } from "graphql";
import { courses } from "../../data/dummyData";
import { CourseType } from "../types/types-ql";
import { ICourse } from "../../types-ts/CourseType";

// Query To Get a Single Course
export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Query to get a single course
    course: {
      type: CourseType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // resolver function that takes args as parameters to find the course with the matching id
        return courses.find((course: ICourse) => course.id === args.id);
      },
    },
    // Query to get all courses
    courses: {
      type: new GraphQLList(CourseType),
      resolve(parent, args) {
        return courses; // returns all courses
      },
    },
  },
});
