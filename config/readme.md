# Purpose

The folder contains configuration settings that need to be applied to the core.

Change only those parameters (top-level properties) that are set in the meta configuration files and those files that are in this folder.

### Example

File config.json

``` JSON
{
    "content":{
        "serverRendering": false,
        "homeRedirect": "/reestr"
    }
}
```

This file `\app\config\config.json`

```{
    "runmode": "production",
    "port": [8888, 8889],
    "appURL": "localhost",
    "db": "mongodb",
    "mongodb": {
        "uri": "mongodb://127.0.0.1:27017/ion",
        "options": {
            "server": {
                "socketOptions":{
                    "keepAlive": 1
                }
            }
        },
        "connectionLimit": 10,
        "schema": "ion",
        "user": "root",
        "password": "ION-sql1"
    },
    "content":{
        "serverRendering": false,
        "homeRedirect": "/home"
    },
}```

will be changed as follows:

```{
    "runmode": "production",
    "port": [8888, 8889],
    "appURL": "localhost",
    "db": "mongodb",
    "mongodb": {
        "uri": "mongodb://127.0.0.1:27017/ion",
        "options": {
            "server": {
                "socketOptions":{
                    "keepAlive": 1
                }
            }
        },
        "connectionLimit": 10,
        "schema": "ion",
        "user": "root",
        "password": "ION-sql1"
    },
    "content":{
        "serverRendering": false,
        "homeRedirect": "/reestr"
    },
}```