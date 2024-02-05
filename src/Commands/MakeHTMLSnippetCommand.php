<?php

namespace Goldfinch\HTMLSnippets\Commands;

use Symfony\Component\Finder\Finder;
use Goldfinch\Taz\Services\InputOutput;
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
        parent::execute($input, $output);

        $io = new InputOutput($input, $output);

        $className = $io->question('Class name that will use this component (eg Page, App/Models/ProjectItem)', null, function ($answer) use ($io) {

            if (!is_string($answer) || $answer === null) {
                throw new \RuntimeException(
                    'Invalid name'
                );
            } else if (strlen($answer) < 2) {
                throw new \RuntimeException(
                    'Too short name'
                );
            } else if(!preg_match('/^([A-z0-9\_]+)$/', $answer)) {
                throw new \RuntimeException(
                    'Name can contains letter, numbers and underscore'
                );
            }

            return $answer;
        });

        $fieldName = $io->question('Field name (HTMLText) that will use this component (eg Content, Text)', null, function ($answer) use ($io) {

            if (!is_string($answer) || $answer === null) {
                throw new \RuntimeException(
                    'Invalid name'
                );
            } else if (strlen($answer) < 2) {
                throw new \RuntimeException(
                    'Too short name'
                );
            } else if(!preg_match('/^([A-z0-9\_]+)$/', $answer)) {
                throw new \RuntimeException(
                    'Name can contains letter, numbers and underscore'
                );
            }

            return $answer;
        });

        $namespaceClass = '{{namespace_class}}';
        $this->buildStr($namespaceClass, $input->getArgument('name'));

        $nameInput = $this->getAttrName($input);

        $command = $this->getApplication()->find(
            'make:html-snippet-template',
        );

        $arguments = [
            'name' => $nameInput,
        ];

        $greetInput = new ArrayInput($arguments);
        $returnCode = $command->run($greetInput, $output);

        // config

        if (!$this->setComponentInConfig($className, $fieldName, $namespaceClass)) {
            // create config

            $command = $this->getApplication()->find('vendor:html-snippets:config');

            $arguments = [
                'name' => 'html-snippets',
            ];

            $greetInput = new ArrayInput($arguments);
            $returnCode = $command->run($greetInput, $output);

            $this->setComponentInConfig($className, $fieldName, $namespaceClass);
        }

        return Command::SUCCESS;
    }

    private function setComponentInConfig($className, $fieldName, $componentName)
    {
        $rewritten = false;

        $htmlModelLine = 'Goldfinch\HTMLSnippets\Models\HTMLSnippet:';

        $finder = new Finder();
        $files = $finder->in(BASE_PATH . '/app/_config')->files()->contains([$htmlModelLine, 'html_snippet_model']);

        foreach ($files as $file) {

            // stop after first replacement
            if ($rewritten) {
                break;
            }

            $newContent = $this->updateYmal(
                $file->getContents(),
                $className . '.allowed_html_snippets.' . $fieldName,
                $componentName,
                $htmlModelLine,
            );

            file_put_contents($file->getPathname(), $newContent);

            $rewritten = true;
        }

        return $rewritten;
    }
}
