export interface UserInterface {
  apiKey:         string,
  appName:        string,
  authDomain:     string,
  createdAt:      string,
  displayName:    string | null,
  email:          string,
  emailVerified:  boolean,
  isAnonymous:    boolean,
  lastLoginAt:    string,
  multiFactor:    { enrolledFactors: any[] }
  phoneNumber:    string | null,
  photoURL:       string | null,
  providerData: {
    displayName:    string | null,
    email:          string,
    phoneNumber:    string | null,
    photoURL:       string | null,
    providerId:     string,
    uid:            string
  }[],
  redirectEventId: string | null,
  stsTokenManager: {
    accessToken:    string,
    apiKey:         string,
    expirationTime: number,
    refreshToken:   string
  },
  tenantId:       string | null,
  uid:            string,

  additionalUserInfo?: any
}