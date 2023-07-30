<?php

use SilverStripe\View\Parsers\ShortcodeParser;
use Goldfinch\Components\Shortcodes\ContentblockShortcode;

ShortcodeParser::get('default')->register('contentblock', [ContentblockShortcode::class, 'handle_shortcode']);
