/**
 * Callback to promise (for Web3)
 * @param {Function} fn
 * @param args
 * @returns {Promise<any>}
 */
export default function callbackToPromise(fn: Function, ...args) {
  return new Promise(function (resolve, reject) {
    args.push(function (error, result) {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    fn.apply(null, args);
  });
}
