import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../../../common/pipe/parse-object-id.pipe';
import { GetUserPrincipal } from '../../auth/decorators/user-principal.decorator';
import { AccessGuard } from '../../auth/guards';
import { UserPrincipal } from '../../auth/interface/user-principal.interface';
import { CreateCardDTO } from '../dto/create-card.dto';
import { CardService } from '../service/card.service';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseGuards(AccessGuard)
  public create(
    @Body() dto: CreateCardDTO,
    @GetUserPrincipal() user: UserPrincipal,
  ) {
    return this.cardService.create(dto, user);
  }

  @Get()
  @UseGuards(AccessGuard)
  public getCardsByUser(@GetUserPrincipal() user: UserPrincipal) {
    return this.cardService.getCardByUser(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessGuard)
  public delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.cardService.delete(id);
  }
}
