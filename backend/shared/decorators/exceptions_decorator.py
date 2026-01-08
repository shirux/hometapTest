from functools import wraps
from shared.exceptions.shared_exceptions import BadRequestException
from django.http import JsonResponse


def handle_errors(operation_name: str):
    """Decorator to handle exceptions and return JSON responses"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except (BadRequestException) as e:
                return JsonResponse({"error": e.message}, status=e.status_code)
            except Exception as e:
                return JsonResponse({"error": f"An unexpected error ocurred during {operation_name}."}, status=500)
        return wrapper
    return decorator