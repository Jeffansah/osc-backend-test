import { GraphQLNonNull, GraphQLObjectType } from "graphql";
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
        const newCourse = await Course.create({
          title: input.title,
          description: input.description,
          duration: input.duration,
          outcome: input.outcome,
        });
        return newCourse; // Return the newly created course
      },
    },
  },
});
