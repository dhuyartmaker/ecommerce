const promisify = async (fn) =>
    new Promise((resolve) => fn.then(res => resolve(res)))

module.exports = {
    promisify
}