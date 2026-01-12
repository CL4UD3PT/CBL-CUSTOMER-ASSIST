# Dockerfile para backend Flask

FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt ./

# Instala netcat-openbsd para o comando 'nc'
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt

# Copia o entrypoint corrigido explicitamente
COPY entrypoint.sh /app/entrypoint.sh
COPY . .

# Dá permissão de execução ao entrypoint
RUN chmod +x /app/entrypoint.sh

ENV FLASK_APP=src/app.py
ENV FLASK_ENV=development

# Usa entrypoint customizado
ENTRYPOINT ["/app/entrypoint.sh"]
