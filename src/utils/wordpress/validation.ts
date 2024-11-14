import axios from 'axios';

interface ValidationResult {
  success: boolean;
  error?: string;
  siteInfo?: {
    name: string;
    description: string;
    url: string;
    version: string;
  };
  permissions?: {
    missing: string[];
    available: string[];
  };
}

const REQUIRED_CAPABILITIES = {
  edit_posts: 'Modifier les articles',
  publish_posts: 'Publier des articles',
  moderate_comments: 'Modérer les commentaires',
  edit_comments: 'Modifier les commentaires',
  read: 'Lire le contenu'
} as const;

export async function validateWordPressConnection(url: string, applicationPassword: string): Promise<ValidationResult> {
  try {
    // Nettoyer l'URL
    const baseUrl = url.replace(/\/$/, '');
    const apiUrl = `${baseUrl}/wp-json/wp/v2`;

    // Vérifier le format du mot de passe d'application
    let authString = applicationPassword;
    if (!applicationPassword.includes(':')) {
      return {
        success: false,
        error: "Format du mot de passe d'application invalide. Le format doit être 'utilisateur:xxxx xxxx xxxx xxxx xxxx xxxx'"
      };
    }

    // Configuration commune pour les requêtes
    const config = {
      headers: {
        'Authorization': `Basic ${btoa(authString)}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 secondes timeout
    };

    try {
      // Vérifier que l'API REST est accessible
      await axios.get(apiUrl, config);

      // Vérifier que nous pouvons accéder aux informations du site
      const siteResponse = await axios.get(`${baseUrl}/wp-json`, config);

      // Vérifier les permissions
      const meResponse = await axios.get(`${apiUrl}/users/me?context=edit`, config);

      // Vérifier si l'utilisateur est administrateur
      const isAdmin = meResponse.data.roles?.includes('administrator') || 
                     meResponse.data.capabilities?.administrator === true;

      if (isAdmin) {
        // Si admin, on considère qu'il a toutes les permissions nécessaires
        return {
          success: true,
          siteInfo: {
            name: siteResponse.data.name,
            description: siteResponse.data.description,
            url: siteResponse.data.url,
            version: siteResponse.data.version
          },
          permissions: {
            missing: [],
            available: Object.values(REQUIRED_CAPABILITIES)
          }
        };
      }

      // Si non admin, on vérifie les permissions spécifiques
      const userCapabilities = meResponse.data.capabilities || {};
      
      // Convertir les capabilities WordPress (qui peuvent avoir différents formats)
      const normalizedCapabilities: Record<string, boolean> = {};
      Object.keys(userCapabilities).forEach(cap => {
        if (typeof userCapabilities[cap] === 'boolean') {
          normalizedCapabilities[cap] = userCapabilities[cap];
        } else if (userCapabilities[cap] === 1 || userCapabilities[cap] === '1') {
          normalizedCapabilities[cap] = true;
        } else if (cap.startsWith('level_')) {
          // Les niveaux d'accès WordPress (level_0 à level_10)
          const level = parseInt(cap.replace('level_', ''));
          if (level >= 7) { // level_7 et plus ont généralement accès à la modération
            Object.keys(REQUIRED_CAPABILITIES).forEach(reqCap => {
              normalizedCapabilities[reqCap] = true;
            });
          }
        }
      });

      const missingCapabilities = Object.entries(REQUIRED_CAPABILITIES)
        .filter(([cap]) => !normalizedCapabilities[cap])
        .map(([_, label]) => label);

      const availableCapabilities = Object.entries(REQUIRED_CAPABILITIES)
        .filter(([cap]) => normalizedCapabilities[cap])
        .map(([_, label]) => label);

      if (missingCapabilities.length > 0) {
        return {
          success: false,
          error: `Permissions manquantes : ${missingCapabilities.join(', ')}. Assurez-vous que l'utilisateur a les rôles nécessaires ou utilisez un compte administrateur.`,
          permissions: {
            missing: missingCapabilities,
            available: availableCapabilities
          }
        };
      }

      return {
        success: true,
        siteInfo: {
          name: siteResponse.data.name,
          description: siteResponse.data.description,
          url: siteResponse.data.url,
          version: siteResponse.data.version
        },
        permissions: {
          missing: [],
          available: availableCapabilities
        }
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Identifiants invalides. Veuillez vérifier :\n1. Que l'identifiant WordPress est correct\n2. Que le mot de passe d'application a été correctement copié\n3. Que le mot de passe d'application n'a pas expiré"
        };
      }
      throw error;
    }
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 403:
          return {
            success: false,
            error: "Accès refusé. Vérifiez que :\n1. L'utilisateur a un rôle administrateur\n2. L'API REST WordPress est activée\n3. Le mot de passe d'application a les bonnes permissions"
          };
        case 404:
          return {
            success: false,
            error: "Site WordPress non trouvé. Vérifiez que :\n1. L'URL est correcte\n2. Le site est bien un site WordPress\n3. L'API REST WordPress est activée\n4. Le site est accessible publiquement"
          };
        default:
          return {
            success: false,
            error: `Erreur ${error.response.status}: ${error.response.data?.message || 'Erreur inconnue'}`
          };
      }
    }

    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: "Le site ne répond pas. Vérifiez que :\n1. Le site est en ligne\n2. L'URL est correcte\n3. Le site est accessible depuis Internet"
      };
    }

    if (error.code === 'ERR_INVALID_URL' || error.message.includes('Invalid URL')) {
      return {
        success: false,
        error: "L'URL est invalide. L'URL doit :\n1. Commencer par http:// ou https://\n2. Être une URL valide (ex: https://monsite.com)"
      };
    }

    return {
      success: false,
      error: "Impossible de se connecter au site WordPress. Vérifiez que :\n1. Le site est accessible\n2. Les identifiants sont corrects\n3. L'API REST WordPress est activée"
    };
  }
}