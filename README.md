# **Rhapsody framework** _for electron_
A framework that uses typescript, sass and ejs templates to make projects easily.

# Disclaimer
Please, don't use this for real projects because is not finished yet. :sweat_smile:


# Requirements

- Nodejs
- Electron
- Gulp

# Setup

- First of all we need to download the project

```bash
git clone https://github.com/admorenog/rhapsody.git
```

- Then we need to download the node packages

```bash
npm install
```

	Dont' worry about the sass vulnerabilities, these packages are used only in development mode and I hope they can fix it soon.

- Finally we need to execute gulp (maybe you need to install it globally).
```bash
gulp
gulp watch
```

This gonna create a new folder called app with the transpiled files, you can run the project in debug mode. Now we can start our project.

# Getting started

This framework is a MVC based structure, we have in the src folder the structure, but also we have some extra files like the .env file, config files or resource files. We going to see what is going on with these files.

## .env file

The .env file setups the environment variables, these variables are only to setup some constants in our project like the systray icon, the app name or the debug variable, which allow us to change the behaviour (for example: show de web developer tools).

It's not saved because it isn't neccesary to run the project (config files can manage it).

## Config files
In the config folder we have some .js files. The difference between the .env file and this files are that there is a lot of variables that probabilly you'll never change and in the .env file we going to store the main variables that commonly we are changing while we are developing.

## core folder
A folder with a bunch of porn. Useless, don't touch it, please.

## dist folder
Here is where we going to compile the release version of our application.

## node_modules
Vendor modules for nodejs, if you have any problem with npm you can delete it and execute npm install again to remake it.

## resources folder
This is the assets path, we can store here anything. Our view scripts and sass will be transpiled into this folder (inside css and js folders).

## MVC
In the controllers and models folders we just going to save the models and the controllers, but in the views folder we have: scripts, styles and templates.

### templates
ejs files to make the view.
### scripts
ts files that will be transpiled in the resources folder to use in the templates.
### styles
scss files like the scripts folder.

# How this framework works
In our .env file or in the app.js config file we going to setup the start page.

The pages are setted as method@controller (route). The controller will process some data and will send it to the returned view.

In the view you can call (through buttons like the main menu or the systray menu) other route to change the view, window or execute some background process.