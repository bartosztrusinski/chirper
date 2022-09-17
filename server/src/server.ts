import 'dotenv/config';
import express, { Application } from 'express';
import 'express-async-errors';
import connectDB from './config/db';
import apiRoutes from './routes';
import errorHandler from './middleware/error';
import notFound from './middleware/notFound';

connectDB();

const app: Application = express();
app.set('port', process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(app.get('port'), () => {
  console.log(
    `Server is running on port ${app.get('port')} in ${app.get('env')} mode`
  );
});
