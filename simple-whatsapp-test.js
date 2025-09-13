const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

console.log('🚀 Starting simple WhatsApp test...');

async function test() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('whatsapp-session');
    
    console.log('📱 Creating WhatsApp connection...');
    
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        console.log('🎯 QR Code detected!');
      }
      
      if (connection === 'open') {
        console.log('✅ Connected to WhatsApp!');
      }
    });

    sock.ev.on('creds.update', saveCreds);
    
    console.log('📱 WhatsApp connection created. Look for QR code above...');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
