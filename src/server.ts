import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import { Server } from 'http';

let server: Server;

async function mahsezServer() {
  try {
    await mongoose.connect(config.databaseUrl as string);

    server = app.listen(config.port, () => {
      console.log(`Mahsez Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

mahsezServer();
