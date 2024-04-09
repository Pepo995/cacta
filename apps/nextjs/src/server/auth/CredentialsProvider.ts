import { prisma } from "@cacta/db";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import z from "zod";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { type: "text" },
    password: { type: "password" },
  },
  async authorize(credentials) {
    const parsedCredentials = CredentialsSchema.safeParse(credentials);

    if (!parsedCredentials.success) return null;

    const { email, password } = parsedCredentials.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const passwordMatches = await compare(password, user.hashedPassword);

    if (!passwordMatches) return null;

    return user;
  },
});
