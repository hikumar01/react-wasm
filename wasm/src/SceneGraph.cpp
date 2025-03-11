#include "SceneGraph.h"
#include <emscripten/bind.h>

using namespace emscripten;

void SceneGraph::addNode(std::string id, float x, float y, float width, float height, std::string color) {
    nodes.push_back(std::make_shared<SceneNode>(id, x, y, width, height, color));
}

// Fix: Return vector of raw pointers instead of shared_ptr
std::vector<SceneNode*> SceneGraph::getNodes() {
    std::vector<SceneNode*> rawNodes;
    for (auto& node : nodes) {
        rawNodes.push_back(node.get());  // Extract raw pointer from shared_ptr
    }
    return rawNodes;
}

// Bind to JavaScript
EMSCRIPTEN_BINDINGS(scene_graph_module) {
    using namespace emscripten;

    register_vector<SceneNode*>("VectorSceneNode");

    class_<SceneNode>("SceneNode")
        .constructor<std::string, float, float, float, float, std::string>()
        .function("getId", &SceneNode::getId)
        .property("x", &SceneNode::x)
        .property("y", &SceneNode::y)
        .property("width", &SceneNode::width)
        .property("height", &SceneNode::height)
        .property("color", &SceneNode::color);

    class_<SceneGraph>("SceneGraph")
        .constructor<>()
        .function("addNode", &SceneGraph::addNode)
        .function("getNodes", &SceneGraph::getNodes, allow_raw_pointers());
}

extern "C" {
    SceneGraph* createSceneGraph() {
        return new SceneGraph();
    }
}
