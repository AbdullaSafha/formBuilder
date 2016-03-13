(function($) {
  'use strict';
  var FormBuilder = function(options, element) {
    var formBuilder = this;

    var defaults = {
      dataType: 'xml',
      // Uneditable fields or other content you would like to
      // appear before and after regular fields.
      disableFields: {
        // before: '<h2>Header</h2>',
        // after: '<h3>Footer</h3>'
      },
      append: false,
      prepend: false,
      // array of objects with fields values
      // ex:
      // defaultFields: [{
      //   label: 'First Name',
      //   name: 'first-name',
      //   required: 'true',
      //   description: 'Your first name',
      //   type: 'text'
      // }, {
      //   label: 'Phone',
      //   name: 'phone',
      //   description: 'How can we reach you?',
      //   type: 'text'
      // }],
      defaultFields: [],
      roles: {
        1: 'Administrator'
      },
      showWarning: false,
      serializePrefix: 'frmb',
      messages: {
        addOption: 'Add Option',
        allowSelect: 'Allow Select',
        autocomplete: 'Autocomplete',
        button: 'Button',
        cannotBeEmpty: 'This field cannot be empty',
        checkboxGroup: 'Checkbox Group',
        checkbox: 'Checkbox',
        checkboxes: 'Checkboxes',
        clearAllMessage: 'Are you sure you want to remove all items?',
        clearAll: 'Clear',
        close: 'Close',
        copy: 'Copy To Clipboard',
        dateField: 'Date Field',
        description: 'Help Text',
        descriptionField: 'Description',
        devMode: 'Developer Mode',
        editNames: 'Edit Names',
        editorTitle: 'Form Elements',
        editXML: 'Edit XML',
        fieldVars: 'Field Variables',
        fieldNonEditable: 'This field cannot be edited.',
        fieldRemoveWarning: 'Are you sure you want to remove this field?',
        fileUpload: 'File Upload',
        formUpdated: 'Form Updated',
        getStarted: 'Drag a field from the right to this area',
        hide: 'Edit',
        hidden: 'Hidden Input',
        label: 'Label',
        labelEmpty: 'Field Label cannot be empty',
        limitRole: 'Limit access to one or more of the following roles:',
        mandatory: 'Mandatory',
        maxlength: 'Max Length',
        minOptionMessage: 'This field requires a minimum of 2 options',
        name: 'Name',
        no: 'No',
        off: 'Off',
        on: 'On',
        option: 'Option',
        optional: 'optional',
        optionLabelPlaceholder: 'Label',
        optionValuePlaceholder: 'Value',
        optionEmpty: 'Option value required',
        paragraph: 'Paragraph',
        placeholder: 'Placeholder',
        placeholders: {
          value: 'Value',
          label: 'Label',
          text: '',
          textarea: '',
          email: 'Enter you email',
          password: 'Enter your password'
        },
        preview: 'Preview',
        radioGroup: 'Radio Group',
        radio: 'Radio',
        removeMessage: 'Remove Element',
        remove: '&#215;',
        required: 'Required',
        richText: 'Rich Text Editor',
        roles: 'Access',
        save: 'Save',
        selectOptions: 'Options',
        select: 'Select',
        selectColor: 'Select Color',
        selectionsMessage: 'Allow Multiple Selections',
        size: 'Size',
        sizes: {
          xs: 'Extra Small',
          sm: 'Small',
          m: 'Default',
          lg: 'Large'
        },
        style: 'Style',
        styles: {
          btn: {
            'default': 'Default',
            danger: 'Danger',
            info: 'Info',
            primary: 'Primary',
            success: 'Success',
            warning: 'Warning'
          }
        },
        subtype: 'Type',
        subtypes: {
          text: [
            'text',
            'password',
            'email',
            'color'
          ],
          button: [
            'button',
            'submit'
          ]
        },
        text: 'Text Field',
        textArea: 'Text Area',
        toggle: 'Toggle',
        warning: 'Warning!',
        viewXML: '&lt;/&gt;',
        yes: 'Yes'
      },
      notify: {
        error: function(message) {
          return console.error(message);
        },
        success: function(message) {
          return console.log(message);
        },
        warning: function(message) {
          return console.warn(message);
        }
      }
    };

    // @todo function to set parent types for subtypes
    defaults.messages.subtypes.password = defaults.messages.subtypes.text;
    defaults.messages.subtypes.email = defaults.messages.subtypes.text;
    defaults.messages.subtypes.color = defaults.messages.subtypes.text;
    defaults.messages.subtypes.submit = defaults.messages.subtypes.button;

    var opts = $.extend(true, defaults, options),
      elem = $(element),
      frmbID = 'frmb-' + $('ul[id^=frmb-]').length++;

    opts.formID = frmbID;

    formBuilder.element = element;

    var $sortableFields = $('<ul/>').attr('id', frmbID).addClass('frmb');
    // @todo refactor these to use proper mdule syntax
    var _helpers = formBuilderHelpers(opts, formBuilder);

    var lastID = 1,
      boxID = frmbID + '-control-box';

    // create array of field objects to cycle through
    var frmbFields = [{
      label: opts.messages.text,
      attrs: {
        type: 'text',
        className: 'text-input',
        name: 'text-input'
      }
    }, {
      label: opts.messages.select,
      attrs: {
        type: 'select',
        className: 'select',
        name: 'select'
      }
    }, {
      label: opts.messages.textArea,
      attrs: {
        type: 'textarea',
        className: 'text-area',
        name: 'textarea'
      }
    }, {
      label: opts.messages.radioGroup,
      attrs: {
        type: 'radio-group',
        className: 'radio-group',
        name: 'radio-group'
      }
    }, {
      label: opts.messages.hidden,
      attrs: {
        type: 'hidden',
        className: 'hidden-input',
        name: 'hidden-input'
      }
    }, {
      label: opts.messages.fileUpload,
      attrs: {
        type: 'file',
        className: 'file-input',
        name: 'file-input'
      }
    }, {
      label: opts.messages.dateField,
      attrs: {
        type: 'date',
        className: 'calendar',
        name: 'date-input'
      }
    }, {
      label: opts.messages.checkboxGroup,
      attrs: {
        type: 'checkbox-group',
        className: 'checkbox-group',
        name: 'checkbox-group'
      }
    }, {
      label: opts.messages.checkbox,
      attrs: {
        type: 'checkbox',
        className: 'checkbox',
        name: 'checkbox'
      }
    }, {
      label: opts.messages.button,
      attrs: {
        type: 'button',
        className: 'button-input',
        name: 'button'
      }
    }, {
      label: opts.messages.autocomplete,
      attrs: {
        type: 'autocomplete',
        className: 'autocomplete',
        name: 'autocomplete'
      }
    }];

    // Create draggable fields for formBuilder
    var $cbUL = $('<ul/>', {
      id: boxID,
      'class': 'frmb-control'
    });

    // Loop through
    for (var i = frmbFields.length - 1; i >= 0; i--) {
      let $field = $('<li/>', {
        'class': 'icon-' + frmbFields[i].attrs.className,
        'type': frmbFields[i].type,
        'name': frmbFields[i].className,
        'label': frmbFields[i].label
      });

      for (var attr in frmbFields[i]) {
        if (frmbFields[i].hasOwnProperty(attr)) {
          $field.data(attr, frmbFields[i][attr]);
        }
      }

      let typeLabel = _helpers.markup('span', frmbFields[i].label);
      $field.html(typeLabel).appendTo($cbUL);
    }

    // Build our headers and action links
    var viewXML = _helpers.markup('button', opts.messages.viewXML, {
        id: frmbID + '-export-xml',
        type: 'button',
        className: 'view-xml btn btn-default'
      }),
      overlay = _helpers.markup('div', null, {
        className: 'form-builder-overlay'
      }),
      allowSelect = $('<a/>', {
        id: frmbID + '-allow-select',
        text: opts.messages.allowSelect,
        href: '#',
        'class': 'allow-select'
      }).prop('checked', 'checked'),
      editXML = $('<button/>', {
        id: frmbID + '-edit-xml',
        text: opts.messages.editXML,
        href: '#',
        'class': 'edit-xml btn btn-default'
      }),
      editNames = $('<a/>', {
        id: frmbID + '-edit-names',
        text: opts.messages.editNames,
        href: '#',
        'class': 'edit-names'
      }),
      clearAll = _helpers.markup('button', opts.messages.clearAll, {
        id: frmbID + '-clear-all',
        type: 'button',
        className: 'clear-all btn btn-default'
      }),
      saveAll = _helpers.markup('button', opts.messages.save, {
        className: 'btn btn-primary fb-save',
        id: frmbID + '-save',
        type: 'button'
      }),
      formActions = _helpers.markup('div', [clearAll, viewXML, saveAll], {
        className: 'form-actions btn-group'
      }).outerHTML,
      actionLinksInner = $('<div/>', {
        id: frmbID + '-action-links-inner',
        'class': 'action-links-inner'
      }).append(saveAll, editXML, ' | ', editNames, ' | ', allowSelect, ' | '),
      devMode = $('<span/>', {
        'class': 'dev-mode-link'
      }).html(opts.messages.devMode + ' ' + opts.messages.off),
      actionLinks = $('<div/>', {
        id: frmbID + '-action-links',
        'class': 'action-links'
      }).append(actionLinksInner, devMode);

    // Add our overlay to the body
    document.body.appendChild(overlay);

    // Sortable fields
    $sortableFields.sortable({
      cursor: 'move',
      opacity: 0.9,
      revert: 150,
      beforeStop: _helpers.beforeStop,
      start: _helpers.startMoving,
      stop: _helpers.stopMoving,
      cancel: 'input, select, .disabled, .form-group, .btn',
      placeholder: 'frmb-placeholder'
    });

    // ControlBox with different fields
    $cbUL.sortable({
      helper: 'clone',
      opacity: 0.9,
      connectWith: $sortableFields,
      cursor: 'move',
      placeholder: 'ui-state-highlight',
      start: _helpers.startMoving,
      stop: _helpers.stopMoving,
      revert: 150,
      beforeStop: _helpers.beforeStop,
      update: function(event, ui) {
        if (_helpers.doCancel) {
          return false;
        }
        event = event;
        prepFieldVars(ui.item, true);
        _helpers.doCancel = true;
      }
    });

    var $stageWrap = $('<div/>', {
      id: frmbID + '-stage-wrap',
      'class': 'stage-wrap'
    });

    var $formWrap = $('<div/>', {
      id: frmbID + '-form-wrap',
      'class': 'form-wrap form-builder' + _helpers.mobileClass()
    });

    elem.before($stageWrap).appendTo($stageWrap);

    var cbWrap = $('<div/>', {
      id: frmbID + '-cb-wrap',
      'class': 'cb-wrap'
    }).append($cbUL[0], formActions);

    $stageWrap.append($sortableFields, cbWrap, actionLinks);
    $stageWrap.before($formWrap);
    $formWrap.append($stageWrap, cbWrap);

    // Save field on change
    $sortableFields.on('change blur keyup', '.form-elements input, .form-elements select', function() {
      let $field = $(this).parents('.form-field:eq(0)');
      _helpers.debounce(_helpers.save);
      _helpers.debounce(_helpers.updatePreview($field));
    });

    // Parse saved XML template data
    var getXML = function() {
      var xml = (elem.val() !== '' ? $.parseXML(elem.val()) : false),
        fields = $(xml).find('field');
      if (fields.length > 0) {
        formBuilder.formData = xml;
        fields.each(function() {
          prepFieldVars($(this));
        });
      } else if (!xml) {
        // Load default fields if none are set
        if (opts.defaultFields.length) {
          opts.defaultFields.reverse();
          for (var i = opts.defaultFields.length - 1; i >= 0; i--) {
            appendNewField(opts.defaultFields[i]);
          }
          $stageWrap.removeClass('empty');
        } else if (!opts.prepend && !opts.append) {
          $stageWrap.addClass('empty').attr('data-content', opts.messages.getStarted);
        }
      }

      $('li.form-field:not(.disabled)', $sortableFields).each(function() {
        _helpers.updatePreview($(this));
      });

      nonEditableFields();

    };

    var loadData = function() {

      let doLoadData = {
        xml: getXML,
        json: function() {
          console.log('coming soon');
        }
      };

      doLoadData[opts.dataType]();

    };

    var nonEditableFields = function() {
      let cancelArray = [];

      if (opts.prepend && !$('.disabled.prepend', $sortableFields).length) {
        let prependedField = _helpers.markup('li', opts.prepend, { className: 'disabled prepend' });
        cancelArray.push(true);
        $sortableFields.prepend(prependedField);
      }

      if (opts.append && !$('.disabled.append', $sortableFields).length) {
        let appendedField = _helpers.markup('li', opts.append, { className: 'disabled append' });
        cancelArray.push(true);
        $sortableFields.append(appendedField);
      }

      if (cancelArray.some(elem => elem === true)) {
        $stageWrap.removeClass('empty');
      }
    };

    // callback to call disabled tooltips
    $sortableFields.on('mousemove', 'li.disabled', function(e) {
      $('.frmb-tt', this).css({
        left: e.offsetX - 15,
        top: e.offsetY - 20
      });
    });

    // callback to call disabled tooltips
    $sortableFields.on('mouseenter', 'li.disabled', function() {
      _helpers.disabledTT.add($(this));
    });

    // callback to call disabled tooltips
    $sortableFields.on('mouseleave', 'li.disabled', function() {
      _helpers.disabledTT.remove($(this));
    });

    var nameAttr = function(field) {
      var epoch = new Date().getTime();
      return field.data('attrs').name + '-' + epoch;
    };

    var prepFieldVars = function($field, isNew = false) {
      var fieldAttrs = $field.data('attrs') || {},
        fType = fieldAttrs.type || $field.attr('type'),
        values = {};

      values.label = _helpers.htmlEncode($field.attr('label'));
      values.name = isNew ? nameAttr($field) : fieldAttrs.name || $field.attr('name');
      values.role = $field.attr('role');
      values.required = $field.attr('required');
      values.maxlength = $field.attr('maxlength');
      values.toggle = $field.attr('toggle');
      values.multiple = fType.match(/(checkbox-group)/);
      values.type = fType;
      values.description = ($field.attr('description') !== undefined ? _helpers.htmlEncode($field.attr('description')) : '');

      appendNewField(values);
      $stageWrap.removeClass('empty');
    };

    // multi-line textarea
    var appendTextarea = function(values) {
      appendFieldLi(opts.messages.textArea, advFields(values), values);
    };

    var appendInput = function(values) {
      let type = values.type || 'text';
      appendFieldLi(opts.messages[type], advFields(values), values);
    };

    /**
     * Add data for field with options [select, checkbox-group, radio-group]
     *
     * @todo   refactor this nasty crap, its actually painful to look at
     * @param  {object} values
     */
    var appendSelectList = function(values) {
      if (!values.values || !values.values.length) {
        values.values = [{
          selected: true
        }, {
          selected: false
        }];

        values.values = values.values.map(function(elem, index) {
          elem.label = `${opts.messages.option} ${index + 1}`;
          elem.value = _helpers.hyphenCase(elem.label);

          return elem;
        });
      }

      var field = '';

      field += advFields(values);
      field += '<div class="form-group field-options">';
      field += '<label class="false-label">' + opts.messages.selectOptions + '</label>';
      field += `<div class="sortable-options-wrap">`;
      if (values.type === 'select') {
        field += '<div class="allow-multi">';
        field += '<input type="checkbox" id="multiple_' + lastID + '" name="multiple"' + (values.multiple ? 'checked="checked"' : '') + '>';
        field += '<label class="multiple" for="multiple_' + lastID + '">' + opts.messages.selectionsMessage + '</label>';
        field += '</div>';
      }
      field += '<ol class="sortable-options">';
      for (i = 0; i < values.values.length; i++) {
        field += selectFieldOptions(values.name, values.values[i], values.values[i].selected, values.multiple);
      }
      field += '</ol>';
      let addOption = _helpers.markup('a', opts.messages.addOption, { className: 'add add-opt' });
      field += _helpers.markup('div', addOption, { className: 'option-actions' }).outerHTML;
      field += '</div>';
      field += '</div>';
      appendFieldLi(opts.messages.select, field, values);

      $('.sortable-options').sortable(); // making the dynamically added option fields sortable.
    };

    var appendNewField = function(values) {

      // TODO: refactor to move functions into this object
      var appendFieldType = {
        'select': appendSelectList,
        'rich-text': appendTextarea,
        'textarea': appendTextarea,
        'radio-group': appendSelectList,
        'checkbox-group': appendSelectList
      };

      values = values || '';

      if (appendFieldType[values.type]) {
        appendFieldType[values.type](values);
      } else {
        appendInput(values);
      }

    };

    /**
     * Build the editable properties for the field
     * @param  {object} values configuration object for advanced fields
     * @return {string}        markup for advanced fields
     */
    var advFields = function(values) {

      var advFields = [],
        key,
        roles = values.role !== undefined ? values.role.split(',') : [];

      var fieldLabelLabel = _helpers.markup('label', opts.messages.label);
      var fieldLabelInput = _helpers.markup('input', null, {
        type: 'text',
        name: 'label',
        value: values.label,
        className: 'fld-label form-control'
      });
      var fieldLabel = _helpers.markup('div', [fieldLabelLabel, fieldLabelInput], {
        className: 'form-group label-wrap'
      });

      advFields.push(fieldLabel.outerHTML);

      values.size = values.size || 'm';
      values.style = values.style || 'default';

      if (values.type !== 'button') {
        let fieldDescLabel = _helpers.markup('label', opts.messages.description),
          fieldDescInput = _helpers.markup('input', opts.messages.description, {
            type: 'text',
            className: 'fld-description form-control',
            name: 'description',
            id: 'description-' + lastID,
            value: values.description
          }),
          fieldDesc = _helpers.markup('div', [fieldDescLabel, fieldDescInput], {
            'class': 'form-group description-wrap'
          });
        advFields.push(fieldDesc.outerHTML);
      }

      advFields.push(subTypeField(values.type));

      // Not ready
      // advFields.push(sizeField(values.size, values.type));

      advFields.push(btnStyles(values.style, values.type));

      advFields.push(placeHolderField(values.type));

      advFields.push('<div class="form-group name-wrap"><label>' + opts.messages.name + ' <span class="required">*</span></label>');
      advFields.push('<input type="text" name="name" value="' + values.name + '" class="fld-name form-control" id="title-' + lastID + '" /></div>');

      advFields.push('<div class="form-group access-wrap"><label>' + opts.messages.roles + '</label>');

      advFields.push('<input type="checkbox" name="enable_roles" value="" ' + (values.role !== undefined ? 'checked' : '') + ' id="enable_roles-' + lastID + '"/> <label for="enable_roles-' + lastID + '" class="roles-label">' + opts.messages.limitRole + '</label>');
      advFields.push('<div class="available-roles" ' + (values.role !== undefined ? 'style="display:block"' : '') + '>');

      for (key in opts.roles) {
        if ($.inArray(key, ['date', '4']) === -1) {
          advFields.push('<input type="checkbox" name="roles[]" value="' + key + '" id="fld-' + lastID + '-roles-' + key + '" ' + ($.inArray(key, roles) !== -1 ? 'checked' : '') + ' class="roles-field" /><label for="fld-' + lastID + '-roles-' + key + '">' + opts.roles[key] + '</label><br/>');
        }
      }
      advFields.push('</div></div>');

      // if field type is not checkbox, checkbox/radio group or select list, add max length
      if ($.inArray(values.type, ['checkbox', 'select', 'checkbox-group', 'date', 'autocomplete', 'radio-group', 'hidden', 'button']) < 0) {
        advFields.push('<div class="form-group"><label class="maxlength-label">' + opts.messages.maxlength + '</label>');
        advFields.push('<input type="text" name="maxlength" maxlength="4" value="' + (values.maxlength !== undefined ? values.maxlength : '') + '" class="fld-maxlength form-control" id="maxlength-' + lastID + '" /></div>');
      }

      return advFields.join('');
    };

    var subTypeField = function(type) {
      let subTypes = opts.messages.subtypes,
        subType = '';

      if (subTypes[type]) {
        let subTypeLabel = `<label>${opts.messages.subtype}</label>`;
        subType += `<select name="subtype" class="fld-subtype form-control" id="subtype-${lastID}">`;
        subTypes[type].forEach(function(element) {
          let selected = type === element ? 'selected' : '';
          subType += `<option value="${element}" ${selected}>${element}</option>`;
        });
        subType += `</select>`;
        subType = `<div class="form-group subtype-wrap">${subTypeLabel} ${subType}</div>`;
      }

      return subType;
    };

    var sizeField = function(size, type) {
      let sizes = Object.keys(opts.messages.sizes),
        tags = {
          button: 'btn',
          text: 'input'
        },
        sizeField = '';

      if (tags[type]) {
        let sizeLabel = `<label>${opts.messages.size}</label>`;
        sizeField += `<select name="size" class="fld-size form-control" id="size-${lastID}">`;
        sizes.forEach(function(element) {
          let selected = size === element ? 'selected' : '';
          sizeField += `<option value="${tags[type]}-${element}" ${selected}>${opts.messages.sizes[element]}</option>`;
        });

        sizeField += `</select>`;
        sizeField = `<div class="form-group size-wrap">${sizeLabel} ${sizeField}</div>`;
      }

      return sizeField;
    };

    var btnStyles = function(style, type) {
      let tags = {
          button: 'btn'
        },
        styles = opts.messages.styles[tags[type]],
        styleField = '';

      if (styles) {
        let styleLabel = `<label>${opts.messages.style}</label>`;
        styleField += `<input value="${style}" name="style" type="hidden" class="btn-style">`;
        styleField += '<div class="btn-group" role="group">';

        Object.keys(opts.messages.styles[tags[type]]).forEach(function(element) {
          let active = style === element ? 'active' : '';
          styleField += `<button value="${element}" type="${type}" class="${active} btn-xs ${tags[type]} ${tags[type]}-${element}">${opts.messages.styles[tags[type]][element]}</button>`;
        });

        styleField += '</div>';

        styleField = `<div class="form-group style-wrap">${styleLabel} ${styleField}</div>`;
      }

      return styleField;
    };

    var placeHolderField = function(type) {
      let placeholders = opts.messages.placeholders,
        placeholder = '';

      if (typeof placeholders[type] !== 'undefined') {
        let placeholderLabel = `<label>${opts.messages.placeholder}</label>`;
        placeholder += `<input type="text" name="placeholder" placeholder="${placeholders[type]}" class="fld-placeholder form-control" id="placeholder-${lastID}">`;
        placeholder = `<div class="form-group placeholder-wrap">${placeholderLabel} ${placeholder}</div>`;
      }

      return placeholder;
    };

    // Append the new field to the editor
    var appendFieldLi = function(title, field, values) {
      var labelVal = $(field).find('input[name="label"]').val(),
        label = (labelVal ? labelVal : title);

      var delBtn = _helpers.markup('a', opts.messages.remove, {
          id: 'del_' + lastID,
          className: 'del-button btn delete-confirm',
          title: opts.messages.removeMessage
        }),
        toggleBtn = _helpers.markup('a', null, {
          id: 'frm-' + lastID,
          className: 'toggle-form btn icon-pencil',
          title: opts.messages.hide
        }),
        fieldActions = _helpers.markup('div', [toggleBtn, delBtn], {
          className: 'field-actions'
        }).outerHTML,
        required = values.required,
        toggle = values.toggle || undefined,
        tooltip = values.description !== '' ? '<span class="tooltip-element" tooltip="' + values.description + '">?</span>' : '';

      var liContents = fieldActions;

      liContents += '<label class="field-label">' + label + '</label>' + tooltip + '<span class="required-asterisk" ' + (required === 'true' ? 'style="display:inline"' : '') + '> *</span>';
      liContents += _helpers.markup('div', '', { className: 'prev-holder' }).outerHTML;
      liContents += '<div id="frm-' + lastID + '-fld" class="frm-holder">';
      liContents += '<div class="form-elements">';
      liContents += '<div class="form-group">';
      liContents += '<label>&nbsp;</label>';
      let requiredField = _helpers.markup('input', null, {
        className: 'required',
        type: 'checkbox',
        name: 'required-' + lastID,
        id: 'required-' + lastID,
        value: 1
      });

      requiredField.defaultChecked = (required === 'true');

      liContents += requiredField.outerHTML;
      liContents += _helpers.markup('label', opts.messages.required, {
        className: 'required-label',
        'for': 'required-' + lastID
      }).outerHTML;
      liContents += '</div>';
      if (values.type === 'checkbox') {
        liContents += '<div class="form-group">';
        liContents += '<label>&nbsp;</label>';
        liContents += '<input class="checkbox-toggle" type="checkbox" value="1" name="toggle-' + lastID + '" id="toggle-' + lastID + '"' + (toggle === 'true' ? ' checked' : '') + ' /><label class="toggle-label" for="toggle-' + lastID + '">' + opts.messages.toggle + '</label>';
        liContents += '</div>';
      }
      liContents += field;
      liContents += _helpers.markup('a', opts.messages.close, { className: 'close-field' }).outerHTML;

      liContents += '</div>';
      liContents += '</div>';

      let li = _helpers.markup('li', liContents, {
          'class': values.type + '-field form-field',
          id: 'frm-' + lastID + '-item'
        }),
        $li = $(li);

      $li.data('fieldData', { attrs: values });

      if (typeof _helpers.stopIndex !== 'undefined') {
        $('> li', $sortableFields).eq(_helpers.stopIndex).after($li);
      } else {
        $sortableFields.append($li);
      }

      $(document.getElementById('frm-' + lastID + '-item')).hide().slideDown(250);

      lastID++;
    };

    // Select field html, since there may be multiple
    var selectFieldOptions = function(name, values, selected, multipleSelect) {
      var optionInputType = {
        selected: (multipleSelect ? 'checkbox' : 'radio')
      };

      let defaultOptionData = {
        selected: selected,
        label: '',
        value: ''
      };

      let optionData = Object.assign(defaultOptionData, values),
        optionInputs = [];

      for (var prop in optionData) {
        if (optionData.hasOwnProperty(prop)) {
          let attrs = {
            type: optionInputType[prop] || 'text',
            'class': 'option-' + prop,
            placeholder: opts.messages.placeholders[prop],
            value: optionData[prop],
            name: name
          };
          let option = _helpers.markup('input', null, attrs);
          if (prop === 'selected') {
            option.checked = optionData.selected;
          }
          optionInputs.push(option);
        }
      }

      let removeAttrs = {
        className: 'remove btn',
        title: opts.messages.removeMessage
      };
      optionInputs.push(_helpers.markup('a', opts.messages.remove, removeAttrs));

      let field = _helpers.markup('li', optionInputs);

      return field.outerHTML;
    };

    // ---------------------- UTILITIES ---------------------- //

    // delete options
    $sortableFields.on('click touchstart', '.remove', function(e) {
      e.preventDefault();
      var optionsCount = $(this).parents('.sortable-options:eq(0)').children('li').length;
      if (optionsCount <= 2) {
        alert('Error: ' + opts.messages.minOptionMessage);
      } else {
        $(this).parent('li').slideUp('250', function() {
          $(this).remove();
        });
      }
    });

    // touch focus
    $sortableFields.on('touchstart', 'input', function(e) {
      if (e.handled !== true) {
        if ($(this).attr('type') === 'checkbox') {
          $(this).trigger('click');
        } else {
          $(this).focus();
          let fieldVal = $(this).val();
          $(this).val(fieldVal);
        }
      } else {
        return false;
      }
    });

    // toggle fields
    $sortableFields.on('click touchstart', '.toggle-form', function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.handled !== true) {
        var targetID = $(this).attr('id');
        _helpers.toggleEdit(targetID + '-item');
        e.handled = true;
      } else {
        return false;
      }
    });

    _helpers.toggleEdit = function(fieldId) {
      var field = document.getElementById(fieldId),
        toggleBtn = $('.toggle-form', field),
        editMode = $('.frm-holder', field);
      toggleBtn.toggleClass('open');
      $('.prev-holder', field).slideToggle(250);
      editMode.slideToggle(250);
    };

    // update preview to label
    $sortableFields.on('keyup change', 'input[name="label"]', function() {
      $('.field-label', $(this).closest('li')).text($(this).val());
    });

    // remove error styling when users tries to correct mistake
    $sortableFields.delegate('input.error', 'keyup', function() {
      $(this).removeClass('error');
    });

    // update preview for description
    $sortableFields.on('keyup', 'input[name="description"]', function() {
      var $field = $(this).parents('.form-field:eq(0)');
      var closestToolTip = $('.tooltip-element', $field);
      var ttVal = $(this).val();
      if (ttVal !== '') {
        if (!closestToolTip.length) {
          var tt = '<span class="tooltip-element" tooltip="' + ttVal + '">?</span>';
          $('.field-label', $field).after(tt);
        } else {
          closestToolTip.attr('tooltip', ttVal).css('display', 'inline-block');
        }
      } else {
        if (closestToolTip.length) {
          closestToolTip.css('display', 'none');
        }
      }
    });

    _helpers.updateMultipleSelect();

    // format name attribute
    $sortableFields.delegate('input[name="name"]', 'keyup', function() {
      $(this).val(_helpers.safename($(this).val()));
      if ($(this).val() === '') {
        $(this).addClass('field_error').attr('placeholder', opts.messages.cannotBeEmpty);
      } else {
        $(this).removeClass('field_error');
      }
    });

    $sortableFields.delegate('input.fld-maxlength', 'keyup', function() {
      $(this).val(_helpers.forceNumber($(this).val()));
    });

    // Delete field
    $sortableFields.on('click touchstart', '.delete-confirm', function(e) {
      e.preventDefault();

      // lets see if the user really wants to remove this field... FOREVER
      var fieldWarnH3 = $('<h3/>').html('<span></span>' + opts.messages.warning),
        deleteID = $(this).attr('id').replace(/del_/, ''),
        delBtn = $(this),
        $field = $(document.getElementById('frm-' + deleteID + '-item')),
        toolTipPageX = delBtn.offset().left - $(window).scrollLeft(),
        toolTipPageY = delBtn.offset().top - $(window).scrollTop();

      if (opts.showWarning) {
        jQuery('<div />').append(fieldWarnH3, opts.messages.fieldRemoveWarning).dialog({
          modal: true,
          resizable: false,
          width: 300,
          dialogClass: 'ite-warning',
          open: function() {
            $('.ui-widget-overlay').css({
              'opacity': 0.0
            });
          },
          position: [toolTipPageX - 282, toolTipPageY - 178],
          buttons: [{
            text: opts.messages.yes,
            click: function() {
              $field.slideUp(250, function() {
                $(this).remove();
                _helpers.save();
              });
              $(this).dialog('close');
            }
          }, {
            text: opts.messages.no,
            'class': 'cancel',
            click: function() {
              $(this).dialog('close');
            }
          }]
        });
      } else {
        $field.slideUp(250, function() {
          $(this).remove();
          _helpers.save();
        });
      }

      if ($('> li', $sortableFields).length === 1) {
        $stageWrap.addClass('empty').attr('data-content', opts.messages.getStarted);
      }

    });

    // Attach a callback to toggle required asterisk
    $sortableFields.on('click', '.style-wrap button', function() {
      let styleVal = $(this).val(),
        $parent = $(this).parent(),
        $btnStyle = $parent.prev('.btn-style');
      $btnStyle.val(styleVal);
      $(this).siblings('.btn').removeClass('active');
      $(this).addClass('active');
      $btnStyle.trigger('change');
    });

    // Attach a callback to toggle required asterisk
    $sortableFields.on('click', 'input.required', function() {
      var requiredAsterisk = $(this).parents('li.form-field').find('.required-asterisk');
      requiredAsterisk.toggle();
    });

    // Attach a callback to toggle roles visibility
    $sortableFields.on('click', 'input[name="enable_roles"]', function() {
      var roles = $(this).siblings('div.available-roles'),
        enableRolesCB = $(this);
      roles.slideToggle(250, function() {
        if (!enableRolesCB.is(':checked')) {
          $('input[type="checkbox"]', roles).removeAttr('checked');
        }
      });
    });

    // Attach a callback to add new options
    $sortableFields.on('click', '.add-opt', function(e) {
      e.preventDefault();
      var $optionWrap = $(this).parents('.field-options:eq(0)'),
        $multiple = $('[name="multiple"]', $optionWrap),
        $firstOption = $('.option-selected:eq(0)', $optionWrap),
        isMultiple = false;

      if ($multiple.length) {
        isMultiple = $multiple.prop('checked');
      } else {
        isMultiple = ($firstOption.attr('type') === 'checkbox');
      }

      let name = $firstOption.attr('name');

      $('.sortable-options', $optionWrap).append(selectFieldOptions(name, false, false, isMultiple));
      _helpers.updateMultipleSelect();
    });

    // Attach a callback to close link
    $sortableFields.on('click touchstart', '.close-field', function() {
      let fieldId = $(this).parents('li.form-field:eq(0)').attr('id');
      _helpers.toggleEdit(fieldId);
    });

    $sortableFields.on('mouseover mouseout', '.remove, .del-button', function() {
      $(this).parents('li:eq(0)').toggleClass('delete');
    });

    var xmlButton = $(document.getElementById(frmbID + '-export-xml'));
    var clearButton = $(document.getElementById(frmbID + '-clear-all'));

    // View XML
    xmlButton.click(function(e) {
      e.preventDefault();
      var xml = elem.val(),
        $pre = $('<pre />').text(xml);
      $pre.dialog({
        resizable: false,
        modal: true,
        width: 720,
        dialogClass: 'frmb-xml',
        overlay: {
          color: '#333333'
        }
      });
    });

    overlay.onclick = function() {
      _helpers.closeConfirm(overlay);
    };

    // Clear all fields in form editor
    clearButton.click(function(e) {
      let buttonPosition = this.getBoundingClientRect(),
        bodyRect = document.body.getBoundingClientRect()
      var coords = {
        pageX: buttonPosition.left + (buttonPosition.width / 2),
        pageY: (buttonPosition.top - bodyRect.top) - 12
      };

      overlay.classList.add('visible');
      _helpers.confirm('Are you sure you want to clear all fields?', function() {
        console.log('fields cleared');
      }, { pageX: coords.pageX, pageY: coords.pageY });
      e.preventDefault();
      // if (window.confirm(opts.messages.clearAllMessage)) {
      //   $sortableFields.empty();
      //   elem.val('');
      //   _helpers.save();
      //   var values = {
      //     label: [opts.messages.descriptionField],
      //     name: ['content'],
      //     required: 'true',
      //     description: opts.messages.mandatory
      //   };

      //   appendNewField(values);
      // }
    });

    // Save Idea Template
    $(document.getElementById(frmbID + '-save')).click(function(e) {
      e.preventDefault();
      _helpers.save();
      _helpers.validateForm(e);
    });

    var triggerDevMode = false,
      keys = [],
      devCode = '68,69,86';
    // Super secret Developer Tools
    $('.fb-save').mouseover(function() {
      triggerDevMode = true;
    }).mouseout(function() {
      triggerDevMode = false;
    });
    $(document.documentElement).keydown(function(e) {
      keys.push(e.keyCode);
      if (keys.toString().indexOf(devCode) >= 0) {
        $('.action-links').toggle();
        $('.view-xml').toggle();
        keys = [];
      }
    });
    // Toggle Developer Mode
    $('.dev-mode-link').click(function(e) {
      e.preventDefault();
      var dml = $(this);
      $stageWrap.toggleClass('dev-mode');
      dml.parent().css('opacity', 1);
      if ($stageWrap.hasClass('dev-mode')) {
        dml.siblings('.action-links-inner').css('width', '100%');
        dml.html(opts.messages.devMode + ' ' + opts.messages.on).css('color', '#8CC63F');
      } else {
        dml.siblings('.action-links-inner').css('width', 0);
        dml.html(opts.messages.devMode + ' ' + opts.messages.off).css('color', '#666666');
        triggerDevMode = false;
        $('.action-links').toggle();
        $('.view-xml').toggle();
      }
    });

    // Toggle Edit Names
    $(document.getElementById(frmbID + '-edit-names')).click(function(e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('.name-wrap', $sortableFields).slideToggle(250, function() {
        $stageWrap.toggleClass('edit-names');
      });
    });

    // Toggle Allow Select
    $(document.getElementById(frmbID + '-allow-select')).click(function(e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('.allow-multi, .option-selected', $sortableFields).slideToggle(250, function() {
        $stageWrap.toggleClass('allow-select');
      });
    });

    // Toggle Edit XML
    $(document.getElementById(frmbID + '-edit-xml')).click(function(e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('textarea.idea-template').show();
      $('.template-textarea-wrap').slideToggle(250);
      $stageWrap.toggleClass('edit-xml');
    });

    elem.parent().find('p[id*="ideaTemplate"]').remove();
    elem.wrap('<div class="template-textarea-wrap"/>');

    loadData();

    $sortableFields.css('min-height', $cbUL.height());

    document.dispatchEvent(formBuilder.events.loaded);

    return formBuilder;
  };

  $.fn.formBuilder = function(options) {
    return this.each(function() {
      var element = this,
        formBuilder;
      if ($(element).data('formBuilder')) {
        var existingFormBuilder = $(element).parents('.form-builder:eq(0)');
        var newElement = $(element).clone();
        existingFormBuilder.before(newElement);
        existingFormBuilder.remove();
        formBuilder = new FormBuilder(options, newElement[0]);
        newElement.data('formBuilder', formBuilder);
      } else {
        formBuilder = new FormBuilder(options, element);
        $(element).data('formBuilder', formBuilder);
      }
    });
  };
})(jQuery);
