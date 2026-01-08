from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from django.conf import settings

from typing import Any, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class ExternalPropertyRepository():
    """
    Repository to interact with an external property details API
    """
    
    def __init__(self):
        self.base_url = f"{settings.EXTERNAL_PROPERTY_SERVICE['URL']}"
        self.api_key = f"{settings.EXTERNAL_PROPERTY_SERVICE['API_KEY']}"
        self.session = requests.Session()
        self.session.headers.update({
            'X-API-KEY': self.api_key,
            'Content-Type': 'application/json'
        })
    
    def get_all_properties(self, amount_of_properties: int = 0) -> Dict[str, Any]:
        """Retrieve all Properties from external API concurrently
        
        Args:
            amount_of_properties (int): Number of properties to fetch
        Returns:
            Dict[str, Any]: A dictionary with property details from all providers
        """
        if amount_of_properties == 0:
            return {}

        properties = {}
        with ThreadPoolExecutor(max_workers=amount_of_properties) as executor:
            future_property = {
                executor.submit(self.get_property_details, str(i)): i
                for i in range(1, amount_of_properties + 1)
            }

            for future in as_completed(future_property):
                try:
                    property_data = future.result()
                    if property_data and property_data.get("data"):
                        properties[f"Provider {future_property[future]}"] = property_data.get("data")
                        # Set an order based on the pooling sequence.
                        properties[f"Provider {future_property[future]}"]['order'] = future_property[future]
                except Exception:
                    raise

        return properties

    def get_property_details(self, property_id: str) -> Optional[Dict]:
        """
        Fetch detailed property information from external API
        Args:
            property_id (str): The ID of the property to fetch
        Returns:
            Optional[Dict]: The property details if found, else None
        """
        try:
            response = self.session.get(
                f"{self.base_url}/provider-{property_id}/property",
            )
            if response.status_code == 200:
                return response.json()
            else:
                response.raise_for_status() 
            
        except requests.exceptions.RequestException:
            raise
