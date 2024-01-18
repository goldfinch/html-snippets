<?php

use SilverStripe\View\Parsers\ShortcodeParser;
use Goldfinch\HTMLComponents\Shortcodes\HTMLComponentBlockShortcode;

ShortcodeParser::get('default')->register('htmlcomponentblock', [
    HTMLComponentBlockShortcode::class,
    'handle_shortcode',
]);
