import AppDataSource from './config/ormconfig';

const connectToDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

export default connectToDatabase;
