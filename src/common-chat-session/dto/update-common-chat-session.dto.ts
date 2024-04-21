import { PartialType } from '@nestjs/mapped-types';
import { CreateCommonChatSessionDto } from './create-common-chat-session.dto';

export class UpdateCommonChatSessionDto extends PartialType(
  CreateCommonChatSessionDto,
) {
  id: number;
}
