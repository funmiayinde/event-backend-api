/* eslint-disable @typescript-eslint/no-explicit-any */
import * as util from 'util';
import { Schema } from 'mongoose';
import AppProcessor from './app.processor';
import { AppModel } from './app.model';
import AppValidation from './app.validation';

class AppSchema extends Schema {
    statics: any;

    constructor(...args: any) {
        super();
        Schema.apply(this, args);
        this.statics.softDelete = true;
        this.statics.uniques = [];
        this.statics.returnDuplicate = false;
        this.statics.hiddenFields = [];
        this.statics.fillables = [];
        this.statics.excludedFields = [];
        this.statics.updateFillables = [];

        /***
         * @param {Model | Any} model The model
         * @return {Object} The process class instance object
         */
        this.statics.getProcessor = (model: any | AppModel<any>): any | AppProcessor => {
            return new AppProcessor(model);
        };

        /**
         * @return {AppValidation} This validator object with the specified rules
         */
        this.statics.getValidator = (): AppValidation => {
           return new AppValidation();
        };
    }
}
util.inherits(AppSchema, Schema);

export default AppSchema;
