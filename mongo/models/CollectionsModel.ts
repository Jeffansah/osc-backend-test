import mongoose, { Schema, Document, type ObjectId } from "mongoose";

export interface ICollectionDoc extends Document {
  name: string;
  courses: [ObjectId];
}

const CollectionSchema = new Schema<ICollectionDoc>(
  {
    name: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export const Collection =
  mongoose.models.Collection ||
  mongoose.model<ICollectionDoc>("Collection", CollectionSchema);
