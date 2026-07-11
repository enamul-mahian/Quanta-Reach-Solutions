// =========================================================================
// MetaFore Technologies - Bilingual Types Definition
// =========================================================================

export type Language = 'en' | 'bn';

export interface TranslationDictionary {
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    submit: string;
    learnMore: string;
    readMore: string;
    seeAll: string;
    getStarted: string;
    requestQuote: string;
    bookMeeting: string;
    whatsappUs: string;
    notFound: string;
    goBack: string;
  };
  navigation: {
    home: string;
    about: string;
    services: string;
    portfolio: string;
    caseStudies: string;
    globalClients: string;
    localClients: string;
    team: string;
    pricing: string;
    blog: string;
    contact: string;
    adminPanel: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroTagline: string;
    trustedBy: string;
    ourServices: string;
    whyChooseUs: string;
    provenResults: string;
    workProcess: string;
    clientReviews: string;
    startProjectCTA: string;
  };
  clients: {
    forGlobalClients: string;
    forLocalClients: string;
    globalFeatures: string[];
    localFeatures: string[];
  };
  pricing: {
    startingAt: string;
    monthly: string;
    fixedPrice: string;
    customQuote: string;
    bdt: string;
    usd: string;
  };
  contact: {
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    companyLabel: string;
    messageLabel: string;
    sendButton: string;
    officeAddress: string;
    businessHours: string;
  };
  footer: {
    companySummary: string;
    quickLinks: string;
    legalPages: string;
    copyright: string;
  };
}