from django.http import JsonResponse
from django.views import View

from properties.services.property_service import PropertyService
from properties.domain.schemas import AddressRequestInput
from shared.decorators.exceptions_decorator import handle_errors

class PropertyView(View):
    def __init__(self):
        super().__init__()
        self.property_service = PropertyService()

    @handle_errors("Get properties")
    def get(self, request):
        AddressRequestInput(
            address=request.GET.get('address')
        )

        properties = self.property_service.get_all_properties()
        
        return JsonResponse({"providers": properties})