import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validations | DS.Model', function (hooks) {
  setupTest(hooks);

  test('create model with defaults', function (assert) {
    const object = this.owner.lookup('service:store').createRecord('signup');

    assert.false(
      object.validations.attrs.acceptTerms.isValid,
      'isValid was expected to be FALSE',
    );

    object.acceptTerms = true;

    assert.true(
      object.validations.attrs.acceptTerms.isValid,
      'isValid was expected to be TRUE',
    );
  });

  test('create model overriding defaults', function (assert) {
    const object = this.owner
      .lookup('service:store')
      .createRecord('signup', { acceptTerms: true });

    assert.true(
      object.validations.attrs.acceptTerms.isValid,
      'isValid was expected to be TRUE',
    );

    object.acceptTerms = false;

    assert.false(
      object.validations.attrs.acceptTerms.isValid,
      'isValid was expected to be FALSE',
    );
  });
});
