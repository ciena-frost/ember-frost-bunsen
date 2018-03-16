# package.json

There are some **dependencies** and **devDependencies** in the _package.json_ file for which it may not be readily
understood why they are listed. This is the explanation:

## dependencies

Dependency | Reason
--- | ---
ember-hook | is used in the templates of this repository's components to facilitate building a hierarchical structure of hooks and as such needs to become part of the source code

## devDependencies

Dependency | Reason
--- | ---
n/a | n/a


# bower.json

There are some **dependencies** and **devDependencies** in the _bower.json_ file for which it may not be readily
understood why they are listed. This is the explanation:

## dependencies

Dependency | Reason
--- | ---
n/a | n/a

## devDependencies

Dependency | Reason
--- | ---
prism | This addon's dummy app runs `ember-frost-demo-components` which utilizes `ember-prism`. The version that we are currently required to use (due to the next releases including Babel 6 which we do not want at this time) require that the Bower `prism` package be installed as Bower packages in this addon.
showdown | This addon's dummy app runs `ember-frost-demo-components` which utilizes `ember-cli-showdown`. The version that we are currently required to use (due to the next releases including Babel 6 which we do not want at this time) require that the Bower `showdown` package be installed as Bower packages in this addon.
