from properties.exceptions import InvalidAddressException
from pydantic import BaseModel, Field, field_validator

class AddressRequestInput(BaseModel):
    address: str = Field(..., min_length=1, description="Address is required")
    
    @field_validator('address', mode='before')
    @classmethod
    def validate_address_not_empty(cls, v: str) -> str:
        if not v or (isinstance(v, str) and not v.strip()):
            raise InvalidAddressException("Address cannot be empty or whitespace")
        return v.strip()
    
