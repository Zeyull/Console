import { Button, Input } from 'antd';
import MarkdownIt from 'markdown-it';
import { ChangeEvent, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import styles from './CreateBlog.less';
import { FormattedMessage, useIntl } from '@umijs/max';

export default function CreateBlogPage() {
  const intl = useIntl();
  const [title, setTitle] = useState('');
  const mdParser = new MarkdownIt();
  const titlePlaceholder = intl.formatMessage({
    id: 'pages.website.blog-manage.create.title-input-placeholder',
  });

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCreateBlog = () => {
    console.log('createBlog');
  };

  const handleEditorChange = ({ html, text }: { html: string; text: string }) => {
    console.log(html, text);
  };

  return (
    <div className={styles.page}>
      <header>
        <Input placeholder={titlePlaceholder} value={title} onChange={handleTitleChange} />
        <Button type="primary" onClick={handleCreateBlog}>
          <FormattedMessage id="pages.website.blog-manage.create" />
        </Button>
      </header>
      <div className={styles.content}>
        <MdEditor
          className={styles.editor}
          renderHTML={(text: string) => mdParser.render(text)}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
}
