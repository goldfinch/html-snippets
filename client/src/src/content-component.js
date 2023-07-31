import ShortcodeSerialiser, { sanitiseShortCodeProperties } from './js/ShortcodeSerialiser'

const useFetch = async function(url, formData) {

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': window.ss.config.SecurityID
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error('Fetch request failed');
  }

  return response.json();
}

tinymce.PluginManager.add('customplugin', (editor, url) => {

  var selectedComponent, componentTypes, componentObjects;

  editor.addCommand('cc-delete', () => {

    const node = editor.selection.getNode();

    if (editor.dom.is(node, filter)) {
      node.remove();
    } else if (editor.dom.is(node.parentNode, filter)) {
      node.parentNode.remove();
    } else {
      console.error({
        error: 'Unexpected selection - expected embed',
        selectedNode: node
      });
    }
  });

  const window1 = {

    title: 'Content Components',
    body: {
      type: 'panel',
      items: [{
          type: 'htmlpanel',
          html: '<p>Please, select type of component you would like to add</p><p></p>',
        },

        {
          type: 'listbox',
          name: 'component',
          label: 'Component',
          enabled: false,
          items: [ { text: '-', value: '-' } ],
        }
      ]
    },
    initialData: {},
    buttons: [{
      type: 'custom',
      name: 'action_next',
      text: 'Next',
      enabled: false,
    }],
    onChange: (dialogApi, details) => {

      const data = dialogApi.getData();
      dialogApi.setEnabled('action_next', data.component);
    },
    onAction: async (dialogApi, details) => {

      if (details.name === 'action_next') {

        dialogApi.block('Loading')
        xhrLoadComponents(dialogApi);
      }
    }
  };

  const window2 = {
    title: 'Content Components',
    body: {
      type: 'panel',
      items: [{
          type: 'htmlpanel',
          html: '<p>Now, select the actual component you would like to be used</p><p></p>',
        },

        {
          type: 'listbox',
          name: 'component',
          label: 'Component',
          enabled: false,
          items: [ { text: '-', value: '-' } ],
        }
      ]
    },
    buttons: [{
        type: 'custom',
        name: 'action_back',
        text: 'Back',
        enabled: true,
      },
      {
        type: 'custom',
        name: 'action_insert',
        text: 'Insert',
        enabled: false,
      }
    ],
    initialData: {},
    onChange: (dialogApi, details) => {

      const data = dialogApi.getData();
      dialogApi.setEnabled('action_insert', data.component);
    },
    onAction: async (dialogApi, details) => {

      if (details.name === 'action_back') {

        dialogApi.block('Loading')
        xhrLoadTypes(dialogApi);

      } else if (details.name === 'action_insert') {

        const data = dialogApi.getData();

        var ctKey = Object.keys(componentTypes).find(x => componentTypes[x].value === selectedComponent);
        var coKey = Object.keys(componentObjects).find(x => componentObjects[x].value === data.component);

        tinymce.activeEditor.execCommand('mceInsertContent', false, `[contentblock class="gf-component" data-class="${selectedComponent}" data-id="${data.component}" data-bn="${componentTypes[ctKey].text}" data-n="${componentObjects[coKey].text}"].[/contentblock]`);

        dialogApi.close();
      }
    }
  };

  const xhrLoadTypes = async (dialogApi) => {

    const formData = new FormData();
    formData.append('name', editor.targetElm.getAttribute('name'))
    formData.append('class', editor.targetElm.getAttribute('data-based-on-class'))

    try {
      const data = await useFetch('/api/component/types', formData)

      var cfg = window1;
      cfg.body.items[1].enabled = true;
      cfg.body.items[1].items = data;

      componentTypes = data;

      dialogApi.redial(cfg)
      dialogApi.unblock();

    } catch (error) {}
  }

  const xhrLoadComponents = async (dialogApi) => {

    selectedComponent = dialogApi.getData().component;

    const formData = new FormData();

    formData.append('name', editor.targetElm.getAttribute('name'))
    formData.append('class', editor.targetElm.getAttribute('data-based-on-class'))
    formData.append('component', selectedComponent)

    try {
      const data = await useFetch('/api/component/objects', formData)

      componentObjects = data;

      var cfg = window2;
      cfg.body.items[1].enabled = true;
      cfg.body.items[1].items = data;

      dialogApi.unblock();
      dialogApi.redial(cfg)

    } catch (error) {}
  }

  editor.ui.registry.addButton('customDropdown', {
    icon: 'sharpen',
    onAction: async () => {

      var dialogApi = editor.windowManager.open(window1);
      dialogApi.block('Loading')
      xhrLoadTypes(dialogApi);

      return dialogApi;
    }
  })

  const filter = 'div[data-shortcode="contentblock"]'

  editor.ui.registry.addButton('ccdelete', {
    tooltip: 'Delete content block',
    icon: 'remove',
    onAction: () => editor.execCommand('cc-delete'),
  });

  editor.ui.registry.addContextToolbar('customplugin', {
    predicate: (node) => editor.dom.is(node, filter),
    position: 'node',
    scope: 'node',
    items: 'ccdelete'
  });

  editor.on('GetContent', (o) => {

    const content = jQuery(`<div>${o.content}</div>`);

    // Transform [embed] shortcodes
    content
      .find(filter)
      .each(function replaceWithShortCode() {

        const embed = jQuery(this);

        const dataId = embed.data('id');
        const dataClass = embed.data('class');
        const dataN = embed.data('n');
        const dataBn = embed.data('bn');

        const properties = sanitiseShortCodeProperties({
          'data-id': dataId,
          'data-class': dataClass,
          'data-n': dataN,
          'data-bn': dataBn,
          class: embed.prop('class'),
        });

        const shortCode = ShortcodeSerialiser.serialise({
          name: 'contentblock',
          properties,
          wrapped: true,
          content: '', //embed.html(),
        });

        embed.replaceWith(shortCode);
      });

    o.content = content.html();
  });

  editor.on('BeforeSetContent', (o) => {

    let content = o.content;
    // Transform [embed] tag
    let match = ShortcodeSerialiser.match('contentblock', true, content);

    while (match) {
      const data = match.properties;

      // Add base div
      const base = jQuery('<div/>')
        .attr('data-id', data['data-id'])
        .attr('data-class', data['data-class'])
        .attr('data-n', data['data-n'])
        .attr('data-bn', data['data-bn'])
        .attr('data-shortcode', 'contentblock')
        .addClass(data.class)

      base.html('<img src="/_resources/vendor/goldfinch/components/client/dist/images/component.svg" width="">');

      content = content.replace(match.original, (jQuery('<div/>').append(base).html()));

      match = ShortcodeSerialiser.match('contentblock', true, content);
    }

    o.content = content;
  });

  return {
    getMetadata: () => ({
      name: 'Goldfinch Components',
      url: 'https://github.com/goldfinch/components'
    })
  }
});
