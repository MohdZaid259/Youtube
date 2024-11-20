import { Subscription } from "../models/subscription.model";

const findOne = async(data) => {
  return await Subscription.findOne(data)
}

const create = async(data) => {
  return await Subscription.create(data)
}

const findById = async(id) => {
  return await Subscription.findById(id)
}

const findByIdAndUpdate = async(id,data) => {
  return await Subscription.findByIdAndUpdate(id,data)
}

const findByIdAndDelete = async(id) => {
  return await Subscription.findByIdAndDelete(id)
}

export default {findOne, create, findById, findByIdAndUpdate, findByIdAndDelete}