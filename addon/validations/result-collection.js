import { isNone, isPresent } from '@ember/utils';
import { isArray } from '@ember/array';
import { tracked } from '@glimmer/tracking';

/**
 * @module Validations
 * @class ResultCollection
 */
export default class ValidationsResultCollection {
  @tracked content = [];

  /**
   * The attribute that this.content belongs to
   *
   * @property attribute
   * @type {String}
   */
  @tracked attribute;

  static create(props) {
    return new ValidationsResultCollection(props);
  }

  constructor(props = {}) {
    Object.assign(this, {
      attribute: props.attribute,
      content: props.content ?? [].filter((item) => item),
    });
  }

  /**
   * ```javascript
   * // Examples
   * get(user, 'validations.isInvalid')
   * get(user, 'validations.attrs.username.isInvalid')
   * ```
   *
   * @property isInvalid
   * @default false
   * @readOnly
   * @type {Boolean}
   */
  get isInvalid() {
    return !this.isValid;
  }

  /**
   * ```javascript
   * // Examples
   * get(user, 'validations.isValid')
   * get(user, 'validations.attrs.username.isValid')
   * ```
   *
   * @property isValid
   * @default true
   * @readOnly
   * @type {Boolean}
   */
  get isValid() {
    return this.content.every((item) => item.isValid);
  }

  /**
   * A collection of all error messages on the object in question
   *
   * ```javascript
   * // Examples
   * get(user, 'validations.messages')
   * get(user, 'validations.attrs.username.messages')
   * ```
   *
   * @property messages
   * @readOnly
   * @type {Array}
   */
  get messages() {
    const messages = this.content
      .map((item) => item.messages)
      .flat(Infinity)
      .filter((item) => item);

    return [...new Set(messages)];
  }

  /**
   * An alias to the first message in the messages collection.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.message')
   * get(user, 'validations.attrs.username.message')
   * ```
   *
   * @property message
   * @readOnly
   * @type {String}
   */
  get message() {
    return this.messages[0];
  }

  /**
   * Will be `true` if there are warnings in the collection.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.hasWarnings')
   * get(user, 'validations.attrs.username.hasWarnings')
   * ```
   *
   * @property hasWarnings
   * @readOnly
   * @type {String}
   */
  get hasWarnings() {
    return isPresent(this.warningMessages);
  }

  /**
   * A collection of all warning messages on the object in question
   *
   * ```javascript
   * // Examples
   * get(user, 'validations.warningMessages')
   * get(user, 'validations.attrs.username.warningMessages')
   * ```
   *
   * @property warningMessages
   * @readOnly
   * @type {Array}
   */
  get warningMessages() {
    const messages = this.content
      .map((item) => item.warningMessages)
      .flat(Infinity)
      .filter((item) => item);

    return [...new Set(messages)];
  }

  /**
   * An alias to the first message in the warningMessages collection.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.warningMessage')
   * get(user, 'validations.attrs.username.warningMessage')
   * ```
   *
   * @property warningMessage
   * @readOnly
   * @type {String}
   */
  get warningMessage() {
    return this.warningMessages[0];
  }

  /**
   * A collection of all {{#crossLink "Error"}}Warnings{{/crossLink}} on the object in question.
   * Each warning object includes the warning message and it's associated attribute name.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.warnings')
   * get(user, 'validations.attrs.username.warnings')
   * ```
   *
   * @property warnings
   * @readOnly
   * @type {Array}
   */
  get warnings() {
    return this._computeErrorCollection(
      this.content.map((item) => item.warnings),
    );
  }

  /**
   * An alias to the first {{#crossLink "Warning"}}{{/crossLink}} in the warnings collection.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.warning')
   * get(user, 'validations.attrs.username.warning')
   * ```
   *
   * @property warning
   * @readOnly
   * @type {Error}
   */
  get warning() {
    return this.warnings[0];
  }

  /**
   * A collection of all {{#crossLink "Error"}}Errors{{/crossLink}} on the object in question.
   * Each error object includes the error message and it's associated attribute name.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.errors')
   * get(user, 'validations.attrs.username.errors')
   * ```
   *
   * @property errors
   * @readOnly
   * @type {Array}
   */
  get errors() {
    return this._computeErrorCollection(
      this.content.map((item) => item.errors),
    );
  }

  /**
   * An alias to the first {{#crossLink "Error"}}{{/crossLink}} in the errors collection.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.error')
   * get(user, 'validations.attrs.username.error')
   * ```
   *
   * @property error
   * @readOnly
   * @type {Error}
   */
  get error() {
    return this.errors[0];
  }

  /**
   * All built options of the validators associated with the results in this.content grouped by validator type
   *
   * ```javascript
   * // Given the following validators
   * {
   *   username: [
   *     validator('presence', true),
   *     validator('length', { max: 15 }),
   *     validator('format', { regex: /foo/ }),
   *     validator('format', { regex: /bar/ }),
   *   ]
   * }
   * ```
   *
   * ```js
   * get(user, 'validations.attrs.username.options')
   * ```
   *
   * The above will return the following
   * ```js
   * {
   *   'presence': { presence: true},
   *   'length': { max: 15 },
   *   'regex': [{ regex: /foo/ }, { regex: /bar/ }]
   * }
   * ```
   *
   * @property options
   * @readOnly
   * @type {Object}
   */
  get options() {
    return this.content.reduce((options, { _validator: v }) => {
      if (isNone(v) || isNone(v._type)) {
        return options;
      }

      let type = v._type;
      let vOpts = v.options.toObject();

      if (options[type]) {
        if (isArray(options[type])) {
          options[type].push(vOpts);
        } else {
          options[type] = [options[type], vOpts];
        }
      } else {
        options[type] = vOpts;
      }
      return options;
    }, {});
  }

  _computeErrorCollection(collection = []) {
    let attribute = this.attribute;
    let errors = collection.flat(Infinity).filter((error) => error);

    errors = [...new Set(errors)];

    errors.forEach((e) => {
      if (attribute && e.attribute !== attribute) {
        e.parentAttribute = attribute;
      }
    });

    return errors;
  }
}
