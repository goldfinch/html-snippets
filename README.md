
# 🦅 HTML Snippets for Silverstripe TinyMCE

[![Silverstripe Version](https://img.shields.io/badge/Silverstripe-^5.1-005ae1.svg?labelColor=white&logoColor=ffffff&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDEuMDkxIDU4LjU1NSIgZmlsbD0iIzAwNWFlMSIgeG1sbnM6dj0iaHR0cHM6Ly92ZWN0YS5pby9uYW5vIj48cGF0aCBkPSJNNTAuMDE1IDUuODU4bC0yMS4yODMgMTQuOWE2LjUgNi41IDAgMCAwIDcuNDQ4IDEwLjY1NGwyMS4yODMtMTQuOWM4LjgxMy02LjE3IDIwLjk2LTQuMDI4IDI3LjEzIDQuNzg2czQuMDI4IDIwLjk2LTQuNzg1IDI3LjEzbC02LjY5MSA0LjY3NmM1LjU0MiA5LjQxOCAxOC4wNzggNS40NTUgMjMuNzczLTQuNjU0QTMyLjQ3IDMyLjQ3IDAgMCAwIDUwLjAxNSA1Ljg2MnptMS4wNTggNDYuODI3bDIxLjI4NC0xNC45YTYuNSA2LjUgMCAxIDAtNy40NDktMTAuNjUzTDQzLjYyMyA0Mi4wMjhjLTguODEzIDYuMTctMjAuOTU5IDQuMDI5LTI3LjEyOS00Ljc4NHMtNC4wMjktMjAuOTU5IDQuNzg0LTI3LjEyOWw2LjY5MS00LjY3NkMyMi40My0zLjk3NiA5Ljg5NC0uMDEzIDQuMTk4IDEwLjA5NmEzMi40NyAzMi40NyAwIDAgMCA0Ni44NzUgNDIuNTkyeiIvPjwvc3ZnPg==)](https://packagist.org/packages/goldfinch/html-snippets)
[![Package Version](https://img.shields.io/packagist/v/goldfinch/html-snippets.svg?labelColor=333&color=F8C630&label=Version)](https://packagist.org/packages/goldfinch/html-snippets)
[![Total Downloads](https://img.shields.io/packagist/dt/goldfinch/html-snippets.svg?labelColor=333&color=F8C630&label=Downloads)](https://packagist.org/packages/goldfinch/html-snippets)
[![License](https://img.shields.io/packagist/l/goldfinch/html-snippets.svg?labelColor=333&color=F8C630&label=License)](https://packagist.org/packages/goldfinch/html-snippets) 

Create custom HTML snippets and use them across your project via TinyMCE plugin. Easy to manage and customize as many snippets as you need.

## Install

#### 1. Install module
```bash
composer require goldfinch/html-snippets
```

## Available Taz commands

If you haven't used [**Taz**](https://github.com/goldfinch/taz)🌪️ before, *taz* file must be presented in your root project folder `cp vendor/goldfinch/taz/taz taz`

---

> Create HTML Snippet
```bash
php taz make:html-snippet
```

> Create new HTML Snippet template
```bash
php taz make:html-snippet-template
```

## How to create a new HTML Snippet

#### 1. Create HTML Snippet

Use [**Taz**](https://github.com/goldfinch/taz)🌪️ to generate new HTML Snippet. It will quickly lead you through the setup and take care of it for you.

```bash
php taz make:html-snippet
```

#### 2. Customise created HTML Snippet component

**Taz** creates HTMLSnippet object in `App\Components`. You can make changes, add relationships, db fields, and so on to eventually prepare your snippet.

#### 3. Add HTML Snippet in CMS

Go to `/admin/html-snippets` and add HTML Snippet. In the **Component type** we need to select our HTML Snippet component that we recently created.

## Usage

This module adds **TinyMCE** plugin to the default HTML editor (look for a diamond icon in its toolbar). It manages all available snippets in your project. Use it to insert your HTML snippets into the content.

## License

The MIT License (MIT)
