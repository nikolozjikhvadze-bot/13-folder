import { MongoClient } from "mongodb";

export async function connectToDatabase() {
    const client = await MongoClient.connect('mongodb://nikolozjikhvadze_db_user:nikolozi1.0.1@ac-gzxyozi-shard-00-00.8euf9cj.mongodb.net:27017,ac-gzxyozi-shard-00-01.8euf9cj.mongodb.net:27017,ac-gzxyozi-shard-00-02.8euf9cj.mongodb.net:27017/?ssl=true&replicaSet=atlas-115k98-shard-0&authSource=admin&appName=Cluster0');
    return client;

}