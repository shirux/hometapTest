class BadRequestException(Exception):
    def __init__(self, message="Bad Request"):
        """Exception raised for bad requests."""
        self.message = message
        self.status_code = 400
        super().__init__(self.message)

class InternalServerException(Exception):
    def __init__(self, message="Internal Server Error"):
        """Exception raised for internal server errors."""
        self.message = message
        self.status_code = 500
        super().__init__(self.message)

class MethodNotImplementedException(InternalServerException):
    def __init__(self, class_name: str, method_name: str, message="Method not yet implemented."):
        """Exception raised for when a method is not yet implemented."""
        self.class_name = class_name
        self.method_name = method_name
        self.message = message
        super().__init__(self.message)

class ProviderClassWithoutSerializerException(InternalServerException):
    def __init__(self, class_name: str):
        """Exception raised for when a serializer is missing."""
        self.class_name = class_name
        super().__init__()