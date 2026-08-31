import { NextRequest } from 'next/server';

export async function getLocale(request: NextRequest): Promise<string> {
  try {
    // Get IP address from request headers
    const forwarded = request.headers.get('x-forwarded-for');
    const real = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : real || request.ip || '127.0.0.1';

    // Use ipapi.co for IP-based geolocation (free tier)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
    const data = await response.json();

    if (data.countryCode) {
      // Map country codes to supported languages
      const countryToLanguage: { [key: string]: string } = {
        // Portuguese-speaking countries
        'BR': 'pt', // Brazil
        'PT': 'pt', // Portugal
        'AO': 'pt', // Angola
        'MZ': 'pt', // Mozambique
        'CV': 'pt', // Cape Verde
        'GW': 'pt', // Guinea-Bissau
        'ST': 'pt', // São Tomé and Príncipe
        'TL': 'pt', // East Timor
        
        // Spanish-speaking countries
        'ES': 'es', // Spain
        'MX': 'es', // Mexico
        'AR': 'es', // Argentina
        'CO': 'es', // Colombia
        'PE': 'es', // Peru
        'VE': 'es', // Venezuela
        'CL': 'es', // Chile
        'EC': 'es', // Ecuador
        'GT': 'es', // Guatemala
        'CU': 'es', // Cuba
        'BO': 'es', // Bolivia
        'DO': 'es', // Dominican Republic
        'HN': 'es', // Honduras
        'PY': 'es', // Paraguay
        'SV': 'es', // El Salvador
        'NI': 'es', // Nicaragua
        'CR': 'es', // Costa Rica
        'PA': 'es', // Panama
        'UY': 'es', // Uruguay
        'GQ': 'es', // Equatorial Guinea
        
        // English-speaking countries (fallback)
        'US': 'en', // United States
        'GB': 'en', // United Kingdom
        'CA': 'en', // Canada
        'AU': 'en', // Australia
        'NZ': 'en', // New Zealand
        'IE': 'en', // Ireland
        'ZA': 'en', // South Africa
        'IN': 'en', // India
        'SG': 'en', // Singapore
        'HK': 'en', // Hong Kong
      };

      return countryToLanguage[data.countryCode] || 'en';
    }
  } catch (error) {
    console.error('Error detecting locale from IP:', error);
  }

  // Fallback to English
  return 'en';
}
