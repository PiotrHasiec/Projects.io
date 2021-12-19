from django.db import models
from django.db.models.deletion import *
from django.db.models.enums import *
from django.db.models.fields import *
from django.db.models.fields.files import *
from django.db.models.fields.related import *
from django.core.validators import *
from django.contrib.auth.models import User


class Applications(models.Model):
    idAdvertisement = ForeignKey('Advertisements', on_delete=CASCADE, null=False)
    description = TextField(max_length=255)

    class AcceptionStates(TextChoices):
        PENDING = 'P', 'pending'
        ACCEPTED = 'A', 'accepted'
        REJECTED = 'R', 'rejected'

    acceptionState = CharField(
        choices=AcceptionStates.choices, default=AcceptionStates.PENDING)

    def __str__(self) -> str:
        return self.acceptionState

    class Meta:
        verbose_name = "Zgłoszenie"
        verbose_name_plural = "Zgłoszenia"


class Advertisements(models.Model):
    idProject = ForeignKey('Project', on_delete=CASCADE, null=False)
    idPosition = ForeignKey('Position', on_delete=SET_NULL)
    description = TextField(max_length=255)

    class Meta:
        verbose_name = "Ogłoszenie"
        verbose_name_plural = "Ogłoszenia"


class CollaboratorsProject(models.Model):
    idProject = ForeignKey('Project', primary_key=True,
                           on_delete=CASCADE, null=False)
    idUser = ForeignKey('Users', primary_key=True, on_delete=CASCADE, null=False)
    idPosition = ForeignKey('Positions', on_delete=SET_NULL)

    class Meta:
        verbose_name = "Twórca"
        verbose_name_plural = "Twórcy"


class Positions(models.Model):
    name = TextField(unique=True, null=False)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Stanowisko"
        verbose_name_plural = "Stanowiska"


class Projects(models.Model):
    idOwner = ForeignKey('Users', on_delete=SET_NULL)
    title = TextField(max_length=50, unique=True, null=False)

    class ProjectStages(TextChoices):
        BRAINSTORM = 'BS', 'BrainStorm'
        EARLYBIRD = 'EB', 'EarlyBird'
        PlayGround = 'PG', 'PlayGround'

    stage = CharField(choices=ProjectStages.choices,
                      default=ProjectStages.BRAINSTORM, null=False)
    description = TextField(max_length=255, null=False)
    folder = FilePathField(allow_folders=True)
    averageRate = DecimalField(max_digits=3, decimal_places=2)

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = "Projekt"
        verbose_name_plural = "Projekty"


class RatingProject(models.Model):
    idProject = ForeignKey('Project', primary_key=True,
                           on_delete=CASCADE, null=False)
    idUser = ForeignKey('Users', primary_key=True, on_delete=CASCADE, null=False)
    mark = IntegerField(null=False, validators=[
                        MaxValueValidator(5), MinValueValidator(0)])

    class Meta:
        verbose_name = "Ocena projektu"
        verbose_name_plural = "Oceny projektów"


class RatingUsers(models.Model):
    idRatedUser = ForeignKey('Users', primary_key=True,
                             on_delete=CASCADE, null=False)
    idUser = ForeignKey('Users', primary_key=True, on_delete=CASCADE, null=False)
    mark = IntegerField(null=False, validators=[
                        MaxValueValidator(5), MinValueValidator(0)])

    class Meta:
        verbose_name = "Ocena użytkownika"
        verbose_name_plural = "Oceny użytkowników"


class Roles(models.Model):
    name = TextField(unique=True, null=False)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Rola"
        verbose_name_plural = "Role"


class SkillsDeveloper(models.Model):
    idUser = ForeignKey('Users', primary_key=True, on_delete=CASCADE, null=False)
    Cpp = BooleanField(null=False, default=False)
    CSharp = BooleanField(null=False, default=False)

    def __str__(self) -> str:
        return self.idUser

    class Meta:
        verbose_name = "Umiejętności dewelopera"
        verbose_name_plural = "Umiejętności deweloperów"


class Users(models.Model):
    idRole = ForeignKey('Roles', on_delete=SET_DEFAULT, null=False, default=0)
    mail = EmailField(unique=True, null=False)
    name = TextField(max_length=50, unique=True, null=False)
    avatar = ImageField(width_field=255, height_field=255)
    description = TextField(max_length=255)
    averageRate = DecimalField(max_digits=3, decimal_places=2)
    owner= models.ForeignKey(User,related_name="users",on_delete=models.CASCADE, null = True)
    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Użytkownik"
        verbose_name_plural = "Użytkownicy"