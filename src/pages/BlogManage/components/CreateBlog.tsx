import {
  Button,
  Drawer,
  Form,
  Image,
  Input,
  Space,
  Switch,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from 'antd';
import MarkdownIt from 'markdown-it';
import { ChangeEvent, useEffect, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import styles from './CreateBlog.less';
import { FormattedMessage, useIntl } from '@umijs/max';
import { addArticle, getArticle, updateArticle } from '@/services/nozomi/article';
import { OpenArticleType } from './BlogTable';
import { PlusOutlined } from '@ant-design/icons';

interface FormConfig {
  is_visible: number;
}

export default function CreateBlogPage({ hash }: { hash: string }) {
  const intl = useIntl();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [openType, setOpenType] = useState(OpenArticleType.CREATE);
  const [drawerStatus, setDrawerStatus] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [configValue, setConfigValue] = useState<FormConfig>({ is_visible: 1 });
  const mdParser = new MarkdownIt();
  const titlePlaceholder = intl.formatMessage({
    id: 'pages.website.blogManage.create.title-input-placeholder',
  });

  useEffect(() => {
    async function getArticleContent() {
      if (hash !== '') {
        const [id, type] = hash.slice(1).split('&');
        setOpenType(Number(type) as OpenArticleType);
        if (id !== '0') {
          try {
            const res = await getArticle({ id: Number(id) });
            if (res.code === 200) {
              const data = res.data;
              setTitle(data?.title as string);
              setContent(data?.content as string);
              if (data?.picture) {
                setPreviewImage(data.picture as string);
              }
              setConfigValue({
                is_visible: data?.is_visible ?? 1,
              });
            } else {
              message.error(res.msg);
            }
          } catch {
            message.error(intl.formatMessage({ id: 'pages.blogTable.get.error.tips' }));
          }
        }
      }
    }
    getArticleContent();
  }, []);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCreateBlog = async () => {
    if (title.trim() === '' || content === '') {
      message.error(intl.formatMessage({ id: 'pages.blogTable.create.emptyInput.tips' }));
      return;
    }
    try {
      const res = await addArticle({
        title: title.trim(),
        content,
        picture: previewImage === '' ? undefined : previewImage,
        ...configValue,
      });
      if (res.code === 200) {
        message.success(intl.formatMessage({ id: 'pages.blogTable.create.success.tips' }));
        window.location.hash = '';
      } else {
        message.error(res.msg);
      }
    } catch {
      message.error(intl.formatMessage({ id: 'pages.blogTable.create.error.tips' }));
    }
  };

  const handleUpdateBlog = async () => {
    if (title.trim() === '' || content === '') {
      message.error(intl.formatMessage({ id: 'pages.blogTable.create.emptyInput.tips' }));
      return;
    }
    const [id] = hash.slice(1).split('&');
    try {
      const res = await updateArticle(
        { id: Number(id) },
        {
          title: title.trim(),
          content,
          picture: previewImage === '' ? undefined : previewImage,
          ...configValue,
        },
      );
      if (res.code === 200) {
        message.success(intl.formatMessage({ id: 'pages.blogTable.update.success.tips' }));
        window.location.hash = '';
      } else {
        message.error(res.msg);
      }
    } catch {
      message.error(intl.formatMessage({ id: 'pages.blogTable.update.error.tips' }));
    }
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text);
  };

  const showDrawer = () => {
    setDrawerStatus(true);
  };

  const closeDrawer = () => {
    setDrawerStatus(false);
  };

  const handlePicChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
    const res = file.response;
    if (file.status === 'done') {
      if (res && res.code === 200) {
        setPreviewImage(res.data.url);
        message.success(intl.formatMessage({ id: 'pages.blogTable.upload.pic.success.tips' }));
      } else {
        message.error(intl.formatMessage({ id: 'pages.blogTable.upload.pic.error.tips' }));
      }
    }
    setFileList(newFileList);
  };

  const onPicRemove: UploadProps['onRemove'] = () => {
    setPreviewImage('');
  };

  const headers = {
    authorization: localStorage.getItem('authToken') ?? '',
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{intl.formatMessage({ id: 'component.button.upload' })}</div>
    </button>
  );

  return (
    <>
      <div className={styles.page}>
        <header>
          <Input
            placeholder={titlePlaceholder}
            value={title}
            onChange={handleTitleChange}
            disabled={openType === OpenArticleType.VIEW}
          />
          {openType === OpenArticleType.CREATE && (
            <Button type="primary" onClick={handleCreateBlog}>
              <FormattedMessage id="pages.website.blogManage.create" />
            </Button>
          )}
          {openType === OpenArticleType.UPDATE && (
            <Button type="primary" onClick={handleUpdateBlog}>
              <FormattedMessage id="pages.website.blogManage.update" />
            </Button>
          )}
          <Button onClick={showDrawer}>
            <FormattedMessage id="pages.website.blogManage.other.config" />
          </Button>
        </header>

        <div className={styles.content}>
          <MdEditor
            className={styles.editor}
            renderHTML={(text: string) => mdParser.render(text)}
            onChange={handleEditorChange}
            readOnly={openType === OpenArticleType.VIEW}
            value={content}
          />
        </div>
      </div>
      <Drawer
        title={intl.formatMessage({ id: 'pages.website.blogManage.other.config' })}
        onClose={closeDrawer}
        open={drawerStatus}
        size="large"
      >
        <Space direction="vertical" size="small" style={{ display: 'flex' }}>
          <Form
            name="basic"
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            autoComplete="off"
            initialValues={configValue}
            onValuesChange={(value) =>
              setConfigValue({
                ...value,
                is_visible: Number(value.is_visible),
              })
            }
          >
            <Form.Item<FormConfig>
              label={intl.formatMessage({ id: 'pages.website.blogManage.isVisible' })}
              name="is_visible"
            >
              <Switch />
            </Form.Item>
          </Form>

          <div>
            {openType === OpenArticleType.VIEW ? null : (
              <>
                <p className="form-label">
                  {intl.formatMessage({ id: 'pages.website.blogManage.coverPic' })}
                </p>
                <Upload
                  accept=".png,.jpg"
                  action="/nozomi/oss/upload-pic"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handlePicChange}
                  headers={headers}
                  onRemove={onPicRemove}
                  name="image"
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </>
            )}
            {previewImage !== '' ? (
              <>
                <p className="form-label">
                  {intl.formatMessage({ id: 'pages.website.blogManage.currentCover' })}
                </p>
                <Image width={'100%'} src={previewImage} />
              </>
            ) : null}
          </div>
        </Space>
      </Drawer>
    </>
  );
}
