import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { CourseInputType, CourseType } from "../types/types-ql";
import { Course } from "../../mongo/models/CourseModel";

export const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCourse: {
      type: CourseType,
      args: {
        input: { type: new GraphQLNonNull(CourseInputType) },
      },
      resolve: async (_, { input }) => {
        // Create a new course based on the input
        const newCourse = await Course.create({
          title: input.title,
          description: input.description,
          duration: input.duration,
          outcome: input.outcome,
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
      resolve: async (_, { id, input }) => {
        // Find the course by ID and if it exists
        const course = await Course.findById(id);

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
      resolve: async (_, { id }) => {
        // Find the course by ID and if it exists
        const deletedCourse = await Course.findByIdAndDelete(id);

        // If not, throw an error
        if (!deletedCourse) {
          throw new Error(`Course with ID ${id} not found`);
        }
        return deletedCourse; // Return the deleted course
      },
    },
  },
});
