import {
  window,
  DecorationOptions,
  Range,
  TextEditor,
  MarkdownString,
  Position,
  TextDocument,
} from "vscode";
import { generateMessage, Message } from "./messages";
import { Highlight, HighLightType } from "./types";

let deco = window.createTextEditorDecorationType({
  after: {
    margin: "2em",
  },
});

export function decorate(editor: TextEditor, decorations: DecorationOptions[]) {
  editor.setDecorations(deco, decorations);
}

type Deco = {
  ln: number;
  position: Position;
  message: Message[];
  highLightType: HighLightType;
};

export function highlightsToDecorations(
  doc: TextDocument,
  highlights: Highlight[],
  shift: number
): DecorationOptions[] {
  let decorations = highlights.map((highlight) => {
    return {
      position: doc.lineAt(doc.positionAt(highlight.start + shift)).range.end,
      highlight: highlight,
    };
  });

  const grouped: Deco[] = [];
  decorations
    .sort((a, b) => a.highlight.type > b.highlight.type ? 1 : -1)
    .sort((a, b) => b.position.line - a.position.line)
    .forEach((current, index) => {
      const previous = decorations[index - 1];
      const message = current.highlight.message;
      const currentLineNumber = current.position.line;
      if (
        previous &&
        previous.highlight.type === current.highlight.type &&
        previous.position.line === currentLineNumber
      ) {
        grouped[grouped.length - 1].message.push(message);
      } else {
        grouped.push({
          ln: current.position.line,
          position: current.position,
          message: [message],
          highLightType: current.highlight.type,
        });
      }
    });

  return grouped.map((d) => {
    let message = generateMessage(d.message);
    return getDecoration(message, d.highLightType, d.position);
  });
}

export function getDecoration(
  message: string,
  icon: HighLightType,
  posIndex: Position
): DecorationOptions {
  let i = "";
  switch (icon) {
    case "success":
      i = "✅";
      break;
    case "error":
      i = "❌";
      break;
    case "hint":
      i = "🤷‍♂️";
      break;
    case "reference":
      i = "🔗";
      break;
  }

  const markdown = new MarkdownString(message);
  markdown.isTrusted = true;

  let decoration: DecorationOptions = {
    range: new Range(posIndex, posIndex),
    hoverMessage: markdown,
    renderOptions: {
      after: {
        contentText: i,
      },
    },
  };

  return decoration;
}
