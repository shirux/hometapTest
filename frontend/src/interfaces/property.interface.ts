export interface IPropertyModel {
  normalizedAddress: string;
  squareFootage?: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  roomCount?: number;
  septicSystem?: boolean;
  salePrice?: number;
  order: number;
}
