from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.
admin.site.register(User, UserAdmin)
UserAdmin.fieldsets += (('Custom fields', {'fields': ('nickname', )}), ) #custom으로 추가한 필드는 admin에 따로 추가