const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { WebSocketServer } = require("ws");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Table subscription channels
const CHANNELS = {
  PATIENTS: "patients",
  STAFF: "staff",
  APPOINTMENTS: "appointments",
  MEDICAL_RECORDS: "medical_records",
};

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize WebSocket server
  const wss = new WebSocketServer({
    server,
    path: "/ws", // Add this line to specify a dedicated path
  });

  // Store clients and their subscriptions
  const clients = new Map();

  wss.on("connection", (ws) => {
    // Generate a unique client ID
    const clientId = Date.now().toString();
    const subscriptions = new Set();
    clients.set(ws, { id: clientId, subscriptions });

    console.log(`Client connected: ${clientId}`);

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);

        console.log("recieved...");

        // Handle subscription requests
        if (data.type === "subscribe") {
          console.log("recieved...............");
          if (Object.values(CHANNELS).includes(data.channel)) {
            subscriptions.add(data.channel);
            console.log(`Client ${clientId} subscribed to ${data.channel}`);

            // Confirm subscription
            ws.send(
              JSON.stringify({
                type: "subscribed",
                channel: data.channel,
                message: `Successfully subscribed to ${data.channel}`,
              })
            );
          }
        }

        // Handle unsubscribe requests
        else if (data.type === "unsubscribe") {
          if (subscriptions.has(data.channel)) {
            subscriptions.delete(data.channel);
            console.log(`Client ${clientId} unsubscribed from ${data.channel}`);

            ws.send(
              JSON.stringify({
                type: "unsubscribed",
                channel: data.channel,
                message: `Successfully unsubscribed from ${data.channel}`,
              })
            );
          }
        }
      } catch (error) {
        console.error("Invalid message format:", error);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`Client disconnected: ${clientId}`);
    });

    // Send welcome message
    ws.send(
      JSON.stringify({
        type: "info",
        message: `Connected to WebSocket server with ID: ${clientId}`,
      })
    );
  });

  // Function to broadcast updates to subscribed clients
  const broadcastUpdate = (channel, data) => {
    clients.forEach((client, ws) => {
      if (client.subscriptions.has(channel) && ws.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({
            type: "update",
            channel,
            data,
          })
        );
      }
    });
  };

  // Expose the broadcast function to be used by API routes
  global.broadcastUpdate = broadcastUpdate;

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
