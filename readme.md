# IONDV. Develop-and-test

Develop-and-test is a IONDV. Framework application. 

<h1 align="center"> <a href="https://www.iondv.com/"><img src="/dnt.png" height="500px" alt="IONDV. Develop-and-test" align="center"></a>
</h1> 

## Start with IONDV. Framework

**IONDV. Framework** - is a node.js open source framework for developing accounting applications
or microservices based on metadata and individual modules. Framework is a part of 
instrumental digital platform to create enterprise 
(ERP) apps. This platform consists of the following open-source components: the [IONDV. Framework](https://github.com/iondv/framework), the
[modules](https://github.com/topics/iondv-module) и ready-made applications expanding it
functionality, visual development environment [Studio](https://github.com/iondv/studio) to create metadata for the app.

* [IONDV. Framework](https://github.com/iondv/framework/)
* [IONDV. Framework Docs](https://github.com/iondv/framework/blob/master/docs/en/index.md)

## Description 

**Develop-and-test** - is created to show you the type of metadata and basic functional modules of the IONDV. Framework and to 
highlight the most powerful features. It has most of the components from the full version to get you a walkthrough of our framework to build top quality web applications. 

### Demo
Go to <a href="https://dnt.iondv.com">dnt.iondv.com</a>. No registration needed. The login for access is - `demo` and the password is - `ion-demo`.

### Software requirements

Install [Node.js](<https://nodejs.org/en/>) runtime and npm package manager to run the IONDV.Framework. Version 10.x.x.   

Install and run the [MongoDB](https://www.mongodb.org/) DBMS to store the data. Version 3.6.  

### Installer

You can use IONDV. Framework apps installer, requiring installed node.js, mongodb and git. During the installation, all other dependencies will be checked and installed, and the application itself will be built and run.

Install in one line:

```
bash <(curl -sL https://raw.githubusercontent.com/iondv/iondv-app/master/iondv-app) -t git -q -i -m localhost:27017 develop-and-test
```
Where  `localhost: 27017` is the MongoDB address, and `develop-and-test` is the app name.

Also the other way is to clone - (`git clone https://github.com/iondv/iondv-app.git`) and install the app by using the `bash iondv-app -m localhost:27017 develop-and-test` command.

<details>
  <summary> 
    <h3> 
      Gitclone with repository
    </h3> 
  </summary>


#### Global dependencies

To build all components and libraries, you need to install the following components globally:

* package [node-gyp](<https://github.com/nodejs/node-gyp>) `npm install -g node-gyp`. For the Windows operating system, 
it is additionally necessary to install the windows-build-tools package `npm install -g --production windows-build-tools`
* [Gulp](<http://gulpjs.com/>) installation package `npm install -g gulp@4.0`. `4.0` - supported version of `Gulp`
* package manager of frontend libraries [Bower](<https://bower.io>) `npm install -g bower`

#### Core, modules and application

The dependencies are listed in the [`package.json`](https://github.com/iondv/develop-and-test/blob/master/package.json) file.

*Example of the `package.json` file:*

```
  "engines": {
    "ion": "3.0.0"
  },
  "ionModulesDependencies": {
    "registry": "3.0.0",
    "geomap": "1.5.0",
    "portal": "1.4.0",
    "report": "2.0.0",
    "ionadmin": "2.0.0",
    "dashboard": "1.1.0",
    "soap": "1.1.2"
  },
  "ionMetaDependencies": {
    "viewlib": "0.9.1"
  }
```
* Install the core, Its version is specified in the `engines": "ion": 3.0.0` parameter. Copy the URL of the core repository
 and execute the command `git clone https://github.com/iondv/framework.git dnt`, where `dnt` is a application name, for 
 example full path is `/workspace/dnt'. Go to 
 the core folder and switch the tag of  the version number `git checkout tags/3.0.0`.
* Further, install the modules listed in the `ionModulesDependencies` parameter. Navigate to the module folder executing 
the `cd modules` command. Clone modules from the `ionModulesDependencies` list, for the registry module the command is 
`git clone https://github.com/iondv/registry.git`. Go to the folder of the installed module and switch the tag of the 
version number `git checkout tags/3.0.0`. Repeat for each module.  
* To install the application, go to the application folder executing the `cd ..\applications` command, if you're in the module folder. 
Clone the path to repository by `git clone https://github.com/iondv/develop-and-test.git`command. Go to the folder of 
installed application and switch the tag of the version number `git checkout tags/2.0.0`. 
* Finally, install all necessary applications listed in the `ionMetaDependencies` parameter in the `applications` folder. 
Make sure that you're inside this folder. Clone the dependencies in `ionMetaDependencies`, in particularly ` viewlib` - 
a additional application - library of views templates. Execute the `git clone https://github.com/iondv/viewlib.git` to 
clone to the `applications` folder. Go to the folder of installed application and switch to the tag of the version 
number `git checkout tags/0.9.1`. Repeat for each application. 
 
#### Building, configuring and deploying the application

Building the application provides installation of all depended libraries, importing data into the database and preparing 
the application for launch.  

Create the configuration file `setup.ini` in the `/config` folder of the core to set the main parameters of the 
application environment.  

```
auth.denyTop=false 
auth.registration=false 
auth.exclude[]=/files/**
auth.exclude[]=/images/**
db.uri=mongodb://127.0.0.1:27017/iondv-dnt-db
server.ports[]=8888
module.default=registry
fs.storageRoot=./files
fs.urlBase=/files
```

Open the file and paste the text above. The main parameter is `db.uri=mongodb://127.0.0.1:27017/iondv-dnt-db`. It shows the 
base name that we use for the application. The DB will be created automatically. 

Set the `NODE_PATH` environment variable which is equal to the path of the application core. For Windows the command 
is `set NODE_PATH=c:\workspace\dnt`, for Linux - `export NODE_PATH=/workspace/dnt`. `/workspace/dnt` is the directory of 
the application.   

The `npm install` installs all key dependencies, including locally the `gulp` build-tool. Please make sure that the Gulp 
version - is `4.0`. 

Further, execute the `gulp assemble` command to build and deploy the application.

If you want to import data into your project, check the demo data in the `data` folder of the application and run the command:
`node bin/import-data --src ./applications/develop-and-test --ns develop-and-test`

Add the admin user with the 123 password executing the `node bin\adduser.js --name admin --pwd 123` command. 

Add admin rights to the user executing the `node bin\acl.js --u admin@local --role admin --p full` command.

#### Running

Run the app, executing the `npm start` or `node bin/www` command. 

Open this link `http://localhost:8888` in a browser and log in. `8888` —  is a port in the `server.ports` parameter.

 </details>

### Docker
Follow these steps to deploy [docker container](https://hub.docker.com/r/iondv/dnt):

1. Run mongodb

```bash
docker run  --name mongodb \
            -v mongodb_data:/data/db \
            -p 27017:27017 \
            --restart unless-stopped \
            -d \
            mongo
```

2. Deploy your **IONDV. Develop-and-test** and additional applications 
```bash
docker run --entrypoint="" --link mongodb --rm iondv/dnt node bin/import --src ./applications/develop-and-test --ns develop-and-test
docker run --entrypoint="" --link mongodb --rm iondv/dnt node bin/setup develop-and-test --reset
docker run --entrypoint="" --link mongodb --rm iondv/dnt node bin/setup viewlib
```

If you want to import data into your project, check the demo data in the `data` folder of the application and run the command:
```
docker run --entrypoint="" --link mongodb --rm iondv/dnt node bin/import-data --src ./applications/develop-and-test --ns develop-and-test
```

3. Create user `admin` with password `123` and `admin` role
```
docker run --entrypoint="" --link mongodb --rm iondv/dnt node bin/adduser --name admin --pwd 123
docker run --entrypoint="" --link mongodb --rm iondv/dnt node bin/acl --u admin@local --role admin --p full
```

4. Start application
```
docker run -d -p 80:8888 --name dnt --link mongodb iondv/dnt
```

Open `http://localhost/` in your browser.


--------------------------------------------------------------------------  


 #### [License](/LICENSE) &ensp;  [Contact us](https://iondv.com) &ensp;   &ensp; [FAQs](/faqs.md)          

<div><img src="https://mc.iondv.com/watch/local/docs/app/dnt" style="position:absolute; left:-9999px;" height=1 width=1 alt="iondv metrics"></div>

--------------------------------------------------------------------------  

Copyright (c) 2019 **LLC "ION DV"**.  
All rights reserved. 
