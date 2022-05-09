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

  // const baseClass = {
  //   ['cm-keyword']: 'cm-keyword',
  //   ['cm-def']: 'cm-def',
  //   ['cm-operator']: 'cm-operator',
  //   ['cm-property']: 'cm-property',
  //   ['cm-number']: 'cm-number',
  //   ['cm-string']: 'cm-string',
  //   ['cm-variable']: 'cm-variable',
  //   ['cm-variable-2']: 'cm-variable-2',
  //   ['cm-type']: 'cm-type',
  //   ['cm-atom']: 'cm-atom',
  //   ['cm-punctuation']: 'cm-punctuation',
  //   ['cm-comment']: 'cm-comment',
  //   ['cm-string-2']: 'cm-string-2',
  //   ['cm-meta']: 'cm-meta',
  //   ['cm-qualifier']: 'cm-qualifier',
  //   ['cm-builtin']: 'cm-builtin',
  //   ['cm-bracket']: 'cm-bracket',
  //   ['cm-tag']: 'cm-tag',
  //   ['cm-attribute']: 'cm-attribute',
  //   ['cm-hr']: 'cm-hr',
  //   ['cm-link']: 'cm-link',
  //   ['cm-error']: 'cm-error',
  //   ['cm-header']: 'cm-header',
  //   ['cm-quote']: 'cm-quote',
  //   ['cm-strikethrough']: 'cm-strikethrough',
  //   ['cm-positive']: 'cm-positive',
  //   ['cm-negative']: 'cm-negative',
  //   ['cm-strong']: 'cm-strong',
  //   ['cm-em']: 'cm-em',
  //   ['cm-invalidchar']: 'cm-invalidchar'
  // }


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
    if (!_element) return;
    const elCursors = document.querySelector('.CodeMirror-cursors');
    // reset state of cursor activity
    // state['event'] = 'mousedown';
    state['keyName'] = '';
    state['mousedownCursors'] = cm.getDoc().getCursor();
    state['elCursors'] = elCursors;
    return;

    // const elTagSelected = document.querySelector('.f-cm-tag-selected');
    console.log('MOUSEDOWN =>', cm.getDoc().getCursor())
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
    // todo: handle select text
    if (formulaTagClass[className]) {
      const elCodemirror = document.querySelector('.CodeMirror');
      if (elCodemirror) elCodemirror.classList.add('f-cm-focus');
      const elCursors = state.elCursors;
      const cursors = state.mousedownCursors
      cm.doc.setSelection(cursors, cursors);
      if (elCursors) {
        cm.focus();
        cm.setCursor(cursors)
        elCursors.style.display = 'unset'
      }
      state['tagValue'] = '';
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
    if(state.event === 'dblclick'){
      return;
    }

    if(!token.start && !token.end){
      showCursorInHeadLine(state.elCursors)
      return
    }

    // Block!
    if(!state.keyName){
      // return
    }

    //* Cursor activity on [TAG]
    if (formulaTagClass[`cm-${token.type}`] && token.string && !!token.string.trim()) {
      if(state.event === 'mousedown'){
        // return
      }

      // Set cursor to position start or end of tag -> case [hadPosEndTag]
      if(state['hadPosEndTag']){
        if(cursor.sticky === 'after')  showCursorToLeft(cm, state, cursor.line);
        state['hadPosEndTag'] = false;
        return;
      }

      
      let isCondition = 0;

      let startPrev = token.start - 1;
      let startNext = token.end + 1;
      let startTag = token.start;
      let endTag = token.end;
      let valueTag = token.string;

      let isStartTag = false;
      let isEndTag = false;

      //Get start and end of tag
      while (isCondition < 1000) {
        const tokenPrev = cm.getTokenAt({
          line: cursor.line,
          ch: startPrev
        });
        const tokenNext = cm.getTokenAt({
          line: cursor.line,
          ch: startNext
        });

        console.log('CHECK ==>', state.startTag, state.endTag, tokenNext.end)
        if(tokenPrev.start === startTag) isStartTag = true;
        if(tokenNext.end === endTag) isEndTag = true;
        if (isStartTag && isEndTag) break;

        if (formulaTagClass[`cm-${tokenPrev.type}`] ) {
          startTag = tokenPrev.start;
          // valueTag = tokenPrev.string + valueTag;
          startPrev = tokenPrev.start - 1;
          console.log('111 asdas', tokenPrev.string, tokenPrev)
        } else {
          isStartTag = true;
          console.log('case els ==>', tokenPrev)
        };

        if (formulaTagClass[`cm-${tokenNext.type}`]) {
          endTag = tokenNext.end;
          // valueTag = valueTag + tokenNext.string;
          startNext = tokenNext.end + 1;
          console.log('222 asdas', state, tokenNext, token)

        }else isEndTag = true;

        
        isCondition += 1
      }
      // set states
      state['startTag'] = startTag;
      state['endTag'] = endTag;

      // Set selection tag value
      console.log('SELECTION =>', state.event)
      // if( cursor.ch > (startTag + 1) && cursor.ch < (endTag - 1) && !state.hadHighlightTag){
      //   cm.setSelection({
      //     ch: startTag,
      //     line: cursor.line,
      //     sticky: cursor.sticky
      //   },
      //   {
      //     ch: endTag,
      //     line: cursor.line,
      //     sticky: cursor.sticky
      //   })
      //   const elSelected = document.querySelector('.CodeMirror-selected');
      //   if(elSelected){elSelected.style.opacity = 0}
      //   setTimeout(() => {
      //     const elSelected = document.querySelector('.CodeMirror-selected');
      //     elSelected.style.left = `calc(${elSelected.style.left} - 22px)`;
      //     elSelected.style.width = `calc(${elSelected.style.width} + 28px)`;
      //     elSelected.style.top = `calc(${elSelected.style.top} + 1px)`;
      //     elSelected.style.borderRadius = `20px`;
      //     elSelected.style.opacity = 1;
      //     console.log('RUN HIGHLIGHT =>', elSelected)
      //   }, 0);
      //   state['hadHighlightTag'] = true;
      //   return;
      // }else {
      //   state['hadHighlightTag'] = false;
      // }
    
      if(cursor.ch === state.endTag && state.keyName === 'Left'){
        state['hadPosEndTag'] = true;
      }

      // Handle show cursor -> cursor.sticky === 'before'
      if(state.keyName.toUpperCase() === 'RIGHT' && cursor.sticky === 'before'){
        cm.setCursor({line: cursor.line, ch: state.endTag });
      }
      
      if(state.keyName === 'Left' && cursor.sticky === 'after' && !state['hadPosEndTag']){
        showCursorToLeft(cm, state, cursor.line);
      }

      return
    }
  }

  function showCursorToLeft(cm, state, line){
    const PADDING = '25px';
    cm.setCursor({line, ch: state.startTag});
    state.elCursors.style.opacity = 0;
    setTimeout(() => {
      const elCursor = state.elCursors.querySelector('.CodeMirror-cursor');
      elCursor.style.left = `calc(${elCursor.style.left} - ${PADDING})`;
      state.elCursors.style.opacity = 1;
    }, 0);
  }

  function showCursorInHeadLine(elCursors){
    elCursors.style.opacity = 0;
    setTimeout(() => {
      const elCursor = elCursors.querySelector('.CodeMirror-cursor');
      if(!elCursor) return;
      const left = elCursor.style.left.replace('px', '');
      const POSITION_INIT = 4
      if(Number(left) > POSITION_INIT){
        elCursor.style.left = `calc(${elCursor.style.left} - 25px)`;
      }
      elCursors.style.opacity = 1;
    }, 0);
  }

  // CodeMirror.defineOption('customEvent', {
  //   newEvent: function(e){
  //     ...
  //   }
  // })

});