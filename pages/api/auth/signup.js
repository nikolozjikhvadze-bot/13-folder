import { connectToDatabase } from "../../../lib/db"; // თუ ერორი ამოაგდო, შეცვალე: "../../../../lib/db"
import { hashPassword } from "../../../lib/auth";

async function handler(req, res) {
    // 1. თუ POST მოთხოვნა არ არის, დავუბრუნოთ პასუხი
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    const data = req.body;
    const { email, password } = data;

    if (!email || !email.includes('@') || !password || password.trim().length < 7) {
        res.status(422).json({ message: 'Invalid Input - password should also be at least 7 characters long.' });
        return;
    }

    try {
        const client = await connectToDatabase();
        const db = client.db('auth');

        const existingUser = await db.collection('users').findOne({email: email})

        if(existingUser) {
            res.status(422).json({message: 'User exist already!'})
            client.close()
            return;
        }

        const hashedPassword = await hashPassword(password);

        // 2. ბაზაში ვინახავთ დაჰაშირებულ პაროლს
        const result = await db.collection('users').insertOne({
            email: email,
            password: hashedPassword 
        });

        res.status(201).json({ message: 'Created User!' });
        client.close()
    } catch (error) {
        res.status(500).json({ message: 'Connecting to the database failed!' });
    }
} 

export default handler;