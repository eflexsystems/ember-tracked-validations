import { isArray } from '@ember/array';
import Model from '@ember-data/model';
import {
  macroCondition,
  dependencySatisfies,
  importSync,
} from '@embroider/macros';

let DS;
if (macroCondition(dependencySatisfies('ember-data', '*'))) {
  DS = importSync('ember-data').default;
}

export function isValidatable(value) {
  return value && value instanceof Model ? !value.isDeleted : true;
}

export function isDSManyArray(o) {
  return !!(
    DS &&
    o &&
    (o instanceof DS.PromiseManyArray || o instanceof DS.ManyArray)
  );
}

export function getValidatableValue(value) {
  if (!value) {
    return value;
  }

  if (value && isArray(value) && value && isDSManyArray(value)) {
    return value.filter((v) => isValidatable(v));
  }

  return isValidatable(value) ? value : undefined;
}
