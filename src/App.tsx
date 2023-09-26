import "./App.scss";
import { Flow } from "./components/flow";
import { MOCK_EDGES, MOCK_NODES } from "./mock";
import "antd/dist/reset.css";

function App() {
  return (
    <>
      <Flow
        nodes={MOCK_NODES}
        edges={MOCK_EDGES}
        draggableNodeTypes={[]}
        droppableNodeTypes={[]}
      />
    </>
  );
}

export default App;
