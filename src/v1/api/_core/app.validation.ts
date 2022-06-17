import Validator from 'validatorjs';
import { ValidationOption } from '../../../v1/types/validation-option';

/**
 * The App Validation class
 * */
class AppValidation {
    /**
     * @param {Object} obj The object to validate
     * @return {Object} ValidatorD
     * */
    create(obj: never | object): ValidationOption {
        const rules: Validator.Rules = {};
        const validator = new Validator(obj, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes(),
        };
    }

    /**
     * @param {Object} obj The object
     * @return {Object} ValidatorD
     * */
    update(obj: never): ValidationOption {
        const rules: Validator.Rules = {};
        const validator = new Validator(obj, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes(),
        };
    }
}

export default AppValidation;
