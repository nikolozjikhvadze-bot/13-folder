import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";

export const authOptions = {
    session: {
        strategy: "jwt" 
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const client = await connectToDatabase();
                const usersCollection = client.db('auth').collection('users');
                const user = await usersCollection.findOne({ email: credentials.email });

                if (!user) {
                    client.close();
                    throw new Error('No users found!');
                }

                const isValid = await verifyPassword(credentials.password, user.password);

                if (!isValid) {
                    client.close();
                    throw new Error('Could not log you in!');
                }

                client.close();
                return { email: user.email };
            }
        })
    ]
};

export default NextAuth(authOptions);