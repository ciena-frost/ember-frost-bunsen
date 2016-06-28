import int64 from './int64'

export default function (min, max, reserved = []) {
  return function (value) {
    if (!int64(value)) {
      return false
    }

    const int = parseInt(value, 10)

    return (
      `${int}` === `${value}` &&
      int >= min &&
      int <= max &&
      (reserved).indexOf(int) === -1
    )
  }
}
