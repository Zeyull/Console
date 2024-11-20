import {
  addAnnouncement,
  getAnnouncement,
  updateAnnouncement,
} from '@/services/nozomi/announcement';
import { PlusOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormText,
  DrawerForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormItem,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, ColorPicker, ColorPickerProps, InputRef, message, theme } from 'antd';
import { generate, green, presetPalettes, red } from '@ant-design/colors';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { SelectIcons } from './SelectIcons';

type Presets = Required<ColorPickerProps>['presets'][number];
const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors }));

export default forwardRef(function CreateAnnouncement({ tableRef }: { tableRef: any }, ref: any) {
  const { token } = theme.useToken();
  const presets = genPresets({ primary: generate(token.colorPrimary), red, green });

  const formRef = useRef<ProFormInstance>();
  const iconInputRef = useRef<InputRef>(null);
  const [drawerStatus, setDrawerStatus] = useState(false);
  const [announcementId, setAnnouncementId] = useState(-1);
  const [colorValue, setColorValue] = useState(token.colorPrimary);
  const [selectedIcon, setSelectIcon] = useState('');

  const intl = useIntl();
  const createText = intl.formatMessage({ id: 'pages.website.announcementManage.create' });

  const createAnnouncementFn = async (values: API.AddAnnouncementData) => {
    try {
      const res = await addAnnouncement(values);
      if (res.code === 200) {
        message.success(intl.formatMessage({ id: 'pages.announcementManage.create.success.tips' }));
        return true;
      } else {
        message.error(res.msg);
        return false;
      }
    } catch {
      message.error(intl.formatMessage({ id: 'pages.announcementManage.create.error.tips' }));
      return false;
    }
  };

  const updateAnnouncementFn = async (id: number, values: API.UpdateAnnouncementData) => {
    try {
      const res = await updateAnnouncement({ id }, values);
      if (res.code === 200) {
        message.success(intl.formatMessage({ id: 'pages.announcementManage.update.success.tips' }));
        return true;
      } else {
        message.error(res.msg);
        return false;
      }
    } catch {
      message.error(intl.formatMessage({ id: 'pages.announcementManage.update.error.tips' }));
      return false;
    }
  };

  const targetIconInputOnChange = (value: string) => {
    if (iconInputRef?.current?.input) {
      //这里一定要手动调用set修改值，不然React内部状态不会变，不会触发onChange事件
      // @ts-ignore 获取原生的 input 元素
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      ).set;
      // @ts-ignore 使用 setter 修改值
      nativeInputValueSetter.call(iconInputRef.current.input, value);
      const event = new Event('input', { bubbles: true });
      iconInputRef.current.input.dispatchEvent(event);
    }
  };

  useImperativeHandle(ref, () => ({
    updateAnnouncement(status: boolean, id: number) {
      setDrawerStatus(status);
      setAnnouncementId(id);
    },
  }));

  useEffect(() => {
    async function initAnnouncement() {
      const announcement = await getAnnouncement({ id: announcementId });
      if (announcement.code === 200) {
        formRef?.current?.setFieldsValue(announcement.data);
        setSelectIcon(announcement.data?.icon ?? '');
        setColorValue(announcement.data?.color ?? token.colorPrimary);
      } else {
        message.error(announcement.msg);
      }
    }

    // 创建时初始化表单
    if (drawerStatus && announcementId === -1) {
      formRef?.current?.resetFields();
      formRef?.current?.setFieldValue('color', token.colorPrimary);
      setSelectIcon('');
      setColorValue(token.colorPrimary);
    }

    // 修改时初始化表单
    if (announcementId !== -1) {
      initAnnouncement();
    }
  }, [announcementId, drawerStatus]);

  return (
    <>
      <DrawerForm
        title={createText}
        formRef={formRef}
        trigger={
          <Button
            type="primary"
            onClick={() => {
              setAnnouncementId(-1);
            }}
          >
            <PlusOutlined />
            {createText}
          </Button>
        }
        open={drawerStatus}
        onOpenChange={setDrawerStatus}
        onFinish={async (values: any) => {
          values.color = colorValue;
          if (announcementId === -1) {
            const createResult = await createAnnouncementFn(values);
            if (createResult) {
              tableRef.current?.reload();
            }
            return createResult;
          } else {
            const updateResult = await updateAnnouncementFn(announcementId, values);
            if (updateResult) {
              tableRef.current?.reload();
            }
            return updateResult;
          }
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="content"
            required={true}
            rules={[{ required: true }]}
            label={intl.formatMessage({ id: 'pages.announcementManage.content.label' })}
          />
          <ProFormDatePicker
            width="md"
            name="announcement_time"
            required={true}
            rules={[{ required: true }]}
            label={intl.formatMessage({ id: 'pages.announcementManage.date.label' })}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="icon"
            required={true}
            rules={[{ required: true }]}
            label={intl.formatMessage({ id: 'pages.announcementManage.icon.label' })}
            fieldProps={{
              ref: iconInputRef,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSelectIcon(e.target.value),
              value: selectedIcon,
            }}
          />
          <ProFormItem
            name="color"
            required={true}
            rules={[{ required: true }]}
            label={intl.formatMessage({ id: 'pages.announcementManage.color.label' })}
          >
            <ColorPicker
              presets={presets}
              showText={(color) => <span>{color.toHexString().slice(0, 7)}</span>}
              disabledAlpha
              value={colorValue}
              onChange={(_e, hex: string) => setColorValue(hex)}
            ></ColorPicker>
          </ProFormItem>
        </ProForm.Group>
        <SelectIcons
          value={selectedIcon}
          setValue={setSelectIcon}
          targetOnChange={targetIconInputOnChange}
        ></SelectIcons>
      </DrawerForm>
    </>
  );
});
