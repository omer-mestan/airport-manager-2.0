from django.contrib import admin

from apps.crews.models import CrewProfile


@admin.register(CrewProfile)
class CrewProfileAdmin(admin.ModelAdmin):
    list_display = ("employee_id", "user", "position")
    search_fields = ("employee_id", "user__email", "user__full_name")

# Register your models here.
