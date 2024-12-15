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
    let onlineUsers = {} as string[];

    io = new SocketIOServer(server, {
      cors: {
        origin: ['https://mahsez.vercel.app', 'http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // যখন বায়ার তার তথ্য পাঠায়
      socket.on('userOnline', async (id) => {
        socket.userId = id;
        console.log(`User ${id} is online`);
        await User.findOneAndUpdate({ id: id }, { isOnline: true });
      });
      // io.emit('statusUpdated', Object.keys(onlineUsers)); // অ্যাডমিনকে আপডেট পাঠানো
      // onlineUsers[id] = socket.id; // buyerId এবং socket.id সংরক্ষণ করা
      // console.log(onlineUsers, 'online users');

      // ইউজার অফলাইন হলে (স্বেচ্ছায়)
      socket.on('userOffline', async (userId) => {
        console.log(`User ${userId} is offline`);
        await User.findOneAndUpdate({ id: userId }, { isOnline: false });
        // io.emit('statusUpdated', { userId, isOnline: false });
      });

      socket.on('disconnect', async (id) => {
        console.log(`User disconnected: userid${id}`);
        if (socket.userId) {
          console.log(`User ${socket.userId} is offline`);
          await User.findOneAndUpdate(
            { id: socket.userId },
            { isOnline: false },
          );
        }
        // await User.findOneAndUpdate({ id: id }, { isOnline: true });
        // অনলাইন বায়ার লিস্ট থেকে বায়ার সরানো
        // for (const [buyerId, socketId] of Object.entries(onlineUsers)) {
        //   if (socketId === socket.id) {
        //     delete onlineUsers[buyerId];
        //     break;
        //   }
        // }
        // io.emit('updateOnlineBuyers', Object.keys(onlineUsers)); // অ্যাডমিনকে আপডেট পাঠানো
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
