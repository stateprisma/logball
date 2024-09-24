from typing import Any, Generator, Tuple

import time

# List contains the line number and iterations
_LABELS: dict[str, list[int]] = {}


def parse(filename: str, line_num: int) -> Generator[Tuple[int, str, str], None, None]:
    with open(filename, 'r', encoding='utf-8') as f:
        current_line_num = 0

        # TODO: Fix this
        while current_line_num <= line_num:
            f.readline()
            current_line_num += 1

        while True:
            line = f.readline()
            # EOF
            if not line:
                break
            if line.strip() == '':
                continue
            command, arg = line.split(' ', 1)
            yield (
                current_line_num,
                command.upper(),
                arg.strip(),
            )
            current_line_num += 1


def execute(client_handle: Any, line_num: int, command: str, arg: str) -> int:
    # Comment
    if command == 'REM':
        return -1

    # Send log/message
    if command == 'LOG':
        client_handle.send_message(
            f'{arg.replace("\\n", "\n").replace("\\r", "\r")}\r\n'
        )

    # Sleep x seconds
    elif command == 'SLP':
        try:
            time.sleep(float(arg))
        except ValueError:
            print(f'[ ERR ] Invalid input for SLP: "{arg}"')
   
    # Jump to a specific label and loop
    # Syntax:
    #   REP label iters (This loops `iters` times)
    #   REP label       (This loops forever)
    elif command == 'REP':
        label_iters_list = arg.split(' ', 1)
        if len(label_iters_list) == 1:
            label = label_iters_list[0]
            iters = '-1'
        else:
            label, iters = label_iters_list

        # Set iterator count
        if _LABELS[label.upper()][1] == 0:
            try:
                _LABELS[label.upper()][1] = int(iters) + 1
            except ValueError:
                print(f'[ ERR ] Iterator count "{iters}" is invalid')
        elif _LABELS[label.upper()][1] > 0:
            # Decrement iterator count until zero is reached (break loop)
            _LABELS[label.upper()][1] -= 1
            if _LABELS[label.upper()][1] - 1 == 0:
                # Break loop
                return -1

        # Return label position
        return _LABELS[label.upper()][0] + 1

    # Define label
    elif command == 'LBL':
        _LABELS[arg.upper()] = [line_num, 0]

    return -1
