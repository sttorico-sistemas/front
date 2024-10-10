export abstract class BaseModel {
  abstract toRecord(): Record<string, any>;
}