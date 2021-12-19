from django.contrib import admin

from .models import  Projects, Users

# Register your models here.
#@admin.register(Projects)
#class ProjectAdmin(admin.ModelAdmin):
##    list_display = ('__all__')

admin.site.register(Projects)
admin.site.register(Users)
#@admin.register( Users)
#class UsersAdmin(admin.ModelAdmin):
 #   list_display = ('__all__')



