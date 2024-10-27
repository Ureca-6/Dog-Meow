import { Entity, Column, ManyToOne } from 'typeorm';
import { Pet } from './pet.entity';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Allergy extends BaseEntity {
  @ApiProperty({ description: '알레르기의 고유 ID' })
  allergy_id: number;

  @ApiProperty({ description: '반려동물 ID', type: () => Pet })
  @ManyToOne(() => Pet, (pet) => pet.allergies)
  pet: Pet;

  @ApiProperty({ description: '알레르기 유형' })
  @Column()
  allergy_type: string;
}
