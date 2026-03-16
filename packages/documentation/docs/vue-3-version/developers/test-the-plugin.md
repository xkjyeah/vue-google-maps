---
id: test-the-plugin
type: link
sidebar_label: Test the plugin
---
# Test the plugin

To test the plugin locally you can build a local package using the following script

```sh
pnpm run emulate:package
```

After that a new `.pack` folder will be generated at the same level than `src` or `dist` folders. When this new folder is ready you can install the plugin using that folder in any project that you are using to test it.

Go to the vue project that use the plugin and, in its root directory, at the same level of the `package.json` run the below command.

```sh
pnpm link ../gmap-vue/packages/v3/.pack
```

:::warning
Don't forget to add your own relative path there 👆🏼
:::

After do that your project will be using the plugin from the `.pack` folder and not downloading from the NPM registry.
