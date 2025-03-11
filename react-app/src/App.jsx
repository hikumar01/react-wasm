import React from 'react';
import ReactDOM from 'react-dom/client';
import SceneGraphRenderer from './SceneGraphRenderer.jsx';

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>WebAssembly Scene Graph</h1>
                <SceneGraphRenderer />
            </div>
        );
    }
}

// Render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
