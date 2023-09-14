FROM postgres:latest
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=qwerty
ENV POSTGRES_DB=todo-app
COPY init.sql /docker-entrypoint-initdb.d/
EXPOSE 5432