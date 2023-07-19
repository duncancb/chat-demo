### General

A simple chat app which allows multiple users to:
  * Message all users in a single channel
  * Mention each other by @<user name>
  * Receive mention alerts audio + system notification
  * Reload all past messages

### Built on

* npm 9.7.2
* node v20.4.0
* postgres 14.8

### Install and run

* Setup postgres and app containers
  `docker-compose up --build -d`
* The chat app should be available on 0.0.0.0:3000 / localhost:3000
* The postgres database should be available on 172.17.0.1:5431

### Uninstall

 * `docker container stop chat-server`
 * `docker container stop chat-room_db_1`
 * `docker container rm chat-server`
 * `docker container rm chat-room_db_1`
 * `docker image rm chat-room_web_app`
 * `docker image rm postgres:14.8`
 * `docker image rm node:20.4-alpine3.17`
 * `sudo rm -r <install path>`
   Root permission is required because the root-owned postgres volume is stored at `<install path>/docker/postgres/data`

### Possible improvements

* Rebuild front end using React and Graphql.
* Add login and auth.
* Implement unit tests.
* Fix bug where messages do not scroll to the bottom on reload. It is possible that the page is not fully loaded when the messages are repopulated.
* Add configuration for production environment.
* Fix docker-compose network configuration. Currently the default bridge is used to connect to postgres.
* Move database passwords to docker secrets.
* When reloading old messages, place a limit on the messages reloaded; eg: only load messages from the last week.

### Third party resources and code

* "src/public/sounds/new_mention.wav" was taken from "https://mixkit.co/free-sound-effects/click/". The original file name was "mixkit-click-error-1110.wav".
* The original layout for "src/views/channel.twig" was taken from "https://hackernoon.com/build-a-chat-room-with-socketio-and-express".
* The original javascript for "src/public/javascript/chat-client.js" was taken from "https://hackernoon.com/build-a-chat-room-with-socketio-and-express".
