/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationOption } from '../../types/validation-option';
import Validator from 'validatorjs';
import AppValidation from '../_core/app.validation';

/**
 * The EventValidation  class
 * */
export default class EventValidation extends AppValidation {
  /**
   * @param {Object} obj The object to validate
   * @return {Object} ValidatorD
   * */
  create(obj: any | object): ValidationOption {
    const rules: Validator.Rules = {
      title: 'required|string',
      description: 'required|string',
      address: 'required|string',
      category: 'required|string',
      date: 'required',
    };
    const validator = new Validator(obj, rules);
    return {
      errors: validator.errors.all(),
      passed: validator.passes(),
    };
  }

  /**
   * @param {Object} obj The object to validate
   * @return {Object} ValidatorD
   * */
  update(obj: any | object): ValidationOption {
    const rules: Validator.Rules = {};
    const validator = new Validator(obj, rules);
    return {
      errors: validator.errors.all(),
      passed: validator.passes(),
    };
  }
}
