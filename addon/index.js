import Factory from './decorators/factory';
import Validator from './validations/validator';

/**
 * ## Installation
 * ```shell
 * ember install ember-cp-validations
 * ```
 *
 * ## Changelog
 * Changelog can be found [here](https://github.com/offirgolan/ember-cp-validations/blob/master/CHANGELOG.md)
 *
 * ## Live Demo
 * A live demo can be found [here](http://offirgolan.github.io/ember-cp-validations/)
 *
 * ## Looking for help?
 * If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-cp-validations/issues).
 *
 * @module Usage
 */

/**
 * ## Models
 *
 * The first thing we need to do is build our validation rules. This will then generate a Mixin that you will be able to incorporate into your model or object.
 *
 * ```javascript
 * // models/user.js
 *
 * import Ember from 'ember';
 * import DS from 'ember-data';
 * import { validator, buildValidations } from '@eflexsystems/ember-tracked-validations';
 *
 * const Validations = buildValidations({
 *   username: validator('presence', true),
 *   password: [
 *     validator('presence', true),
 *     validator('length', {
 *       min: 4,
 *       max: 8
 *     })
 *   ],
 *   email: [
 *     validator('presence', true),
 *     validator('format', { type: 'email' })
 *   ],
 *   emailConfirmation: [
 *     validator('presence', true),
 *     validator('confirmation', {
 *       on: 'email',
 *       message: '{description} do not match',
 *       description: 'Email addresses'
 *     })
 *   ]
 * });
 * ```
 *
 * Once our rules are created and our Mixin is generated, all we have to do is add it to our model.
 *
 * ```javascript
 * // models/user.js
 *
 * export default DS.Model.extend(Validations, {
 *   'username': attr('string'),
 *   'password': attr('string'),
 *   'email': attr('string')
 * });
 * ```
 *
 * ## Objects
 *
 * You can also use the generated `Validations` mixin on any `Ember.Object` or child
 * of `Ember.Object`, like `Ember.Component`. For example:
 *
 * ```javascript
 * // components/x-foo.js
 *
 * import Ember from 'ember';
 * import { validator, buildValidations } from '@eflexsystems/ember-tracked-validations';
 *
 * const Validations = buildValidations({
 *   bar: validator('presence', true)
 * });
 *
 * export default Ember.Component.extend(Validations, {
 *   bar: null
 * });
 * ```
 *
 * ```javascript
 * // models/user.js
 *
 * export default Ember.Object.extend(Validations, {
 *   username: null
 * });
 * ```
 *
 * @module Usage
 * @submodule Basic
 */

/**
 * ### Default Options
 *
 * Default options can be specified over a set of validations for a given attribute. Local properties will always take precedence.
 *
 * Instead of doing the following:
 *
 * ```javascript
 * const Validations = buildValidations({
 *   username: [
 *     validator('presence', {
 *       presence: true,
 *       description: 'Username'
 *     }),
 *     validator('length', {
 *       min: 1,
 *       description: 'Username'
 *     }),
 *     validator('my-custom-validator', {
 *       description: 'A username'
 *     })
 *   ]
 * });
 * ```
 *
 * We can declare default options:
 *
 * ```javascript
 * const Validations = buildValidations({
 *   username: {
 *     description: 'Username'
 *     validators: [
 *       validator('presence', true),
 *       validator('length', {
 *         min: 1
 *       }),
 *       validator('my-custom-validator', {
 *         description: 'A username'
 *       })
 *     ]
 *   },
 * });
 * ```
 *
 * In the above example, all the validators for username will have a description of `Username` except that of the `my-custom-validator` validator which will be `A username`.
 *
 * ### Global Options
 *
 * If you have  specific options you want to propagate through all your validation rules, you can do so by passing in a global options object.
 *
 * ```javascript
 * const Validations = buildValidations(validationRules, globalOptions);
 * ```
 *
 * ```javascript
 * import Ember from 'ember';
 * import { validator, buildValidations } from '@eflexsystems/ember-tracked-validations';
 *
 * const Validations = buildValidations({
 *   firstName: {
 *     description: 'First Name'
 *     validators: [
 *       validator('presence', {
 *         presence: true,
 *       })
 *      ]
 *    },
 *   lastName: validator('presence', true)
 * }, {
 *   description: 'This field'
 *   disabled: computed.readOnly('model.disableValidations')
 * });
 * ```
 *
 * Just like in the default options, locale validator options will always take precedence over default options and default options will always take precedence
 * over global options. This allows you to declare global rules while having the ability to override them in lower levels.
 *
 * ### Computed Options
 *
 * All options can also be Computed Properties. These CPs have access to the `model` and `attribute` that is associated with the validator.
 *
 * Please note that the `message` option of a validator can also be a function with [the following signature](http://offirgolan.github.io/ember-cp-validations/docs/modules/Validators.html#message).
 *
 * ```javascript
 * const Validations = buildValidations({
 *   username: validator('length', {
 *     disabled: Ember.computed.not('model.meta.username.isEnabled'),
 *     min: Ember.computed.readOnly('model.meta.username.minLength'),
 *     max: Ember.computed.readOnly('model.meta.username.maxLength'),
 *     description: Ember.computed(function() {
 *       // CPs have access to the `model` and `attribute`
 *       return this.get('model').generateDescription(this.get('attribute'));
 *     })
 *   })
 * });
 * ```
 *
 * @module Usage
 * @submodule Advanced
 */

/**
 * ### [__Ember-Intl__](https://github.com/ember-intl/cp-validations)
 *
 *  ```bash
 *  ember install @ember-intl/cp-validations
 *  ```
 *
 * ### [__Ember-I18n__](https://github.com/jasonmit/ember-i18n-cp-validations)
 *
 * ```bash
 *  ember install ember-i18n-cp-validations
 * ```
 *
 * @module Usage
 * @submodule I18n Solutions
 */

export const buildValidations = Factory;
export const validator = Validator;

export default {
  buildValidations,
  validator,
};
