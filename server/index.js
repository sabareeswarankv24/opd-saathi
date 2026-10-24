import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

// In-memory server state
let serverState = null;

app.get('/api/health', (req, res) => {
  res.json({ ok: true, version: '1.0.0' });
});

io.on('connection', (socket) => {
  // Send current state on join
  if (serverState) {
    socket.emit('state:sync', serverState);
  }

  // Patients or staff syncing state updates - open without password for hackathon prototype
  socket.on('state:update', (data) => {
    serverState = data.state;
    // Broadcast to all other devices in real time
    socket.broadcast.emit('state:sync', serverState);
  });

  socket.on('flag:urgent', (flag) => {
    io.emit('flag:new', flag);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`OPD Saathi Live Sync Server running on port ${PORT}`);
  console.log(`Accessible to any device on the local network (no password required)`);
});
