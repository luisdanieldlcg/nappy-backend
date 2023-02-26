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
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { mergeMap } from 'rxjs';
import { InvalidCredentialsException } from '../../../common/exceptions/invalid-credentials.exception';
import { ImageFormatMismatchException } from '../../../common/exceptions/image-upload.exceptions';
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
    console.log({ file });
    if (!file || !file.filename) {
      throw new ImageFormatMismatchException();
    }
    const imagesPath = join(process.cwd(), 'images');
    const fullPath = imagesPath + '/' + file.filename;
    console.log(fullPath);
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
