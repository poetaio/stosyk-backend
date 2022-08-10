docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
docker run -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=test -p 5433:5432 -d postgres
