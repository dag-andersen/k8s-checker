import { format } from "util";
import * as vscode from "vscode";
import { FromWhere } from "./types";

// log message
const diagnosticCollectionTest = vscode.languages.createDiagnosticCollection(
  "kubernetes-reference-highlighter-test"
);

const diagnostics: vscode.Diagnostic[] = [];

export function logRest() {
  diagnostics.length = 0;
}

export function logText(a: any, b = 0) {
  const current = vscode.window.activeTextEditor?.document;
  diagnostics.push(
    new vscode.Diagnostic(
      new vscode.Range(b, 0, b, 0),
      format(a),
      vscode.DiagnosticSeverity.Information
    )
  );
  diagnosticCollectionTest.set(current!.uri, diagnostics);
}

export type Message = ReferenceFound | ReferenceNotFound | SubItemFound;

export function generateMessage(mg: Message) {
  if ("type" in mg) {
    return generateFoundMessage(mg);
  } else if ("suggestion" in mg) {
    return generateNotFoundMessage(mg);
  } else {
    return generateSubItemFoundMessage(mg);
  }
}

type ReferenceFound = {
  type: string;
  name: string;
  activeFilePath: string;
  fromWhere?: FromWhere;
};

function generateFoundMessage(mg: ReferenceFound) {
  const { type, name, activeFilePath, fromWhere } = mg;
  const p = require("path");
  let message = `✅ Found ${type}: ${name}`;
  if (fromWhere) {
    if (typeof fromWhere === "string") {
      message += ` in ${fromWhere}`;
    } else {
      const fromFilePath = fromWhere.path;
      const relativeFilePathFromRoot = vscode.workspace.asRelativePath(
        fromFilePath || ""
      );
      const activeDirPath: string = p.dirname(activeFilePath || "");
      const relativePathFromActive: string = p.relative(
        activeDirPath || "",
        fromFilePath
      );
      const path =
        relativeFilePathFromRoot.length < relativePathFromActive.length
          ? "/" + relativeFilePathFromRoot
          : relativePathFromActive.includes("/")
          ? relativePathFromActive
          : "./" + relativePathFromActive;
      message += ` in ${fromWhere.place} at ${path}`;
    }
  }
  return message;
}

type ReferenceNotFound = {
  name: string;
  suggestion: string;
  activeFilePath: string;
  fromWhere?: FromWhere;
};

function generateNotFoundMessage(mg: ReferenceNotFound) {
  const { name, activeFilePath, fromWhere, suggestion } = mg;
  const p = require("path");
  let message = `🤷‍♂️ ${name} not found. Did you mean ${suggestion}?`;
  if (fromWhere) {
    if (typeof fromWhere !== "string") {
      const fromFilePath = fromWhere.path;
      const relativeFilePathFromRoot = vscode.workspace.asRelativePath(
        fromFilePath || ""
      );
      const activeDirPath: string = p.dirname(activeFilePath || "");
      const relativePathFromActive: string = p.relative(
        activeDirPath || "",
        fromFilePath
      );
      const path =
        relativeFilePathFromRoot.length < relativePathFromActive.length
          ? "/" + relativeFilePathFromRoot
          : relativePathFromActive.includes("/")
          ? relativePathFromActive
          : "./" + relativePathFromActive;
      message += ` (in ${fromWhere.place} at ${path})`;
    }
  }
  return message;
}

type SubItemFound = {
  subType: string;
  mainType: string;
  subName: string;
  mainName: string;
  activeFilePath: string;
  fromWhere?: FromWhere;
};

function generateSubItemFoundMessage(mg: SubItemFound) {
  const { subType, mainType, subName, mainName, activeFilePath, fromWhere } = mg;
  const p = require("path");
  let message = `✅ Found ${subType}: ${subName} in ${mainType}: ${mainName}`;
  if (fromWhere) {
    if (typeof fromWhere === "string") {
      message += ` at ${fromWhere}`;
    } else {
      const fromFilePath = fromWhere.path;
      const relativeFilePathFromRoot = vscode.workspace.asRelativePath(
        fromFilePath || ""
      );
      const activeDirPath: string = p.dirname(activeFilePath || "");
      const relativePathFromActive: string = p.relative(
        activeDirPath || "",
        fromFilePath
      );
      const path =
        relativeFilePathFromRoot.length < relativePathFromActive.length
          ? "/" + relativeFilePathFromRoot
          : relativePathFromActive.includes("/")
          ? relativePathFromActive
          : "./" + relativePathFromActive;
      message += ` at ${fromWhere.place} at ${path}`;
    }
  }
  return message;
}
