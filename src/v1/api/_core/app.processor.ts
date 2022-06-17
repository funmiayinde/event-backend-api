/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { AppModel } from './app.model';
import { Document } from 'mongoose';
import { Request } from 'express';
import QueryParser from '../../../lib/query-parser';
import ResponseOption from '../../../v1/types/response-option';
import AppResponse from '../../../lib/app-response';
import Pagination from '../../../lib/pagination';
import { POST, PUT, PATCH } from '../../../utils/codes';

/***
 * The app processor class
 */
export default class AppProcessor {
  protected model: AppModel<any | Document>;

  /**
   * @param {AppModel} model The default model object
   * for the processor
   */
  constructor(model: AppModel<any | Document>) {
    this.model = model;
  }

  /***
   * @param {Object} id required for response
   * @param {QueryParser} queryParser required for response
   * @param {AppModel | Any} model The model object
   * @return {Object}
   */
  async findObject(id: any | string, queryParser: QueryParser): Promise<any> {
    let query = this.model.findOne({ _id: id, ...queryParser.query });
    if (queryParser && queryParser.selection) {
      query = query.select(queryParser.selection);
    }
    return await query.exec();
  }

  /***
   * @param {String} token
   * @param {AppModel} model
   * @param {Number} code
   * @param {QueryParser} queryParser
   * @param {Pagination} pagination
   * @param {Number} count
   * @param {Object} token
   * @param {Object} value
   * @return {Promise<Object>}
   */
  async getResponseObject({
    message,
    model,
    code,
    queryParser,
    pagination,
    count,
    value,
    token,
  }: ResponseOption): Promise<any> {
    const meta = AppResponse.getSuccessMeta();
    if (token) {
      meta.token = token;
    }
    _.extend(meta, { statusCode: code });
    if (message) {
      meta.message = message;
    }
    if (pagination && !queryParser.getAll) {
      pagination.totalCount = count;
      if (pagination.morePages(count)) {
        pagination.next = pagination.current + 1;
      }
      meta.pagination = pagination.done();
    }
    if (value) {
      if (_.isArray(value)) {
        value = value.map((v) => ({
          ..._.omit(v.toJSON ? v.toJSON() : v, ...model.hiddenFields),
        }));
      } else {
        try {
          value = { ..._.omit(value.toJSON ? value.toJSON() : value, ...model.hiddenFields) };
        } catch (e) {
          console.log(e);
        }
      }
    }
    return AppResponse.format(meta, value);
  }

  /**
   * @param {AppModel} model The pagination for the object
   * @param {Pagination | Any} pagination The pagination for the object
   * @param {QueryParser | Any} queryParser The queryParser for the object
   * @return {Object}
   */
  async buildModelQueryObject(pagination: Pagination, queryParser: QueryParser): Promise<any> {
    let query = this.model.find(queryParser.query);

    query = query.sort(
      queryParser.sort ? Object.assign({}, { createdAt: -1, ...queryParser.sort }) : { createdAt: -1 },
    );
    if (!queryParser.getAll) {
      query = query.skip(pagination.skip).limit(pagination.perPage);
    }
    return {
      value: await query.select(queryParser.selection).exec(),
      count: await this.model.countDocuments(queryParser.query).exec(),
    };
  }

  /***
   * @param {Object} req The request object
   * @return {Promise<Object>}
   */
  async prepareBodyObject(req: any | Request): Promise<any> {
    let obj = Object.assign({}, req.params, req.query, req.body);
    if (req.authId) {
      obj = Object.assign(
        {},
        {
          auth: req.auth,
          user: req.authId,
          createdBy: req.authId,
          updatedBy: req.authId,
        },
        req.body,
      );
    }
    _.omit(obj, this.model.excludedFields && this.model.excludedFields.length ? this.model.excludedFields : []);
    if (req.method === POST) {
      if (this.model.fillables && this.model.fillables.length) {
        obj = _.pick(obj, ...this.model.fillables);
      }
    } else if (req.method === PUT || req.method === PATCH) {
      if (this.model.updateFillables && this.model.updateFillables.length) {
        obj = _.pick(obj, ...this.model.updateFillables);
      }
    }
    return obj;
  }


  /**
   * @param {Object} query The query object
   * @return {Promise<Object>}
   */
  async countQueryDocument(query: any): Promise<any> {
    let count: any = await this.model.aggregate(query.concat([{ $count: 'total' }]));
    count = count[0] ? count[0].total : 0;
    return count;
  }

  /***
   * @param {Object} obj The request object
   * @return {Promise<Object>}
   */
  async getExitingResource(obj: any): Promise<any> {
    if (this.model.uniques.length > 0) {
      const uniqueKeys = this.model.uniques;
      const query: any = { $and: [], deleted: false };
      for (const key of uniqueKeys) {
        query['$and'].push({ [key]: _.get(obj, key) });
      }
      return await this.model.findOne({ ...query });
    }
    return null;
  }
}
