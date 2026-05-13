dev:
	docker compose up --build

prod:
	docker compose -f docker-compose.prod.yml up --build -d

prod-build:
	docker compose -f docker-compose.prod.yml build

dev-down:
	docker compose down

prod-down:
	docker compose -f docker-compose.prod.yml down
