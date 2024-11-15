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
import { Button, ColorPicker, ColorPickerProps, message, theme } from 'antd';
import { generate, green, presetPalettes, red } from '@ant-design/colors';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

type Presets = Required<ColorPickerProps>['presets'][number];
const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors }));

export default forwardRef(function CreateAnnouncement({ tableRef }: { tableRef: any }, ref: any) {
  const { token } = theme.useToken();
  const presets = genPresets({ primary: generate(token.colorPrimary), red, green });
  const formRef = useRef<ProFormInstance>();
  const [drawerStatus, setDrawerStatus] = useState(false);
  const [announcementId, setAnnouncementId] = useState(-1);
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
      } else {
        message.error(announcement.msg);
      }
    }

    if (announcementId !== -1) {
      initAnnouncement();
    } else {
      formRef?.current?.resetFields();
    }
  }, [announcementId]);

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
          const color = values.color.toHexString();
          values.color = color;
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
            ></ColorPicker>
          </ProFormItem>
          <ProFormText
            width="md"
            name="icon"
            required={true}
            rules={[{ required: true }]}
            label={intl.formatMessage({ id: 'pages.announcementManage.icon.label' })}
          />
        </ProForm.Group>
      </DrawerForm>
    </>
  );
});
