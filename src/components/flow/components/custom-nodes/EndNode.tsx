import { NodeProps, Position } from 'reactflow';
import styles from './EndNode.module.scss';
import { CustomNodeWrapper } from '../CustomNodeWrapper';
import { Tooltip } from 'antd';
import { NodeImage } from '../NodeImage';

function EndNode(props: NodeProps) {
  const { data } = props;
  const { label: endNodeLabel, icon } = data;
  return (
    <CustomNodeWrapper {...props} handles={[Position.Top]}>
      <div className={styles.customEndNode} data-comp-type="EndNode">
        {icon && <NodeImage className={styles.customEndNodeIcon} icon={icon} />}
        <Tooltip title={endNodeLabel} mouseEnterDelay={0.7}>
          <span className={styles.customEndNodeName}>{endNodeLabel}</span>
        </Tooltip>
      </div>
    </CustomNodeWrapper>
  );
}

export { EndNode };
