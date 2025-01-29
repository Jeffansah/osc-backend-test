import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { CollectionType, CourseType, UserType } from "../types/types-ql";
import { Collection } from "../../mongo/models/CollectionsModel";
import { Course } from "../../mongo/models/CourseModel";
import { User } from "../../mongo/models/UserModel";

// Query To Get a Single Course
export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    /** COURSES QUERIES **/

    // Query to get a single course
    course: {
      type: CourseType,
      args: { id: { type: GraphQLString } },
      resolve: async (_, args) =>
        // resolver function that takes args as parameters to find the course with the matching id
        await Course.findById(args.id),
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
      resolve: async (_, args) => {
        const options = {
          sort: { title: args.sortOrder === "ASC" ? 1 : -1 }, // Sorting order based on the argument
          limit: args.limit || 0, // Limiting the number of results
        };

        // Fetch all courses with the given options
        const courses = await Course.find({}, _, options);
        return courses;
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
      args: { id: { type: GraphQLString } },
      resolve: async (_, args) => await Collection.findById(args.id), // returns the collection with the matching id
    },

    /** USER QUERIES **/

    // Query to get a single user
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve: async (_, args) => await User.findById(args.id), // returns the user with the matching id
    },

    // Query to get all users
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, args, { req, res }) => {
        // verify if the user is authenticated
        if (!req.user || req.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        return await User.find(); // returns all users
      },
    },
  },
});
