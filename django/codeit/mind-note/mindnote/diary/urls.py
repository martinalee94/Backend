from django.urls import path, include
from . import views

urlpatterns = [
    path('diary/', views.page_list, name='page-list'),
    path('diary/info/', views.info, name='info'),
    # path('diary/writes/', views.page_create, name='page-create'),
    path('diary/page/<int:page_id>/', views.page_detail, name='page-detail'),
    # path('diary/page/<int:page_id>/edit/', views.page_update, name='page-edit'),
    # path('diary/page/<int:page_id>/delete/', views.page_delete, name='page-delete'),
]