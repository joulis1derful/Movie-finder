# Back-end launch

## Prerequisites:
- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Develop:
- `cd server`
- `npm run start`

## In case of Docker image update
- `docker build -t ${DOCKER_USERNAME}/movie-finder`

To ensure image is working okay locally run
- `docker run -p YOUR_PORT:APP_PORT -d ${DOCKER_USERNAME}/movie-finder`

And then push image to your DockerHub (`docker login` beforehand)
- `docker push ${DOCKER_USERNAME}/movie-finder`

P.S. Don't forget to change image path inside `docker-compose.yaml` if you wanna run your own version

## Deploy infrastructure
```
docker-compose up --build
```
