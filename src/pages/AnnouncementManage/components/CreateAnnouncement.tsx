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
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, message } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function CreateAnnouncement({ tableRef }: { tableRef: any }, ref: any) {
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
            name="color"
            width="md"
            required={true}
            rules={[{ required: true }]}
            label={intl.formatMessage({ id: 'pages.announcementManage.color.label' })}
          />
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
