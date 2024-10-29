import { Entity, Column, ManyToOne } from 'typeorm';
import { Pet } from './pet.entity';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Health extends BaseEntity {
  @ApiProperty({ description: '건강 기록의 고유 ID' })
  healthId: string;

  @ApiProperty({ description: '반려동물 ID', type: () => Pet })
  @ManyToOne(() => Pet, (pet) => pet.healthRecords)
  pet: Pet;

  @ApiProperty({ description: '건강 기록 설명 (JSON 형식)' })
  @Column('json')
  description: string;
}