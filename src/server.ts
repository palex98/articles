import express from 'express';
import bodyParser from 'body-parser';
import connectToDatabase from './app';
import articlesRouter from './routes/articles';

const app = express();
app.use(bodyParser.json());
app.use('/articles', articlesRouter);

const PORT = process.env.PORT || 3000;

connectToDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
