import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from "graphql";
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
      args: {
        // Optional arguments to limit the number of courses returned and to sort the courses
        limit: { type: GraphQLInt },
        sortOrder: {
          type: new GraphQLEnumType({
            name: "SortOrder",
            values: {
              ASC: { value: "ASC" },
              DESC: { value: "DESC" }, // storing sort orders in an enum for type saftey
            },
          }),
        },
      },
      resolve(parent, args) {
        let sortedCourses = [...courses];
        if (args.sortOrder === "ASC") {
          sortedCourses.sort((a, b) => a.title.localeCompare(b.title)); // Sorting in ascending order by course title
        } else if (args.sortOrder === "DESC") {
          sortedCourses.sort((a, b) => b.title.localeCompare(a.title)); // Sorting in descending order by course title
        }
        return args.limit ? sortedCourses.slice(0, args.limit) : sortedCourses; // Returning the sorted courses with the limit applied if provided
      },
    },
  },
});
