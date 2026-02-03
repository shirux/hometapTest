from properties.models import PropertyModel
from properties.repositories.providers.base_provider import BaseProvider

class ProviderOne(BaseProvider):
    """
    Repository to interact with an external property details API
    """
    
    def __init__(self, provider_id: int):
        super().__init__(provider_id)
        self.set_serializer(PropertyModel.serializeProviderOne)
