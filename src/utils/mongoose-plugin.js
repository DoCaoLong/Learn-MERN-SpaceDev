import mongoose from "mongoose";
import _ from "lodash";
import { initSoftDeletePlugin } from "./mongoose-soft-delete";
import { paginate } from "./mongoose-paginate";

mongoose.plugin(initSoftDeletePlugin);

mongoose.Model.paginate = paginate;
