import mongoose, { Schema, Document } from "mongoose";

export interface ICourseDoc extends Document {
  id: string;
  title: string;
  description: string;
  duration: string;
  outcome: string;
}

const CourseSchema = new Schema<ICourseDoc>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    outcome: { type: String, required: true },
  },
  { timestamps: true }
);

export const Course =
  mongoose.models.Course || mongoose.model<ICourseDoc>("Course", CourseSchema);
