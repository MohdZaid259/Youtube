import { Subscription } from "../models/subscription.model.js";

const findOne = async(data) => {
  return await Subscription.findOne(data)
}

const find = async(data) => {
  return await Subscription.find(data)
}

const createDocuments = async(data) => {
  return await Subscription.createDocuments(data)
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

export default {findOne, find, createDocuments, create, findById, findByIdAndUpdate, findByIdAndDelete}