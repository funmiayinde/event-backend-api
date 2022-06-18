/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document } from 'mongoose';
import AppSchema from '../_core/app.schema';
import { AppModel } from '../_core';
import EventValidation from './event.validation';
import EventProcessor from './event.processor';

/**
 * EventSchema
 **/
const EventSchema = new AppSchema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      select: false,
      default: false,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    toObject: { getters: true, setters: true },
    toJSON: { virtuals: true, getters: true, setters: true },
  },
);

/**
 * @return {Object} The validator object with specified rules
 **/
EventSchema.statics.fillables = [
  'title',
  'description',
  'category',
  'date',
  'isVirtual',
  'address',
];

/**
 * @return {Object} The validator object with specified rules
 * */
EventSchema.statics.hiddenFields = ['deleted'];

/**
 * @param {Model} model required for response
 * @return {Object} The processor class instance object
 * */

EventSchema.statics.getProcessor = (model: any | AppModel<Event>) => {
  return new EventProcessor(model);
};

/**
 * @return {Object} The validator object with specified rules
 * */
EventSchema.statics.getValidator = (): EventValidation => {
  return new EventValidation();
};

export interface Event extends Document {
  title: string;
  description: string;
  category: string;
  date: Date;
  isVirtual: boolean;
  address: string;
  deleted?: boolean;
}

export type IEventModel = AppModel<Event>;

export const EventModel = mongoose.model<Event, IEventModel>(
  'event',
  EventSchema,
);
