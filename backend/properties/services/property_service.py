from properties.repositories.external_property_repository import ExternalPropertyRepository
from typing import Dict, Any

class PropertyService:
    """
    Service layer that will validate different business rules for properties
    """
    
    def __init__(self, repository: ExternalPropertyRepository = None):
        self.external_property_repository = repository or ExternalPropertyRepository()
    
    def get_all_properties(self) -> Dict[str, Any]:
        """Get all properties from external service"""
        properties = self.external_property_repository.get_all_properties()
        return properties
