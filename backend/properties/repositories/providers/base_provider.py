from typing import Callable, Optional
import requests
from django.conf import settings

from shared.exceptions.shared_exceptions import MethodNotImplementedException, ProviderClassWithoutSerializerException
from properties.models import PropertyModel

class BaseProvider():
    """
    Repository to interact with an external property details API
    """
    
    def __init__(self, provider_id: None | int = None):
        self.base_url = f"{settings.EXTERNAL_PROPERTY_SERVICE['URL']}"
        self.api_key = f"{settings.EXTERNAL_PROPERTY_SERVICE['API_KEY']}"
        self.session = requests.Session()
        self.session.headers.update({
            'X-API-KEY': self.api_key,
            'Content-Type': 'application/json'
        })
        self.provider_id = provider_id
        self.property_data = None
        self.serializer: Optional[Callable[[dict, int], PropertyModel]] = None

    def serialize_property(self) -> PropertyModel:
        """
        Serialize the property data
        
        :return: Property Model standarized for responses
        """
        if not self.serializer:
            raise ProviderClassWithoutSerializerException('Serializer not yet implemented TODO')
        return self.serializer(self.property_data, self.provider_id)

    def set_serializer(self, serializer: Callable[[dict, int], PropertyModel]):
        """
        Set serializer for class
        
        :param serializer: Serializer Method to be instantiated
        """
        self.serializer = serializer

    def get_property_details(self) -> PropertyModel:
        """
        Fetch detailed property information from external API
        Returns:
            Optional[Dict]: The property details if found, else None
        """
        try:
            if not self.provider_id:
                raise MethodNotImplementedException(self.__class__, "get_property_details")
            response = self.session.get(
                f"{self.base_url}/provider-{self.provider_id}/property",
            )
            if response.status_code == 200:
                self.property_data = response.json()
                return self.serialize_property()
            else:
                response.raise_for_status() 
            
        except requests.exceptions.RequestException:
            raise

        