# spec/supplier.md — Tasks

## Tasks

- [ ] **Task 1:** Create supplier app
      ```bash
      python manage.py startapp supplier
      ```

- [ ] **Task 2:** Create model in `supplier/models.py`
      - Table: `supplier` (via `db_table` in Meta)
      - Fields (from database-schema.md):
        - `company_name` = CharField(max_length=255)
        - `contact_name` = CharField(max_length=255, blank=True)
        - `email` = EmailField(max_length=254, blank=True)
        - `phone` = CharField(max_length=20, blank=True)
        - `address` = TextField(blank=True)
        - `city` = CharField(max_length=100, blank=True)
        - `country` = CharField(max_length=100, blank=True)
        - `created_at` = DateTimeField(auto_now_add=True)
        - `updated_at` = DateTimeField(auto_now=True)
      - `def __str__(self): return self.company_name`
      - `class Meta: db_table = 'supplier'; ordering = ['-created_at']; verbose_name = 'Supplier'; verbose_name_plural = 'Suppliers'`

- [ ] **Task 3:** Create serializers in `supplier/serializers.py`
      - `SupplierListSerializer(ModelSerializer)` — fields: id, company_name, contact_name, email, city
      - `SupplierDetailSerializer(ModelSerializer)` — fields: `__all__`
      - `SupplierCreateSerializer(ModelSerializer)` — fields: company_name, contact_name, email, phone, address, city, country

- [ ] **Task 4:** Create views in `supplier/views.py`
      - `SupplierViewSet(ModelViewSet)` with:
        - `queryset = Supplier.objects.all()`
        - `get_serializer_class()` returning:
          - `list` → `SupplierListSerializer`
          - `retrieve` → `SupplierDetailSerializer`
          - `create` → `SupplierCreateSerializer`
          - `update`/`partial_update` → `SupplierCreateSerializer`
        - `permission_classes = [IsAdminOrReadOnly]` (imported from `core.permissions`)

- [ ] **Task 5:** Create urls in `supplier/urls.py`
      - `router = DefaultRouter()` registering `SupplierViewSet` with `basename='supplier'`
      - `urlpatterns = router.urls`

- [ ] **Task 6:** Register in `supplier/admin.py`
      - `@admin.register(Supplier)` with `list_display`, `search_fields`, `list_filter`

- [ ] **Task 7:** Add `'supplier'` to `INSTALLED_APPS` in `config/settings.py`

- [ ] **Task 8:** Include supplier URLs in `config/urls.py`
      - Add `path('api/v1/suppliers/', include('supplier.urls'))` to `urlpatterns`

- [ ] **Task 9:** Run makemigrations + migrate
      ```bash
      python manage.py makemigrations supplier
      python manage.py migrate
      ```

- [ ] **Task 10:** Register in admin with full configuration
      - `list_display = ('company_name', 'contact_name', 'email', 'city', 'created_at')`
      - `search_fields = ('company_name', 'contact_name', 'email')`
      - `list_filter = ('city', 'country')`
