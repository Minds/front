// response for GET request for oauth token generation.
export type GetTwitterOauthTokenResponse = {
  authorization_url: string;
};

// response to get a users Twitter config.
export type GetTwitterConfigResponse = {
  twitter_oauth2_connected: boolean;
};

// Twitter config object.
export type TwitterConfig = GetTwitterConfigResponse;
