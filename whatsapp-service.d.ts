declare module '@/whatsapp-service' {
  export interface WhatsAppService {
    start(): Promise<void>;
    stop(): void;
    sendMessage(phone: string, message: string): Promise<boolean>;
    isReady(): boolean;
  }

  export const whatsappService: WhatsAppService;
}
