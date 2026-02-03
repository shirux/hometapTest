from pydantic import BaseModel
class PropertyModel(BaseModel):
    model_config = {"extra": "ignore"}

    normalizedAddress: str | None = None
    squareFootage: int | None = None
    lotSize: float | None = None
    yearBuilt: int | None = None
    propertyType: str | None = None
    bedrooms: int | None = None
    bathrooms: int | None = None
    roomCount: int | None = None
    septicSystem: bool | None = None
    salePrice: int | None = None
    order: int = 0

    @staticmethod
    def serializeProviderOne(data: dict, order: int) -> "PropertyModel":
        """
        Serialize data for Provider one
        
        :param data: Raw Property data from provider one response
        :param order: Order on which the provider should appear on the tables
        :return: PropertyModel serialized 
        """
        property_data = data.get("data", {})
        features = property_data.get("features", {})
        
        parsed_data = {
            "normalizedAddress": property_data.get("formattedAddress"),
            "squareFootage": property_data.get("squareFootage"),
            "lotSize": property_data.get("lotSizeSqFt"),
            "yearBuilt": property_data.get("yearBuilt"),
            "propertyType": property_data.get("propertyType"),
            "bedrooms": property_data.get("bedrooms"),
            "bathrooms": property_data.get("bathrooms"),
            "roomCount": features.get("roomCount"),
            "septicSystem": features.get("septicSystem"),
            "salePrice": property_data.get("lastSalePrice"),
        }
    
        return PropertyModel(**parsed_data, order=order)

    @staticmethod
    def serializeProviderTwo(data: dict, order: int) -> "PropertyModel":
        """
        Serialize data for Provider two
        
        :param data: Raw Property data from provider one response
        :param order: Order on which the provider should appear on the tables
        :return: PropertyModel serialized 
        """
        property_data = data.get("data", {})
        
        parsed_data = {
            "normalizedAddress": property_data.get("NormalizedAddress"),
            "squareFootage": property_data.get("SquareFootage"),
            "lotSize": property_data.get("LotSizeAcres") * 1000 if property_data.get("LotSizeAcres") else None,
            "yearBuilt": property_data.get("YearConstructed"),
            "propertyType": property_data.get("PropertyType"),
            "bedrooms": property_data.get("Bedrooms"),
            "bathrooms": property_data.get("Bathrooms"),
            "roomCount": property_data.get("RoomCount"),
            "septicSystem": property_data.get("SepticSystem"),
            "salePrice": property_data.get("SalePrice"),
        }
        
        return PropertyModel(**parsed_data, order=order)
    
    def to_dict(self) -> dict:
        """
        Custom to dict method. 
        """
        return {
            "normalizedAddress": self.normalizedAddress,
            "squareFootage": self.squareFootage,
            "lotSize": self.lotSize,
            "yearBuilt": self.yearBuilt,
            "propertyType": self.propertyType,
            "bedrooms": self.bedrooms,
            "bathrooms": self.bathrooms,
            "roomCount": self.roomCount,
            "septicSystem": self.septicSystem,
            "salePrice": self.salePrice,
            "order": self.order
        }