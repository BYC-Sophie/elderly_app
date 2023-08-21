from django.urls import path

from . import views

urlpatterns = [
    path("chatCompletion", views.chatCompletion, name="chatCompletion"),
    path("regenerate", views.regenerate, name="regenerate"),
]