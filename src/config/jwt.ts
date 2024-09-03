export default {
    secretOrPrivateKey: process.env.JWT_ACCESS_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
    },
  };