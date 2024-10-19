import { Button, Input, message } from 'antd';
import MarkdownIt from 'markdown-it';
import { ChangeEvent, useEffect, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import styles from './CreateBlog.less';
import { FormattedMessage, useIntl } from '@umijs/max';
import { addArticle, getArticle, updateArticle } from '@/services/nozomi/article';
import { OpenArticleType } from './BlogTable';

export default function CreateBlogPage({ hash }: { hash: string }) {
  const intl = useIntl();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [openType, setOpenType] = useState(OpenArticleType.CREATE);
  const mdParser = new MarkdownIt();
  const titlePlaceholder = intl.formatMessage({
    id: 'pages.website.blogManage.create.title-input-placeholder',
  });

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

  return (
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
  );
}
