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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { switchMap, tap } from 'rxjs';
import { CardImagesInterceptor } from '../../../common/interceptors/card-img-upload.interceptor';
import { ParseObjectIdPipe } from '../../../common/pipe/parse-object-id.pipe';
import { UploadedCardImages } from '../../../common/types';
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
  @UseInterceptors(CardImagesInterceptor)
  public create(
    @Body() dto: CreateCardDTO,
    @GetUserPrincipal() user: UserPrincipal,
    @UploadedFiles() images: UploadedCardImages,
  ) {
    return this.cardService
      .validateImages(dto, images)
      .pipe(switchMap((newDto) => this.cardService.create(newDto, user)));
  }

  @Get()
  @UseGuards(AccessGuard)
  public getCardsByUser(@GetUserPrincipal() user: UserPrincipal) {
    return this.cardService.getCardsByUser(user);
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseInterceptors(CardImagesInterceptor)
  public update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: CardDTO,
    @GetUserPrincipal() user: UserPrincipal,
    @UploadedFiles() images: UploadedCardImages,
  ) {
    return this.cardService.assertCardBelongsTo(id, user).pipe(
      switchMap((_) => this.cardService.validateImages(dto, images)),
      switchMap((newDto) => this.cardService.updateCard(id, newDto, user)),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessGuard)
  public delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.cardService.delete(id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessGuard)
  public deleteAll(@GetUserPrincipal() user: UserPrincipal) {
    return this.cardService.deleteAll(user);
  }
}
