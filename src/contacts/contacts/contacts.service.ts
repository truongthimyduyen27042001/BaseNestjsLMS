import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './contacts.entity';
import { Repository } from 'typeorm';
import type { UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private contactRespository: Repository<Contact>,
  ) {}

  async findAll(): Promise<Contact[]> {
    return await this.contactRespository.find();
  }

  async create(contact: Contact): Promise<Contact> {
    return await this.contactRespository.save(contact);
  }

  async update(id: number, contact: Contact): Promise<UpdateResult> {
    return await this.contactRespository.update(id, contact);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.contactRespository.delete(id);
  }
}
