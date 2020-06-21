// Andrea Tino - 2020

{
  const STYLE = {
    CURSIVE: 0,
    BOLD: 1
  };
}

/*
  Initial options:
  1. Block: the most basic concept in the language. 
*/
start
  = bf:blockflow { return bf; }

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
  = textstream

/* Heading */
heading
  = textstream

/* Lists */
list
  = textstream

/* Code block */
code
  = textstream

/* Quotation */
quote
  = textstream

/* Environments */
env
  = textstream

/* Media reference */
media
  = textstream

/* Variable declaration */
var
  = textstream

/* Directive */
dir
  = textstream

/* Equation block */
eq
  = textstream

/*
A text stream can be text plus other inline elements.
*/
textstream
  = t:(plaintext / inline)+ { return t; }

plaintext
  = t: TEXT { return { t: "TEXT:INLINE", v: t }; }

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
  = STAR t:TEXT STAR { return { t: "TEXT", v: { text: t, style: STYLE.CURSIVE } }; }
  / UNDER t:TEXT UNDER { return { t: "TEXT", v: { text: t, style: STYLE.CURSIVE } }; }
  / STAR STAR t:TEXT STAR STAR { return { t: "TEXT", v: { text: t, style: STYLE.BOLD } }; }
  / UNDER UNDER t:TEXT UNDER UNDER { return { t: "TEXT", v: { text: t, style: STYLE.BOLD } }; }

/* Links */
link
  = SBO t:TEXT? SBC CBO u:url CBC { return { t: "LINK", v: { text: t, url: u } }; }

/* Code (inline) */
codeline
  = TIK t:TEXT TIK { return { t: "CODELINE", v: t }; }

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

/* Identifier */
identifier
  = [a-zA-Z] [a-zA-Z0-9]*

url
  = ("http://" / "https://") [a-zA-Z0-9]+

/* ----- Terminals and character classes ----- */

TEXT = [a-zA-Z0-9 \t]+

S "whitespace" = [ \t]*

N "newline" = [\n\r]

_ "empty" = ""

STAR        "asterisk"              = "*"
TILDE       "tilde"                 = "~"
UNDER       "underscore"            = "_"
BANK        "exclamation mark"      = "!"
AT          "commercial at"         = "@"
SQUARE      "sharp"                 = "#"
DOLLAR      "dollar"                = "$"
PERC        "percentage"            = "%"
SEMICOL     "semicolon"             = ":"
TIK         "backtick"              = "`"
APEX        "apex"                  = "^"
CBO         "circle bracket open"   = "("
CBC         "circle bracket close"  = ")"
SBO         "square bracket open"   = "["
SBC         "square bracket close"  = "]"
