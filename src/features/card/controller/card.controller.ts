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
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { join } from 'path';
import { mergeMap, switchMap } from 'rxjs';
import {
  ImageFormatMismatchException,
  InvalidImageFormatException,
} from '../../../common/exceptions/image-upload.exceptions';
import { CardImageUploadInterceptor } from '../../../common/interceptors/card-img-upload.interceptor';
import { ParseObjectIdPipe } from '../../../common/pipe/parse-object-id.pipe';
import { GetUserPrincipal } from '../../auth/decorators/user-principal.decorator';
import { AccessGuard } from '../../auth/guards';
import { UserPrincipal } from '../../auth/interface/user-principal.interface';
import { CardDTO, CreateCardDTO } from '../dto/card.dto';
import { CardService } from '../service/card.service';
import {
  fileMatchesExtension,
  removeFile,
} from '../../../common/helpers/image-upload';
import { Response } from 'express';

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
    console.log({ dto });
    if (file) {
      if (!file.filename) throw new InvalidImageFormatException();
      const imagesPath = join(process.cwd(), 'public/images');
      const fullPath = imagesPath + '/' + file.filename;
      dto.backgroundImage = file.filename;
      return fileMatchesExtension(fullPath).pipe(
        switchMap((isLegit) => {
          if (!isLegit) {
            removeFile(fullPath);
            throw new ImageFormatMismatchException();
          }
          return this.cardService.create(dto, user);
        }),
      );
    } else {
      return this.cardService.create(dto, user);
    }
  }

  @Get()
  @UseGuards(AccessGuard)
  public getCardsByUser(
    @GetUserPrincipal() user: UserPrincipal,
    @Res() res: Response,
  ) {
    return this.cardService.getCardsByUser(user).pipe(
      switchMap((e) => {
        console.log();
        // e.forEach((card) => {
        //   if (card.backgroundImage) {
        //     res.sendFile(card.backgroundImage, {
        //       root: './images',
        //     });
        //   }
        // });
        return e;
      }),
    );
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
