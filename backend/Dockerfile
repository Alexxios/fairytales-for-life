FROM python:3.10-bullseye
WORKDIR /backend

COPY requirements.txt .
RUN pip install --progress-bar off --upgrade pip
RUN pip install --progress-bar off -r requirements.txt

COPY ./app ./app

EXPOSE 8000

#RUN chmod a+x docker/*.sh
CMD ["python", "-m", "app.main"]