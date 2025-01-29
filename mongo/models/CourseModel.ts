import mongoose, { Schema, Document } from "mongoose";

export interface ICourseDoc extends Document {
  title: string;
  description: string;
  duration: string;
  outcome: string;
  authorId: string;
  collectionId?: string;
}

const CourseSchema = new Schema<ICourseDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    outcome: { type: String, required: true },
    authorId: { type: String, required: true },
    collectionId: { type: String },
  },
  { timestamps: true }
);

export const Course =
  mongoose.models.Course || mongoose.model<ICourseDoc>("Course", CourseSchema);
