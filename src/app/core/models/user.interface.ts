// Structure for the full user profile data
export interface User {
    username:string,
    email:string,
    firstName:string,
    lastName:string,
    roles:string[],
}
// Structure for the security token response
export interface LoginResponse {
    accessToken :string,
    tokenType:string
}

// Structure for the full user profile data
export interface RegisterRequest {
    id: number,
    username:string,
    email:string,
    firstName:string,
    lastName:string,
    roles:string[],
    mobile: number,
    gender: string,
}

export class ContactResponse {

    id!: number;
    fullName!: string;
    email!: string;
    mobile!: number;
    comment!: string;
    replied!: boolean;
    subject!: string;
}

export class EmailResponse {
    subject!: string;
    toList!: string;
    body!: string;
    id!: number;

}

export interface Image {
  id: number;
  name: string;
  type: string;
  title: string;
  description: string;
  imageData: string; // Base64 string
  image: string; // URL or Base64 string

}

export interface RecordCard {
  id?: number;
  title: string;
  description: string;
  category: string;
}