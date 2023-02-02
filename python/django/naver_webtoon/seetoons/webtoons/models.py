from django.db import models

# Create your models here.
class Webtoons(models.Model):
    day = models.CharField(max_length=10)    
    title = models.CharField(max_length=80)
    img = models.TextField()

    def __str__(self):
        return self.title


