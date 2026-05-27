# spec/customer.md — Tasks

## Tasks

- [ ] **Task 1:** Create customer app
      ```bash
      python manage.py startapp customer
      ```

- [ ] **Task 2:** Create model in `customer/models.py`
      - Table: `customer` (via `db_table` in Meta)
      - Fields (from database-schema.md):
        - `user` = OneToOneField to `auth.User` (`on_delete=SET_NULL, null=True, blank=True, related_name='customer_profile'`)
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
      - `class Meta: db_table = 'customer'; ordering = ['-created_at']; verbose_name = 'Customer'; verbose_name_plural = 'Customers'`

- [ ] **Task 3:** Create serializers in `customer/serializers.py`
      - `CustomerListSerializer(ModelSerializer)` — fields: id, company_name, contact_name, email, city, is_active (if applicable — note: customer has no is_active field per schema, omit)
      - `CustomerDetailSerializer(ModelSerializer)` — fields: `__all__` (all model fields)
      - `CustomerCreateSerializer(ModelSerializer)` — fields: user, company_name, contact_name, email, phone, address, city, country

- [ ] **Task 4:** Create views in `customer/views.py`
      - `CustomerViewSet(ModelViewSet)` with:
        - `queryset = Customer.objects.all()`
        - `get_serializer_class()` returning:
          - `list` → `CustomerListSerializer`
          - `retrieve` → `CustomerDetailSerializer`
          - `create` → `CustomerCreateSerializer`
          - `update`/`partial_update` → `CustomerCreateSerializer`
        - `permission_classes = [IsAdminOrReadOnly]` (imported from `core.permissions`)

- [ ] **Task 5:** Create urls in `customer/urls.py`
      - `router = DefaultRouter()` registering `CustomerViewSet` with `basename='customer'`
      - `urlpatterns = router.urls`

- [ ] **Task 6:** Register in `customer/admin.py`
      - `@admin.register(Customer)` with `list_display`, `search_fields`, `list_filter`

- [ ] **Task 7:** Add `'customer'` to `INSTALLED_APPS` in `config/settings.py`

- [ ] **Task 8:** Include customer URLs in `config/urls.py`
      - Add `path('api/v1/customers/', include('customer.urls'))` to `urlpatterns`

- [ ] **Task 9:** Run makemigrations + migrate
      ```bash
      python manage.py makemigrations customer
      python manage.py migrate
      ```

- [ ] **Task 10:** Register in admin with full configuration
      - `list_display = ('company_name', 'contact_name', 'email', 'city', 'created_at')`
      - `search_fields = ('company_name', 'contact_name', 'email')`
      - `list_filter = ('city', 'country')`
