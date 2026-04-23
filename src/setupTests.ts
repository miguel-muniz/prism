// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

const originalAttachInternals = HTMLElement.prototype.attachInternals

Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
  configurable: true,
  value() {
    const internals = originalAttachInternals?.call(this) ?? {}
    const states =
      internals.states ??
      ({
        add() {},
        clear() {},
        delete() {},
        entries() {
          return [][Symbol.iterator]()
        },
        forEach() {},
        has() {
          return false
        },
        keys() {
          return [][Symbol.iterator]()
        },
        size: 0,
        values() {
          return [][Symbol.iterator]()
        },
        [Symbol.iterator]() {
          return [][Symbol.iterator]()
        }
      } as unknown as CustomStateSet)
    const validity =
      internals.validity ??
      ({
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valid: true,
        valueMissing: false
      } as ValidityState)

    return {
      ...internals,
      states,
      validity,
      validationMessage: internals.validationMessage ?? '',
      willValidate: internals.willValidate ?? true,
      checkValidity: internals.checkValidity ?? (() => true),
      reportValidity: internals.reportValidity ?? (() => true),
      setFormValue: internals.setFormValue ?? (() => {}),
      setValidity: internals.setValidity ?? (() => {})
    }
  }
})
