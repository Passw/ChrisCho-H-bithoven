// Values (runtime code) are imported normally
import { ViewPlugin, Decoration } from "@codemirror/view";
// Types (for static analysis) are imported with `import type`
import type { ViewUpdate, EditorView, DecorationSet } from "@codemirror/view";
import type { Range } from "@codemirror/state";

export const customKeywordHighlighting = ViewPlugin.fromClass(class {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.getDecorations(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.getDecorations(update.view);
    }
  }

  getDecorations(view: EditorView): DecorationSet {
    const decorations: Range<Decoration>[] = [];
/*
  // This is a regex literal. It's safer for complex patterns with backslashes.
  const combinedRegex = 
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:true|false)\b)|(\b(?:verify|checksig|after|older)\b)|(\b(?:signature|bool|string|number)\b)|(\b\d+\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)/g;
  // GRP 1: Strings | GRP 2: Booleans  | GRP 3: Keywords                    | GRP 4: Types                         | GRP 5: Nums | GRP 6: Identifiers
*/
// Step 1: Define each pattern separately for readability.
  // The .source property gives us the raw string pattern.
  // Literal
  const stringPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/.source;
  const booleanPattern = /(\b(?:true|false)\b)/.source;
  const numberPattern = /(\b\d+\b)/.source;
  // Control
  const controlPattern = /(\b(?:if|else|return)\b)/.source;
  // Type
  const typePattern = /(\b(?:signature|bool|string|number)\b)/.source;
  // Pragma
  const pragmaPattern = /(\b(?:pragma|bithoven|version|target|legacy|segwit|taproot)\b)/.source;
  // Bithoven keyword
  const statementPattern = /(\b(?:verify|after|older)\b)/.source;
  const cryptoPattern = /(\b(?:checksig|sha256|ripemd160)\b)/.source;
  const bytePattern = /(\b(?:len)\b)/.source;
  const compareOpPattern = /(==|!=|>=|<=|>|<)/.source;
  const logicalOpPattern = /(\|\||&&)/.source;
  const unaryMathOpPattern = /(\+\+|--|\bnegate\b|\babs\b|!)/.source;
  const infixMathOpPattern = /([+|-])/.source;
  const postfixMathOpPattern = /(\b(?:max|min)\b)/.source;

  // Step 2: Join the patterns into one final regex.
  // The order in this array determines the capture group number.
  const combinedRegex = new RegExp(
    [
      stringPattern,     
      booleanPattern,
      numberPattern, 
      controlPattern, 
      typePattern,  
      pragmaPattern,
      statementPattern,
      cryptoPattern,
      bytePattern,
      compareOpPattern,
      logicalOpPattern,
      unaryMathOpPattern,
      infixMathOpPattern,
      postfixMathOpPattern
    ].join('|'),
    'g'
  );

  for (const range of view.visibleRanges) {
    const text = view.state.doc.sliceString(range.from, range.to);
    let match;

    while ((match = combinedRegex.exec(text))) {
      let className = '';
      
      // Check the capture groups in the correct order
      if (match[1]) {
        className = 'cm-string';
      } else if (match[2]) {
        className = 'cm-bool';
      } else if (match[3]) {
        className = 'cm-number';
      } else if (match[4]) {
        className = 'cm-control';
      } else if (match[5]) {
        className = 'cm-type';
      } else if (match[6]) {
        className = 'cm-pragma';
      } else if (match[7]) {
        className = 'cm-statement';
      } else if (match[8]) {
        className = 'cm-crypto';
      } else if (match[9]) {
        className = 'cm-byte';
      } else {
        className = 'cm-operation';
      }


      const start = range.from + match.index;
      const end = start + match[0].length;
      
      if (className) {
        decorations.push(
          Decoration.mark({ class: className }).range(start, end)
        );
      }
    }
  }
  return Decoration.set(decorations);
  }
}, {
  decorations: v => v.decorations
});
/*

export const customTypeHighlighting = ViewPlugin.fromClass(class {
    decorations: DecorationSet;
  
    constructor(view: EditorView) {
      this.decorations = this.getDecorations(view);
    }
  
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.getDecorations(update.view);
      }
    }
  
    getDecorations(view: EditorView): DecorationSet {
      const decorations: Range<Decoration>[] = [];
      const customKeywords = /\b(signature)\b/g;
  
      for (const range of view.visibleRanges) {
        const text = view.state.doc.sliceString(range.from, range.to);
        let match;
        while ((match = customKeywords.exec(text))) {
          const start = range.from + match.index;
          const end = start + match[0].length;
          decorations.push(
            Decoration.mark({ class: "cm-custom-type" }).range(start, end)
          );
        }
      }
      return Decoration.set(decorations);
    }
  }, {
    decorations: v => v.decorations
  });

  */