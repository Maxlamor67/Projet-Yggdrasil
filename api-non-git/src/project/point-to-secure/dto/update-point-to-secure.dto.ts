import {OmitType, PartialType} from "@nestjs/swagger";
import {CreatePointToSecureDto} from "./create-point-to-secure.dto";

export class UpdatePointToSecureDto extends PartialType(CreatePointToSecureDto) {}
