// OAuth login box type
export const loginBoxType = {
  Main: 1,
  Popup: 2
  // Eventually support a visible Iframe/Inline Modal dialog variant as well
};

export const endpoints = {
  // Change this URL if you want to point the React application at another Pega server.
  PEGAURL: "https://softserve01.pegalabs.io/prweb",

  

  // use_v2apis should be set to true only for Pega 8.5 and better servers, where the application
  //  service package exists.  Also, it must be configured to the same authentication type as the
  //  api service package and what is specified by use_OAuth within this file
  use_v2apis: false,

  // use_OAuth should be set to false for basic auth, and true to use OAuth 2.0
  use_OAuth: false,
  
  OAUTHCFG: {
    // These settings are only significant when use_OAuth is true
  
    /* V1 CableCo public */
    client_id: "62031018436007304421",

    // revoke endpoint for "Public" OAuth 2.0 client registrations are only available with 8.7 and later
    use_revoke: false,

    authService: "pega",

    // Other properties that might be specified to override default values
    // use_pkce, authorize, token, revoke

    // Optional params
    // client_secret is not advised for web clients (as can't protect this value) but is honored if present
    // client_secret: "",

    loginExperience: loginBoxType.Main
  },


  AUTHENTICATE: "/authenticate",
  CASES: "/cases",
  CASETYPES: "/casetypes",
  VIEWS: "/views",
  ASSIGNMENTS: "/assignments",
  ACTIONS: "/actions",
  PAGES: "/pages",
  DATA: "/data",
  REFRESH: "/refresh",
  // V2 endpoints
  NAVIGATION_STEPS: "/navigation_steps"
};
