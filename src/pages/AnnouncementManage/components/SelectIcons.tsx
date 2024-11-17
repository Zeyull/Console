import { createStyles } from 'antd-style';
import icons from './AntdIcons';
import { generateChronicleIcon } from '@/utils/tools';

const useStyles = createStyles(({ token }) => {
  return {
    'icon-content': {
      width: '100%',
      height: '600px',
      display: 'flex',
      flexWrap: 'wrap',
      overflow: 'auto',
    },
    'icon-select-box': {
      display: 'flex',
      justifyContent: 'center',
      width: '50px',
      height: '50px',
      padding: '10px',
      borderRadius: '4px',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    'selected-icon': {
      backgroundColor: token.colorBgTextHover,
    },
    icon: {
      fontSize: '20px',
    },
  };
});

export function SelectIcons({ value, setValue, targetOnChange }: any) {
  const twoToneIcons = icons.TOW_TONE_ICONS;
  const { styles } = useStyles();

  return (
    <>
      <div className={styles['icon-content']}>
        {twoToneIcons.map((item) => (
          <div
            key={item}
            onClick={() => {
              setValue(item);
              targetOnChange(item);
            }}
            className={`
                            ${styles['icon-select-box']} 
                            ${value === item ? styles['selected-icon'] : ''}`}
          >
            {generateChronicleIcon(item, '#1677ff', styles['icon'])}
          </div>
        ))}
      </div>
    </>
  );
}
