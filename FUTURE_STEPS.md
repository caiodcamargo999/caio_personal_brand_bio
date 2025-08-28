# FUTURE_STEPS

- After choosing "No" in the budget step, the lead should be sent to the Rarity Agency site for now.
- Later, replace this with a landing page to download Caio de Camargo's free ebook and start a nurture flow.
- Temporary redirect URL: https://rarityglobal.agency

## 🔄 **Cron Job Implementation (Future Enhancement)**

### **Current Status:**
- Using Google Calendar native reminders (24h, 2h, 15min before)
- No automated email reminders system

### **Future Enhancement - Cron Job System:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/email-sequence",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### **Benefits of Cron Job System:**
- Custom branded reminder emails
- Professional nurture sequence
- Better user experience with branded content

### **Implementation Steps:**
1. Upgrade to Vercel Pro plan (40 cron jobs, unlimited executions)
2. Add vercel.json with cron configuration
3. Test automated email sequence
4. Monitor delivery and open rates
