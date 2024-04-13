<div align="center">

# Plug13

</div>

<table>
<tr><td align="center" width="2000"><b>
<a href="README-RU.md">Перейти на русскую версию README</a>
</b></td></tr>
</table>

This is [Space Station 13](https://spacestation13.com/) and [Buttplug.io](https://buttplug.io/) integration through the service.

Implemented using [Nuxt 3](https://nuxt.com/), [Socket.IO](https://socket.io/) and [buttplug-js](https://github.com/buttplugio/buttplug-js).

<table>
<tr><td><details>
<summary>List of contents</summary>

- [Space Station 13 - Short Wiki summary](#space-station-13---short-wiki-summary)
- [How to use Plug13](#how-to-use-plug13)
- [Is my device supported?](#what-toys-devices-are-supported)
- [Service internals](#service-internals)
- [How to run this project](#how-to-run-this-project)

</details></td></tr>
</table>

## Space Station 13 - Short Wiki summary

> Space Station 13 is a top-down tile-based action role-playing multiplayer video game running on the freeware BYOND game engine, originally released in 2003.
>
> The game is set on a futuristic space station; however, the location of the in-game world can differ depending on the server that is being played, including a spacecraft and an exoplanet.
>
> Players are free to work together with their fellow crewmates to complete tasks and keep the station running smoothly, or they can choose to cause chaos and disrupt the work of others. The game has a variety of different game modes and win conditions, which can range from simple survival to complex conspiracies and political intrigue.

[Go to the Wikipedia page](https://en.wikipedia.org/w/index.php?title=Space_Station_13&oldid=1208832640)

## How to use Plug13

- You open the app and authorize (authorization is just for discord to handle bots, spam and stuff).
- Connect to Intiface Central.
- Find devices and configure them.
  App allows you to set modifier for every type of interaction with your character:
  - `Face` for kisses and oral *things*, `chest` for breasts and chest... `crotch` for crotch and `back` for ass.
  - `Basic` is for hugs, headpats, etc.
  - `Masochism` for Security department players.
- Generate and copy code `XXXXX-XXXXX`.
- Open the game and enter/paste this code in the special menu.
  *`OOC` -> `Plug13` by default.*
- Enjoy your game.

### *– It's overcomplicated!*

Yes it is. This is the only way you can do this without hacking into a game, risking to be banned.

And also when everything is already set up, you need just to connect Intiface and copy the secret code. That's it.

## What ~~toys~~ devices are supported?

Currently only vibration and oscillation are supported.

A list of devices that can connect to buttplug.io can be found on [IoST Index](https://iostindex.com/?filter0ButtplugSupport=4).
The same site also contains referral links from the developers of buttplug.io for the purchase of devices - a great way to support them.

## Service internals

So, Space Station 13 is a game that has roleplay servers. Every server runs their own code.

This project has two parts:
- Plug13 service, that acts like a bridge between Intiface Central and the game
- Module for SS13 servers that allows SS13 server and Plug13 service communicate

By steps:
- On server procedure `plug13.send_emote(type, strength, duration)` is called
- SS13 server sends HTTP(S) POST request to Plug13 server.
- Plug13 server sends WS message to the Plug13 web-client.
- Web-client applies *custom user-defined modifiers* and sends message to Intiface Central.
- Intiface Central handles message and activates actuators.

### What? Whyyyy?!

*\- Hey! Intiface Central is already a bridge, that allows you to do that without an external server!*

Yes. I know. But.

BYOND engine is so old... It doesn't allow you to use WS on the client side natively.
Yeah.

In theory I could use hidden IE11 browser window in game interface, but it would be a way bigger pain in my back to implement that, than this web-service.

## How to run this project

This project uses [`pnpm`](https://pnpm.io/).

```bash
# To install modules run:
pnpm install

# To start a development server:
pnpm run dev

# To build project in production mode:
pnpm run build

# To preview production-built project:
pnpm run preview
```
