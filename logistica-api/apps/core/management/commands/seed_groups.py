from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group


class Command(BaseCommand):
    help = 'Seed default user groups'

    def handle(self, *args, **options):
        groups = [
            ('admin', 'Full CRUD on all modules'),
            ('manager', 'CRUD shipments, routes, transports'),
            ('driver', 'View assigned routes, update delivery status'),
            ('customer', 'View own shipments only'),
        ]

        for name, description in groups:
            group, created = Group.objects.get_or_create(name=name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Group "{name}" created'))
            else:
                self.stdout.write(self.style.WARNING(f'Group "{name}" already exists'))
