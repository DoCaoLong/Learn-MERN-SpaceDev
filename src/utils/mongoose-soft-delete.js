import { Schema } from "mongoose";

function overrideFindMethod() {
  this._conditions.deletedAt = { $not: { $type: "date" } };
}

// gắn field deletedAt vào tất cả các schema
export const initSoftDeletePlugin = (schema, options) => {
  schema.add({
    deletedAt: {
      type: Schema.Types.Date,
      default: null,
    },
  });

  schema.pre("find", overrideFindMethod);
  schema.pre("findOne", overrideFindMethod);
  schema.pre("countDocuments", overrideFindMethod);
  // ước lượng count document khi có hàng triệu tỷ dòng
  schema.pre("estimatedDocumentCount", overrideFindMethod);
};
