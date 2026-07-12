# Scaling Django APIs to 50k Requests Per Minute

Building REST APIs with Django Rest Framework (DRF) is straightforward, but scaling them to support tens of thousands of requests per minute requires architectural changes.

## 1. Eliminate N+1 Queries
The most common source of API latency is the N+1 query problem, where Django fetches foreign keys in separate queries. Use `select_related` (for ForeignKey and OneToOne) and `prefetch_related` (for ManyToMany) to fetch all records in a single join query.

```python
# Before (Slow)
queryset = Book.objects.all() # Triggers query for author on every iteration

# After (Fast)
queryset = Book.objects.select_related('author').all()
```

## 2. Redis Cache Middleware
Implementing an aggressive caching layer for static data or heavy read endpoints can reduce database load:

```python
from django.core.cache import cache

def get_dashboard_metrics(request):
    cache_key = "dashboard_metrics_data"
    data = cache.get(cache_key)
    
    if not data:
        data = calculate_heavy_metrics()
        cache.set(cache_key, data, timeout=300) # Cache for 5 mins
        
    return JsonResponse(data)
```

## 3. Offloading Work with Celery
Never run time-consuming tasks (like email delivery or pdf generation) in the main request-response cycle. Offload them to background worker processes:

```python
# tasks.py
@shared_task
def send_welcome_email(user_id):
    user = User.objects.get(id=user_id)
    send_mail("Welcome!", "Thanks for signing up.", "admin@saas.com", [user.email])
```

## Key Results
* Average API Latency: **from 320ms to 45ms**
* CPU Utilization: **Reduced by 55%**
* System Throughput: **Successfully sustained 50k RPM**
