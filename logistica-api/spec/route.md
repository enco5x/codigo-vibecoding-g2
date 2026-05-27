# spec/route.md — Tasks

## Tasks

- [ ] **Task 1:** Create route app
      ```bash
      python manage.py startapp route
      ```

- [ ] **Task 2:** Create models in `route/models.py`
      - **Route** (table: `route`):
        - `name` = CharField(`max_length=255`)
        - `transport` = ForeignKey(`'transport.Transport'`, `on_delete=models.SET_NULL`, `null=True`, `blank=True`, `related_name='routes'`)
        - `status` = CharField(`max_length=20`, `default='pending'`, `choices=Route.STATUS_CHOICES`)
        - `estimated_start` = DateTimeField(`null=True`, `blank=True`)
        - `actual_start` = DateTimeField(`null=True`, `blank=True`)
        - `estimated_end` = DateTimeField(`null=True`, `blank=True`)
        - `actual_end` = DateTimeField(`null=True`, `blank=True`)
        - `created_at` = DateTimeField(`auto_now_add=True`)
        - `updated_at` = DateTimeField(`auto_now=True`)
        - `STATUS_CHOICES = [('pending', 'Pending'), ('in_progress', 'In Progress'), ('completed', 'Completed')]`
        - `class Meta: db_table = 'route'; ordering = ['-created_at']; verbose_name = 'Route'; verbose_name_plural = 'Routes'`
        - `def __str__(self): return self.name`
      - **RouteStop** (table: `route_stop`):
        - `route` = ForeignKey(`'route.Route'`, `on_delete=models.CASCADE`, `related_name='stops'`)
        - `order` = IntegerField()
        - `address` = TextField(`blank=True`)
        - `city` = CharField(`max_length=100`, `blank=True`)
        - `estimated_arrival` = DateTimeField(`null=True`, `blank=True`)
        - `actual_arrival` = DateTimeField(`null=True`, `blank=True`)
        - `status` = CharField(`max_length=20`, `default='pending'`, `choices=RouteStop.STATUS_CHOICES`)
        - `notes` = TextField(`blank=True`)
        - `STATUS_CHOICES = [('pending', 'Pending'), ('arrived', 'Arrived'), ('completed', 'Completed')]`
        - `class Meta: db_table = 'route_stop'; ordering = ['order']; verbose_name = 'Route Stop'; verbose_name_plural = 'Route Stops'`
        - `def __str__(self): return f"{self.route.name} - Stop {self.order}"`

- [ ] **Task 3:** Create serializers in `route/serializers.py`
      - `RouteStopSerializer(ModelSerializer)` — fields: `'__all__'`
      - `RouteListSerializer(ModelSerializer)` — fields: `id`, `name`, `transport_id`, `status`, `estimated_start`, `estimated_end`, `created_at`
        - `transport_plate` = SerializerMethodField (readonly, returns `transport.plate_number` if transport exists)
      - `RouteDetailSerializer(ModelSerializer)` — fields: `'__all__'`, plus `stops = RouteStopSerializer(many=True, read_only=True)`
      - `RouteCreateSerializer(ModelSerializer)` — fields: `name`, `transport`, `estimated_start`, `estimated_end`

- [ ] **Task 4:** Create views in `route/views.py`
      - `RouteViewSet(ModelViewSet)` with:
        - `queryset = Route.objects.all()`
        - `permission_classes = [IsAdminOrReadOnly]` (imported from `core.permissions`)
        - `get_serializer_class()` returning:
          - `list` → `RouteListSerializer`
          - `retrieve` → `RouteDetailSerializer`
          - `create` → `RouteCreateSerializer`
          - `update`/`partial_update` → `RouteCreateSerializer`
        - **Custom actions (nested stops):**
          - `@action(detail=True, methods=['get'], url_path='stops')` → `list_stops(self, request, pk=None)` — returns `RouteStopSerializer(stops, many=True).data`
          - `@action(detail=True, methods=['post'], url_path='stops')` → `add_stop(self, request, pk=None)` — creates `RouteStop` for the route using `RouteStopSerializer(data=request.data)`, sets `route` from URL
          - `@action(detail=True, methods=['put'], url_path='stops/(?P<stop_id>[^/.]+)')` → `update_stop(self, request, pk=None, stop_id=None)` — updates specific stop via `RouteStopSerializer`

- [ ] **Task 5:** Create urls in `route/urls.py`
      - `router = DefaultRouter()` registering `RouteViewSet` with `basename='route'`
      - `urlpatterns = router.urls`

- [ ] **Task 6:** Register both models in `route/admin.py`
      - `@admin.register(Route)` with `list_display = ('name', 'transport', 'status', 'estimated_start', 'estimated_end', 'created_at')`; `search_fields = ('name',)`; `list_filter = ('status',)`
      - `@admin.register(RouteStop)` with `list_display = ('route', 'order', 'address', 'city', 'status')`; `list_filter = ('status',)`

- [ ] **Task 7:** Add `'route'` to `INSTALLED_APPS` in `config/settings.py`

- [ ] **Task 8:** Include route URLs in `config/urls.py`
      - Add `path('api/v1/routes/', include('route.urls'))` to `urlpatterns`

- [ ] **Task 9:** Create `route/services.py` with stub `RouteService` class
      ```python
      class RouteService:
          @staticmethod
          def start_route(route):
              pass

          @staticmethod
          def complete_route(route):
              pass

          @staticmethod
          def arrive_at_stop(stop):
              pass
      ```

- [ ] **Task 10:** Run makemigrations + migrate
      ```bash
      python manage.py makemigrations route
      python manage.py migrate
      ```
