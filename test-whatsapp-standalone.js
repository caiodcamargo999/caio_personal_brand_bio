const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function startWhatsApp() {
  try {
    console.log('🚀 Starting WhatsApp server...');
    
    const { state, saveCreds } = await useMultiFileAuthState('whatsapp-session');
    
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      defaultQueryTimeoutMs: undefined,
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
        
        if (shouldReconnect) {
          await startWhatsApp();
        }
      } else if (connection === 'open') {
        console.log('✅ WhatsApp connected successfully!');
        console.log('📱 You can now send messages!');
      }
    });

    sock.ev.on('creds.update', saveCreds);

  } catch (error) {
    console.error('❌ Error starting WhatsApp server:', error);
  }
}

startWhatsApp();
