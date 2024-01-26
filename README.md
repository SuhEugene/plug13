# Plug13

## Что это?
Данный проект объединяет [Buttplug.io](https://buttplug.io/) и [Space Station 13](https://spacestation13.com/). Он позволяет девайсам действовать вместе с персонажем в игре.


Реализован с помощью [Nuxt 3](https://nuxt.com/), [Socket.IO](https://socket.io/) и [buttplug-js](https://github.com/buttplugio/buttplug-js).

## А моя игрушка поддерживается?

Сейчас поддерживаются только вибрация и поступательные движения.

Список игрушек, которые умеют подключаться к buttplug.io можно найти на [IoST Index](https://iostindex.com/?filter0ButtplugSupport=4).
На этом же сайте размещены и реферальные ссылки от разработчиков buttplug.io на покупку игрушек - отличный способ их поддержать.


## Как запустить проект?

Для разработки данного проекта используется [`pnpm`](https://pnpm.io/).

### Установка:
```bash
pnpm install
```

### Запуск сервера разработки:
```bash
pnpm run dev
```

### Билд сайта в production режиме:
```bash
pnpm run build
```

### Предпросмотр сбилженного сайта:
```bash
pnpm run preview
```
