import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import styles from './ActionAddonBtn.module.scss';
import { CSSProperties, MouseEventHandler } from 'react';

const ActionAddonBtn = (props: {
  onClick?: MouseEventHandler<HTMLDivElement>;
  style?: CSSProperties;
  className?: string;
}) => {
  const { style, onClick, className } = props;
  const btnCls = classNames(styles.buttonWrapper, className);
  return (
    <div data-comp-type="ActionAddonBtn" className={btnCls} style={style} onClick={onClick}>
      <PlusOutlined />
    </div>
  );
};

export { ActionAddonBtn };
