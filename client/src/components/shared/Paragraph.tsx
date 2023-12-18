import React, { FC } from 'react';

type ParagraphType = {
  type: 'infobox';
};

/**
 * Just a draft of the Typography component
 * Can be extended later on.
 */
export const Paragraph: FC<ParagraphType> = ({ children, type }) =>
  type === 'infobox' ? (
    <p
      style={{
        fontSize: '22px',
        fontWeight: 500,
        marginBottom: '14px',
        letterSpacing: '0px',
        lineHeight: 1.2,
        marginBlockStart: '0.83em',
        marginBlockEnd: '0.83em',
        marginInlineStart: '0',
        marginInlineEnd: '0',
      }}
    >
      {children}
    </p>
  ) : (
    <p>{children}</p>
  );
