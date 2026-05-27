# spec/transport.md — Tasks

## Tasks

- [ ] **Task 1:** Create transport app
      ```bash
      python manage.py startapp transport
      ```

- [ ] **Task 2:** Create model in `transport/models.py`
      - Table: `transport` (via `db_table` in Meta)
      - Fields (from database-schema.md §6):
        - `plate_number` = CharField(`max_length=20`, `unique=True`)
        - `vehicle_type` = CharField(`max_length=50`, `blank=True`)
        - `vehicle_model` = CharField(`max_length=100`, `blank=True`, `db_column='model'`) — field named `vehicle_model` to avoid shadowing Django's built-in `model` attribute; `db_column='model'` to match exact table column
        - `capacity_kg` = DecimalField(`max_digits=10`, `decimal_places=2`, `null=True`, `blank=True`)
        - `is_available` = BooleanField(`default=True`)
        - `driver` = ForeignKey(`'driver.Driver'`, `on_delete=models.SET_NULL`, `null=True`, `blank=True`, `related_name='transports'`)
        - `created_at` = DateTimeField(`auto_now_add=True`)
        - `updated_at` = DateTimeField(`auto_now=True`)
      - `def __str__(self): return self.plate_number`
      - `class Meta: db_table = 'transport'; ordering = ['-created_at']; verbose_name = 'Transport'; verbose_name_plural = 'Transports'`

- [ ] **Task 3:** Create serializers in `transport/serializers.py`
      - `TransportListSerializer(ModelSerializer)` — fields: `id`, `plate_number`, `vehicle_type`, `vehicle_model`, `driver_name` (readonly, source=`'driver.license_number'`), `is_available`
      - `TransportDetailSerializer(ModelSerializer)` — fields: `'__all__'`
      - `TransportCreateSerializer(ModelSerializer)` — fields: `plate_number`, `vehicle_type`, `vehicle_model`, `capacity_kg`, `is_available`, `driver`

- [ ] **Task 4:** Create views in `transport/views.py`
      - `TransportViewSet(ModelViewSet)` with:
        - `queryset = Transport.objects.all()`
        - `get_serializer_class()` returning:
          - `list` → `TransportListSerializer`
          - `retrieve` → `TransportDetailSerializer`
          - `create` → `TransportCreateSerializer`
          - `update`/`partial_update` → `TransportCreateSerializer`
        - `permission_classes = [IsAdminOrReadOnly]` (imported from `core.permissions`)

- [ ] **Task 5:** Create urls in `transport/urls.py`
      - `router = DefaultRouter()` registering `TransportViewSet` with `basename='transport'`
      - `urlpatterns = router.urls`

- [ ] **Task 6:** Register in `transport/admin.py`
      - `@admin.register(Transport)` with `list_display`, `search_fields`, `list_filter`

- [ ] **Task 7:** Add `'transport'` to `INSTALLED_APPS` in `config/settings.py`

- [ ] **Task 8:** Include transport URLs in `config/urls.py`
      - Add `path('api/v1/transports/', include('transport.urls'))` to `urlpatterns`

- [ ] **Task 9:** Run makemigrations + migrate
      ```bash
      python manage.py makemigrations transport
      python manage.py migrate
      ```

- [ ] **Task 10:** Register in admin with full configuration
      - `list_display = ('plate_number', 'vehicle_type', 'vehicle_model', 'capacity_kg', 'is_available', 'driver', 'created_at')`
      - `search_fields = ('plate_number', 'vehicle_type', 'vehicle_model')`
      - `list_filter = ('vehicle_type', 'is_available')`
