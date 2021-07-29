import { Request } from 'express';
import User from 'src/users/users.entity';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
