import { NodeProps, Position } from 'reactflow';
import styles from './StartNode.module.scss';
import { CustomNodeWrapper } from '../CustomNodeWrapper';
import { Tooltip } from 'antd';
import { NodeImage } from '../NodeImage';

function StartNode(props: NodeProps) {
  const { data } = props;

  const { label: startNodeLabel, icon } = data;

  return (
    <CustomNodeWrapper {...props} handles={[Position.Bottom]}>
      <div className={styles.customStartNode} data-comp-type="StartNode">
        {icon && <NodeImage className={styles.customStartNodeIcon} icon={icon} />}
        <Tooltip title={startNodeLabel} mouseEnterDelay={0.7}>
          <span className={styles.customStartNodeName}>{startNodeLabel}</span>
        </Tooltip>
      </div>
    </CustomNodeWrapper>
  );
}

export { StartNode };
