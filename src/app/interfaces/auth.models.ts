
export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  token: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
}