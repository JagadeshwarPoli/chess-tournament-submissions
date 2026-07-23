export const randomId = () => Math.random().toString(36).slice(2, 11);

export const randomNumber = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
