/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction, Request } from 'express';;
import { AppModel } from './app.model';
import { Document } from 'mongoose';
import AppProcessor from './app.processor';
import lang from '../../../v1/lang';
import QueryParser from '../../../lib/query-parser';
import AppError from '../../../lib/app-error';
import { StatusCodes } from 'http-status-codes';
import { ValidationOption } from '../../../v1/types/validation-option';
import Pagination from '../../../lib/pagination';


/**
 * @class AppController
 */
export abstract class AppController {
    protected model: AppModel<any | Document>;
    protected lang: any;

    /**
      * @param {Model | Any} model The default model object
      * for the controller. Will be required to create
      * an instance of the controller
    * */
    constructor(model: AppModel<any | Document>) {
        if (model) {
            this.model = model;
            this.lang = lang.get(model.collection.collectionName.toLowerCase());
            this.create = this.create.bind(this);
            this.id = this.id.bind(this);
            this.findOne = this.findOne.bind(this);
            this.find = this.find.bind(this);
        }
    }

    /**
    * @param {Any| Request} req The request object
    * @param {Any | Response} res The response object
    * @param {NextFunction} next The callback to the next program handler
    * @param {String} id The id from the url parameter
    * @return {Object} res The response object
    */
    async id(req: any | Request, res: any | Response, next: NextFunction, id: string): Promise<any> {
        try {
            const queryParser: QueryParser = new QueryParser(Object.assign({}, req.query));
            const object = await this.model.getProcessor(this.model).findObject(id, queryParser);
            if (object) {
                req.object = object;
                return next();
            }
            const appError = new AppError(this.lang.not_found, StatusCodes.NOT_FOUND);
            return next(appError);
        } catch (e) {
            return next(e);
        }
    }

    /**
   * @param {Any| Request} req The request object
   * @param {Any | Response} res The response object
   * @param {NextFunction} next The callback to the next program handler
   * @return {Object} res The response object
   */
    async findOne(req: any | Request, res: any | Response, next: NextFunction): Promise<any> {
        try {
            const queryParser: QueryParser = new QueryParser(Object.assign({}, req.query));
            const response = await this.model.getProcessor(this.model).getResponseObject({
                model: this.model,
                code: StatusCodes.OK,
                value: req.object,
                queryParser,
            });
            return res.status(StatusCodes.OK).json(response);
        } catch (e) {
            return next(e);
        }
    }

    /**
   * @param {Any| Request} req The request object
   * @param {Any | Response} res The response object
   * @param {NextFunction} next The callback to the next program handler
   * @return {Object} res The response object
   */
    async create(req: any | Request, res: any | Response, next: NextFunction): Promise<any> {
        try {
            const queryParser: QueryParser = new QueryParser(Object.assign({}, req.query));
            const processor: AppProcessor = this.model.getProcessor(this.model);
            const obj = await processor.prepareBodyObject(req);
            const validate: ValidationOption = this.model.getValidator().create(obj);
            if (!validate.passed) {
                return next(new AppError(lang.get('error').inputs, StatusCodes.BAD_REQUEST, validate.errors));
            }
            let object = await processor.getExitingResource(obj);
            if (object) {
                if (object && this.model.returnDuplicate) {
                    const response = await processor.getResponseObject({
                        model: this.model,
                        code: StatusCodes.CREATED,
                        message: this.lang.created,
                        value: object,
                        queryParser,
                    });
                    return res.status(StatusCodes.CREATED).json(response);
                }
                const messageObj = this.model.uniques.map((m: any) => ({
                    [m]: `${m.replace('_', ' ')} must be unique`
                }));
                return next(new AppError(lang.get('error').resource_already_exist, StatusCodes.CONFLICT, messageObj));
            }
            object = new this.model(obj);
            object = await object.save();
            const response = await processor.getResponseObject({
                model: this.model,
                code: StatusCodes.OK,
                message: this.lang.created,
                value: object,
                queryParser,
            });
            return res.status(StatusCodes.CREATED).json(response);
        } catch (e) {
            return next(e);
        }
    }

    /**
     * @param {Any| Request} req The request object
     * @param {Any | Response} res The response object
     * @param {NextFunction} next The callback to the next program handler
     * @return {Object} res The response object
    */
    async find(req: any | Request, res: any | Response, next: NextFunction): Promise<any> {
        const queryParser: QueryParser = new QueryParser(Object.assign({}, req.query));
        const pagination: Pagination = new Pagination(req.originalUrl);
        const processor: AppProcessor = this.model.getProcessor(this.model);
        try {
            const { value, count } = await processor.buildModelQueryObject(pagination, queryParser);
            const response = await processor.getResponseObject({
                model: this.model,
                code: StatusCodes.OK,
                value,
                queryParser,
                pagination,
                count,
            });
            return res.status(StatusCodes.OK).json(response);
        } catch (e) {
            return next(e);
        }
    }

}
export default AppController;
