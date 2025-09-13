const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');

// Fix WebSocket compatibility issues
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

class WhatsAppService {
  constructor() {
    this.sock = null;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
  }

  async start() {
    try {
      console.log('🚀 Starting WhatsApp service...');
      
      const { state, saveCreds } = await useMultiFileAuthState('whatsapp-session');
      
      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ['Chrome (Linux)', '', ''],
        connectTimeoutMs: 120000,
        keepAliveIntervalMs: 25000,
        retryRequestDelayMs: 2000,
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: false,
        getMessage: async () => {
          return {
            conversation: 'Hello!'
          }
        }
      });

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
          console.log('🎯 QR Code detected! Displaying...');
          console.log('📱 Scan this QR code with your WhatsApp Business!');
          console.log('🔗 Or copy this link to scan:');
          console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
          console.log('');
          
          // Try to generate a better QR code display
          try {
            const qrDataUrl = await qrcode.toDataURL(qr, { 
              width: 300, 
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
            console.log('📱 QR Code Data URL (copy to browser):');
            console.log(qrDataUrl);
            console.log('');
          } catch (error) {
            console.log('⚠️ Could not generate QR code data URL, using fallback...');
          }
          
          // Fallback: try to display in terminal with better formatting
          try {
            const qrTerminal = await qrcode.toString(qr, { 
              type: 'terminal',
              small: false,
              width: 40
            });
            console.log('📱 Terminal QR Code:');
            console.log(qrTerminal);
            console.log('');
          } catch (error) {
            console.log('⚠️ Could not display terminal QR code');
          }
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log('❌ Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
          
          if (shouldReconnect && this.connectionAttempts < this.maxRetries) {
            this.connectionAttempts++;
            console.log(`🔄 Attempting to reconnect... (${this.connectionAttempts}/${this.maxRetries})`);
            setTimeout(() => this.start(), 5000);
          } else if (this.connectionAttempts >= this.maxRetries) {
            console.log('❌ Max reconnection attempts reached. Please restart the service manually.');
          }
        } else if (connection === 'open') {
          this.isConnected = true;
          this.connectionAttempts = 0;
          console.log('✅ WhatsApp connected successfully!');
          console.log('📱 Ready to send messages!');
        }
      });

      this.sock.ev.on('creds.update', saveCreds);

    } catch (error) {
      console.error('❌ Error starting WhatsApp service:', error);
      if (this.connectionAttempts < this.maxRetries) {
        this.connectionAttempts++;
        console.log(`🔄 Retrying in 5 seconds... (${this.connectionAttempts}/${this.maxRetries})`);
        setTimeout(() => this.start(), 5000);
      }
    }
  }

  stop() {
    if (this.sock) {
      this.sock.end();
      this.isConnected = false;
      console.log('🛑 WhatsApp service stopped');
    }
  }

  isReady() {
    return this.isConnected && this.sock;
  }

  async sendMessage(phone, message) {
    if (!this.isReady()) {
      console.log('❌ WhatsApp not connected');
      return false;
    }

    try {
      // Format phone number properly
      let formattedPhone = phone.replace(/\D/g, '');
      if (!formattedPhone.startsWith('55')) {
        formattedPhone = '55' + formattedPhone;
      }
      formattedPhone = formattedPhone + '@s.whatsapp.net';

      console.log(`📤 Sending message to ${formattedPhone}`);
      
      await this.sock.sendMessage(formattedPhone, { text: message });
      console.log('✅ Message sent successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return false;
    }
  }
}

module.exports = { whatsappService: new WhatsAppService() };
