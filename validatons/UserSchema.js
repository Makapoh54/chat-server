const usernameSchema = {
  username: {
    in: ['params'],
    isLength: {
      errorMessage: 'Username should be at least 2 characters',
      options: { min: 2 },
    },
  },
};

export { usernameSchema };
