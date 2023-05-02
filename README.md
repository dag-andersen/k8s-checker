# <img src="/images/icon.png" width="70" /> Kubernetes Reference Highlighter

## Features

- [ Kubernetes Reference Highlighter](#-kubernetes-reference-highlighter)
  - [Features](#features)
    - [Suggestions](#suggestions)
    - [Code Navigation](#code-navigation)
    - [Graph View (Experimental)](#graph-view-experimental)
      - [Example](#example)
    - [Reference Highlighting](#reference-highlighting)
      - [Cluster Scanning](#cluster-scanning)
      - [Workspace Scanning](#workspace-scanning)
      - [Kustomize Scanning](#kustomize-scanning)
      - [Helm Scanning](#helm-scanning)
    - [Kustomize Build](#kustomize-build)
    - [Helm Template](#helm-template)
  - [Commands](#commands)
  - [Settings](#settings)
  - [Issues and feature requests](#issues-and-feature-requests)

### Suggestions

If a reference is not found, but a reference with a similar name exists, the extension will suggest using that instead.

<p float="left">
  <img src="/images/deco/suggestion-ingress.png" width="500" />
</p>
<p float="left">
  <img src="/images/deco/suggestion-deployment.png" width="500" />
</p>

### Code Navigation

Clicking any filename in one of the hovering boxes will send the user to that file/folder.

<p float="left">
  <img src="/images/deco/code-navigation-deployment.png" width="500" />
</p>

### Graph View (Experimental)

Running `Kubernetes Reference Highlighter: Show Dependency Diagram` in the Command Palette will show a diagram of the references between Kubernetes resources.

<p float="left">
  <img src="/images/graph-example-command.png" width="500" />
</p>

#### Example
<p float="left">
  <img src="/images/graph-example.png" width="500" />
</p>

### Reference Highlighting  

Currently, the extension only supports scanning of `Services`, `Pods`, `Deployments`, `StatefulSets`, `Jobs`, `CronJobs`, `Secrets`, and `ConfigMaps`. More resources will be added at a later point. 

All resources are namespace-sensitive. A resource will not be highlighted if the resource exists in another namespace.

#### Cluster Scanning

The extension calls the Kubernetes API of the user's current context and collects the names of all the objects the user has access to.

<p float="left">
  <img src="/images/deco/cluster-pod.png" width="500" />
</p>


#### Workspace Scanning

The extension will collect the names of all the objects in the manifest files found in the open VSCode workspace.

<p float="left">
  <img src="/images/deco/workspace-ingress.png" width="500" />
</p>

#### Kustomize Scanning

The extension will run `kustomize build` on all `kustomization`-files in the open workspace and collect the names of all the objects found in the generated kustomize-output.

<p float="left">
  <img src="/images/deco/kustomize-ingress.png" width="500" />
</p>

#### Helm Scanning

The extension will run `helm template` on all helm charts in the open workspace and collect the names of all the objects found in the generated helm-output.

<p float="left">
  <img src="/images/deco/helm-ingress.png" width="500" />
</p>

### Kustomize Build

The extension will inform the user if the kustomize-file builds or not.

<p float="left">
  <img src="/images/deco/kustomize-build-success.png" width="244" />
  <img src="/images/deco/kustomize-build-failed.png" width="250" /> 
</p>

_Note_: If you have [kustomize](https://kustomize.io/) installed as a stand-alone binary in your PATH, the extension will use `kustomize build` instead of `kubectl kustomize`.

### Helm Template 

The extension will inform the user if the helm chart builds or not.

<p float="left">
  <img src="/images/deco/helm-build-success.png" width="250" />
  <img src="/images/deco/helm-build-fail.png" width="245" /> 
</p>

## Commands

| Command                                                                          | Effect                                                                                |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `Kubernetes Reference Highlighter: Toggle WorkSpace Scanning`                    | Toggles Workspace Scanning                                                            |
| `Kubernetes Reference Highlighter: Toggle Cluster Scanning`                      | Toggles Cluster Scanning                                                              |
| `Kubernetes Reference Highlighter: Toggle Kustomize Scanning`                    | Toggles Kustomize Scanning                                                            |
| `Kubernetes Reference Highlighter: Toggle Helm Scanning`                         | Toggles Helm Scanning                                                                 |
| `Kubernetes Reference Highlighter: Toggle Reference Correction Hints`            | Toggles Suggestions                                                                   |
| `Kubernetes Reference Highlighter: Toggle Bi-directional Reference Highlighting` | Toggles Bi-directional Reference Highlighting (Disabling it may increase performance) |
| `Kubernetes Reference Highlighter: Show Dependency Diagram`                      | Shows a dependency diagram of the Kubernetes resources                                |

## Settings

| Setting                                                         | Default | Effect                                                                                |
| --------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `kubernetesReferenceHighlighter.enableWorkSpaceScanning`        | `true`  | Toggles Workspace Scanning                                                            |
| `kubernetesReferenceHighlighter.enableKustomizeScanning`        | `true`  | Toggles Kustomize Scanning                                                            |
| `kubernetesReferenceHighlighter.enableHelmScanning`             | `true`  | Toggles Helm Scanning                                                                 |
| `kubernetesReferenceHighlighter.enableClusterScanning`          | `true`  | Toggles Cluster Scanning                                                              |
| `kubernetesReferenceHighlighter.enableCorrectionHints`          | `true`  | Toggles Suggestions                                                                   |
| `kubernetesReferenceHighlighter.enabledBiDirectionalReferences` | `true`  | Toggles Bi-directional Reference Highlighting (Disabling it may increase performance) |


## Issues and feature requests 

Please open an issue on GitHub if you experience any issues or have ideas for future features.
