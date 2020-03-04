import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Department} from './department.model';
import {Address, AddressRelations} from './address.model';

@model()
export class Student extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  first_name: string;

  @property({
    type: 'string',
    required: true,
  })
  last_name: string;

  @property({
    type: 'number',
  })
  courseId?: number;

  @belongsTo(() => Department)
  departmentId: number;

  /*@hasOne(() => Address)
  address: Address;*/

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
  //address?: AddressRelations;
}

export type StudentWithRelations = Student & StudentRelations;
