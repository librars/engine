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
  = block _n _n blockflow
  / _e
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

/*
A text stream can be text plus other inline elements.
*/
textstream
  = t textstream
t
  = text
  / inline

text
  = [a-zA-Z0-9 \t]+

_ "whitespace" = [ \t]*

_n "newline" = [\n\r]

_e "null" = ""
