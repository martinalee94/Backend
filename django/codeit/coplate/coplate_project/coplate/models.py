from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):
    def __str__(self):
        return self.email #username말고 email을 필수값으로했을떄