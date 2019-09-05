# ws-server-ftw

[![Build Status](https://travis-ci.com/abidibo/ws-server.svg?branch=master)](https://travis-ci.com/abidibo/ws-server)
[![Coverage Status](https://coveralls.io/repos/github/abidibo/ws-server/badge.svg?branch=master)](https://coveralls.io/github/abidibo/ws-server?branch=master)

> Mock websocket endpoints with ease

ws-server was developed in order to allow a developer to easily mock websocket apis in a few seconds. The idea is taken from [json-server](https://github.com/typicode/json-server), a great package which lets you mock entire rest apis.

![Screenshot](screenshot.png)

# Install

[![NPM](https://nodei.co/npm/ws-server-ftw.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ws-server-ftw/)

    $ npm install ws-server-ftw --save-dev

# Getting started

ws-server lets you send through a socket connection data defined in a json or js file.
The mock server will serve the requested path traversing the json provided with the same path, i.e. the path `/foo/bar` will serve (if db is the json object) `db['foo']['bar']`

A js file can be used instead of a json in order to perform operations or send random stuff, such js should export an object.

Data are sent when the connection occurs. Then the application continues listening for stdin inputs, so that it is possible to:

- send again the input data (just hit Enter)
- send new data: just enter the new data in a valid json format and hit Enter
- merge new data: just enter `'merge <NEW_DATA>'`, where `<NEW_DATA>` should be in a valid json format and hit Enter
- deep-merge new data: just enter `'deepmerge <NEW_DATA>'`, where `<NEW_DATA>` should be in a valid json format and hit Enter
- append new data (if the endpoints returns an array): just enter `'append <NEW_DATA>'`, where `<NEW_DATA>` should be in a valid json format and hit Enter

Incoming messages will be printed to the console.

## Start the cli

    $ ws-server -i mydb.json

Available options:

    $ ws-server -h

    usage: index.js [-h] [-v] [-p PORT] -i DB

    ws-server cli

    Optional arguments:
      -h, --help            Show this help message and exit.
      -v, --version         Show program's version number and exit.
      -p PORT, --port PORT  Websocket server port
      -i DB, --input DB     JSON or js input file which exports (es5) an object

# Example

Given the following `db.json`:

    {
      "api": {
        "v1": {
          "ui": {
            "modalIsOpen": true,
            "sidebarStyle": "dark"
          },
          "users": [
            {
              "username": "admin",
              "email": "admin@example.com",
              "id": 1,
              "role": "admin"
            },
            {
              "username": "guest",
              "email": "guest@example.com",
              "id": 2,
              "role": "guest"
            }
          ]
        }
      }
    }


A socket client connected to the path `ws://localhost:9704/api/v1/` will receive this data:

     {
      "ui": {
        "modalIsOpen": true,
        "sidebarStyle": "dark"
      },
      "users": [
        {
          "username": "admin",
          "email": "admin@example.com",
          "id": 1,
          "role": "admin"
        },
        {
          "username": "guest",
          "email": "guest@example.com",
          "id": 2,
          "role": "guest"
        }
      ]
    }



Now hit Enter to send the data again.

Entering `merge {"ui": {"foo": "bar"}}` and pressing Enter the client will receive:

    {
      "ui": {
        "foo": "bar"
      },
      "users": [
        {
          "username": "admin",
          "email": "admin@example.com",
          "id": 1,
          "role": "admin"
        },
        {
          "username": "guest",
          "email": "guest@example.com",
          "id": 2,
          "role": "guest"
        }
      ]
    }


Entering `deepmerge {"ui": {"foo": "bar"}}` and pressing Enter the client will receive:

    {
      "ui": {
        "modalIsOpen": true,
        "sidebarStyle": "dark",
        "foo": "bar"
      },
      "users": [
        {
          "username": "admin",
          "email": "admin@example.com",
          "id": 1,
          "role": "admin"
        },
        {
          "username": "guest",
          "email": "guest@example.com",
          "id": 2,
          "role": "guest"
        }
      ]
    }

Entering `deepmerge {"users": [{"username": "foo"}]}` and pressing Enter, the client will receive:


    {
      "ui": {
        "modalIsOpen": true,
        "sidebarStyle": "dark"
      },
      "users": [
        {
          "username": "admin",
          "email": "admin@example.com",
          "id": 1,
          "role": "admin"
        },
        {
          "username": "guest",
          "email": "guest@example.com",
          "id": 2,
          "role": "guest"
        },
        {
          "username": "foo"
        }
      ]
    }

## Contributing

This project it's quite simple actually, I've developed it to match my needs during some UI implementations with react relying upon socket communication.

Pull request and new contributions will be much appreciated. Please just make sure to be compliant with the eslint configuration before submitting.

Also I preferred not to arm ES6 and ES7 features here, so let's keep the code ES2015 compatible, in order to avoid babel transpiling.
