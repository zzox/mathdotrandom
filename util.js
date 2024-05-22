export const checkNumber = (value, max) => {
  if (isNaN(Number(value)) || !value) {
    return 1
  }

  const int = parseInt(value > max ? max : value)
  if (int < 1) {
    return 1
  }

  return int
}

export const checkNumberWithZero = (value, max) => {
  if (isNaN(Number(value)) || !value) {
    return 0
  }

  const int = parseInt(value > max ? max : value)
  if (int < 0) {
    return 0
  }

  return int
}
