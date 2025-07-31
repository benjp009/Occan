import React from 'react';
import { NotionBlock } from '../types';

interface NotionRendererProps {
  blocks: NotionBlock[];
}

const NotionRenderer: React.FC<NotionRendererProps> = ({ blocks }) => {
  const renderBlock = (block: NotionBlock): React.ReactNode => {
    const { type, content, children } = block;

    switch (type) {
      case 'paragraph':
        return (
          <p key={block.id}>
            {renderRichText(content?.rich_text || [])}
          </p>
        );

      case 'heading_1':
        return (
          <h1 key={block.id}>
            {renderRichText(content?.rich_text || [])}
          </h1>
        );

      case 'heading_2':
        return (
          <h2 key={block.id}>
            {renderRichText(content?.rich_text || [])}
          </h2>
        );

      case 'heading_3':
        return (
          <h3 key={block.id}>
            {renderRichText(content?.rich_text || [])}
          </h3>
        );

      case 'bulleted_list_item':
        return (
          <li key={block.id}>
            {renderRichText(content?.rich_text || [])}
            {children && children.length > 0 && (
              <ul>{children.map(child => renderBlock(child))}</ul>
            )}
          </li>
        );

      case 'numbered_list_item':
        return (
          <li key={block.id}>
            {renderRichText(content?.rich_text || [])}
            {children && children.length > 0 && (
              <ol>{children.map(child => renderBlock(child))}</ol>
            )}
          </li>
        );

      case 'quote':
        return (
          <blockquote key={block.id}>
            {renderRichText(content?.rich_text || [])}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={block.id} className="code-block">
            <code className={`language-${content?.language || 'text'}`}>
              {content?.rich_text?.[0]?.plain_text || ''}
            </code>
          </pre>
        );

      case 'image':
        const imageUrl = content?.file?.url || content?.external?.url;
        const caption = content?.caption?.[0]?.plain_text;
        return (
          <figure key={block.id} className="notion-image">
            <img src={imageUrl} alt={caption || ''} />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        );

      case 'divider':
        return <hr key={block.id} className="notion-divider" />;

      case 'callout':
        return (
          <div key={block.id} className="notion-callout">
            <div className="callout-icon">
              {content?.icon?.emoji || '💡'}
            </div>
            <div className="callout-content">
              {renderRichText(content?.rich_text || [])}
            </div>
          </div>
        );

      case 'toggle':
        return (
          <details key={block.id} className="notion-toggle">
            <summary>
              {renderRichText(content?.rich_text || [])}
            </summary>
            <div className="toggle-content">
              {children?.map(child => renderBlock(child))}
            </div>
          </details>
        );

      case 'embed':
        return (
          <div key={block.id} className="notion-embed">
            <iframe
              src={content?.url}
              title="Contenu intégré"
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        );

      default:
        return (
          <div key={block.id} className="notion-unsupported">
            <p>Type de contenu non supporté: {type}</p>
          </div>
        );
    }
  };

  const renderRichText = (richText: any[]): React.ReactNode => {
    return richText.map((text, index) => {
      const { plain_text, annotations, href } = text;
      let element: React.ReactNode = plain_text;

      if (annotations?.bold) {
        element = <strong>{element}</strong>;
      }
      if (annotations?.italic) {
        element = <em>{element}</em>;
      }
      if (annotations?.strikethrough) {
        element = <del>{element}</del>;
      }
      if (annotations?.underline) {
        element = <u>{element}</u>;
      }
      if (annotations?.code) {
        element = <code>{element}</code>;
      }
      if (annotations?.color && annotations.color !== 'default') {
        element = <span className={`notion-color-${annotations.color}`}>{element}</span>;
      }
      if (href) {
        element = (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {element}
          </a>
        );
      }

      return <React.Fragment key={index}>{element}</React.Fragment>;
    });
  };

  // Group consecutive list items
  const groupBlocks = (blocks: NotionBlock[]): React.ReactNode[] => {
    const grouped: React.ReactNode[] = [];
    let currentList: NotionBlock[] = [];
    let currentListType: string | null = null;

    blocks.forEach((block, index) => {
      if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
        if (currentListType !== block.type) {
          // Finish previous list if different type
          if (currentList.length > 0) {
            const ListTag = currentListType === 'numbered_list_item' ? 'ol' : 'ul';
            grouped.push(
              <ListTag key={`list-${index}`}>
                {currentList.map(item => renderBlock(item))}
              </ListTag>
            );
          }
          currentList = [block];
          currentListType = block.type;
        } else {
          currentList.push(block);
        }
      } else {
        // Finish current list
        if (currentList.length > 0) {
          const ListTag = currentListType === 'numbered_list_item' ? 'ol' : 'ul';
          grouped.push(
            <ListTag key={`list-${index}`}>
              {currentList.map(item => renderBlock(item))}
            </ListTag>
          );
          currentList = [];
          currentListType = null;
        }
        grouped.push(renderBlock(block));
      }
    });

    // Finish any remaining list
    if (currentList.length > 0) {
      const ListTag = currentListType === 'numbered_list_item' ? 'ol' : 'ul';
      grouped.push(
        <ListTag key="final-list">
          {currentList.map(item => renderBlock(item))}
        </ListTag>
      );
    }

    return grouped;
  };

  return <div className="notion-content">{groupBlocks(blocks)}</div>;
};

export default NotionRenderer;