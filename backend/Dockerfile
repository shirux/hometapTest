FROM python:3.13-slim

ARG PORT=8000
ENV PORT=${PORT}
WORKDIR /app

RUN pip install poetry
COPY pyproject.toml poetry.lock* ./
RUN poetry config virtualenvs.create false && poetry install --no-root

COPY . .

EXPOSE ${PORT}

CMD ["sh", "-c", "python manage.py runserver 0.0.0.0:${PORT}"]
