(function (mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {

  const baseClass = {
    ['cm-keyword']: 'cm-keyword',
    ['cm-def']: 'cm-def',
    ['cm-operator']: 'cm-operator',
    ['cm-property']: 'cm-property',
    ['cm-number']: 'cm-number',
    ['cm-string']: 'cm-string',
    ['cm-variable']: 'cm-variable',
    ['cm-variable-2']: 'cm-variable-2',
    ['cm-type']: 'cm-type',
    ['cm-atom']: 'cm-atom',
    ['cm-punctuation']: 'cm-punctuation',
    ['cm-comment']: 'cm-comment',
    ['cm-string-2']: 'cm-string-2',
    ['cm-meta']: 'cm-meta',
    ['cm-qualifier']: 'cm-qualifier',
    ['cm-builtin']: 'cm-builtin',
    ['cm-bracket']: 'cm-bracket',
    ['cm-tag']: 'cm-tag',
    ['cm-attribute']: 'cm-attribute',
    ['cm-hr']: 'cm-hr',
    ['cm-link']: 'cm-link',
    ['cm-error']: 'cm-error',
    ['cm-header']: 'cm-header',
    ['cm-quote']: 'cm-quote',
    ['cm-strikethrough']: 'cm-strikethrough',
    ['cm-positive']: 'cm-positive',
    ['cm-negative']: 'cm-negative',
    ['cm-strong']: 'cm-strong',
    ['cm-em']: 'cm-em',
    ['cm-invalidchar']: 'cm-invalidchar'
  }

  const keyTagClass = {
    'cm-keyword': "cm-keyword"
  }

  // CodeMirror.on(document.documentElement, 'mouseup', function () {
  //   const elCodemirrorFocus = document.querySelector('.f-cm-focus');
  //   if (elCodemirrorFocus) {
  //     elCodemirrorFocus.classList.remove('f-cm-focus');
  //   }
  // })

  CodeMirror.customEvent = (cm) => {
    return cm.customEvent(cm);
  }

  CodeMirror.defineExtension('customEvent', function (cm) {
    // options = parseOptions(this, this.getCursor("start"), options);
    //* [f-state] -> store states: text preview selection | element cursors | position cursors when executing mousedown
    const state = {}
    const hintOptions = {
      tables: {
        table1: ["column1", "column2", "column3", "etc"],
        table2: ["column1", "column2", "column3", "etc"],
        another_table: ["columnA", "columnB"],
      },
      completeSingle: false
    }

    cm.on('mousedown', function (_cm, event) {
      handleOnMousedown(_cm, event, state);
    })

    cm.on('keydown', function (_cm, event) {
      handleOnKeyDown(_cm, event, state);
    })

    cm.on('dblclick', function (_cm, event) {
      handleDblclick(cm, event, state)
    })

    cm.on('change', function (_cm, data) {
      const line = _cm.doc.getCursor().line;
      const textOfLine = _cm.doc.getLine(line);

      const value = _cm.getValue();
      if (!value.includes(';') && !!textOfLine) {
        _cm.showHint(hintOptions)
      }
    })
  })

  /**
   * - Add and remove class highlight text selection
   * - Set states
   * @param {*} cm -> codemirror
   * @param {*} event -> mousedownEvent
   * @param {*} state -> [f-state]
   * @returns 
   */

  function handleOnMousedown(cm, event, state) {
    const _element = event.target;
    if (!_element) return;

    const elTagSelected = document.querySelector('.f-cm-tag-selected');
    const elCursors = document.querySelector('.CodeMirror-cursors');
    const textOfElement = _element.innerText || '';

    if (elTagSelected) {
      elTagSelected.classList.remove('f-cm-tag-selected');
    }

    // if (baseClass[_element.className]) {
    //   _element.classList.add('f-cm-tag-selected');
    //   elCursors.style.display = 'none';
    // } else elCursors.style.display = 'unset';

    if (keyTagClass[_element.className]) {
      state['textPrevSelection'] = textOfElement;
      _element.classList.add('f-cm-tag-selected');
      elCursors.style.display = 'none';
    } else elCursors.style.display = 'unset';

    state['mousedownCursors'] = cm.getDoc().getCursor();
    state['elCursors'] = elCursors;
  }

  /**
   * Handle event keydown when execute delete action:
   * - Calculate position cursors of new text selection
   * - Use setSelection with that position
   * @param {*} cm ->  codemirror
   * @param {*} event -> keydownEvent
   * @param {*} state -> [f-state]
   * @returns () => void
   */
  function handleOnKeyDown(cm, event, state) {
    const CHAR_BACKSPACE = 'Backspace',
      CODE_BACKSPACE = 8,
      CODE_DEL = 46,
      CODE_SEMI_COLON = 186
    if (event.key === CHAR_BACKSPACE || event.which === CODE_BACKSPACE || event.which === CODE_DEL) {
      const _somethingSelected = cm.somethingSelected();
      const _textPrevSelection = state.textPrevSelection;
      const hadWhiteSpaces = _textPrevSelection?.match(/\s+/g);
      const hadDots = _textPrevSelection?.match(/\./g);
      // const wordsWithoutDots = _textPrevSelection.match(/(^|\s)([^\s\.]+)($|\s)/g);
      if (_somethingSelected || hadWhiteSpaces || hadDots || !!!_textPrevSelection) return;

      const _doc = cm.getDoc(),
        line = _doc.getCursor().line,
        ch = _doc.getCursor().ch,
        length = state.textPrevSelection.length,
        n = length === 1 ? 1 : length === 2 ? 2 : 3,
        subText = _doc.getLine(line).substr(Math.max(ch - n, 0), n),
        indexOfSubText = state.textPrevSelection.indexOf(subText),
        ch1 = ch - indexOfSubText - n,
        ch2 = ch + (length - indexOfSubText - n),
        anchor = {
          ch: ch1,
          line,
          sticky: null
        },
        head = {
          ch: ch2,
          line,
          sticky: null
        }

      _doc.setSelection(anchor, head);
    }
    if(event.which === CODE_SEMI_COLON){
      state['hadSemiColon'] = true;
    }
  }

  function handleDblclick(cm, event, state) {
    const elCodemirror = document.querySelector('.CodeMirror');
    if (elCodemirror) elCodemirror.classList.add('f-cm-focus');
    const elCursors = state.elCursors;
    const cursors = state.mousedownCursors

    cm.doc.setSelection(cursors, cursors);
    if (elCursors) {
      editor.focus();
      editor.setCursor(cursors)
      elCursors.style.display = 'unset'
    }
    state['textPrevSelection'] = '';
  }

  // CodeMirror.defineOption('customEvent', {
  //   newEvent: function(e){
  //     ...
  //   }
  // })

});