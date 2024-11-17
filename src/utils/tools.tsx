import React from 'react';
import * as Icons from '@ant-design/icons';

/**
 * 生成Icon图标
 * @param icon 图标名
 * @param color 图标颜色
 * @param myClass 图标类名
 * @returns Icon Dom
 */
export const generateChronicleIcon = (icon: string, color = '#1677ff', myClass = '') => {
  // @ts-ignore
  return React.createElement(Icons[icon], {
    twoToneColor: color,
    className: myClass,
  });
};
