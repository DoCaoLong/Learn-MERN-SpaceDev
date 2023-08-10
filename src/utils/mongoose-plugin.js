import mongoose from "mongoose";
import { DEFAULT_LIMIT } from "../config/database";
import _ from "lodash";

mongoose.Model.paginate = async function (query) {
  let { page = 1, fields, sort, search, include } = query;
  page = parseInt(page);
  let [sortBy, sortValue] = sort?.split(".") || ["_id", "desc"];

  let _query = _.omit(query, "page", "fields", "sort", "search", "include");

  if (search) {
    _query.$text = {
      $search: search,
    };
  }

  let total = await this.count(_query);

  let totalPage = Math.ceil(total / DEFAULT_LIMIT);

  let result = await this.find(_query)

    .populate(include?.replace(",", " "))
    .limit(DEFAULT_LIMIT)
    .skip((page - 1) * DEFAULT_LIMIT)
    .sort({
      [sortBy]: sortValue === "asc" ? 1 : -1,
    })
    .select(fields?.replace(",", " "));

  let response = {
    data: result,
    totalPage,
    currentPage: page,
    total,
  };

  if (page < totalPage) {
    response.nextPage = page + 1;
  }

  if (page > 1) {
    response.prevPage = page - 1;
  }

  return response;
};
