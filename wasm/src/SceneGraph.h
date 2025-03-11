#ifndef SCENE_GRAPH_H
#define SCENE_GRAPH_H

#include <vector>
#include <string>
#include <memory>
#include <emscripten/bind.h>

class SceneNode {
public:
    std::string id;
    float x, y, width, height;
    std::string color;

    SceneNode(std::string id, float x, float y, float width, float height, std::string color)
        : id(id), x(x), y(y), width(width), height(height), color(color) {}

    std::string getId() { return id; }
};

class SceneGraph {
public:
    std::vector<std::shared_ptr<SceneNode>> nodes;

    void addNode(std::string id, float x, float y, float width, float height, std::string color);
    std::vector<SceneNode*> getNodes();
};

extern "C" SceneGraph* createSceneGraph();

#endif
