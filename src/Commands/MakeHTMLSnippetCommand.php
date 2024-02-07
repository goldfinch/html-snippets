<?php

namespace Goldfinch\HTMLSnippets\Commands;

use Goldfinch\Taz\Console\GeneratorCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;

#[AsCommand(name: 'make:html-snippet')]
class MakeHTMLSnippetCommand extends GeneratorCommand
{
    protected static $defaultName = 'make:html-snippet';

    protected $description = 'Create new HTML Snippet';

    protected $path = 'app/src/Components';

    protected $type = 'html-snippet';

    protected $stub = './stubs/html-snippet.stub';

    protected $prefix = 'Component';

    protected function execute($input, $output): int
    {
        if (parent::execute($input, $output) === false) {
            return Command::FAILURE;
        }

        $className = $this->askClassNameQuestion('What [class name] this snippet need to be assigned to (eg: Page, App/Pages/Page)', $input, $output);
        $fieldName = $this->askClassNameQuestion('What [HTMLText field name] this snippet need to be assigned to (eg: Text, Content)', $input, $output);

        $nameInput = $this->getAttrName($input);

        // create page template
        $command = $this->getApplication()->find('make:html-snippet-template');
        $command->run(new ArrayInput(['name' => $nameInput]), $output);

        // find config
        $config = $this->findYamlConfigFileByName('app-html-snippets');

        // create new config if not exists
        if (!$config) {

            $command = $this->getApplication()->find('vendor:html-snippets:config');
            $command->run(new ArrayInput(['name' => 'html-snippets']), $output);

            $config = $this->findYamlConfigFileByName('app-html-snippets');
        }

        // update config
        $this->updateYamlConfig(
            $config,
            $className . '.allowed_html_snippets.' . $fieldName,
            $this->getNamespaceClass($input),
        );

        return Command::SUCCESS;
    }
}
