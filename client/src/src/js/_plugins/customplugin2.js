// Used to match outer regexp and get attrs as a string
// All attrs extracted into matches[1]
// eslint-disable-next-line max-len
const stringifyRegex = (regexp) => (regexp.toString().slice(1, -1));
const SHORTCODE_ATTRS = stringifyRegex(
  /((?:[,\s]+(?:[a-z0-9\-_]+)=(?:(?:[a-z0-9\-_]+)|(?:\d+\.\d+)|(?:'[^']*')|(?:"[^"]*")))*)/
);
// Used to extract individual items from above regexp
// Each item matches[1] is key, and matches[2] || matches[3] || matches[4] || matches[5] is value
// eslint-disable-next-line max-len
const SHORTCODE_ATTR = /[,\s]+([a-z0-9\-_]+)=(?:([a-z0-9\-_]+)|(\d+\.\d+)|(?:'([^']*)')|(?:"([^"]*)"))/;
const SHORTCODE_OPEN = stringifyRegex(/\[%s/);
const SHORTCODE_RIGHT_BRACKET = '\\]';
const SHORTCODE_CLOSE = stringifyRegex(/\[\s*\/\s*%s\s*]/);
const SHORTCODE_CONTENT = stringifyRegex(/((?:.|\n|)*?)/);
const SHORTCODE_SPACE = stringifyRegex(/\s*/);
/**
 * End
 */

const ShortcodeSerialiser = {

  /**
   * Matches the next occurance of a shortcode in a string.
   *
   * Returns object with keys:
   *  - name (tag name)
   *  - original (original matched string)
   *  - properties (key-value pair of properties)
   *  - content (between open / close tags)
   *  - wrapped (bool flag)
   *
   * @param {String} name - shortcode tag
   * @param {Boolean} wrapped - Expect a closing tag? ([tag][/tag]) or simple tag ([tag])
   * @param {String} content - string to parse
   * @return {Object} Object, or null if not found
   */
  match(name, wrapped, content) {
    // Build matching regexp
    const open = i18n.sprintf(SHORTCODE_OPEN, name);
    let pattern = `${open}${SHORTCODE_ATTRS}${SHORTCODE_SPACE}${SHORTCODE_RIGHT_BRACKET}`;
    if (wrapped) {
      pattern = `${pattern}${SHORTCODE_CONTENT}${i18n.sprintf(SHORTCODE_CLOSE, name)}`;
    }

    // Get next match
    const regex = new RegExp(pattern, 'i');
    const match = regex.exec(content);
    if (!match) {
      return null;
    }

    // parse attributes
    const properties = this.parseProperties(match[1]);
    return {
      name,
      wrapped,
      properties,
      original: match[0],
      content: wrapped ? match[2] : null,
    };
  },

  /**
   * Parse shortcode props from string
   *
   * @param {String} input
   * @return {Object}
   */
  parseProperties(input) {
    let unmatched = input;
    const result = {};
    let match = unmatched.match(SHORTCODE_ATTR);
    while (match) {
      // Save key / value
      const key = match[1] || '';
      const value = match[2] || match[3] || match[4] || match[5] || '';
      if (key) {
        result[key] = value;
      }

      // Trim off matched content from unmatched and continue parsing
      const idx = unmatched.indexOf(match[0]);
      unmatched = unmatched.substr(idx + match[0].length);
      match = unmatched.match(SHORTCODE_ATTR);
    }
    return result;
  },

  /**
   * Turn shortcode object into string.
   * Note that if a shortcode is placed into a html attribute, use attributesafe to true to
   * use attribute protected characters. For example:
   *  - [sitetree_link id="3"] (attributesafe = false)
   *  - [sitetree_link,id='3'] (attributesafe = true)
   *
   * Note that special characters (e.g. quotes) will be stripped if they would otherwise
   * break the shortcode.
   *
   * @param {Object} object - Object in same format as match() (original ignored)
   * @param {Boolean} attributesafe - Set to true to encode in attribute safety mode
   * @return {String}
   */
  serialise(object, attributesafe = false) {
    // attributesafe can only encode alphanumeric characters
    const rule = attributesafe
      ? { sep: ',', quote: '', replacer: /[^a-z0-9\-_.]/gi }
      : { sep: ' ', quote: '"', replacer: /"/g };
    const attrs = Object.entries(object.properties)
      .map(([name, value]) => ((value)
        ? `${rule.sep}${name}=${rule.quote}${`${value}`.replace(rule.replacer, '')}${rule.quote}`
        : null
      ))
      .filter((attr) => attr !== null)
      .join('');

    if (object.wrapped) {
      return `[${object.name}${attrs}]${object.content}[/${object.name}]`;
    }
    return `[${object.name}${attrs}]`;
  },
};

const createHTMLSanitiser = () => {
  const div = document.createElement('div');
  return (str) => {
    if (str === undefined) {
      return '';
    }

    div.textContent = str;

    return div.innerHTML;
  };
};

const sanitiseShortCodeProperties = (rawProperties) => {
  const sanitise = createHTMLSanitiser();
  return Object.entries(rawProperties).reduce((props, [name, value]) => ({
    ...props,
    [name]: sanitise(value)
  }), {});
};



// (function() {
  tinymce.PluginManager.add('customplugin', (editor, url) => {
    // add plugin code here

    // editor.ui.registry.addButton('customInsertButton', {
    //   text: 'My Button',
    //   onAction: (_) => editor.insertContent(`&nbsp;<strong>It's my button!</strong>&nbsp;`)
    // });

    // const toTimeHtml = (date) => `<time datetime="${date.toString()}">${date.toDateString()}</time>`;

    // editor.ui.registry.addButton('customDateButton', {
    //   icon: 'insert-time',
    //   tooltip: 'Insert Current Date',
    //   enabled: false,
    //   onAction: (_) => editor.insertContent(toTimeHtml(new Date())),
    //   onSetup: (buttonApi) => {
    //     const editorEventCallback = (eventApi) => {
    //       buttonApi.setEnabled(eventApi.element.nodeName.toLowerCase() !== 'time');
    //     };
    //     editor.on('NodeChange', editorEventCallback);

    //     /* onSetup should always return the unbind handlers */
    //     return () => editor.off('NodeChange', editorEventCallback);
    //   }
    // });



    editor.addCommand('gfc-delete', () => {
        const node = editor.selection.getNode();
        // selecting the div correctly
        if (editor.dom.is(node, filter)) {
          node.remove();
        // selecting the image inside the div
        } else if (editor.dom.is(node.parentNode, filter)) {
          node.parentNode.remove();
        // anything else
        } else {
          // eslint-disable-next-line no-console
          console.error({ error: 'Unexpected selection - expected embed', selectedNode: node });
        }
      });

    var toggleState = false;



console.log('INit')

const page1Config = {
  // console.log('cc',window.goldfinch_component)

  title: 'Components',
  body: {
    type: 'panel',
    name: 'superpanel',
    items: [{
      type: 'htmlpanel',
      html: '<p>Please, select component you would like to insert</p><p></p>'
    },

    {
  type: 'listbox', // component type
  name: 'component', // identifier
  label: 'Component',
  enabled: false, // enabled state
  items: [
    { text: '-', value: '-' },
  ]
}]
  },
  initialData: {
    // type: '1'
    // type: null, // xhrLoadType()
  },
  buttons: [
    {
      type: 'custom',
      name: 'uniquename',
      text: 'Next',
      enabled: false
    }
  ],
  onChange: (dialogApi, details) => {console.log('Changed')
  // dialogApi.block('loading...');
    const data = dialogApi.getData();
    /* Example of enabling and disabling a button, based on the checkbox state. */
    dialogApi.setEnabled('uniquename', data.component);
  },
  onAction: async (dialogApi, details) => {console.log('Action', details)
    if (details.name === 'uniquename') {

      dialogApi.block('Loading ...')

      //   dialog.setData({
      //     type: 'Open 2'
      // })

      await xhrLoadType2(dialogApi);



    }
  }
};
        const page2Config = {
      title: 'Redial Demo - Page 2',
      body: {
        type: 'panel',
        items: [{
      type: 'htmlpanel',
      html: '<p>Please, select</p><p></p>'
    },

    {
  type: 'listbox', // component type
  name: 'component', // identifier
  label: 'Component',
  enabled: false, // enabled state
  items: [
    { text: '-', value: '-' },
  ]
}]
      },
      buttons: [
        {
          type: 'custom',
          name: 'doesnothing',
          text: 'Back',
          enabled: true
        },
        {
          type: 'custom',
          name: 'lastpage',
          text: 'Done',
          enabled: true
        }
      ],
      initialData: {
        // component: ''
      },
      onAction: async (dialogApi, details) => {

        if (details.name === 'doesnothing') {

          console.log('back')
          dialogApi.block('Loading..')
          await xhrLoadType(dialogApi);

        } else if (details.name === 'lastpage') {


          const data = dialogApi.getData();

          const result = 'You chose wisely: ' + data.component;
          console.log('>>>', details, data, savedComponent);

          console.log('123', componentTypes, componentObjects)

          // tinymce.activeEditor.execCommand('mceInsertContent', false, `<gf-component class="gf-component" data-class="${savedComponent}" data-id="${data.component}">[${result}]</gf-component>`);

          var k1 = Object.keys(componentTypes).find(x => componentTypes[x].value === savedComponent);
          var k2 = Object.keys(componentObjects).find(x => componentObjects[x].value === data.component);

          tinymce.activeEditor.execCommand('mceInsertContent', false, `[contentblock class="gf-component" data-class="${savedComponent}" data-id="${data.component}" data-bn="${componentTypes[k1].text}" data-n="${componentObjects[k2].text}"].[/contentblock]`);

          dialogApi.close();
        }
      }
    };


        var savedComponent;
        var componentTypes;
        var componentObjects;


        const xhrLoadType = async (dialog) => {

          const formData = new FormData();
          formData.append('name', editor.targetElm.getAttribute('name'))
          formData.append('class', editor.targetElm.getAttribute('data-based-on-class'))
          console.log(formData)


          try {
            const response = await fetch('/api/component/components', {
              method: 'POST',
              headers: {
                'X-CSRF-TOKEN': window.ss.config.SecurityID
              },
              body: formData
            });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            // console.log(dialog.getData('type'))
            // dialog.setData({sfPreview: 'ssss'})
            // dialog.setData('type', {
            //   enabled: true,
            //   items: [
            //     { text: 'One', value: '1' },
            //     { text: 'Two', value: '2' },
            //     { text: 'Submenu', items: [
            //       { text: 'Three', value: '3' }
            //     ]}
            //   ]
            // })

            var cfg = page1Config;
            cfg.body.items[1].enabled = true;
            cfg.body.items[1].items = data;

            componentTypes = data;

            console.log('cfg', cfg)
            dialog.redial(cfg)
            // console.log('editor', editor.targetElm.getAttribute('name'));
            // console.log('class', editor.targetElm.getAttribute('data-based-on-class'))
            // console.dir(editor);
            // console.log('entwune', jQuery(`#${editor.id}`).entwine('ss'))
            dialog.unblock();

          } catch (error) {
            // console.error(error);
          }

        }


        const xhrLoadType2 = async (dialog) => {

          savedComponent = dialog.getData().component;
          console.log('!!!!!', dialog.getData())
          const formData = new FormData();
          formData.append('name', editor.targetElm.getAttribute('name'))
          formData.append('class', editor.targetElm.getAttribute('data-based-on-class'))
          formData.append('component', savedComponent)

          try {
            const response = await fetch('/api/component/componentobjects', {
              method: 'POST',
              headers: {
                'X-CSRF-TOKEN': window.ss.config.SecurityID
              },
              body: formData
            });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            // console.log(dialog.getData('type'))
            // dialog.setData({sfPreview: 'ssss'})
            // dialog.setData('type', {
            //   enabled: true,
            //   items: [
            //     { text: 'One', value: '1' },
            //     { text: 'Two', value: '2' },
            //     { text: 'Submenu', items: [
            //       { text: 'Three', value: '3' }
            //     ]}
            //   ]
            // })
            console.log('almost', dialog)

            componentObjects = data;

            var cfg = page2Config;
            cfg.body.items[1].enabled = true;
            cfg.body.items[1].items = data;

            console.log('cfg', cfg.body.items)
            dialog.unblock();

            dialog.redial(cfg)

            // return cfg;
            // console.log('editor', editor.targetElm.getAttribute('name'));
            // console.log('class', editor.targetElm.getAttribute('data-based-on-class'))
            // console.dir(editor);
            // console.log('entwune', jQuery(`#${editor.id}`).entwine('ss'))
            console.log('finishied', dialog)
          } catch (error) {
            // console.error(error);
          }

        }


        var getInitialState =  function () {
          console.log('call')
          console.log('after call')
          return page1Config;
    }




    editor.ui.registry.addButton('customDropdown', {
      icon: 'sharpen',
      onAction: async () => {

        console.log('start')
        console.log('ready')

        var dialog = editor.windowManager.open(getInitialState());//page1Config());
        dialog.block('Loading ...')

      //   dialog.setData({
      //     type: 'Open 2'
      // })

      await xhrLoadType(dialog);



        return dialog;

        // editor.windowManager.open(page1Config)
        // return window.goldfinch_component.block('Loading..');
      }
    })

    const filter = 'div[data-shortcode="contentblock"]'

      editor.ui.registry.addButton('gfcdelete', {
        tooltip: 'Delete content block',
        icon: 'remove',
        onAction: () => editor.execCommand('gfc-delete'),
      });

      editor.ui.registry.addContextToolbar('customplugin', {
        predicate: (node) => editor.dom.is(node, filter),
        position: 'node',
        scope: 'node',
        items: 'gfcdelete'
      });

    editor.on('GetContent', (o) => {

      const content = jQuery(`<div>${o.content}</div>`);

        // Transform [embed] shortcodes
        content
          .find(filter)
          .each(function replaceWithShortCode() {
            // Note: embed <div> contains placeholder <img>, and potentially caption <p>
            const embed = jQuery(this);
            // If placeholder has been removed, remove data-* properties and
            // convert to non-shortcode div
            // const placeholder = embed.find('img.placeholder');
            // if (placeholder.length === 0) {
            //   // embed.removeAttr('data-url');
            //   embed.removeAttr('data-shortcode');
            //   return;
            // }

            // Find nested element data
            // const caption = embed.find('.caption').text();
            // const width = parseInt(placeholder.attr('width'), 10);
            // const height = parseInt(placeholder.attr('height'), 10);
            const dataId = embed.data('id');
            const dataClass = embed.data('class');
            const dataN = embed.data('n');
            const dataBn = embed.data('bn');

            const properties = sanitiseShortCodeProperties({
              // url,
              // thumbnail: placeholder.prop('src'),
              'data-id': dataId,
              'data-class': dataClass,
              'data-n': dataN,
              'data-bn': dataBn,
              class: embed.prop('class'),
              // caption,
            });

            console.log('properties', properties)

            const shortCode = ShortcodeSerialiser.serialise({
              name: 'contentblock',
              properties,
              wrapped: true,
              content: '', //embed.html(),
            });

            console.log('shortCode', shortCode)

            embed.replaceWith(shortCode);
          });

        // eslint-disable-next-line no-param-reassign
        o.content = content.html();
        console.log('updated', o.content)
      });



      editor.on('BeforeSetContent', (o) => {
        let content = o.content;
        console.log('before set content', content)
        // Transform [embed] tag
        let match = ShortcodeSerialiser.match('contentblock', true, content);
        while (match) {
          const data = match.properties;
          console.log('data', data, match, data['data-id'])

          // Add base div
          const base = jQuery('<div/>')
            // .attr('data-url', data.url || match.content)
            .attr('data-id', data['data-id'])
            .attr('data-class', data['data-class'])
            .attr('data-n', data['data-n'])
            .attr('data-bn', data['data-bn'])
            .attr('data-shortcode', 'contentblock')
            .addClass(data.class)
            // .addClass('ss-htmleditorfield-file contentblock');

          // Add placeholder
          // const placeholder = jQuery('<img />')
          //   .attr('src', data.thumbnail)
          //   .addClass('placeholder');

          // Set dimensions
          // if (data.width) {
          //   placeholder.attr('width', data.width);
          // }
          // if (data.height) {
          //   placeholder.attr('height', data.height);
          // }

          // base.append(placeholder);
          // base.html(match.content);
          base.html('<img src="/component.svg">');

          // Add caption p tag
          // if (data.caption) {
          //   const caption = jQuery('<p />')
          //     .addClass('caption')
          //     .text(data.caption);
          //   base.append(caption);
          // }

          // Inject into code
          content = content.replace(match.original, (jQuery('<div/>').append(base).html()));

          // Search for next match
          match = ShortcodeSerialiser.match('contentblock', true, content);
        }

        // eslint-disable-next-line no-param-reassign
        o.content = content;
        console.log('before set content finished', content)
      });

    // return {
    //     getMetadata: () => ({
    //         name: 'sfPreview',
    //         url: 'https://www.test.cn'
    //     })
    // };

    // editor.ui.registry.addMenuButton('customDropdown', {
    //   // icon: 'more-drawer',
    //   // icon: 'preferences',
    //   icon: 'sharpen',
    //   // text: 'My button',
    //   fetch: function (callback) {
    //     var items = [
    //       {
    //         type: 'menuitem',
    //         text: 'Menu item 1',
    //         onAction: function () {
    //           editor.insertContent('&nbsp;<em>You clicked menu item 1!</em>');
    //         }
    //       },
    //       {
    //         type: 'nestedmenuitem',
    //         text: 'Menu item 2',
    //         icon: 'user',
    //         getSubmenuItems: function () {
    //           return [
    //             {
    //               type: 'menuitem',
    //               text: 'Sub menu item 1',
    //               icon: 'unlock',
    //               onAction: function () {
    //                 editor.insertContent('&nbsp;<em>You clicked Sub menu item 1!</em>');
    //               }
    //             },
    //             {
    //               type: 'menuitem',
    //               text: 'Sub menu item 2',
    //               icon: 'lock',
    //               onAction: function () {
    //                 editor.insertContent('&nbsp;<em>You clicked Sub menu item 2!</em>');
    //               }
    //             }
    //           ];
    //         }
    //       },
    //       {
    //         type: 'togglemenuitem',
    //         text: 'Toggle menu item',
    //         onAction: function () {
    //           toggleState = !toggleState;
    //           editor.insertContent('&nbsp;<em>You toggled a menuitem ' + (toggleState ? 'on' : 'off') + '</em>');
    //         },
    //         onSetup: function (api) {
    //           api.setActive(toggleState);
    //           return function() {};
    //         }
    //       }
    //     ];
    //     callback(items);
    //   }
    // });

    return {
      getMetadata: () => ({
        name: 'Custom plugin',
        url: 'https://example.com/docs/customplugin'
      })
    }
  });
// })();


// (function() {
//   tinymce.PluginManager.add('myplugin', function(editor, url) {

//       editor.addButton('myplugin', {
//         text: 'Add button',
//         icon: false,
//         onclick: function() {

//           editor.windowManager.open({
//             title: 'Add button',
//             body: [

//               {
//                   type: 'textbox',
//                   name: 'text',
//                   label: 'Text',
//               },

//               {
//                   type: 'textbox',
//                   name: 'link',
//                   label: 'Link',
//               },

//             ],
//             buttons: [
//               {
//                 text: "Set",
//                 subtype: "primary",
//                 onclick: 'submit'
//               },
//               {
//                 text: "Cancel",
//                 onclick: function() {
//                   editor.windowManager.close();
//                 }
//               }
//             ],
//             onsubmit: function(e) {

//               editor.insertContent('<a class="btn btn--custom btn--blue btn--adown btn--mleft" href="' + e.data.link + '">' + e.data.text + '</a>');

//             }
//           });
//         }
//       });

//   });
// })();
