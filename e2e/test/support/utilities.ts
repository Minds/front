/**
 * @returns a random 21 character string
 */
const generateRandomId = () => {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
};
export default generateRandomId;
