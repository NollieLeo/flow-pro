import { CustomNodeWrapper } from '../CustomNodeWrapper';
import styles from './ProcessNode.module.scss';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { useEventsFlowContext } from '../../stores';
import { FlowNodeComponentProps } from '../../types/nodes';
import { NodeImage } from '../NodeImage';

const ProcessNode = (props: FlowNodeComponentProps) => {
  const { data, id } = props;
  const { label, icon } = data;

  const { selectedNodeId } = useEventsFlowContext();

  const isSelected = selectedNodeId === id;

  const processNodeCls = classNames(styles.customProcessNode, {
    [styles.isSelected]: isSelected,
  });

  return (
    <CustomNodeWrapper {...props}>
      <div className={processNodeCls} data-comp-type="ProcessNode">
        <div className={styles.customProcessNodeTop}>
          <NodeImage icon={icon} />
          <Tooltip title={label} mouseEnterDelay={0.7}>
            <span className={styles.customProcessNodeName}>{label}</span>
          </Tooltip>
        </div>
        {data.describe && <div className={styles.customProcessNodeBottom}>{data.describe}</div>}
        {isSelected && <div className={styles.customProcessSelectedShadow} />}
      </div>
    </CustomNodeWrapper>
  );
};

export { ProcessNode };
