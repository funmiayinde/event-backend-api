import config from 'config';
import mongoose from 'mongoose';
import * as Q from 'q';
import log from '../utils/logger';

export default () => {
  mongoose.Promise = Q.Promise;
  mongoose.connection.on('disconnected', function () {
    log.debug('Mongoose connection to mongodb shell disconnected');
  });
  const databaseUrl = config.get('database.mongodb.url') as string;
  return mongoose
    .connect(`${databaseUrl}`, {
      autoIndex: true,
      autoCreate: true,
      maxPoolSize: 2000,
      useFindAndModify: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      log.debug(`Database loaded -url -${databaseUrl}`);
    })
    .catch((err) => {
      log.error(`database-err:::${err}`);
      throw err;
    });
};
