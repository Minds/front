/**
 * @author Ben Hayward
 * @create date 2019-08-10 00:38:46
 * @modify date 2019-08-10 00:38:46
 * @desc Space to put utilities and helper functions without cluttering up commands.js
 */

/**
 * @returns a random 21 character string
 */
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15)
    + Math.random().toString(36).substring(2, 15);  
}
export default generateRandomId;
