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
    'cm-dots-namespace-tag': 'cm-dots-namespace-tag',

    'cm-start-table-tag--string': 'cm-start-table-tag--string',
    'cm-start-table-tag--number': 'cm-single-table-tag--number',
    'cm-start-table-tag--boolean': 'cm-single-table-tag--boolean',
    'cm-start-table-tag--date': 'cm-single-table-tag--date',

    'cm-start-currentvalue-tag--string': 'cm-start-currentvalue-tag--string',
    'cm-middle-currentvalue-tag--number': 'cm-single-currentvalue-tag--number',
    'cm-end-currentvalue-tag--boolean': 'cm-single-currentvalue-tag--boolean',
    'cm-end-currentvalue-tag--date': 'cm-single-currentvalue-tag--date',

    'cm-start-currentuser-tag--string': 'cm-start-currentuser-tag--string',
    'cm-middle-currentuser-tag--number': 'cm-single-currentuser-tag--number',
    'cm-end-currentuser-tag--boolean': 'cm-single-currentuser-tag--boolean',
    'cm-end-currentuser-tag--date': 'cm-single-currentuser-tag--date',
  }

  CodeMirror.customEvent = (cm) => {
    return cm.customEvent(cm);
  }

  CodeMirror.defineExtension('customEvent', function (cm) {
    // options = parseOptions(this, this.getCursor("start"), options);
    //* [state] -> store states:
    //* - tagValue: text of tag
    //* - elCursors: dom element cursor 
    //* - position cursors when executing mousedown
    //* - posStart: position of text picked to position start tag
    //* - posEnd: position of text picked to position end tag
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
      console.log('EVENT 222 ==>', 'mousedown')
      handleOnMousedown(_cm, event, state);
    })

    cm.on('keyup', function (cm, event) {
      console.log('keyup', cm, event)
    })

    cm.on('keydown', function (_cm, event) {
      // const keyName = CodeMirror.keyName(event);
      // const extra = cm.getOption('extraKeys');
      handleOnKeyDown(_cm, event, state);
    })

    cm.on('dblclick', function (_cm, event) {
      state['event'] = 'dblclick';
      console.log('EVENT ==>', 'dblclick')
      handleDblclick(cm, event, state);
    })

    cm.on('cursorActivity', function (_cm) {
      handleCursorsActivity(cm, state);
    })

    // cm.on('change', function (_cm, data) {
    //   const line = _cm.doc.getCursor().line;
    //   const textOfLine = _cm.doc.getLine(line);

    //   const value = _cm.getValue();
    //   if (!value.includes(';') && !!textOfLine) {
    //     _cm.showHint(hintOptions)
    //   }
    // })

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
    state['event'] = 'mousedown';
    if (!_element) return;
    const elCursors = document.querySelector('.CodeMirror-cursors');
    // reset state of cursor activity
    // state['event'] = 'mousedown';
    state['keyName'] = '';
    // state['mousedownCursors'] = cm.getDoc().getCursor();
    state['elCursors'] = elCursors;

    const el = event.target;
    const elRect = el.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;



    return;

    // const elTagSelected = document.querySelector('.f-cm-tag-selected');
    let textOfElement = _element.innerText || '';
    if (formulaTagClass[_element.className]) {
      let existNextClass = true,
        existPrevClass = true,
        nexCurrent = _element,
        prevElCurrent = _element;

      let posEnd = 0;
      let posStart = 0;

      while (true) {
        const nextElementSibling = nexCurrent ? nexCurrent.nextElementSibling : null;
        const prevElementSibling = prevElCurrent ? prevElCurrent.previousElementSibling : null;
        if (nextElementSibling) {
          const nextClass = nextElementSibling.className;
          if (formulaTagClass[nextClass] && nextClass) {
            textOfElement = textOfElement + nextElementSibling.innerText;
            posEnd += nextElementSibling.innerText.length
          } else existNextClass = false;
        } else existNextClass = false;

        if (prevElementSibling) {
          const prevClass = prevElementSibling.className;
          if (formulaTagClass[prevClass] && existPrevClass) {
            textOfElement = prevElementSibling.innerText + textOfElement;
            posStart += prevElementSibling.innerText.length
          } else existPrevClass = false;
        } else existPrevClass = false

        if ((!existNextClass && !existPrevClass)) {
          break
        }
        nexCurrent = nextElementSibling;
        prevElCurrent = prevElementSibling;
      }

      state['tagValue'] = textOfElement;
      state['posStart'] = posStart;
      state['posEnd'] = posEnd;
      console.log('TEXT ==>', textOfElement, posEnd, posStart)
      // elCursors.style.display = 'none';
    } else {
      // elCursors.style.display = 'unset';
      state['tagValue'] = null;
    };

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
    state['event'] = 'keydown';
    const CODE_SEMI_COLON = 186,
      keyName = CodeMirror.keyName(event),
      doc = cm.getDoc(),
      cursor = doc.getCursor(),
      token = cm.getTokenAt({
        line: cursor.line,
        ch: cursor.ch
      }, true);

    state['keyName'] = keyName;
    // state['event'] = 'keydown';
    console.log('KEY NAME =>', keyName)
    return;


    // if (formulaTagClass[`cm-${token.type}`]) {
    //   const strValueLine = doc.getLine(cursor.line);
    //   const strTag = state.tagValue;
    //   const tokenString = token.string;




    //   const line = cursor.line;
    //   const ch1 = token.start - state.posStart;
    //   const ch2 = token.end + state.posEnd;
    //   const sticky = null;

    //   console.log('TEXT 222 =>', ch1, ch2, token, state, keyName);
    //   // doc.setSelection({ch: ch1, line,sticky},{ch: ch2, line, sticky});

    // }

    if (keyName === 'Backspace' || keyName === 'Delete') {
      const _somethingSelected = cm.somethingSelected();
      let _tagValue = state.tagValue;
      const hadWhiteSpaces = _tagValue ? _tagValue.match(/\s+/g) : false;
      // const hadDots = _tagValue?.match(/\./g);
      // const wordsWithoutDots = _tagValue.match(/(^|\s)([^\s\.]+)($|\s)/g);
      if (_somethingSelected || !!!_tagValue || hadWhiteSpaces) return;
      const _tagValueArr = _tagValue.split('.')

      if (_tagValueArr.length === 2 && !!!_tagValueArr[1]) {
        _tagValue = _tagValue.replace(/\./g, '');
      }

      const _doc = cm.getDoc(),
        line = _doc.getCursor().line,
        ch = _doc.getCursor().ch,
        length = _tagValue.length,
        n = length === 1 ? 1 : length === 2 ? 2 : 3,
        subText = _doc.getLine(line).substr(Math.max(ch - n, 0), n),
        indexOfSubText = state.tagValue.indexOf(subText),
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


    if (event.which === CODE_SEMI_COLON) {
      state['hadSemiColon'] = true;
    }

  }

  function handleDblclick(cm, event, state) {
    const className = event.target.className;
    state['event'] = 'dblclick';
    // todo: handle select text
    if (formulaTagClass[className]) {
      // const elCodemirror = document.querySelector('.CodeMirror');
      // if (elCodemirror) elCodemirror.classList.add('f-cm-focus');
      // const elCursors = state.elCursors;
      console.log('DBLCLICK ==>', cm.getDoc().getCursor(), state.mousedownCursors)
      const cursors = state.mousedownCursors
      cm.doc.setSelection(cursors, cursors);
      // if (elCursors) {
      //   cm.focus();
      //   cm.setCursor(cursors)
      //   elCursors.style.display = 'unset'
      // }
    }

  }

  function handleCursorsActivity(cm, state) {
    console.log('CursorsActivity ===>', cm);
    const doc = cm.getDoc();
    const cursor = doc.getCursor();
    const token = cm.getTokenAt({
      line: cursor.line,
      ch: cursor.ch
    }, true);

    console.log('RESULT ==>', token, cursor, state, !!token.string.trim(), state.event);
    if (state.event === 'dblclick') {
      console.log('RUN DBLCLICK', cursor)
      return;
    }

    if (!token.start && !token.end) {
      showCursorInHeadLine(state.elCursors)
      return
    }

    //* Cursor activity on [TAG]
    if (formulaTagClass[`cm-${token.type}`] && token.string && !!token.string.trim() && (state.event === 'mousedown' || state.keyName === 'Left' || state.keyName === 'Right')) {

      const {
        startTag,
        endTag
      } = getValueTag(cm, token);
      // set states
      state['startTag'] = startTag;
      state['endTag'] = endTag;

      console.log('SELECTION =>', cm.somethingSelected(), state.event);

      if (state['event'] === 'mousedown') {
        console.log('RUN 11', cm.somethingSelected(), cursor);
        if (!cm.somethingSelected()) {
          state['mousedownCursors'] = cursor;
        }
        highlightTag(cm, startTag, endTag);
        state['clientSomethingSelected'] = true;
        return;
      }

      if (!state['clientSomethingSelected']) {
        console.log('RUN 22')
        highlightTag(cm, startTag, endTag);
        state['clientSomethingSelected'] = true;
      } else {
        state['clientSomethingSelected'] = false;
      }

      return
    }
    state['clientSomethingSelected'] = false;
  }

  function cachingValueTag(func) {
    const cache = new Map();

    return function (x) {
      if (cache.has(x)) {
        return cache.get(x);
      }
      const result = func(x);
      cache.set(x, result);
      return result;
    }
  }

  // Get value tag
  function getValueTag(cm, token) {
    if (!cm) return console.error('cm not exist');
    let startPrev = token.start,
      startNext = token.end + 1,
      startTag = token.start,
      endTag = token.end,
      isStartTag = false,
      isEndTag = false;

    const cursor = cm.getDoc().getCursor(),
      condition = 0;

    while (condition < 1000) {
      const tokenPrev = cm.getTokenAt({
        line: cursor.line,
        ch: startPrev
      });
      const tokenNext = cm.getTokenAt({
        line: cursor.line,
        ch: startNext
      });

      // Condition break loop
      if ((tokenPrev.start === startTag) || !tokenPrev) isStartTag = true;
      if ((tokenNext.end === endTag) || !tokenNext) isEndTag = true;
      if (isStartTag && isEndTag) break;

      // Handle next tag
      if (formulaTagClass[`cm-${tokenPrev.type}`]) {
        startTag = tokenPrev.start;
        startPrev = tokenPrev.start - 1;
      } else isStartTag = true;

      // Handle previous tag
      if (formulaTagClass[`cm-${tokenNext.type}`]) {
        endTag = tokenNext.end;
        startNext = tokenNext.end + 1;
      } else isEndTag = true;
    }

    return {
      startTag,
      endTag
    }
  }

  // Handle highlight tag when focus
  // focus: By picked: mouse down or keydown: arrowLeft - arrowRight
  function highlightTag(cm, startTag = 0, endTag = 0) {
    if (!cm) return console.error('Codemirror exist');
    const cursor = cm.getDoc().getCursor();
    cm.setSelection({
      ch: startTag,
      line: cursor.line,
      sticky: cursor.sticky
    }, {
      ch: endTag,
      line: cursor.line,
      sticky: cursor.sticky
    })
  }

  function showCursorToLeft(cm, state, line) {
    const PADDING = '25px';
    cm.setCursor({
      line,
      ch: state.startTag
    });
    state.elCursors.style.opacity = 0;
    setTimeout(() => {
      const elCursor = state.elCursors.querySelector('.CodeMirror-cursor');
      elCursor.style.left = `calc(${elCursor.style.left} - ${PADDING})`;
      state.elCursors.style.opacity = 1;
    }, 0);
  }

  function showCursorInHeadLine(elCursors) {
    elCursors.style.opacity = 0;
    setTimeout(() => {
      const elCursor = elCursors.querySelector('.CodeMirror-cursor');
      if (!elCursor) return;
      const left = elCursor.style.left.replace('px', '');
      const POSITION_INIT = 4
      if (Number(left) > POSITION_INIT) {
        elCursor.style.left = `calc(${elCursor.style.left} - 25px)`;
      }
      elCursors.style.opacity = 1;
    }, 0);
  }

});