import express, { Response, NextFunction } from 'express';
import { Request } from 'types';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: 'Server is up and running!!!' });
});
router.get('/api', (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: 'Parkify API up and running!!!' });
});

export default router;
