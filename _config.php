<?php

use SilverStripe\View\Parsers\ShortcodeParser;
use Goldfinch\HTMLSnippets\Shortcodes\HTMLSnippetBlockShortcode;

ShortcodeParser::get('default')->register('htmlsnippetblock', [
    HTMLSnippetBlockShortcode::class,
    'handle_shortcode',
]);
