<?php

namespace Goldfinch\HTMLComponents\Commands;

use Goldfinch\Taz\Console\GeneratorCommand;
use Symfony\Component\Console\Command\Command;

#[AsCommand(name: 'vendor:html-components:config')]
class MediaConfigCommand extends GeneratorCommand
{
    protected static $defaultName = 'vendor:html-components:config';

    protected $description = 'Create HTML components YML config';

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
