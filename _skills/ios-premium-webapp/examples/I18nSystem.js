/* 
  ios-premium-webapp: Reactive Globalization (i18n) Pattern
  
  This pattern allows for seamless, multi-language support 
  without heavy libraries, keeping the App light and responsive.
*/

const i18n = (lang) => {
  const translations = {
    es: {
      portal: "Portal de Gestión",
      welcome: "Hola, bienvenido de nuevo.",
      settings: "Ajustes",
      logout: "Cerrar sesión",
      loading: "Cargando",
      // Add more strings here
    },
    en: {
      portal: "Management Portal",
      welcome: "Hello, welcome back.",
      settings: "Settings",
      logout: "Log out",
      loading: "Loading",
    },
    fr: {
      portal: "Portail de Gestion",
      welcome: "Bonjour, bon retour.",
      settings: "Paramètres",
      logout: "Déconnexion",
      loading: "Chargement",
    }
  };

  return translations[lang] || translations['es'];
};

export default i18n;

/* Usage in Component:
   const t = i18n(lang);
   return <h1>{t.portal}</h1>;
*/
 Wilmington
