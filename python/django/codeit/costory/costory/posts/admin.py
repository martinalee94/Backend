from django.contrib import admin
from .models import Post

# python manage.py createsuperuser
# Register your models here.
admin.site.register(Post)