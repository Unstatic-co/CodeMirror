(function (mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {

  const formulaTagClass = {
    'cm-single-table-tag': 'cm-single-table-tag',
    'cm-start-table-tag': 'cm-start-table-tag',
    'cm-middle-table-tag': 'cm-single-table-tag',
    'cm-end-table-tag': 'cm-single-table-tag',

    'cm-single-currentvalue-tag': 'cm-single-currentvalue-tag',
    'cm-start-currentvalue-tag': 'cm-start-currentvalue-tag',
    'cm-middle-currentvalue-tag': 'cm-middle-currentvalue-tag',
    'cm-end-currentvalue-tag': 'cm-end-currentvalue-tag',

    'cm-single-currentuser-tag': 'cm-single-currentuser-tag',
    'cm-start-currentuser-tag': 'cm-start-currentuser-tag',
    'cm-middle-currentuser-tag': 'cm-middle-currentuser-tag',
    'cm-end-currentuser-tag': 'cm-end-currentuser-tag',

    'cm-single-placeholder-tag': 'cm-single-placeholder-tag',
    'cm-start-placeholder-tag': 'cm-start-placeholder-tag',
    'cm-middle-placeholder-tag': 'cm-middle-placeholder-tag',
    'cm-end-placeholder-tag': 'cm-end-placeholder-tag',

    'cm-single-namepace-tag': 'cm-single-namepace-tag',
    'cm-start-namepace-tag': 'cm-start-namepace-tag',
    'cm-middle-namepace-tag': 'cm-middle-namepace-tag',
    'cm-end-namepace-tag': 'cm-end-namepace-tag',

    'cm-dots-table-tag': 'cm-dots-table-tag',
    'cm-dots-currentvalue-tag': 'cm-dots-currentvalue-tag',
    'cm-dots-currentuser-tag': 'cm-dots-currentuser-tag',
    'cm-dots-placeholder-tag': 'cm-dots-placeholder-tag',
    'cm-dots-namespace-tag': 'cm-dots-namespace-tag'
  }

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

  CodeMirror.customEvent = (cm) => {
    return cm.customEvent(cm);
  }

  // CodeMirror.prototype.operation = function(action) {
    // if (this.alreadyInOperation()) return action();
    // this.setUpOperation();
    // try     { return action();        }
    // finally { this.finishOperation();  console.log('FINALY') }
  // };

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
      // const keyName = CodeMirror.keyName(event);
      // const extra = cm.getOption('extraKeys');
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
    // const elTagSelected = document.querySelector('.f-cm-tag-selected');
    const elCursors = document.querySelector('.CodeMirror-cursors');

    let textOfElement = _element.innerText || '';
    if(formulaTagClass[_element.className]){
      let existNextClass = true;
      let existPrevClass = true;
      let nexCurrent = _element;
      let prevElCurrent = _element;
      while (true) {
        const nextElementSibling = nexCurrent ? nexCurrent.nextElementSibling : null;
        const prevElementSibling = prevElCurrent ? prevElCurrent.previousElementSibling : null;
        if(nextElementSibling){
          const nextClass = nextElementSibling.className;
          if(formulaTagClass[nextClass] && nextClass){
            // textOfElement = textOfElement + '.' + nextElementSibling.innerText;
            textOfElement = textOfElement + nextElementSibling.innerText;
          }else existNextClass = false;
        }else existNextClass = false;

        if(prevElementSibling){
          const prevClass = prevElementSibling.className;
          if(formulaTagClass[prevClass] && existPrevClass){
            // textOfElement = prevElementSibling.innerText + '.' + textOfElement;
            textOfElement = prevElementSibling.innerText + textOfElement;
          }else existPrevClass = false;
        }else existPrevClass = false
        
        if((!existNextClass && !existPrevClass) ){
          break
        }
        nexCurrent = nextElementSibling;
        prevElCurrent = prevElementSibling;
      }
      state['textPrevSelection'] = textOfElement;
      // _element.classList.add('f-cm-tag-selected');
      elCursors.style.display = 'none';
    }else elCursors.style.display = 'unset';

    
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
      CODE_SEMI_COLON = 186,
      keyName = CodeMirror.keyName(event);

      // const isConditionPass = event.key === CHAR_BACKSPACE || event.which === CODE_BACKSPACE || event.which === CODE_DEL;

    if (keyName === 'Backspace' || keyName === 'Delete') {
      const _somethingSelected = cm.somethingSelected();
      let _textPrevSelection = state.textPrevSelection;
      // const hadWhiteSpaces = _textPrevSelection?.match(/\s+/g);
      // const hadDots = _textPrevSelection?.match(/\./g);
      // const wordsWithoutDots = _textPrevSelection.match(/(^|\s)([^\s\.]+)($|\s)/g);
      if (_somethingSelected || !!!_textPrevSelection || hadWhiteSpaces) return;
      const _textPrevSelectionArr = _textPrevSelection.split('.')
      
      if(_textPrevSelectionArr.length === 2 && !!!_textPrevSelectionArr[1]){
        _textPrevSelection = _textPrevSelection.replace(/\./g,'');
      }
      const _doc = cm.getDoc(),
        line = _doc.getCursor().line,
        ch = _doc.getCursor().ch,
        length = _textPrevSelection.length,
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