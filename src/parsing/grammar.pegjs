// Andrea Tino - 2020

/*
  Initial options:
  1. Block: the most basic concept in the language. 
*/
start
  = blockflow

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
*/
blockflow
  = head:block tail:(N N block { return "bb"; })*
    {
      return `b${tail.length}`;
    }

block
  = paragraph
  / heading
  / list
  / code
  / quote
  / env
  / media
  / var
  / dir

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

/*
A text stream can be text plus other inline elements.
*/
textstream
  = text
  / inline

inline
  = _

/* ----- Terminals and character classes ----- */

text
  = [a-zA-Z0-9 \t]+

S "whitespace" = [ \t]*

N "newline" = [\n\r]

_ "empty" = ""
