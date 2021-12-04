from django.db import models

# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length = 50, unique=True, error_messages={'unique':'이미있는제목이네요!'})
    content = models.TextField()
    dt_created = models.DateTimeField(verbose_name = 'Date created', auto_now_add=True) #별명붙이기!, first created time
    dt_modified = models.DateTimeField(verbose_name='Date modified', auto_now=True) #last modified moment

    def __str__(self):
        return self.title