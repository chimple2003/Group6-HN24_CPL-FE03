export const loadingDelay = async (delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, delay);
    });
  };
  