import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import ObjectWithIdDTO from '../../utils/type/objectWithId.dto';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateNested()
  @Type(() => ObjectWithIdDTO)
  post: ObjectWithIdDTO;
}

export default CreateCommentDto;
