import moduleCss from './NodeImage.module.scss';
import { FC } from 'react';
import { Image } from 'antd';
import Thunder from '../assets/thunder.svg';
import classNames from 'classnames';

interface NodeImageProps {
  icon?: string;
  className?: string;
}

export const NodeImage: FC<NodeImageProps> = (props) => {
  const { icon, className } = props;
  return (
    <div className={classNames(moduleCss.conatiner, className)}>
      <Image src={icon || Thunder} preview={false} />
    </div>
  );
};
