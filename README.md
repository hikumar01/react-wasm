# Building
podman build -t react-wasm-scenegraph . -f docker/Dockerfile

# Executing
podman run --rm -p 8080:80 react-wasm-scenegraph

# Stop and remove all containers
podman stop -a && podman rm -a

# Delete dangling images
podman rmi $(podman images -q -f dangling=true)

# =======================================

# List all container
podman ps -a

# List all images
podman images -a

# =======================================

# Remove unused images
podman image prune -a -f

# Remove unuseed volume
podman volume prune -f

# Locally

## One time
source "$HOME/.emsdk/emsdk_env.sh"

mkdir wasm/build; cd wasm/build
emcmake cmake .. -DCMAKE_VERBOSE_MAKEFILE=ON -DCMAKE_CXX_FLAGS="-gsource-map" && emmake make VERBOSE=2
cd ../..

mkdir react-app/src/wasm/
cp -v wasm/build/*.js wasm/build/*.wasm wasm/build/*.map react-app/src/wasm/

cd react-app
npm install && npm run start

## Repetitively
cd ../wasm/build && emmake make VERBOSE=2 && cd - && npm run start

cd ../wasm/build && emcmake cmake .. -DCMAKE_VERBOSE_MAKEFILE=ON -DCMAKE_CXX_FLAGS="-gsource-map" && emmake make VERBOSE=2 && cd - && npm run start


# =========================
FROM node:20 AS frontend

WORKDIR /app
COPY --from=builder /app/wasm/build/*.js /app/src/wasm/
COPY --from=builder /app/wasm/build/*.wasm /app/src/wasm/
COPY --from=builder /app/wasm/build/*.map /app/src/wasm/
COPY react-app/ .
RUN npm install && npm run build

# =========================
FROM nginx:latest

RUN echo '....'
COPY --from=frontend /app/dist /usr/share/nginx/html
COPY --from=builder /app/wasm/build/*.map /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
