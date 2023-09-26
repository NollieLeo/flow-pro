import { FC } from "react";
import { ReactFlowProvider } from "reactflow";
import { FlowContextProvider } from "./stores";
import { FlowPanel } from "./components/FlowPanel";
import { FlowProps } from "./types";

export const Flow: FC<FlowProps> = (props) => {
  const { ...res } = props;
  return (
    <ReactFlowProvider>
      <FlowContextProvider {...res}>
        <FlowPanel></FlowPanel>
      </FlowContextProvider>
    </ReactFlowProvider>
  );
};
