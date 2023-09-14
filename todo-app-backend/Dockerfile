FROM python:3.8-slim
WORKDIR /app
COPY . /app
RUN apt-get update && apt-get install inetutils-ping
RUN pip install -r requirements.txt
CMD ["flask","run","--debug","--host=0.0.0.0"]