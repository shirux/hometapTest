import { formatCurrency, formatNumber } from "../helpers";
import { IPropertyModel } from "../interfaces";

type PropertyKey = keyof Omit<IPropertyModel, "order">;
type PropertyConfig = {
  key: PropertyKey;
  label: string;
  format?: (value: any) => string;
};

export class PropertyModel implements IPropertyModel {
  normalizedAddress: string = "N/A";
  squareFootage?: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  roomCount?: number;
  septicSystem?: boolean;
  salePrice?: number;
  order: number = 0;

  constructor(data: IPropertyModel) {
    Object.assign(this, data);
  }

  private static formatters: Record<PropertyKey, (value: any) => string> = {
    normalizedAddress: (v) => (v !== null ? v.toString() : "N/A"),
    squareFootage: (v) => formatNumber(v),
    lotSize: (v) => (v != null ? v.toString() : "N/A"),
    yearBuilt: (v) => (v != null ? v.toString() : "N/A"),
    propertyType: (v) => v || "N/A",
    bedrooms: (v) => (v != null ? v.toString() : "N/A"),
    bathrooms: (v) => (v != null ? v.toString() : "N/A"),
    roomCount: (v) => (v != null ? v.toString() : "N/A"),
    septicSystem: (v) => (v != null ? (v ? "Yes" : "No") : "N/A"),
    salePrice: (v) => formatCurrency(v),
  };

  format(key: PropertyKey): string {
    const value = this[key];
    const formatter = PropertyModel.formatters[key];
    return formatter ? formatter(value) : "N/A";
  }

  static getPropertyConfigs(): PropertyConfig[] {
    return [
      { key: "squareFootage", label: "Square Footage" },
      { key: "lotSize", label: "Lot Size (Acres)" },
      { key: "yearBuilt", label: "Year Built" },
      { key: "propertyType", label: "Property Type" },
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "roomCount", label: "Room Count" },
      { key: "septicSystem", label: "Septic System" },
      { key: "salePrice", label: "Sale Price" },
    ];
  }
}
