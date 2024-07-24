# custom-node-red-node-es-template

![custom-nodes](./images/custom-nodes.png)

## 📁 Directory Structure

```bash
node-red-node-es-template/
├── assets/
│   ├── icons/
│   │   └── icon.png
│   └── locales/
│       ├── de/
│       │   ├── index.hmtl
│       │   └── index.json
│       └── en-US/
│           ├── index.html
│           └── index.json
├── dist/
│   ├── icons/
│   │   └── icon.png
│   ├── locales/
│   │   ├── de/
│   │   │   ├── index.hmtl
│   │   │   └── index.json
│   │   └── en-US/
│   │       ├── index.html
│   │       └── index.json
│   ├── index.html
│   ├── index.js
│   └── index.js.map
├── src/
│   ├── nodes/
│   │   ├── node-1/
│   │   │   ├── index.js
│   │   │   └── index.html
│   │   └── node-2/
│   │       ├── index.js
│   │       └── index.html
│   └── index.js
├── package.json
└── package-lock.json
```

## 💻 Dev Environment Requirements

| Tool           | Version |
| -------------- | ------- |
| node           | >= 18   |
| npm            | >= 10   |
| docker         | >= 26   |
| docker compose | >= 2    |

## 📖 How to test your node

1. open a terminal in the root of this project
2. run `npm install`
3. run `npm run docker:compose:up`
4. open your browser
5. navigate to `http://localhost:1880`
6. verify that the pallete contains the nodes you are developing in these repository

## 📝 TODO

- create a compiler to generate the html for i18n help text based on markdown
- create a compiler for bundling the node's client side js and generate the final client side html
