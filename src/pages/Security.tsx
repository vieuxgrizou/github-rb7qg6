import React from 'react';
import TwoFactorSetup from '../components/TwoFactorSetup';
import AuditLogViewer from '../components/AuditLogViewer';
import DataPrivacySettings from '../components/DataPrivacySettings';
import BackupManager from '../components/BackupManager';
import { useAuth } from '../utils/auth/useAuth';

export default function Security() {
  const { user } = useAuth();
  const [showTwoFactorSetup, setShowTwoFactorSetup] = React.useState(false);

  const handleTwoFactorComplete = (secret: string, backupCodes: string[]) => {
    // TODO: Implement 2FA activation
    console.log('2FA activated:', { secret, backupCodes });
    setShowTwoFactorSetup(false);
  };

  return (
    <div className="space-y-6">
      {showTwoFactorSetup ? (
        <div className="container-card">
          <TwoFactorSetup
            userId={user?.id || ''}
            onComplete={handleTwoFactorComplete}
            onCancel={() => setShowTwoFactorSetup(false)}
          />
        </div>
      ) : (
        <>
          <div className="container-card">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-dark-primary">
                Authentification à deux facteurs
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-dark-secondary">
                <p>
                  Ajoutez une couche de sécurité supplémentaire à votre compte.
                </p>
              </div>
              <div className="mt-5">
                <button
                  onClick={() => setShowTwoFactorSetup(true)}
                  className="button-primary"
                >
                  Activer l'authentification à deux facteurs
                </button>
              </div>
            </div>
          </div>

          <div className="container-card">
            <DataPrivacySettings
              userId={user?.id || ''}
              onDataDeleted={() => {/* Handle account deletion */}}
            />
          </div>

          <div className="container-card">
            <BackupManager />
          </div>

          <div className="container-card">
            <AuditLogViewer userId={user?.id || ''} />
          </div>
        </>
      )}
    </div>
  );
}