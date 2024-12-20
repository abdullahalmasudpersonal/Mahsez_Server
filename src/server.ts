import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { User } from './app/modules/User/user.model';

let server: Server;
let io: SocketIOServer;

async function mahsezServer() {
  try {
    await mongoose.connect(config.databaseUrl as string);

    server = new Server(app);

    io = new SocketIOServer(server, {
      cors: {
        origin: ['https://mahsez.vercel.app', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true,
      },
      pingTimeout: 60000,
      transports: ['websocket'],
    });

    io.on('connection', (socket) => {
      socket.on('userOnline', async (id) => {
        socket.userId = id;
        await User.findOneAndUpdate({ id: id }, { isOnline: true });
      });

      socket.on('userOffline', async (userId) => {
        await User.findOneAndUpdate({ id: userId }, { isOnline: false });
      });

      socket.on('disconnect', async (id) => {
        if (socket.userId) {
          await User.findOneAndUpdate(
            { id: socket.userId },
            { isOnline: false },
          );
        }
      });
    });

    server.listen(config.port, () => {
      console.log(`Mahsez Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.log('Error starting server:', error);
  }
}

mahsezServer();

// import app from './app';
// import mongoose from 'mongoose';
// import config from './app/config';
// import { Server } from 'http';

// let server: Server;

// async function mahsezServer() {
//   try {
//     await mongoose.connect(config.databaseUrl as string);

//     server = app.listen(config.port, () => {
//       console.log(`Mahsez Server listening on port ${config.port}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// mahsezServer();
