import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import {
  CollectionInputType,
  CollectionType,
  CourseInputType,
  CourseType,
  UserLoginInputType,
  UserRegisterInputType,
  UserType,
} from "../types/types-ql";
import { Course } from "../../mongo/models/CourseModel";
import bcrypt from "bcrypt";
import { User } from "../../mongo/models/UserModel";
import { encryptPassword } from "../../utils/encryptPassword";
import { decryptPassword } from "../../utils/decryptPassword";
import { generateToken } from "../../utils/generateToken";
import { log } from "console";
import { Collection } from "../../mongo/models/CollectionsModel";

export const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    /* COURSES MUTATIONS */
    addCourse: {
      type: CourseType,
      args: {
        input: { type: new GraphQLNonNull(CourseInputType) },
      },
      resolve: async (_, { input }, { req, res }) => {
        // verify if the user is authenticated
        if (!req.user) {
          throw new Error("Unauthorized");
        }

        const currentUser = await User.findById(req.user._id);

        if (!currentUser) {
          throw new Error("User not found");
        }

        // Check if a course with the same title and author already exists
        const existingCourse = await Course.findOne({
          title: input.title,
          authorId: currentUser._id,
        });

        // If it exists, throw an error
        if (existingCourse) {
          throw new Error("Course with this title and author already exists");
        }

        // Create a new course based on the input
        const newCourse = await Course.create({
          title: input.title,
          description: input.description,
          duration: input.duration,
          outcome: input.outcome,
          authorId: currentUser._id, // set the author Id to the authentciated user id
        });
        return newCourse; // Return the newly created course
      },
    },
    updateCourse: {
      type: CourseType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(CourseInputType) },
      },
      resolve: async (_, { id, input }, { req, res }) => {
        // verify if the user is authenticated
        if (!req.user) {
          throw new Error("Unauthorized, please log in");
        }

        // Find the course by ID and if it exists
        const course = await Course.findById(id);

        if (!course) {
          throw new Error("Course not found");
        }

        // Check if the authenticated user is the author of the course or is not an admin
        if (course.authorId !== req.user._id && req.user.role !== "admin") {
          throw new Error("Unauthorized to update this course");
        }

        // If not, throw an error
        if (!course) {
          throw new Error(`Course with ID ${id} not found`);
        }

        // Create an update object based on provided input
        const updateFields: any = {};
        if (input.title) updateFields.title = input.title;
        if (input.description) updateFields.description = input.description;
        if (input.duration) updateFields.duration = input.duration;
        if (input.outcome) updateFields.outcome = input.outcome;

        // Update the course using findOneAndUpdate with the $set operator
        const updatedCourse = await Course.findOneAndUpdate(
          { _id: id },
          { $set: updateFields },
          { new: true }
        );
        return updatedCourse; // Return the updated course
      },
    },
    deleteCourse: {
      type: CourseType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { id }, { req, res }) => {
        // verify if the user is authenticated
        if (!req.user) {
          throw new Error("Unauthorized");
        }

        // Find the course by ID and if it exists
        const course = await Course.findById(id);

        // If not, throw an error
        if (!course) {
          throw new Error(`Course with ID ${id} not found`);
        }

        // Check if the authenticated user is the author of the course
        if (course.authorId !== req.user._id && req.user.role !== "admin") {
          throw new Error("Unauthorized to delete this course");
        }

        // Find the course by ID and if it exists
        const deletedCourse = await Course.findByIdAndDelete(id);

        // If not, throw an error
        if (!deletedCourse) {
          throw new Error(`Course with ID ${id} not found`);
        }
        return deletedCourse; // Return the deleted course
      },
    },

    /* COLLECTIONS MUTATIONS */
    addCollection: {
      type: CollectionType,
      args: {
        input: {
          type: new GraphQLNonNull(CollectionInputType),
        },
      },
      resolve: async (_, { name }, { req, res }) => {
        // verify if the user is authenticated
        if (!req.user || req.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        // Create a new collection based on the input
        const newCollection = await Collection.create({
          name,
          courses: [], // Initialize the courses array with an empty array
        });
        return newCollection; // Return the newly created collection
      },
    },
    addToCollection: {
      type: CollectionType,
      args: {
        collectionId: { type: new GraphQLNonNull(GraphQLString) },
        courseId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { collectionId, courseId }, { req, res }) => {
        // verify if the user is authenticated
        if (!req.user || req.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        // Find the collection by ID and if it exists
        const collection = await Collection.findById(collectionId);

        if (!collection) {
          throw new Error(`Collection with ID ${collectionId} not found`);
        }

        // Find the course by ID and if it exists
        const course = await Course.findById(courseId);

        if (!course) {
          throw new Error(`Course with ID ${courseId} not found`);
        }

        const updatedCollection = await Collection.findByIdAndUpdate(
          collectionId,
          { $push: { courses: courseId } }, // add courseId to courses array
          { new: true } // Return the updated document
        );

        return updatedCollection; // Return the updated collection
      },
    },
    removeFromCollection: {
      type: CollectionType,
      args: {
        collectionId: { type: new GraphQLNonNull(GraphQLString) },
        courseId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { collectionId, courseId }, { req, res }) => {
        // verify if the user is authenticated
        if (!req.user || req.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        // Find the collection by ID and if it exists
        const collection = await Collection.findById(collectionId);

        if (!collection) {
          throw new Error(`Collection with ID ${collectionId} not found`);
        }

        // Find the course by ID and if it exists
        const course = await Course.findById(courseId);

        if (!course) {
          throw new Error(`Course with ID ${courseId} not found`);
        }

        const updatedCollection = await Collection.findByIdAndUpdate(
          collectionId,
          { $pull: { courses: courseId } }, // remove courseId from the course array
          { new: true } // Return the updated document
        );

        return updatedCollection; // Return the updated collection
      },
    },
    deleteCollection: {
      type: CollectionType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { id }, { req, res }) => {
        // verify if the user is authenticated
        if (!req.user || req.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        // Find the collection by ID and if it exists
        const collection = await Collection.findById(id);

        if (!collection) {
          throw new Error(`Collection with ID ${id} not found`);
        }

        const deletedCollection = await Collection.findByIdAndDelete(id); // Find collection by id and delete the collection

        if (!deletedCollection) {
          throw new Error(`Collection with ID ${id} not found`);
        }
        return deletedCollection; // Return the deleted collection
      },
    },

    /* USERS MUTATIONS */
    register: {
      type: UserType,
      args: {
        input: { type: new GraphQLNonNull(UserRegisterInputType) },
      },
      resolve: async (_, { input }, { req, res }) => {
        // hash user password before saving it to the database
        const hashedPassword = await encryptPassword(input.password);

        // Create a new user based on the input
        const newUser = await User.create({
          name: input.name,
          email: input.email,
          password: hashedPassword.encryptedPassword,
          role: "user",
        });

        if (!newUser) {
          throw new Error("Error creating user");
        }

        const token = generateToken({
          _id: newUser._id as string,
          email: newUser.email,
          role: newUser.role,
        });

        // Set the token in an HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Set to true in production
          sameSite: "Strict",
          maxAge: 86400000,
        });

        return newUser; // Return the newly created user
      },
    },
    login: {
      type: UserType, // Return true if successfull
      args: {
        input: { type: new GraphQLNonNull(UserLoginInputType) },
      },
      resolve: async (_, { input }, { req, res }) => {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new Error("User not found");
        }
        const isValid = await decryptPassword(input.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }
        const token = generateToken({
          _id: user._id as string,
          email: user.email,
          role: user.role,
        });

        // Set the token in an HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Set to true in production
          sameSite: "Strict",
          maxAge: 86400000,
        });

        return user;
      },
    },
    logout: {
      type: GraphQLBoolean,
      resolve: async (_, __, { res }) => {
        // Clear the token cookie to log out the user
        res.clearCookie("token");
        return true;
      },
    },
  },
});
