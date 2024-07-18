import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDate()
  nextRun: Date;

  @IsNotEmpty()
  @IsString()
  cronTime: string;
  
  @IsOptional()
  config?: Record<string, any>;
}