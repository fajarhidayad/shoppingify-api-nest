import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsService],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should accept an item object argument for creating an item', async () => {
      const createdItem = service.create({});

      expect(createdItem).toEqual(item);
      expect(createdItem).toHaveProperty('id', 1);
      expect(createdItem).toHaveProperty('name', 'Avocado');
      expect(createdItem).toHaveProperty('category', 'Fruit');
    });

    it('should throw an error if the argument is invalid', async () => {
      const invalidItem = { id: '', name: '' };

      expect(() => service.create(invalidItem)).toThrow(Error);
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const items = await service.findAll();
      expect(items).toBeDefined();
    });
  });

  describe('findById', () => {});

  describe('update', () => {});

  describe('delete', () => {});
});
