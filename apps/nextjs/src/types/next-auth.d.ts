import "next-auth";

declare module "next-auth" {
  type User = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    profilePictureUrl: string | null;
    pendingVerification: boolean;
  };

  type Session = {
    user: User;
  };
}

declare module "next-auth/jwt" {
  type JWT = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    profilePictureUrl: string | null;
    pendingVerification: boolean;
  };
}
