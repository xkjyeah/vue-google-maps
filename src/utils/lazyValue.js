// This piece of code was orignally written by sindresorhus and can be seen here
// https://github.com/sindresorhus/lazy-value/blob/master/index.js

export default fn => {
  let called = false
  let ret

  return () => {
    if (!called) {
      called = true
      ret = fn()
    }

    return ret
  }
}
