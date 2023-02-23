import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { mergeMap } from 'rxjs';
import { ParseObjectIdPipe } from '../../../common/pipe/parse-object-id.pipe';
import { GetUserPrincipal } from '../../auth/decorators/user-principal.decorator';
import { AccessGuard } from '../../auth/guards';
import { UserPrincipal } from '../../auth/interface/user-principal.interface';
import { CardDTO, CreateCardDTO } from '../dto/card.dto';
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
    return this.cardService.getCardsByUser(user);
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  public update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: CardDTO,
    @GetUserPrincipal() user: UserPrincipal,
  ) {
    return this.cardService.assertCardBelongsTo(id, user).pipe(
      mergeMap((card) => {
        return this.cardService.updateCard(id, dto, user);
      }),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessGuard)
  public delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.cardService.delete(id);
  }
}
