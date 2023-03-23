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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { mergeMap, switchMap, tap } from 'rxjs';
import { CardImageUploadInterceptor } from '../../../common/interceptors/card-img-upload.interceptor';
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
  @UseInterceptors(CardImageUploadInterceptor)
  public create(
    @Body() dto: CreateCardDTO,
    @GetUserPrincipal() user: UserPrincipal,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cardService.validateImage(dto, file).pipe(
      switchMap((dto) => this.cardService.validateImage(dto, file)),
      switchMap((newDto) => this.cardService.create(newDto, user)),
    );
  }

  @Get()
  @UseGuards(AccessGuard)
  public getCardsByUser(@GetUserPrincipal() user: UserPrincipal) {
    return this.cardService.getCardsByUser(user);
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseInterceptors(CardImageUploadInterceptor)
  public update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: CardDTO,
    @GetUserPrincipal() user: UserPrincipal,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cardService.assertCardBelongsTo(id, user).pipe(
      switchMap((_) => this.cardService.validateImage(dto, file)),
      switchMap((newDto) => this.cardService.updateCard(id, newDto, user)),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessGuard)
  public delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.cardService.delete(id);
  }
}
