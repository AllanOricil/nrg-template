<div style="display: flex;">
<a href="https://github.com/AllanOricil/nrg-cli" style="margin-right: 10px;"><img src="https://img.shields.io/badge/built%20with-nrg-A80000.svg?labelColor=black&style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9Im91dGxpbmVHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiAjODA4MDgwOyBzdG9wLW9wYWNpdHk6IDEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6ICM0MDQwNDA7IHN0b3Atb3BhY2l0eTogMSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImhleGFnb25HcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiAjQTgwMDAwOyBzdG9wLW9wYWNpdHk6IDEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6ICM0QjAwMDA7IHN0b3Atb3BhY2l0eTogMSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpZ2h0bmluZ0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6ICNmZmZmZmY7IHN0b3Atb3BhY2l0eTogMSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjogI2UwZTBlMDsgc3RvcC1vcGFjaXR5OiAxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBvbHlnb24gcG9pbnRzPSI1MCwyIDk4LDI1IDk4LDc1IDUwLDk4IDMsNzUgMywyNSIgCiAgICAgICAgICAgc3Ryb2tlPSJ1cmwoI291dGxpbmVHcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0idXJsKCNoZXhhZ29uR3JhZGllbnQpIiAvPgoKICA8cGF0aCBkPSJNMzMgMGwxOS43OTcyIDM5LjQ1NzQtMjguNTAyMi0xMS4xMTg0TDc0IDk4IDUxLjA2MDggNDkuMzA1NCA3MSA1NloiIAogICAgICAgIGZpbGw9InVybCgjbGlnaHRuaW5nR3JhZGllbnQpIiBzdHJva2U9Im5vbmUiIC8+Cjwvc3ZnPgo="/></a>

<a href="https://github.com/AllanOricil/node-red-node-esm-template/actions/workflows/ci.yaml"><img src="https://github.com/AllanOricil/node-red-node-esm-template/actions/workflows/ci.yaml/badge.svg?branch=main" alt="build status"></a>

</div>

# node-red-node-esm-template

This project illustrates the utilization of the `nrg` CLI for the development of Node-RED nodes.

## 📁 Directory Structure

This project is built using the `nrg` cli.

```bash
node-red-node-es-template/
└── src/
    └── nodes/
        ├── node-1/
        │   ├── client/
        │   │   ├── locales/
        │   │   │   ├── labels/
        │   │   │   │   ├── de.json
        │   │   │   │   └── en-US.json
        │   │   │   └── docs/
        │   │   │       ├── de.html
        │   │   │       └── en-US.html
        │   │   ├── icons/
        │   │   │   └── icon-1.png
        │   │   ├── index.html
        │   │   └── index.js
        │   └── server/
        │       └── index.js
        └── node-2/
            ├── client/
            │   ├── locales/
            │   │   ├── labels/
            │   │   │   ├── de.json
            │   │   │   └── en-US.json
            │   │   └── docs/
            │   │       ├── de.html
            │   │       └── en-US.html
            │   ├── icons/
            │   │   └── icon-2.png
            │   ├── index.html
            │   └── index.js
            └── server/
                └── index.js
```

### dist

```bash
node-red-node-es-template/
└── dist/
    ├── icons/
    │   ├── icon-1.png
    │   └── icon-2.png
    ├── locales/
    │   ├── de/
    │   │   ├── index.html
    │   │   └── index.json
    │   └── en-US/
    │       ├── index.html
    │       └── index.json
    ├── index.html
    ├── index.js.map
    └── index.js
```

## 💻 Dev Environment Requirements

| Tool | Version |
| ---- | ------- |
| node | >= 18   |
| npm  | >= 10   |

## 📖 How to test your node

1. open a terminal in the root of this project
2. run `npm install`
3. run `npm run start` and wait for your browser to open
4. verify that 4 nodes are available in the pallete, in the "custom nodes" group.

## 📖 Other commands

All the following commands are set in the `scripts` section of `package.json` and were created using the `nrg` CLI.

### `npm run build`

Builds the project for production.

### `npm run build:dev`

Builds the project for development.

### `npm run start`

Starts Node-RED with nodes built for development.

### `npm run start:prod`

Starts Node-RED with nodes built for production.

### `npm run start:debug`

Starts Node-RED with nodes built for development and enables debug mode, allowing you to attach a debugger to the server side.

### `npm run watch`

Starts Node-RED with nodes built for development and enables watch mode. This will automatically rebuild your nodes, restart the flows, and refresh/open the browser whenever changes are made to files in ./src.

### `npm run watch:debug`

Starts Node-RED with nodes built for development in both watch and debug modes. This setup allows you to automatically rebuild, restart, and debug the server side with the ability to attach a debugger.

### Creating Nodes

If you have the `nrg` CLI installed globaly, you can create a new node with the following commnad:

```bash
nrg create node -n my-node-name
```

or, if you have it installed as a dev dependency, you can use:

```bash
./node_modules/.bin/nrg create node -n my-node-name
```

### Starting a new nrg project

If you have the `nrg` CLI installed globally, you can run the following commands to get started:

```bash
nrg create -n my-nrg-project
cd my-nrg-project

npm install
# pnpm install
# yarn install
```
