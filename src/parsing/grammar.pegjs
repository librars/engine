// Andrea Tino - 2020

{
  const TEXTSTYLE = {
    CURSIVE: 0,
    BOLD: 1
  };

  const LISTITEMTYPE = {
    BULLET: 0,
    NUMERIC_AUTO: 1,
    NUMERIC_MANUAL: 2
  };
}

/*
  Initial options:
  1. Block: the most basic concept in the language. 
*/
start
  = bf:blockflow { return { t: "ROOT", v: bf }; }

/* ----- Block constructs ----- */

/*
  A block can either be:
  - Plain paragraph
  - Titled paragraph
  - List
  - Code block
  - Quotation block
  - Environment
  - Media reference
  - Text variable
  - Directive
  - Equation
*/
blockflow
  = head:block tail:(N N sep:N* b:block { return b; })*
    {
      if (tail.length === 0) {
        return [head];
      }

      return [head].concat(tail);
    }

block
  = p:paragraph { return { t: "PARAGRAPH:BLOCK", v: p }; }
  / h:heading { return { t: "HEADING:BLOCK", v: h }; }
  / l:list { return { t: "LIST:BLOCK", v: l }; }
  / c:code { return { t: "CODE:BLOCK", v: c }; }
  / q:quote { return { t: "QUOTE:BLOCK", v: q }; }
  / e:env { return { t: "ENVIRONMENT:BLOCK", v: e }; }
  / m:media { return { t: "MEDIA:BLOCK", v: m }; }
  / v:var { return { t: "VARIABLE-DECLARATION:BLOCK", v: v }; }
  / d:dir { return { t: "DIRECTIVE:BLOCK", v: d }; }
  / e:eq { return { t: "EQUATION:BLOCK", v: e }; }

/* A paragraph is just a text stream */
paragraph
  = s:textstream { return s; }

/* 
  Heading
  Comprises the heading itself followed by a paragraph.
*/
heading
  = s:SHARP+ S* t:TEXT S* par:(N+ p:paragraph { return p; })?
    {
      // Compute the heading level by counting the number of sharps
      const level = s.length;

      return {
        t: "HEADING",
        v: {
          level: level,
          title: t.reduce((a, b) => a + b),
          paragraph: par
        }
      };
    }

/*
  Lists
  Different types supported:
  - Bulleted list
  - Numbered lists
      - Automatic numbering
      - Manual numbering
*/
list
  = l:(ind:S*
       sign:(MINUS { return LISTITEMTYPE.BULLET; } /
             PLUS { return LISTITEMTYPE.NUMERIC_AUTO; } /
             (NUMERIC DOT) { return LISTITEMTYPE.NUMERIC_MANUAL; })
       S*
       t:TEXT
       N { return { t: "LISTITEM", v: { indentation: ind.length, type: sign, text: t } }; })+
    {
      return { t: "LIST", v: l };
    }

/* Code block */
code
  = TIK TIK TIK N c:TEXT N TIK TIK TIK { return { t: "CODEBLOCK", v: { text: c, lang: "undefined" } }; }

/* Quotation */
quote
  = head:quoteline tail:(N quoteline)*
    {
      if (tail.length === 0) {
        return [head];
      }

      return [head].concat(tail);
    }

quoteline
  = ABC S* t:TEXT { return { t: "QUOTELINE", v: t }; }

/* Environments */
env
  = textstream // TODO

/* Media reference */
media
  = BANG SBO t:TEXT SBC CBO u:url CBC { return { t: "MEDIA", v: { text: t, url: u } }; }

/* Variable declaration(s) */
var
  = head:varline tail:(N varline)*
    {
      if (tail.length === 0) {
        return [head];
      }

      return [head].concat(tail);
    }

varline
  = SEMICOL SBO id:identifier SBC CBO t:TEXT CBC { return { t: "VARIABLEDECLARATION", v: { identifier: id, value: t } }; }

/* Directive(s) */
dir
  = head:dirline tail:(N dirline)*
    {
      if (tail.length === 0) {
        return [head];
      }

      return [head].concat(tail);
    }

dirline
  = d:incdirline { return d; }

incdirline
  = PERC DIR_INCLUDE S+ QUOTEMARK p:path QUOTEMARK { return { t: "DIRINCLUDE", v: { path: p } }; }

/* Equation block */
eq
  = DOLLAR DOLLAR N l:TEXT N DOLLAR DOLLAR { return { t: "EQUATION", v: { text: l, lang: "latex" } }; }

/*
A text stream can be text plus other inline elements.
*/
textstream
  = t:(plaintext / inline)+ { return t; }

plaintext
  = t:TEXT { return { t: "TEXT:INLINE", v: t.reduce((a, b) => a + b) }; }

/* ----- Inline constructs ----- */

/*
  An inline element can be:
  - Inline formatting (bold, italic)
  - Link
  - Inline code chunk
  - Inline equation
  - Footnote
  - Text reference and label
*/
inline
  = f:formatting { return { t: "FORMAT:INLINE", v: f }; }
  / l:link { return { t: "LINK:INLINE", v: l }; }
  / c:codeline { return { t: "CODE:INLINE", v: c }; }
  / e:eqline { return { t: "EQUATION:INLINE", v: e }; }
  / f:footnote { return { t: "FOOTNOTE:INLINE", v: f }; }
  / l:label { return { t: "LABEL:INLINE", v: l }; }
  / r:ref { return { t: "REFERENCE:INLINE", v: r }; }

/* Formatting */
formatting
  = STAR t:TEXT STAR { return { t: "TEXT", v: { text: t, style: TEXTSTYLE.CURSIVE } }; }
  / UNDER t:TEXT UNDER { return { t: "TEXT", v: { text: t, style: TEXTSTYLE.CURSIVE } }; }
  / STAR STAR t:TEXT STAR STAR { return { t: "TEXT", v: { text: t, style: TEXTSTYLE.BOLD } }; }
  / UNDER UNDER t:TEXT UNDER UNDER { return { t: "TEXT", v: { text: t, style: TEXTSTYLE.BOLD } }; }

/* Links */
link
  = SBO t:TEXT? SBC CBO u:url CBC { return { t: "LINK", v: { text: t, url: u } }; }

/* Code (inline) */
codeline
  = TIK t:TEXT TIK { return { t: "CODELINE", v: { text: t, lang: "undefined" } }; }

/* Equation (inline) */
eqline
  = DOLLAR t:TEXT DOLLAR { return { t: "EQUATIONLINE", v: { text: t, lang: "latex" } }; }

/* Footnote */
footnote
  = APEX SBO t:TEXT SBC { return { t: "FOOTNOTE", v: t }; }

/* Label: `:[id]` */
label
  = SEMICOL SBO id:identifier SBC
    {
      // TODO: Semantic check, references a heading or an environment
      return { t: "LABEL", v: id };
    }

/* Reference: `@[id]` */
ref
  = AT SBO id:identifier SBC
    {
      // TODO: Semantic check, identifier previously created and present
      return { t: "REFERENCE", v: id };
    }

/* ----- Generic classes ----- */

/* Identifier */
identifier
  = [a-zA-Z] [a-zA-Z0-9]*

url
  = ("http://" / "https://") [a-zA-Z0-9]+

path
  = [a-zA-Z0-9]+

/* ----- Terminals and character classes ----- */

/* Chunk of text */
TEXT "text" = [a-zA-Z0-9 \t]+

NUMERIC "numeric" = [0-9]+

S "whitespace" = [ \t]

N "newline" = [\n\r]

_ "empty" = ""

STAR        "asterisk"              = "*"
TILDE       "tilde"                 = "~"
UNDER       "underscore"            = "_"
BANG        "exclamation mark"      = "!"
AT          "commercial at"         = "@"
SHARP       "sharp"                 = "#"
DOLLAR      "dollar"                = "$"
PERC        "percentage"            = "%"
SEMICOL     "semicolon"             = ":"
DOT         "dot"                   = "."
TIK         "backtick"              = "`"
APEX        "apex"                  = "^"
MINUS       "minus sign"            = "-"
PLUS        "plus sign"             = "+"
CBO         "circle bracket open"   = "("
CBC         "circle bracket close"  = ")"
SBO         "square bracket open"   = "["
SBC         "square bracket close"  = "]"
ABC         "angular bracket close" = ">"
QUOTEMARK   "quotation mark"        = "\""

DIR_INCLUDE "include" = "include"
