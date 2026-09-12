#!/usr/bin/env bash
# Сабсет OffBit (display-шрифт заголовков) до латиницы, кириллицы, пунктуации,
# стрелок и символов, без TrueType-хинтинга: полный файл весил 65–80 КБ на
# начертание, из них ~70% — таблицы автохинтера, бесполезные на macOS и
# для крупных заголовков на Windows. Итог: ~12 КБ вместо ~70 КБ.
#
# Исходные полные файлы лежат в git-истории (до коммита с этим скриптом).
# Требуется fontTools + brotli:  python3 -m venv .venv && .venv/bin/pip install fonttools brotli
# Запуск: scripts/subset-fonts.sh <путь к полному OffBit-Regular.woff2> <путь к полному OffBit-Bold.woff2>
set -euo pipefail

UNICODES="U+0020-007E,U+00A0-00BF,U+00D7,U+00F7,U+0400-045F,U+0490-0491,U+2010-2027,U+2030-203A,U+20BD,U+20AC,U+2116,U+2122,U+2190-2199,U+2600-27BF,U+FEFF"
PYFTSUBSET="${PYFTSUBSET:-pyftsubset}"

subset() {
  "$PYFTSUBSET" "$1" \
    --unicodes="$UNICODES" \
    --layout-features='*' \
    --flavor=woff2 \
    --no-hinting \
    --no-notdef-outline \
    --output-file="$2"
  ls -la "$2"
}

subset "${1:?full OffBit-Regular.woff2}" "$(dirname "$0")/../public/fonts/OffBit-Regular.woff2"
subset "${2:?full OffBit-Bold.woff2}" "$(dirname "$0")/../public/fonts/OffBit-Bold.woff2"
