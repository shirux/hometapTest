class BadRequestException(Exception):
    def __init__(self, message="Bad Request"):
        """Exception raised for bad requests."""
        self.message = message
        self.status_code = 400
        super().__init__(self.message)
