import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {TransferType} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class CreateTransferDto {
  /**
   * Type de transfert.
   * Définit la nature du transfert à effectuer.
   * @required
   */
  @ApiProperty({ enum: TransferType })
  @IsString({ message: 'Le type de transfert doit être une chaîne de caractères'})
  @IsNotEmpty({ message: 'Le type de transfert est requis'})
  @IsEnum(TransferType, { message: 'Le type de transfert doit être une valeur valide'})
  type: TransferType;
}
