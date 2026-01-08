from shared.exceptions.shared_exceptions import BadRequestException

class InvalidAddressException(BadRequestException):
    def __init__(self, message="Invalid Address Provided"):
        """Custom Exception  raised for invalid address inputs."""
        self.message = message
        self.status_code = 400
        super().__init__(self.message)