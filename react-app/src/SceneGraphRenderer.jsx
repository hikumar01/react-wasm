import React, { useEffect, useState } from "react";
import createSceneGraphModule from './wasm/scenegraph.js';

export default class SceneGraphRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SceneGraphModule: null,
            scene: []
        };
    }

    async componentDidMount() {
        try {
            const module = await createSceneGraphModule();
            console.log("Module loaded:", module);
            this.setState({ SceneGraphModule: module });
            console.log("SceneGraphModule updated:", this.state.SceneGraphModule);
            const sceneGraph = new module.SceneGraph(); // Assuming SceneGraph is exported
            console.log("SceneGraph created:", sceneGraph);
            sceneGraph.addNode("rect1", 10, 10, 100, 100, "red");
            console.log("Node added to SceneGraph: ", sceneGraph.getNodes());
            // this.setState({ scene: sceneGraph.getNodes() });
            const sceneArray = [];
            const sceneSize = rawScene.size();  // Get vector size

            for (let i = 0; i < sceneSize; i++) {
                const node = rawScene.get(i);  // Access individual node
                sceneArray.push({
                    id: node.getId(),
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height,
                    color: node.color
                });
            }

            console.log("Extracted Scene Array:", sceneArray);

            this.setState({ scene: sceneArray });
        } catch (error) {
            console.error("Failed to load SceneGraph module:", error);
        }
    }

    render() {
        const { SceneGraphModule, scene } = this.state;

        if (!SceneGraphModule) return <p>Loading SceneGraph...</p>;

        if (scene) {
            console.log("SceneGraphRenderer scene:", scene);
            // const sceneArray = Array.isArray(scene) ? scene : Object.values(scene);
            scene.map((node) => {
                console.log("Node:", node);
                const nodes = rawNodes.map(node => ({
                    id: node.getId(),
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height,
                    color: node.color
                }));
                console.log("Extracted Nodes:", nodes);
            });
        }

        return (
            <>
                <p>SceneGraph Loaded!</p>
                {scene.map((node) => (
                    <div key={node.id}>
                        Node: {node.id} (x: {node.x}, y: {node.y}, color: {node.color})
                    </div>
                ))}
                <canvas width="500" height="500" style={{ border: "1px solid black" }}>
                    {scene && scene.map((node) => (
                        <rect key={node.id} x={node.x} y={node.y} width={node.width} height={node.height} fill={node.color} />
                    ))}
                </canvas>
            </>
        );
    }
}
