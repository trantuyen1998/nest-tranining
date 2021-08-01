import { Request } from 'express';
import User from 'src/users/entity/users.entity';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
