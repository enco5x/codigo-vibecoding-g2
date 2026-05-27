# spec/core.md — Core + Auth Setup

## Tasks

### Task 1: Add dependencies to requirements.txt
Agregar:
```
djangorestframework>=3.15
djangorestframework-simplejwt>=5.3
django-cors-headers>=4.3
drf-spectacular>=0.27
```

### Task 2: Create core app
```bash
python manage.py startapp core
```

### Task 3: Configure INSTALLED_APPS in settings.py
Agregar al final de `INSTALLED_APPS`:
```python
'rest_framework',
'rest_framework_simplejwt',
'corsheaders',
'drf_spectacular',
'core',
```
Y agregar `'corsheaders.middleware.CorsMiddleware'` al inicio de `MIDDLEWARE`.

### Task 4: Configure REST_FRAMEWORK with JWT auth
En `settings.py`:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

### Task 5: Configure SIMPLE_JWT settings
```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

### Task 6: Configure CORS headers
```python
CORS_ALLOW_ALL_ORIGINS = True
```
Opcional: restringir en producción.

### Task 7: Configure drf-spectacular for API docs
```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'Logistica API',
    'DESCRIPTION': 'API REST para gestión de logística y envíos',
    'VERSION': '1.0.0',
}
```

### Task 8: Create core/permissions.py with role classes

Crear:
- `IsAdmin` — usuario en grupo "admin"
- `IsManager` — usuario en grupo "manager"
- `IsDriver` — usuario en grupo "driver"
- `IsCustomer` — usuario en grupo "customer"
- `IsAdminOrManager` — admin o manager
- `IsAdminOrReadOnly` — admin full, resto read-only

Todas basadas en `request.user.groups.filter(name=...).exists()`.

### Task 9: Configure auth URLs

En `config/urls.py`:
```python
path('api/v1/auth/', include('core.urls')),
```

En `core/urls.py`:
```python
path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
path('logout/', LogoutView.as_view(), name='logout'),
```

### Task 10: Create management command to seed default groups

Crear `core/management/commands/seed_groups.py` que cree los grupos:
- `admin` — full CRUD
- `manager` — CRUD shipments, routes, transports
- `driver` — view assigned routes, update delivery status
- `customer` — view own shipments only

### Task 11: Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```
