const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

console.log('🚀 Starting working WhatsApp test...');

async function test() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('whatsapp-session');
    
    console.log('📱 Creating WhatsApp connection...');
    
    const sock = makeWASocket({
      auth: state,
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        console.log('🎯 QR Code detected! Displaying...');
        qrcode.generate(qr, { small: true });
        console.log('📱 Scan this QR code with your WhatsApp!');
      }
      
      if (connection === 'open') {
        console.log('✅ Connected to WhatsApp!');
        console.log('🎉 You can now send messages!');
      }
    });

    sock.ev.on('creds.update', saveCreds);
    
    console.log('📱 Waiting for QR code...');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
