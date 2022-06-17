/* eslint-disable @typescript-eslint/no-explicit-any */
import AppProcessor from './app.processor';
import AppValidation from './app.validation';
import { Document, Model } from 'mongoose';

export interface AppModel<T extends Document> extends Model<any | Document>{
    softDelete: boolean;
    returnDuplicate: boolean;
    overrideExisting: boolean;
    slugify: string;
    uniques: string[];
    fillables: string[];
    hiddenFields: string[];
    excludedFields: string[];
    updateFillables: string[];

    getValidator(): AppValidation;

    getProcessor(model: AppModel<any | T>): AppProcessor;
}
