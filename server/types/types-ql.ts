import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { Course } from "../../mongo/models/CourseModel";

/** COURSE **/
// Course Type
export const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    // field function to populate the props of the Course Type object
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    duration: { type: GraphQLString },
    outcome: { type: GraphQLString },
    authorId: { type: GraphQLString },
    collectionId: { type: GraphQLString },
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

/** COLLECTION **/
// Collection Type
export const CollectionType = new GraphQLObjectType({
  name: "Collection",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    courses: {
      type: new GraphQLList(CourseType),
      // resolver function to get the courses of the collection by the collection Id matching with the mongo id of the collection
      resolve: async (parent) =>
        await Course.find({ collectionId: parent._id }),
    },
  }),
});

/** USER **/
// User Role Enum Type
const UserRoleEnumType = new GraphQLEnumType({
  name: "UserRole",
  values: {
    ADMIN: { value: "admin" },
    USER: { value: "user" },
  },
});

// User Type
export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: UserRoleEnumType },
    courses: {
      type: new GraphQLList(CourseType),
      // resolve function to get the courses of the user by the authord Id matching with the mongo id of the user
      resolve: async (parent) => {
        return Course.find({ authorId: parent._id });
      },
    },
  }),
});

// User Input Type
export const UserLoginInputType = new GraphQLInputObjectType({
  name: "UserInput",
  fields: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
});

// User Register Input Type
export const UserRegisterInputType = new GraphQLInputObjectType({
  name: "UserRegisterInput",
  fields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
});
