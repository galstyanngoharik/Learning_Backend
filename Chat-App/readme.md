# TCP Chat Application

## Overview

This project is a simple chat application built with Node.js using the built-in `net` module. Multiple clients can connect to the server from separate terminals, choose usernames, send broadcast messages, and send private messages to specific users.

No third-party networking or chat libraries are used.

## Message Protocol and Framing

The application uses a simple text-based protocol.

* Every message ends with `\n`.
* The server uses `\n` as a message delimiter.
* Because TCP does not guarantee that one `data` event contains exactly one message, the server stores incoming data in a `buffer`.
* The server checks the buffer for `\n`, extracts complete messages, and leaves incomplete data in the buffer until the rest arrives.

The protocol uses the following commands:

* `/msg <username> <message>` — sends a private message to one connected user.
* `/who` — shows the list of currently connected users.
* Any message without a command prefix is treated as a broadcast message.

## Features

In addition to the core requirements, the application includes:

### `/who`

Shows all currently connected users to the client who requested the command.

Example:

```text
Connected users: Alice, Bob, Maria
```

### Join and Leave Notifications

When a user connects, other users receive:

```text
*** Alice joined ***
```

When a user disconnects, other users receive:

```text
*** Alice left ***
```

### Message Timestamps

Broadcast messages include the time when they were sent.

Example:

```text
[18:42:15] [Alice]: Hello everyone
```

## Data Structures

The server uses two `Map` objects:

```text
map1: username → socket
map2: socket → username
```

`map1` is used to find a user's socket when sending a private message.

`map2` is used to find the username associated with a socket, for example when a client disconnects.

## Running the Application

Start the server:

```bash
node server.js
```

Then open two or more separate terminals and start a client in each:

```bash
node client.js
```

Choose a unique username when prompted.

### Examples

Broadcast:

```text
hello everyone
```

Private message:

```text
/msg Bob hello Bob!
```

List users:

```text
/who
```

## Error Handling

The server handles:

* Empty usernames
* Duplicate usernames
* Messages sent to users who are not connected
* Client disconnections
* Socket errors

A disconnected client is removed from both user maps so that other connected clients can continue using the chat normally.
