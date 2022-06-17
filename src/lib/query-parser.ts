/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import _ from 'lodash';


/**
 * The QueryParser class
 */
class QueryParser {
    private _query: any;
    private _all: any;
    private _sort: any;
    private _population: any;
    private _selection: any;
    private _where: any;
    private _search: any;
    private _filters: any;
    private _group: any;

    /***
     * @constructor
     * @param {Object} query This is a query object of the request
     */
    constructor(query: any) {
        this._query = { ...query };
        this.initialize(query);
        const excluded: string[] = [
            'per_page',
            'page',
            'limit',
            'sort',
            'all',
            'population',
            'filters',
            'includes',
            'group',
            'selection',
            'search',
            'nested',
            'regex',
        ];
        // omit special query string keys from query before passing down to the model for filtering
        this._query = _.omit(this._query, ...excluded);
        _.extend(this._query, { deleted: false });
        Object.assign(this, this._query);
    }

    /***
     * Initialize all the special object required for the find query
     * @param {Object} query This is a query object of the request
     */
    private initialize(query: any) {
        this._all = query.all;
        this._sort = query.sort;
        if (query.population) {
            this.population = query.population;
        }
        if (query.selection) {
            try {
                this._selection = _.isString(query.selection) ? JSON.parse(query.selection) : query.selection;
                // this._selection =  query.selection;
            } catch (e) {
                throw e;
            }
        }
        if (query.search) {
            this._search = query.search;
        }
        if (query.group) {
            this._group = query.group;
        }
        if (query.filters) {
            try {
                this._filters = JSON.stringify(query.filters);
            } catch (e) {
                console.log('filter-error:', e.getMessages());
            }
        }
    }



    /**
     * @return {Object} get the parsed query
     */
    get query() {
        return this._query;
    }

    /**
     * @return {Object} get the parsed query
     */
    get search() {
        return this._search;
    }
    /**
     * @return {Object} get the parsed query
     */
    get filters() {
        return this._filters;
    }
    /**
     * @return {Boolean} get the value for all data request
     */
    get getAll() {
        return this._all;
    }
    /**
     * @return {Object} get the parsed query
     */
    get selection() {
        if (this._selection) {
            return this._selection;
        }
        return [];
    }

    /**
    * @return {Object} get the population object for query
    * */
    get population() {
        if (this._population) {
            return this._population;
        }
        return [];
    }

    /**
     * @param {Object} value is the population for object
     * */
    set population(value) {
        this._population = value;
        if (!_.isObject(value)) {
            try {
                this._population = JSON.parse(value.toString());
            } catch (e) {
                // console.log('population-error:', e);
            }
        }
    }

    /**
     * @param {Object} value is the selection object
     */
    set selection(value) {
        this._selection = value;
    }

    /**
     * @param {Object} value is the selection object
     */
    set query(value) {
        this._query = value;
    }


    /**
     * when String i.e ?sort=name it is sorted by name ascending order
     * when Object ?sort[name]=desc { name: 'desc'} it is sorted by name descending order
     * when Object ?sort[name]=desc,sort[age]=asc {name: 'desc', age: 'asc'} it is sorted by name desc and age asc order
     */
     get sort() {
        if (this._sort) {
            if (!_.isObject(this._sort)) {
                try {
                    this._sort = JSON.parse(this._sort);
                } catch (e) {
                    return { [this._sort]: 1 };
                }
            }

            for (const [column, direction] of Object.entries(this._sort)) {
                if (_.isString(direction)) this._sort[column] = direction.toLowerCase() === 'asc' ? 1 : -1;
            }

            return this._sort;
        }
        return { createdAt: -1 };
    }

}

export default QueryParser;
