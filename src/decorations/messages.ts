import * as vscode from "vscode";
import { FromWhere, Local } from "../types";

type DefaultMessage = {
  content: string;
};

export type Message =
  | SubItemNotFound
  | ReferenceNotFound
  | ReferenceFound
  | SubItemFound
  | DefaultMessage;

export function generateMessage(mg: Message[]): string {
  if (mg.length === 0) {
    return "Error";
  }
  if (mg.every((m) => "type" in m)) {
    return generateFoundMessage(mg as ReferenceFound[]);
  } else if (mg.every((m) => "suggestion" in m && "subType" in m)) {
    return generateSubItemNotFoundMessage(mg as SubItemNotFound[]);
  } else if (mg.every((m) => "suggestion" in m)) {
    return generateNotFoundMessage(mg as ReferenceNotFound[]);
  } else if (mg.every((m) => "subType" in m)) {
    return generateSubItemFoundMessage(mg as SubItemFound[]);
  }
  const mes = mg as DefaultMessage[];
  return mes.map((m) => m.content).join("\\\n");
}

type ReferenceFound = {
  type: string;
  name: string;
  pwd: string;
  fromWhere: FromWhere;
};

function generateFoundMessage(mg: ReferenceFound[]): string {
  if (mg.length === 0) {
    return "Error";
  }
  if (mg.length === 1) {
    const { type, name, pwd, fromWhere } = mg[0];
    return `✅ Found ${type}: \`${name}\` ${individualRef(fromWhere, pwd)}`;
  }

  const type = mg[0].type;
  const name = mg[0].name;

  const header = `✅ Found ${type}: \`${name}\` in:`;
  return mg.reduce(
    (acc, { pwd, fromWhere }) => acc + `\n- ${listRef(fromWhere, pwd)}`,
    header
  );
}

type ReferenceNotFound = {
  name: string;
  suggestion: string;
  pwd: string;
  fromWhere: FromWhere;
};

function generateNotFoundMessage(mg: ReferenceNotFound[]): string {
  if (mg.length === 0) {
    return "Error";
  }

  if (mg.length === 1) {
    const { name, pwd, fromWhere, suggestion } = mg[0];
    return `🤷‍♂️ \`${name}\` not found. Did you mean \`${suggestion}\`? (From ${individualRef(fromWhere, pwd)})`;
  }

  const { name } = mg[0];
  const header = `🤷‍♂️ \`${name}\` not found.`;
  return mg.reduce(
    (acc, { pwd, fromWhere, suggestion }) =>
      acc + `\n- Did you mean \`${suggestion}\`? (From ${listRef(fromWhere, pwd)})`,
    header
  );
}

type SubItemFound = {
  subType: string;
  mainType: string;
  subName: string;
  mainName: string;
  pwd: string;
  fromWhere: FromWhere;
};

function generateSubItemFoundMessage(mg: SubItemFound[]): string {
  if (mg.length === 0) {
    return "Error";
  }
  if (mg.length === 1) {
    const { subType, mainType, subName, mainName, pwd, fromWhere } = mg[0];
    return `✅ Found ${subType}: \`${subName}\` in ${mainType}: \`${mainName}\` ${individualRef(fromWhere, pwd)}`;
  }

  const { subType, mainType, subName, mainName } = mg[0];
  const header = `✅ Found ${subType}: \`${subName}\` in ${mainType}: \`${mainName}\` in:`;
  return mg.reduce(
    (acc, { pwd, fromWhere }) => acc + `\n- ${listRef(fromWhere, pwd)}`,
    header
  );
}

type SubItemNotFound = {
  subType: string;
  mainType: string;
  subName: string;
  mainName: string;
  suggestion: string;
  pwd: string;
  fromWhere: FromWhere;
};

function generateSubItemNotFoundMessage(mg: SubItemNotFound[]): string {
  if (mg.length === 0) {
    return "Error";
  }
  if (mg.length === 1) {
    const { subType, pwd, subName, mainType, fromWhere, suggestion, mainName } = mg[0];
    return `🤷‍♂️ _${subType}_: \`${subName}\` not found in _${mainType}_: \`${mainName}\` ${individualRef(fromWhere, pwd)}.\\\nDid you mean \`${suggestion}\`?`;
  }

  const { subType, subName, mainType, mainName } = mg[0];
  const header = `🤷‍♂️ _${subType}_: \`${subName}\` not found in:`;
  return mg.reduce(
    (acc, { pwd, fromWhere, suggestion }) =>
      acc + `\n- _${mainType}_: \`${mainName}\` ${listRef(fromWhere, pwd)}.\\\nDid you mean \`${suggestion}\`?`,
    header
  );
}

function getRelativePath(path: string, pwd: string): string {
  const p = require("path");
  const fromFilePath = path;
  const relativeFilePathFromRoot = vscode.workspace.asRelativePath(
    fromFilePath || ""
  );
  const activeDirPath: string = p.dirname(pwd || "");
  const relativePathFromActive: string = p.relative(
    activeDirPath || "",
    fromFilePath
  );
  return relativeFilePathFromRoot.length < relativePathFromActive.length
    ? "/" + relativeFilePathFromRoot
    : relativePathFromActive.includes("/")
    ? relativePathFromActive
    : "./" + relativePathFromActive;
}

function individualRef(fromWhere: FromWhere, pwd: string): string {
  const { place } = fromWhere;

  if (place === "cluster") {
    return `in Cluster (_${fromWhere.context}_)`;
  }

  if (place === "workspace") {
    return `in ${link(fromWhere, pwd)}`;
  }
  if (place === "kustomize" || place === "helm") {
    return `with _${capitalize(place)}_ at ${link(fromWhere, pwd)}`;
  }
  return "Error";
}

function listRef(fromWhere: FromWhere, pwd: string): string {
  const { place } = fromWhere;

  if (place === "cluster") {
    return `Cluster (_${fromWhere.context}_)`;
  }

  if (place === "kustomize" || place === "helm") {
    return `${link(fromWhere, pwd)} (_${capitalize(fromWhere.place)}_)`;
  }

  return link(fromWhere, pwd);
}

function link(local: Local, pwd: string): string {
  const { place, path } = local;

  if (place === "kustomize" || place === "helm") {
    const folder = path.substring(0, path.lastIndexOf("/"));
    const relativePath = getRelativePath(folder, pwd);
    return `[\`${relativePath}\`](${path})`;
  }

  const relativePath = getRelativePath(path, pwd);
  return `[\`${relativePath}\`](${path})`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
