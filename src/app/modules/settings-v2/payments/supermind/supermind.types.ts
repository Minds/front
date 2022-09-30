// Supermind settings object.
export type SupermindSettings = {
  min_cash?: number;
  min_offchain_tokens?: number;
};

// Settings GET API response.
export type SupermindSettingsGetApiResponse = SupermindSettings;

// Settings POST API response.
export type SupermindSettingsPostApiResponse = {};

// Settings config object from config service.
export type SupermindConfig = {
  min_thresholds: SupermindSettings;
};
