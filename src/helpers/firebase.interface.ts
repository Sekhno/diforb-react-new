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

export interface FirebaseConfig {
  apiKey: string,
  authDomain: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string,
  measurementId: string
}

export interface Library {
  id: string,
  author: string,
  cover: string,
  cover_retina: string,
  data: LibrariesCategory[],
  main?: LibrariesCategory[],
  main2?: LibrariesCategory[]
  extra?: LibrariesCategory[],
  extra2?: LibrariesCategory[],
  description: string,
  name: string,
  tizer: string,
  develop: boolean,
  four_sound: boolean,
  format: string
}

interface LibrariesCategory {
  type: 'category',
  icon: string,
  name: string,
  data: LibrariesSubCategory[]
}

interface LibrariesSubCategory {
  type: 'subcategory' | 'sound'
  icon: string,
  name: string,
  data: LibrariesSound[]
}

interface LibrariesSound {
  type: 'sound'
  name: string
}

export interface Review {
  date: any,
  name: string,
  photo: string,
  review: string
}