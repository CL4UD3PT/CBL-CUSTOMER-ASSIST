#!/bin/sh
# Espera pelo Postgres
until nc -z db 5432; do
  echo "Aguardando o Postgres iniciar..."
  sleep 1
done

# Aplica migrações
flask db upgrade

# Arranca o backend
exec flask run --host=0.0.0.0 --port=3001
