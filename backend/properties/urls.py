from django.urls import path
from properties import views

urlpatterns = [
    path('', views.PropertyView.as_view(), name='property_view'),
]