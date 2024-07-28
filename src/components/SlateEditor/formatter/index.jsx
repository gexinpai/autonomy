import { CodeBlockType, CodeLineType } from '../components/BlockCode';
import CheckList from '../components/CheckList';
import { Image } from './images';
import { ReactEditor, useSlateStatic } from 'slate-react'
import { Transforms } from 'slate'
import { css } from '@emotion/css'
import LanguageSelect from '../components/BlockCode/components/LanguageSelect';


export default function RenderElement(props) {
  const { attributes, children, element } = props;
  const { type, children:ccc, url, style, ...rest} = element;
  const styles = {...style, ...rest};
  const editor = useSlateStatic()
  console.log('element-type', element, styles)
  switch (element.type) {
    /**
     * 图片
     */
    case 'image':
      return <Image style={styles} {...props} />;

    case 'check-list':
      return <CheckList style={styles} {...props}/>;
    /**
     * markdown 快捷
     */
    case 'heading-one':
      return <h1 style={styles} {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 style={styles} {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 style={styles} {...attributes}>{children}</h3>;
    case 'heading-four':
      return <h4 style={styles} {...attributes}>{children}</h4>;
    case 'heading-five':
      return <h5 style={styles} {...attributes}>{children}</h5>;
    case 'heading-six':
      return <h6 style={styles} {...attributes}>{children}</h6>;
    case 'bulleted-list':
      return <ul style={styles} {...attributes}>{children}</ul>;
    case 'numbered-list':
      return <ol style={styles} {...attributes}>{children}</ol>;
    case 'list-item':
    case 'bulleted-list-item':
    case 'numbered-list-item':
      return <li style={styles} {...attributes}>{children}</li>;
    case 'block-quote':
      return <blockquote style={styles} {...attributes}>{children}</blockquote>;
    // case 'code-line':
    //     return <p style={styles} {...attributes}>{children}</p>;
    // case 'code-block':
    //       return <pre><code style={styles} {...attributes}>{children}</code></pre>;
    case CodeLineType:
      return (
        <p {...attributes} style={{ ...styles, position: 'relative' }}>
          {children}
        </p>
      )
    case CodeBlockType: 
      const setLanguage = (language) => {
        const path = ReactEditor.findPath(editor, element)
        Transforms.setNodes(editor, { language }, { at: path })
      }
      return (
        <div
          {...attributes}
          className={css(`
          font-family: monospace;
          font-size: 16px;
          line-height: 20px;
          margin-block: 14px;
          background: rgba(0, 20, 60, .03);
          padding: 32px 16px;
        `)}
          style={{ position: 'relative' }}
          spellCheck={false}
        >
          <LanguageSelect
            value={element.language}
            onChange={e => setLanguage(e.target.value)}
          />
          {children}
        </div>
      )
    default:
      const Tag = editor.isInline(element) ? 'span' : 'p'
      return <Tag style={styles} {...attributes}>{children}</Tag>;
  }
}

export function formatChildren({ attributes, children, leaf }){
  const {text, url, bold, code, italic, underline, middleline, ...styles} = leaf;
  if (bold) {
    children = <strong>{children}</strong>
  }
  if (code) {
    children = <code>{children}</code>
  }
  if (italic) {
    children = <em>{children}</em>
  }
  if (underline) {
    children = <u>{children}</u>
  }
  if(middleline){
    children = <del>{children}</del>
  }

  return <span style={styles} {...attributes}>{children}</span>
}
