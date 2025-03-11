import React from 'react';
import createSceneGraphModule from './wasm/scenegraph.js';

export default class SceneGraphRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            SceneGraphModule: null,
            scene: [],
        };
    }

    async componentDidMount() {
        try {
            const module = await createSceneGraphModule();
            this.setState({ SceneGraphModule: module });

            const sceneGraph = new module.SceneGraph();
            sceneGraph.addNode('rect1', 10, 10, 100, 100, 'red');
            sceneGraph.addNode('rect2', 20, 20, 20, 20, 'green');

            // posted changes to c++
            // Retrieving changes from c++

            const rawNodes = sceneGraph.getNodes();
            const nodes = [];
            const sceneSize = rawNodes.size();

            for (let i = 0; i < sceneSize; i++) {
                const node = rawNodes.get(i);
                nodes.push({
                    id: node.getId(),
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height,
                    color: node.color,
                });
            }

            console.log('Extracted Nodes:', nodes);
            this.setState({ scene: nodes }, this.drawScene);
        } catch (error) {
            console.error('Failed to load SceneGraph module:', error);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.scene !== this.state.scene) {
            this.drawScene();
        }
    }

    drawScene = () => {
        const { scene } = this.state;
        const canvas = this.canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        // Draw each scene node as a rectangle
        scene.forEach((node) => {
            ctx.fillStyle = node.color;
            ctx.fillRect(node.x, node.y, node.width, node.height);
        });
    };

    render() {
        const { SceneGraphModule, scene } = this.state;

        if (!SceneGraphModule) return <p>Loading SceneGraph...</p>;

        return (
            <>
                {scene.map((node) => (
                    <div key={node.id}>
                        Node: {node.id} (x: {node.x}, y: {node.y}, width: {node.width}, height: {node.height}, color: {node.color})
                    </div>
                ))}
                <canvas
                    ref={this.canvasRef}
                    width='500'
                    height='500'
                    style={{ border: '1px solid black' }}
                />
            </>
        );
    }
}
