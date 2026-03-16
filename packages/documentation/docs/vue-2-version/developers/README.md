# Contributing guide

## Commit convention

We follow the [conventional commit style](https://www.conventionalcommits.org/en/v1.0.0/) to write our commits and can follow a semantic version of each package.

The commit structure is the follow for inline commits

```sh
type(scope): the message
```

of the following when you want to add a body or a footer.

```sh
type(scope): the message

body

footer
```

We use commitlint bot to ensure that all PRs follow this pattern, all PRs that not follow these rules will not be merged until the author fix all needed commits.

### Valid types

We follow the angular convention for types, some of the valid commit types are for example `feat`, `fix`, `chore`, etc; if you want a more detailed explanation please read the valid types on the [angular contributing guide](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type).

### Valid scopes

In this project the scopes are **required** this is because Lerna needs it to determine when it should upgrade the version of a package in the mono repository.

|Name|Description|
|----|-----------|
|root|This is for changes that only affect the root monorepo managed by Lerna|
|all|This is for changes that affect all packages and the root monorepo|
|gmap-vue|This is for changes that affect the `gmap-vue` package (the plugin package)|
|docs|This is for changes that affect the `documentation` package|

If you have changes that affect `gmap-vue` and `documentation` packages you can use the scope that contains the main changes, but this situation is very rare and **you must commit the changes in different commits** and each of one must have the corresponding scope.

### Subject min and max length

The subject should have **15** characters as a minimum and **75** as a maximum.

The subject should be a concise description of the changes.

### Body

The body of the commit is optional, there you can explain in a more detailed way the changes that you will commit. The maximum length of the body should be **300** characters.

### Footer

The footer of the commit is optional, there you should add the related issue if it exists, or a message if the commit close o resolve an issue. Also, you can put in this section the keyword `BREAKING CHANGE: message` to inform that this commit inserts a breaking change on the API, another option to do that is adding the `!` symbol after the `type(scope)` section.

Footer examples:

```sh
issue: #45
```

```sh
close: #45
```

```sh
resolve: #45
```

```sh
BREAKING CHANGE: This breaks the api that generate automatically all components.
```

## Git flow and history

At this moment we have one main branch `master` when you fork the project you must work on that branch.

This branch have a linear history and you should use the **rebase** strategy instead of ~~merge~~ strategy to maintain the linear history of the commits.

After ensuring that all changes in your branch works as expected we will merge it on the master branch and all features and fixes added to the master branch will automatically be deployed to npm and the documentation site.

## PR title (**deprecated**)

~~A tricky point that you need to keep in mind is because of the GitHub behaviour when you make a PR the title of the PR should be similar to an inline commit style, in this way the title validator will approve you PR and will review it and merge it.~~

~~The regex patter that validates the title for a PR is the following~~

```javascript
/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\()(deps|root|all|gmap-vue|documentation)(\))(:)(\s{1}[\.\/\-\_a-z0-9\s]+)$/gm
```

~~You can test this regex expression following this link [regexr.com/59fn0](regexr.com/59fn0).~~

## Code style

We follow the [Airbnb](https://github.com/airbnb/javascript) code style rules, if you have doubts, please read the explanation on his GitHub repository or the [Eslint documentation](https://eslint.org/docs/rules/).

Your changes must pass the linter before you can commit your changes, this is not optional and required to maintain the same style in the project.

## Tests

We have a few tests in the project and they must pass before we can merge your PR into the project.

We have planned to improve our tests adding jest and cypress to the project in the middle term.
