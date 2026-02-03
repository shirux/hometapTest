from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any, Dict, List

from properties.models import PropertyModel
from properties.repositories.providers.base_provider import BaseProvider
from properties.repositories.providers.provider_one import ProviderOne
from properties.repositories.providers.provider_two import ProviderTwo

class ExternalPropertyRepository():
    """
    Repository to interact with an external property details API
    """
    
    def __init__(self):
        self.providers: List[BaseProvider] = [ProviderOne, ProviderTwo]
        self.amount_of_providers = len(self.providers)
    
    def get_all_properties(self) -> Dict[str, Any]:
        """Retrieve all Properties from external API concurrently
        
        Args:
            amount_of_properties (int): Number of properties to fetch
        Returns:
            Dict[str, Any]: A dictionary with property details from all providers
        """
        properties = {}

        # Start thread pool
        with ThreadPoolExecutor(max_workers=self.amount_of_providers) as executor:
            future_to_provider = {}
            for i, ProviderClass in enumerate(self.providers):
                # Start Provider class and retrieve property data
                provider_instance: BaseProvider = ProviderClass(provider_id=i + 1)
                future = executor.submit(provider_instance.get_property_details)
                future_to_provider[future] = (provider_instance, i)

            # Attach to properties
            for future in as_completed(future_to_provider):
                provider_instance, index = future_to_provider[future]
                try:
                    property_data: PropertyModel = future.result()
                    if property_data:
                        properties[f"Provider {index + 1}"] = property_data.to_dict()
                except Exception as e:
                    raise
      
        return properties
