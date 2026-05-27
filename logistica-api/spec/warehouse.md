# spec/warehouse.md — Tasks

## Tasks

- [ ] **Task 1:** Create warehouse app
      ```bash
      python manage.py startapp warehouse
      ```

- [ ] **Task 2:** Create model in `warehouse/models.py`
      - Table: `warehouse` (via `db_table` in Meta)
      - Fields (from database-schema.md):
        - `name` = CharField(max_length=255)
        - `code` = CharField(max_length=50, unique=True)
        - `address` = TextField(blank=True)
        - `city` = CharField(max_length=100, blank=True)
        - `country` = CharField(max_length=100, blank=True)
        - `capacity` = IntegerField(null=True, blank=True)
        - `is_active` = BooleanField(default=True)
        - `created_at` = DateTimeField(auto_now_add=True)
        - `updated_at` = DateTimeField(auto_now=True)
      - `def __str__(self): return self.name`
      - `class Meta: db_table = 'warehouse'; ordering = ['-created_at']; verbose_name = 'Warehouse'; verbose_name_plural = 'Warehouses'`

- [ ] **Task 3:** Create serializers in `warehouse/serializers.py`
      - `WarehouseListSerializer(ModelSerializer)` — fields: id, name, code, city, is_active
      - `WarehouseDetailSerializer(ModelSerializer)` — fields: `__all__`
      - `WarehouseCreateSerializer(ModelSerializer)` — fields: name, code, address, city, country, capacity, is_active

- [ ] **Task 4:** Create views in `warehouse/views.py`
      - `WarehouseViewSet(ModelViewSet)` with:
        - `queryset = Warehouse.objects.all()`
        - `get_serializer_class()` returning:
          - `list` → `WarehouseListSerializer`
          - `retrieve` → `WarehouseDetailSerializer`
          - `create` → `WarehouseCreateSerializer`
          - `update`/`partial_update` → `WarehouseCreateSerializer`
        - `permission_classes = [IsAdminOrReadOnly]` (imported from `core.permissions`)

- [ ] **Task 5:** Create urls in `warehouse/urls.py`
      - `router = DefaultRouter()` registering `WarehouseViewSet` with `basename='warehouse'`
      - `urlpatterns = router.urls`

- [ ] **Task 6:** Register in `warehouse/admin.py`
      - `@admin.register(Warehouse)` with `list_display`, `search_fields`, `list_filter`

- [ ] **Task 7:** Add `'warehouse'` to `INSTALLED_APPS` in `config/settings.py`

- [ ] **Task 8:** Include warehouse URLs in `config/urls.py`
      - Add `path('api/v1/warehouses/', include('warehouse.urls'))` to `urlpatterns`

- [ ] **Task 9:** Run makemigrations + migrate
      ```bash
      python manage.py makemigrations warehouse
      python manage.py migrate
      ```

- [ ] **Task 10:** Register in admin with full configuration
      - `list_display = ('name', 'code', 'city', 'capacity', 'is_active', 'created_at')`
      - `search_fields = ('name', 'code', 'city')`
      - `list_filter = ('is_active', 'city', 'country')`
