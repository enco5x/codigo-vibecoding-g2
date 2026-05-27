# spec/driver.md — Tasks

## Tasks

- [ ] **Task 1:** Create driver app
      ```bash
      python manage.py startapp driver
      ```

- [ ] **Task 2:** Create model in `driver/models.py`
      - Table: `driver` (via `db_table` in Meta)
      - Fields (from database-schema.md §5):
        - `user` = OneToOneField(`'auth.User'`, `on_delete=models.SET_NULL`, `null=True`, `blank=True`, `related_name='driver_profile'`)
        - `license_number` = CharField(`max_length=50`)
        - `phone` = CharField(`max_length=20`, `blank=True`)
        - `email` = EmailField(`max_length=254`, `blank=True`)
        - `is_available` = BooleanField(`default=True`)
        - `created_at` = DateTimeField(`auto_now_add=True`)
        - `updated_at` = DateTimeField(`auto_now=True`)
      - `def __str__(self): return self.license_number`
      - `class Meta: db_table = 'driver'; ordering = ['-created_at']; verbose_name = 'Driver'; verbose_name_plural = 'Drivers'`

- [ ] **Task 3:** Create serializers in `driver/serializers.py`
      - `DriverListSerializer(ModelSerializer)` — fields: `id`, `license_number`, `phone`, `email`, `is_available`
      - `DriverDetailSerializer(ModelSerializer)` — fields: `'__all__'`
      - `DriverCreateSerializer(ModelSerializer)` — fields: `user`, `license_number`, `phone`, `email`, `is_available`

- [ ] **Task 4:** Create views in `driver/views.py`
      - `DriverViewSet(ModelViewSet)` with:
        - `queryset = Driver.objects.all()`
        - `get_serializer_class()` returning:
          - `list` → `DriverListSerializer`
          - `retrieve` → `DriverDetailSerializer`
          - `create` → `DriverCreateSerializer`
          - `update`/`partial_update` → `DriverCreateSerializer`
        - `permission_classes = [IsAdminOrReadOnly]` (imported from `core.permissions`)

- [ ] **Task 5:** Create urls in `driver/urls.py`
      - `router = DefaultRouter()` registering `DriverViewSet` with `basename='driver'`
      - `urlpatterns = router.urls`

- [ ] **Task 6:** Register in `driver/admin.py`
      - `@admin.register(Driver)` with `list_display`, `search_fields`, `list_filter`

- [ ] **Task 7:** Add `'driver'` to `INSTALLED_APPS` in `config/settings.py`

- [ ] **Task 8:** Include driver URLs in `config/urls.py`
      - Add `path('api/v1/drivers/', include('driver.urls'))` to `urlpatterns`

- [ ] **Task 9:** Run makemigrations + migrate
      ```bash
      python manage.py makemigrations driver
      python manage.py migrate
      ```

- [ ] **Task 10:** Register in admin with full configuration
      - `list_display = ('license_number', 'phone', 'email', 'is_available', 'created_at')`
      - `search_fields = ('license_number', 'phone', 'email')`
      - `list_filter = ('is_available',)`
