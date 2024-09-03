export default {
    secretOrPrivateKey: process.env.JWT_REFRESH_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
    },
  };