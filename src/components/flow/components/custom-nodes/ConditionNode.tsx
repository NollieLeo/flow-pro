import { CustomNodeWrapper } from '../CustomNodeWrapper';
import { Position } from 'reactflow';
import styles from './ConditionNode.module.scss';

import { FlowNodeComponentProps } from '../../types/nodes';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import { useEventsFlowContext } from '../../stores';

export enum ConditionType {
  SUCCESS = 'success',
  ERROR = 'error',
  DEFAULT = 'default',
}

const ConditionNode = (
  props: FlowNodeComponentProps & {
    conditionType?: ConditionType;
  }
) => {
  const { data, conditionType = ConditionType.DEFAULT, id } = props;

  const { selectedNodeId } = useEventsFlowContext();

  const nodeCls = classNames(styles.customConditionNode, conditionType && styles[conditionType], {
    [styles.isSelected]: selectedNodeId === id,
  });

  return (
    <CustomNodeWrapper {...props} handles={[Position.Bottom, Position.Top]}>
      <div className={nodeCls} data-comp-type="ConditionNode">
        <Tooltip title={data.label} mouseEnterDelay={0.7}>
          <div className={styles.customConditionNodeLabel}>{data.label}</div>
        </Tooltip>
      </div>
    </CustomNodeWrapper>
  );
};

export const ConditionSuccessNode = (props: FlowNodeComponentProps) => {
  return <ConditionNode {...props} conditionType={ConditionType.SUCCESS} />;
};

export const ConditionErrorNode = (props: FlowNodeComponentProps) => {
  return <ConditionNode {...props} conditionType={ConditionType.ERROR} />;
};

export { ConditionNode };
