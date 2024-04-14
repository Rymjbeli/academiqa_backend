import { PartialType } from '@nestjs/mapped-types';
import { CreateCommonChatDto } from './create-common-chat.dto';

export class UpdateCommonChatDto extends PartialType(CreateCommonChatDto) {}
