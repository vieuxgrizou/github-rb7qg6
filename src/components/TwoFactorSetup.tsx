import React from 'react';
import { QrCode, Copy, Check } from 'lucide-react';
import { generateTwoFactorSecret } from '../utils/security/twoFactor';

interface TwoFactorSetupProps {
  userId: string;
  onComplete: (secret: string, backupCodes: string[]) => void;
  onCancel: () => void;
}

export default function TwoFactorSetup({ userId, onComplete, onCancel }: TwoFactorSetupProps) {
  const [setupData, setSetupData] = React.useState<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    generateTwoFactorSecret(userId).then(setSetupData);
  }, [userId]);

  const copyBackupCodes = () => {
    if (setupData) {
      navigator.clipboard.writeText(setupData.backupCodes.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!setupData) {
    return <div className="text-gray-500 dark:text-dark-secondary">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
          Configuration de l'authentification à deux facteurs
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
          Scannez le QR code avec votre application d'authentification
        </p>
      </div>

      <div className="flex justify-center">
        <div className="p-4 bg-white dark:bg-dark-paper rounded-lg">
          <img src={setupData.qrCode} alt="QR Code" className="h-48 w-48" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
          Code de vérification
        </label>
        <div className="mt-1">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="input-standard w-full"
            placeholder="Entrez le code à 6 chiffres"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-dark-primary">Codes de secours</h4>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
          Conservez ces codes dans un endroit sûr. Ils vous permettront de récupérer l'accès à votre compte.
        </p>
        <div className="mt-2 bg-gray-50 dark:bg-dark-hover p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            {setupData.backupCodes.map((code) => (
              <div key={code} className="font-mono text-sm text-gray-900 dark:text-dark-primary">{code}</div>
            ))}
          </div>
          <button
            type="button"
            onClick={copyBackupCodes}
            className="mt-4 button-secondary"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copié
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copier les codes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="button-secondary"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={() => onComplete(setupData.secret, setupData.backupCodes)}
          className="button-primary"
        >
          Activer
        </button>
      </div>
    </div>
  );
}