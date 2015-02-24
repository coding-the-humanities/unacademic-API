# unacademic-API

This is the repository of the API for the Coding the Humanities unacademic web application.

## Up and Running

1. Fork and clone this repository.
2. Move into the repo directory with `cd unacademic-api`.
3. Install dependencies with `npm install`.
4. Run `grunt` to begin a watch and lint task.
5. Run `mocha test/<resource name>`(e.g. `mocha test/places.js`)   to run the tests.
5. Run `node index.js` to start the server.

## vagrant environment
1. ensure [ansible > 1.8.2](http://docs.ansible.com/intro_installation.html), [virtualbox](https://www.virtualbox.org/wiki/Downloads) and [vagrant > 1.7.2](https://www.vagrantup.com/downloads.html) are installed.
2. `vagrant up`
3. `npm run provision-vagrant`
4. `vagrant ssh`
5. inside the vagrant box, run
    - `cd /home/deploy/unacademic/`
    - `pm2 start index.js`
    - when necessary, reload the server with `pm2 reload all`
    - view logs of pm2 with `pm2 logs`