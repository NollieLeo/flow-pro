import type { FC, CSSProperties } from "react";
import type { EdgeProps } from "reactflow";
import { useEventsFlowContext } from "../../stores";
import { isNumber } from "lodash-es";
import { SmartStepEdge as FlowSmartBeizerEdge } from "@tisoap/react-flow-smart-edge";
import { DEFAULT_EDGE_STYLE } from "../../constants";

const SmartBezierEdge: FC<EdgeProps> = (props) => {
  const { style = {}, markerEnd, markerStart, target } = props;

  const { draggingNodeChildrenIds } = useEventsFlowContext();

  const isEdgeInvisible = draggingNodeChildrenIds?.includes(target);

  const edgeOpacity = isEdgeInvisible
    ? 0
    : isNumber(style.opacity)
    ? style.opacity
    : "initial";

  const edgeStyle: CSSProperties = {
    ...DEFAULT_EDGE_STYLE,
    ...style,
    opacity: edgeOpacity,
  };

  if (!edgeOpacity) {
    return <></>;
  }

  return (
    <>
      <FlowSmartBeizerEdge
        {...props}
        style={edgeStyle}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
    </>
  );
};

export { SmartBezierEdge };
