from django.db import models
from django.contrib.auth.models import User

class StandardUser(models.Model):
    name = models.CharField(max_length=40)
   # created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Użytkownik"
        verbose_name_plural = "Użytkownicy"

class Developer(StandardUser):

  class Meta:
        verbose_name = "Deweloper"
        verbose_name_plural = "Deweloperzy"


class Category(models.Model):
    name = models.CharField(max_length=20)
    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Kategoria"
        verbose_name_plural = "Kategorie"

# Create your models here.
class Project(models.Model):
    title = models.CharField(max_length=40)
    category = models.ForeignKey(Category,null=True,blank=True,on_delete=models.CASCADE)
    Description=models.TextField(blank = True)
    author = models.ForeignKey(StandardUser,on_delete=models.CASCADE,null=True)
    def __str__ (self):
        return self.title

    class Meta:
        verbose_name = "Projekt"
        verbose_name_plural = "Projekty"

