import QRCode from 'qrcode';
import { authenticator } from 'otplib';

// Utilise crypto.getRandomValues au lieu de crypto.randomBytes
function generateSecureRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function generateTwoFactorSecret(userId: string) {
  // Génère un secret compatible TOTP
  const secret = authenticator.generateSecret();
  
  // Crée l'URL otpauth
  const otpauth = authenticator.keyuri(userId, 'Intensify', secret);
  
  // Génère le QR code
  const qrCode = await QRCode.toDataURL(otpauth);

  // Génère des codes de secours
  const backupCodes = generateBackupCodes();

  return {
    secret,
    qrCode,
    backupCodes
  };
}

export function generateBackupCodes(count = 8): string[] {
  return Array.from({ length: count }, () => 
    generateSecureRandomString(4).toUpperCase()
  );
}

export function verifyTwoFactorToken(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

export function verifyBackupCode(code: string, validCodes: string[]): boolean {
  return validCodes.includes(code.toUpperCase());
}