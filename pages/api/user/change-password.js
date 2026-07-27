import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { connectToDatabase } from '../../../lib/db'
import { hashPassword, verifyPassword } from "../../../lib/auth"

async function handler (req, res) {
    if(req.method !== 'PATCH'){
        return res.status(405).json({message: 'Method not allowed'});
    }

    const session = await getServerSession(req, res, authOptions);

    if(!session) {
        return res.status(401).json({message: 'Not authenticated!'});
    }

    const userEmail = session.user.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const client = await connectToDatabase();
    const usersCollection = client.db('auth').collection('users');

    const user = await usersCollection.findOne({email: userEmail});

    if(!user) {
        client.close();
        return res.status(404).json({message: 'User not found'});
    }

    const currentPassword = user.password;
    const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

    if(!passwordsAreEqual){
        client.close();
        return res.status(403).json({message: 'Invalid password!'});
    }

    const hashedPassword = await hashPassword(newPassword);

    await usersCollection.updateOne({email: userEmail}, {$set: {password: hashedPassword}});

    client.close();
    return res.status(200).json({message: 'Password updated!'});
}

export default handler;