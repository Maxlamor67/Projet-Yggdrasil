import {CreateGeometryDto} from "./create-geometry.dto";
import {OmitType, PartialType} from "@nestjs/swagger";

export class UpdateGeometryDto extends PartialType(OmitType(CreateGeometryDto, ['type'])) {}