export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}
export interface TokenPayload {
  // Id of the user
  id: string;
  // Issued At
  iat: number;
  // Expiration Time.
  exp: number;
}
