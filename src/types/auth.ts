export interface User {
   id: number;
   username: string;
   email: string;
   firstName: string;
   lastName: string;
   image: string;
}

export interface AuthResponse {
   accessToken: string;
   refreshToken: string;
   id: number;
   username: string;
   email: string;
   firstName: string;
   lastName: string;
   image: string;
}

export interface RefreshTokenResponse {
   accessToken: string;
   refreshToken: string;
}

export interface ProfileAddress {
   address: string;
   city: string;
   state: string;
   stateCode: string;
   postalCode: string;
   country: string;
}

export interface ProfileCompany {
   department: string;
   name: string;
   title: string;
   address: ProfileAddress;
}

/** Full user payload returned by GET /auth/me (a superset of `User`). */
export interface ProfileUser extends User {
   maidenName: string;
   age: number;
   gender: string;
   phone: string;
   birthDate: string;
   bloodGroup: string;
   height: number;
   weight: number;
   eyeColor: string;
   role: string;
   address: ProfileAddress;
   company: ProfileCompany;
   university: string;
}
