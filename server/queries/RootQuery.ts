import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from "graphql";
import { collections, courses } from "../../data/dummyData";
import { CollectionType, CourseType } from "../types/types-ql";
import { ICourse } from "../../types-ts/CourseType";
import { Collection } from "../../mongo/models/CollectionsModel";
import { Course } from "../../mongo/models/CourseModel";

// Query To Get a Single Course
export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    /** COURSES QUERIES **/

    // Query to get a single course
    course: {
      type: CourseType,
      args: { id: { type: GraphQLID } },
      resolve: (_, args) =>
        // resolver function that takes args as parameters to find the course with the matching id
        Course.findById(args.id),
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
      resolve: (_, args) => {
        const options = {
          sort: { title: args.sortOrder === "ASC" ? 1 : -1 }, // Sorting order based on the argument
          limit: args.limit || 0, // Limiting the number of results
        };

        // Fetch all courses with the given options
        return Course.find({}, _, options);
      },
    },

    /** COLLECTIONS QUERIES **/

    // Query to get all collections
    collections: {
      type: new GraphQLList(CollectionType),
      resolve: () => Collection.find(), // returns all collections
    },
    // Query to get a single collection
    collection: {
      type: CollectionType,
      args: { id: { type: GraphQLID } },
      resolve: (_, args) => Collection.findById(args.id), // returns the collection with the matching id
    },
  },
});
