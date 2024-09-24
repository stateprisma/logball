from websocket_server import WebsocketServer

import logging

import logsim


def main() -> None:
    print('[ INF ] Listening for websocket connections on port 1234')
    server = WebsocketServer(host='127.0.0.1', port=1234, loglevel=logging.WARN)
    server.set_fn_new_client(new_client)
    server.run_forever()


def new_client(client: dict, _) -> None:
    print('[ INF ] New connection')
    client['handler'].send_message('[ BOOT ] Connection established\r\n')
    client['handler'].send_message('[ BOOT ] Welcome from LogGen!\r\n')
    print('[ INF ] Logsim started')
    exec_logsim(client['handler'], 'logs.logsim')
    print('[ INF ] Logsim ended')


def exec_logsim(client_handler: object, filename: str, line: int = 0) -> None:
    for line_num, command, arg in logsim.parse(filename, line):
        line = logsim.execute(client_handler, line_num, command, arg)
        if line > -1:
            exec_logsim(client_handler, filename, line)


if __name__ == '__main__':
    main()
