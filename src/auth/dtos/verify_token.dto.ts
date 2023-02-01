export class RefreshTokenDTO {
  refreshToken: string;
  // Id of the user
  id: string;
  // Issued At
  iat: number;
  // Expiration Time.
  exp: number;
}
