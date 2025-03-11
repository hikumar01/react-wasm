cmake_minimum_required(VERSION 3.20)
project(SceneGraphWASM)

set(CMAKE_CXX_STANDARD 17)

set(CMAKE_TOOLCHAIN_FILE $ENV{EMSCRIPTEN}/cmake/Modules/Platform/Emscripten.cmake)

add_executable(scenegraph src/main.cpp src/SceneGraph.cpp)

set_target_properties(scenegraph PROPERTIES
    OUTPUT_NAME "scenegraph"
    SUFFIX ".js"
    LINK_FLAGS "-s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORT_NAME='createSceneGraphModule' -s EXPORTED_RUNTIME_METHODS='[cwrap,ccall]' -s ENVIRONMENT=web -lembind"
)
