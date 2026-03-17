<table>
<tr><td align="center" width="2000">
<a href="README-RU.md">Перейти на русскую версию README</a>
</td></tr>
</table>

# Plug13 DM

### `_defines.dm`
This file should be placed somewhere higher in the hierarchy so that all the defines are accessible everywhere.

Contains macros for easier use of Plug13.

### `_plug13.dm`
Includes all files located in the `code/` folder.
Transforms the project into something like a drag-n-drop solution.
*(At least for servers with a configuration similar to BlueMoon)*

### `Plug13.tsx`
The interface itself, which you just need copy and paste into `tgui/packages/tgui/interfaces/` and it should work.  
But I'm not 100% sure.

### `code/client.dm`
Binds `/datum/plug13_connection` to each client, allowing connection using short codes.  
Also adds the verb "Plug13" to the OOC tab, which opens the connection interface.

### `code/config.dm`
This is where the BlueMoon server configuration is used.  
Since it is done differently on different servers, there will be no universal config file here.

### `code/plug13.dm`
Implementation of `/datum/plug13_connection`. The procedure you're interested in is most likely `proc/send_emote`.
Using `send_emote` you can send data about what happened in the game and trigger the corresponding action on the website.

### `code/tgui.dm`
TGUI related stuff
