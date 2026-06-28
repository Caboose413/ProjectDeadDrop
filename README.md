# Project Dead Drop
Interactive ARG prototype built as a static web page.

## Play Locally
https://Caboose413.github.io/ProjectDeadDrop/

## Local Operator AI

Run the local bridge before using `operator <message>` or `cd operator` in the terminal:

```powershell
G:\LLM\NPCAi\operator-server.cmd
```

The page calls `http://127.0.0.1:8787/operator` when available and falls back
to static in-world Operator replies when the bridge is offline. The Operator
channel is part of the terminal flow through `ls`, `cd operator`, `operator`,
`op`, and `contact`.
