const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

let sock = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

async function connectWhatsApp() {
  try {
    console.log('🚀 Starting WhatsApp connection...');
    
    const { state, saveCreds } = await useMultiFileAuthState('whatsapp-session');
    
    sock = makeWASocket({
      auth: state,
      printQRInTerminal: false, // We'll handle QR display manually
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        console.log('🎯 QR Code detected! Displaying...');
        qrcode.generate(qr, { small: true });
        console.log('📱 Scan this QR code with your WhatsApp!');
      }
      
      if (connection === 'open') {
        console.log('✅ WhatsApp connected successfully!');
        console.log('🎉 You can now send messages!');
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      }
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
        console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
        
        if (shouldReconnect && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          console.log(`🔄 Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
          
          setTimeout(async () => {
            try {
              await connectWhatsApp();
            } catch (error) {
              console.error('Reconnection failed:', error);
            }
          }, 3000); // Wait 3 seconds before reconnecting
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.log('❌ Max reconnection attempts reached. Please restart manually.');
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);
    
    console.log('📱 Waiting for QR code or connection...');
    
  } catch (error) {
    console.error('❌ Error in connectWhatsApp:', error);
    
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`🔄 Retry attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
      
      setTimeout(async () => {
        await connectWhatsApp();
      }, 5000);
    }
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down WhatsApp server...');
  if (sock) {
    sock.end();
  }
  process.exit(0);
});

// Start the connection
connectWhatsApp();
