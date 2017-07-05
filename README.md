## Installation

```
git clone https://github.com/Upperstage/configurator.git
npm install
```

## Using the application
* [Deploy](#deploying) the configurator client application.
* [Start](https://github.com/bflemi3/acr-configurator#staring-the-server) the configurator server.
* From your browser, navigate to `http://localhost:8081`. *NOTE: Port 8081 is the default port of the server, however, this could be different on your machine. Please check the README of the [configurator server](https://github.com/bflemi3/acr-configurator) for more information.*

## Deploying<a href="#deploying"></a>

```
grunt deploy
```

To deploy the application you'll first need to clone and install the [configurator server](https://github.com/bflemi3/acr-configurator), then follow these steps...
1. Create an environment variable, `CONFIGURATOR_ROOT`, with the value being the root of the static directory in the configurator server, ie: `path/to/server/public`.
2. From the command prompt, cd to the root directory of the application and run `grunt deploy`. This will [build](#building) the application and deploy to the `CONFIGURATOR_ROOT`.

## Building<a href="#building"></a>

```
grunt build
```

Building the application will creata a `/dist` folder at the root of the project with the transformed application files packaged and ready for deployment. To build the application, from the command prompt, cd to the root directory of the application and run `grunt build`.

## Active development

```
grunt watch
```

To have your changes deployed to the server in real-time...
1. Ensure that the [configurator server](https://github.com/bflemi3/acr-configurator) is cloned and installed and that step 1 of the [deployment](#deploying) section (for this application) is completed.
2. From the command prompt, cd to the root directory of the application and run `grunt watch`. As changes are saved to individual files, the files will be built and deployed to the configurator server, ie: `CONFIGURATOR_ROOT`.