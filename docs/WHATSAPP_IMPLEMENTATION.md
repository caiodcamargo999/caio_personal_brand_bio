# WhatsApp Implementation with Baileys

## 🚀 **Phase 1: Baileys Implementation (ACTIVE)**

### **What is Baileys?**
Baileys is a free, unofficial WhatsApp Web library that allows you to:
- Connect to your existing WhatsApp number
- Send messages via HTTP API
- Receive webhooks for incoming messages
- Work offline and be more reliable

### **Current Setup**
- ✅ **WhatsApp Server**: `lib/whatsapp-baileys.ts`
- ✅ **API Endpoint**: `app/api/whatsapp/send/route.ts`
- ✅ **Reminders Endpoint**: `app/api/whatsapp/reminders/route.ts`
- ✅ **Calendar Integration**: Automatic confirmation after event creation

### **How to Use**

#### **1. Start the Server**
```bash
npm run dev
```
- A QR code will appear in your terminal
- Scan it with your WhatsApp on your phone
- Keep the server running to maintain connection

#### **2. Send a Test Message**
```bash
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "+5511999999999", "message": "Test message"}'
```

#### **3. Test in Browser Console**
```javascript
fetch('/api/whatsapp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+5511999999999',
    message: 'Test: WhatsApp confirmation pipeline is connected!'
  })
}).then(r=>r.json()).then(console.log)
```

### **Features**

#### **Automatic Confirmation**
- After creating a calendar event, WhatsApp confirmation is sent automatically
- Message includes: Date, time, and reminder information
- Uses the phone number from the lead capture form

#### **1-Hour Reminder**
- Endpoint: `/api/whatsapp/reminders`
- Checks events in the next 2 hours
- Sends reminder when event is ~1 hour away
- Prevents duplicate reminders

#### **Message Queue**
- If WhatsApp is not connected, messages are queued
- Messages are sent automatically when connection is restored
- Queue expires after 5 minutes

### **Phone Number Format**
- **Input**: Any format (e.g., `+55 51 99328-8772`, `(51) 99328-8772`)
- **Processing**: Automatically formats to WhatsApp format
- **Output**: `+5551993288772@c.us`

## 🔄 **Phase 2: Z-API Implementation (Future)**

### **When to Implement**
- After thoroughly testing Baileys
- When scaling up to production
- When you need more professional support

### **Benefits of Z-API**
- More stable and reliable
- Professional support
- Better documentation
- Higher uptime

### **Migration Path**
1. Set up Z-API instance
2. Update environment variables
3. Modify code to use Z-API instead of Baileys
4. Test thoroughly
5. Deploy to production

## 🛠️ **Technical Details**

### **Dependencies**
```json
{
  "@whiskeysockets/baileys": "Latest",
  "qrcode-terminal": "Latest"
}
```

### **File Structure**
```
lib/
├── whatsapp-baileys.ts      # Main WhatsApp server
├── whatsapp-init.ts         # Initialization helper
└── whatsapp.ts              # Legacy Z-API (can be removed)

app/api/whatsapp/
├── send/route.ts            # Send message endpoint
└── reminders/route.ts       # 1-hour reminder endpoint
```

### **Environment Variables**
No additional environment variables needed for Baileys!

### **Session Management**
- Session data is stored in `whatsapp-session/` folder
- Automatically reconnects if connection is lost
- Credentials are saved locally

## ⚠️ **Important Notes**

### **Keep Server Running**
- WhatsApp connection requires the server to stay running
- If you stop the server, you'll need to scan the QR code again
- Consider using PM2 or similar for production

### **Phone Number**
- Uses your current number: `(51) 99328-8772`
- No need for new numbers or activation fees
- 100% free to use

### **Limitations**
- Unofficial API (may have stability issues)
- Requires phone to stay connected to internet
- May need to re-scan QR code occasionally

## 🧪 **Testing**

### **Manual Test**
1. Start server: `npm run dev`
2. Scan QR code with your phone
3. Send test message via API
4. Verify message arrives on your phone

### **Automated Test**
```bash
node test-whatsapp.js
```

### **Integration Test**
1. Fill out lead capture form
2. Schedule a calendar event
3. Verify WhatsApp confirmation is sent
4. Check 1-hour reminder endpoint

## 🚀 **Next Steps**

1. ✅ **Phase 1 Complete**: Baileys implementation working
2. [ ] **Test thoroughly** with real phone numbers
3. [ ] **Monitor stability** and performance
4. [ ] **Scale up** if everything works well
5. [ ] **Phase 2**: Consider Z-API for production

---

**Current Status**: ✅ **ACTIVE** - Baileys WhatsApp server running and ready for testing!
