<?php

namespace Goldfinch\HTMLSnippets\Commands;

use Goldfinch\Taz\Console\GeneratorCommand;
use Symfony\Component\Console\Command\Command;

#[AsCommand(name: 'vendor:html-snippets:config')]
class MediaConfigCommand extends GeneratorCommand
{
    protected static $defaultName = 'vendor:html-snippets:config';

    protected $description = 'Create HTML snippets YML config';

    protected $path = 'app/_config';

    protected $type = 'config';

    protected $stub = './stubs/config.stub';

    protected $extension = '.yml';

    protected function execute($input, $output): int
    {
        parent::execute($input, $output);

        return Command::SUCCESS;
    }
}
