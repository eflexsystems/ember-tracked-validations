import ResultCollection from './result-collection';

export default class WarningResultCollection extends ResultCollection {
  get isValid() {
    return true;
  }

  get messages() {
    return [];
  }

  get errors() {
    return [];
  }

  get warningMessages() {
    const messages = [
      this.content.map((item) => item.messages),
      this.content.map((item) => item.warningMessages),
    ]
      .flat(Infinity)
      .filter((item) => item);

    return [...new Set(messages)];
  }

  get warnings() {
    return this._computeErrorCollection(
      [
        this.content.map((item) => item.errors),
        this.content.map((item) => item.warnings),
      ].flat(Infinity),
    );
  }
}
