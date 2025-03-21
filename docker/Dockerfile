# =========================
FROM ubuntu:22.04 AS builder
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y bash git cmake make python3 nodejs npm curl

WORKDIR /emsdk
RUN git clone https://github.com/emscripten-core/emsdk.git .
RUN ./emsdk install latest && ./emsdk activate latest

ENV PATH="/emsdk:/emsdk/upstream/emscripten:/emsdk/upstream/bin:$PATH"
RUN bash -c "source /emsdk/emsdk_env.sh && emcc -v"

WORKDIR /app
COPY wasm/ /app/wasm

WORKDIR /app/wasm/build
RUN emcmake cmake .. -DCMAKE_VERBOSE_MAKEFILE=ON -DCMAKE_CXX_FLAGS="-gsource-map"
RUN emmake make VERBOSE=2

# =========================
FROM node:20 AS frontend

WORKDIR /app
COPY react-app/ .
COPY --from=builder /app/wasm/build/*.js /app/wasm/build/*.wasm /app/src/wasm/
# COPY --from=builder /app/wasm/build/*.map /app/src/wasm/
RUN npm install && npm run build

# =========================
FROM nginx:latest

COPY --from=frontend /app/dist /usr/share/nginx/html
# COPY --from=builder /app/wasm/build/*.map /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
