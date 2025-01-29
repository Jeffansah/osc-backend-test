import mongoose, {
  Schema,
  Document,
  Model,
  models,
  type ObjectId,
} from "mongoose";

export interface ICollectionDoc extends Document {
  id: string;
  name: string;
  courses: [ObjectId];
}

const CollectionSchema = new Schema<ICollectionDoc>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export const Collection =
  models.Collection ||
  mongoose.model<ICollectionDoc>("Collection", CollectionSchema);
