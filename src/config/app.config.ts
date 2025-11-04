export const EnvConfiguration = () => ({
  mongodb: process.env.MONGODB_URI || 'mongodb://localhost:27017/nest-pokemon',
  port: process.env.PORT || 3000,
});
