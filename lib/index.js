var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true})), module2);
};

// node_modules/css-tree/lib/common/List.js
var require_List = __commonJS((exports2, module2) => {
  function createItem(data) {
    return {
      prev: null,
      next: null,
      data
    };
  }
  function allocateCursor(node, prev, next) {
    var cursor;
    if (cursors !== null) {
      cursor = cursors;
      cursors = cursors.cursor;
      cursor.prev = prev;
      cursor.next = next;
      cursor.cursor = node.cursor;
    } else {
      cursor = {
        prev,
        next,
        cursor: node.cursor
      };
    }
    node.cursor = cursor;
    return cursor;
  }
  function releaseCursor(node) {
    var cursor = node.cursor;
    node.cursor = cursor.cursor;
    cursor.prev = null;
    cursor.next = null;
    cursor.cursor = cursors;
    cursors = cursor;
  }
  var cursors = null;
  var List = function() {
    this.cursor = null;
    this.head = null;
    this.tail = null;
  };
  List.createItem = createItem;
  List.prototype.createItem = createItem;
  List.prototype.updateCursors = function(prevOld, prevNew, nextOld, nextNew) {
    var cursor = this.cursor;
    while (cursor !== null) {
      if (cursor.prev === prevOld) {
        cursor.prev = prevNew;
      }
      if (cursor.next === nextOld) {
        cursor.next = nextNew;
      }
      cursor = cursor.cursor;
    }
  };
  List.prototype.getSize = function() {
    var size = 0;
    var cursor = this.head;
    while (cursor) {
      size++;
      cursor = cursor.next;
    }
    return size;
  };
  List.prototype.fromArray = function(array) {
    var cursor = null;
    this.head = null;
    for (var i = 0; i < array.length; i++) {
      var item = createItem(array[i]);
      if (cursor !== null) {
        cursor.next = item;
      } else {
        this.head = item;
      }
      item.prev = cursor;
      cursor = item;
    }
    this.tail = cursor;
    return this;
  };
  List.prototype.toArray = function() {
    var cursor = this.head;
    var result = [];
    while (cursor) {
      result.push(cursor.data);
      cursor = cursor.next;
    }
    return result;
  };
  List.prototype.toJSON = List.prototype.toArray;
  List.prototype.isEmpty = function() {
    return this.head === null;
  };
  List.prototype.first = function() {
    return this.head && this.head.data;
  };
  List.prototype.last = function() {
    return this.tail && this.tail.data;
  };
  List.prototype.each = function(fn, context) {
    var item;
    if (context === void 0) {
      context = this;
    }
    var cursor = allocateCursor(this, null, this.head);
    while (cursor.next !== null) {
      item = cursor.next;
      cursor.next = item.next;
      fn.call(context, item.data, item, this);
    }
    releaseCursor(this);
  };
  List.prototype.forEach = List.prototype.each;
  List.prototype.eachRight = function(fn, context) {
    var item;
    if (context === void 0) {
      context = this;
    }
    var cursor = allocateCursor(this, this.tail, null);
    while (cursor.prev !== null) {
      item = cursor.prev;
      cursor.prev = item.prev;
      fn.call(context, item.data, item, this);
    }
    releaseCursor(this);
  };
  List.prototype.forEachRight = List.prototype.eachRight;
  List.prototype.reduce = function(fn, initialValue, context) {
    var item;
    if (context === void 0) {
      context = this;
    }
    var cursor = allocateCursor(this, null, this.head);
    var acc = initialValue;
    while (cursor.next !== null) {
      item = cursor.next;
      cursor.next = item.next;
      acc = fn.call(context, acc, item.data, item, this);
    }
    releaseCursor(this);
    return acc;
  };
  List.prototype.reduceRight = function(fn, initialValue, context) {
    var item;
    if (context === void 0) {
      context = this;
    }
    var cursor = allocateCursor(this, this.tail, null);
    var acc = initialValue;
    while (cursor.prev !== null) {
      item = cursor.prev;
      cursor.prev = item.prev;
      acc = fn.call(context, acc, item.data, item, this);
    }
    releaseCursor(this);
    return acc;
  };
  List.prototype.nextUntil = function(start, fn, context) {
    if (start === null) {
      return;
    }
    var item;
    if (context === void 0) {
      context = this;
    }
    var cursor = allocateCursor(this, null, start);
    while (cursor.next !== null) {
      item = cursor.next;
      cursor.next = item.next;
      if (fn.call(context, item.data, item, this)) {
        break;
      }
    }
    releaseCursor(this);
  };
  List.prototype.prevUntil = function(start, fn, context) {
    if (start === null) {
      return;
    }
    var item;
    if (context === void 0) {
      context = this;
    }
    var cursor = allocateCursor(this, start, null);
    while (cursor.prev !== null) {
      item = cursor.prev;
      cursor.prev = item.prev;
      if (fn.call(context, item.data, item, this)) {
        break;
      }
    }
    releaseCursor(this);
  };
  List.prototype.some = function(fn, context) {
    var cursor = this.head;
    if (context === void 0) {
      context = this;
    }
    while (cursor !== null) {
      if (fn.call(context, cursor.data, cursor, this)) {
        return true;
      }
      cursor = cursor.next;
    }
    return false;
  };
  List.prototype.map = function(fn, context) {
    var result = new List();
    var cursor = this.head;
    if (context === void 0) {
      context = this;
    }
    while (cursor !== null) {
      result.appendData(fn.call(context, cursor.data, cursor, this));
      cursor = cursor.next;
    }
    return result;
  };
  List.prototype.filter = function(fn, context) {
    var result = new List();
    var cursor = this.head;
    if (context === void 0) {
      context = this;
    }
    while (cursor !== null) {
      if (fn.call(context, cursor.data, cursor, this)) {
        result.appendData(cursor.data);
      }
      cursor = cursor.next;
    }
    return result;
  };
  List.prototype.clear = function() {
    this.head = null;
    this.tail = null;
  };
  List.prototype.copy = function() {
    var result = new List();
    var cursor = this.head;
    while (cursor !== null) {
      result.insert(createItem(cursor.data));
      cursor = cursor.next;
    }
    return result;
  };
  List.prototype.prepend = function(item) {
    this.updateCursors(null, item, this.head, item);
    if (this.head !== null) {
      this.head.prev = item;
      item.next = this.head;
    } else {
      this.tail = item;
    }
    this.head = item;
    return this;
  };
  List.prototype.prependData = function(data) {
    return this.prepend(createItem(data));
  };
  List.prototype.append = function(item) {
    return this.insert(item);
  };
  List.prototype.appendData = function(data) {
    return this.insert(createItem(data));
  };
  List.prototype.insert = function(item, before) {
    if (before !== void 0 && before !== null) {
      this.updateCursors(before.prev, item, before, item);
      if (before.prev === null) {
        if (this.head !== before) {
          throw new Error("before doesn't belong to list");
        }
        this.head = item;
        before.prev = item;
        item.next = before;
        this.updateCursors(null, item);
      } else {
        before.prev.next = item;
        item.prev = before.prev;
        before.prev = item;
        item.next = before;
      }
    } else {
      this.updateCursors(this.tail, item, null, item);
      if (this.tail !== null) {
        this.tail.next = item;
        item.prev = this.tail;
      } else {
        this.head = item;
      }
      this.tail = item;
    }
    return this;
  };
  List.prototype.insertData = function(data, before) {
    return this.insert(createItem(data), before);
  };
  List.prototype.remove = function(item) {
    this.updateCursors(item, item.prev, item, item.next);
    if (item.prev !== null) {
      item.prev.next = item.next;
    } else {
      if (this.head !== item) {
        throw new Error("item doesn't belong to list");
      }
      this.head = item.next;
    }
    if (item.next !== null) {
      item.next.prev = item.prev;
    } else {
      if (this.tail !== item) {
        throw new Error("item doesn't belong to list");
      }
      this.tail = item.prev;
    }
    item.prev = null;
    item.next = null;
    return item;
  };
  List.prototype.push = function(data) {
    this.insert(createItem(data));
  };
  List.prototype.pop = function() {
    if (this.tail !== null) {
      return this.remove(this.tail);
    }
  };
  List.prototype.unshift = function(data) {
    this.prepend(createItem(data));
  };
  List.prototype.shift = function() {
    if (this.head !== null) {
      return this.remove(this.head);
    }
  };
  List.prototype.prependList = function(list) {
    return this.insertList(list, this.head);
  };
  List.prototype.appendList = function(list) {
    return this.insertList(list);
  };
  List.prototype.insertList = function(list, before) {
    if (list.head === null) {
      return this;
    }
    if (before !== void 0 && before !== null) {
      this.updateCursors(before.prev, list.tail, before, list.head);
      if (before.prev !== null) {
        before.prev.next = list.head;
        list.head.prev = before.prev;
      } else {
        this.head = list.head;
      }
      before.prev = list.tail;
      list.tail.next = before;
    } else {
      this.updateCursors(this.tail, list.tail, null, list.head);
      if (this.tail !== null) {
        this.tail.next = list.head;
        list.head.prev = this.tail;
      } else {
        this.head = list.head;
      }
      this.tail = list.tail;
    }
    list.head = null;
    list.tail = null;
    return this;
  };
  List.prototype.replace = function(oldItem, newItemOrList) {
    if ("head" in newItemOrList) {
      this.insertList(newItemOrList, oldItem);
    } else {
      this.insert(newItemOrList, oldItem);
    }
    this.remove(oldItem);
  };
  module2.exports = List;
});

// node_modules/css-tree/lib/utils/createCustomError.js
var require_createCustomError = __commonJS((exports2, module2) => {
  module2.exports = function createCustomError(name, message) {
    var error = Object.create(SyntaxError.prototype);
    var errorStack = new Error();
    error.name = name;
    error.message = message;
    Object.defineProperty(error, "stack", {
      get: function() {
        return (errorStack.stack || "").replace(/^(.+\n){1,3}/, name + ": " + message + "\n");
      }
    });
    return error;
  };
});

// node_modules/css-tree/lib/common/SyntaxError.js
var require_SyntaxError = __commonJS((exports2, module2) => {
  var createCustomError = require_createCustomError();
  var MAX_LINE_LENGTH = 100;
  var OFFSET_CORRECTION = 60;
  var TAB_REPLACEMENT = "    ";
  function sourceFragment(error, extraLines) {
    function processLines(start, end) {
      return lines.slice(start, end).map(function(line2, idx) {
        var num = String(start + idx + 1);
        while (num.length < maxNumLength) {
          num = " " + num;
        }
        return num + " |" + line2;
      }).join("\n");
    }
    var lines = error.source.split(/\r\n?|\n|\f/);
    var line = error.line;
    var column = error.column;
    var startLine = Math.max(1, line - extraLines) - 1;
    var endLine = Math.min(line + extraLines, lines.length + 1);
    var maxNumLength = Math.max(4, String(endLine).length) + 1;
    var cutLeft = 0;
    column += (TAB_REPLACEMENT.length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length;
    if (column > MAX_LINE_LENGTH) {
      cutLeft = column - OFFSET_CORRECTION + 3;
      column = OFFSET_CORRECTION - 2;
    }
    for (var i = startLine; i <= endLine; i++) {
      if (i >= 0 && i < lines.length) {
        lines[i] = lines[i].replace(/\t/g, TAB_REPLACEMENT);
        lines[i] = (cutLeft > 0 && lines[i].length > cutLeft ? "\u2026" : "") + lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) + (lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? "\u2026" : "");
      }
    }
    return [
      processLines(startLine, line),
      new Array(column + maxNumLength + 2).join("-") + "^",
      processLines(line, endLine)
    ].filter(Boolean).join("\n");
  }
  var SyntaxError2 = function(message, source, offset, line, column) {
    var error = createCustomError("SyntaxError", message);
    error.source = source;
    error.offset = offset;
    error.line = line;
    error.column = column;
    error.sourceFragment = function(extraLines) {
      return sourceFragment(error, isNaN(extraLines) ? 0 : extraLines);
    };
    Object.defineProperty(error, "formattedMessage", {
      get: function() {
        return "Parse error: " + error.message + "\n" + sourceFragment(error, 2);
      }
    });
    error.parseError = {
      offset,
      line,
      column
    };
    return error;
  };
  module2.exports = SyntaxError2;
});

// node_modules/css-tree/lib/tokenizer/const.js
var require_const = __commonJS((exports2, module2) => {
  var TYPE2 = {
    EOF: 0,
    Ident: 1,
    Function: 2,
    AtKeyword: 3,
    Hash: 4,
    String: 5,
    BadString: 6,
    Url: 7,
    BadUrl: 8,
    Delim: 9,
    Number: 10,
    Percentage: 11,
    Dimension: 12,
    WhiteSpace: 13,
    CDO: 14,
    CDC: 15,
    Colon: 16,
    Semicolon: 17,
    Comma: 18,
    LeftSquareBracket: 19,
    RightSquareBracket: 20,
    LeftParenthesis: 21,
    RightParenthesis: 22,
    LeftCurlyBracket: 23,
    RightCurlyBracket: 24,
    Comment: 25
  };
  var NAME = Object.keys(TYPE2).reduce(function(result, key) {
    result[TYPE2[key]] = key;
    return result;
  }, {});
  module2.exports = {
    TYPE: TYPE2,
    NAME
  };
});

// node_modules/css-tree/lib/tokenizer/char-code-definitions.js
var require_char_code_definitions = __commonJS((exports2, module2) => {
  var EOF = 0;
  function isDigit(code) {
    return code >= 48 && code <= 57;
  }
  function isHexDigit(code) {
    return isDigit(code) || code >= 65 && code <= 70 || code >= 97 && code <= 102;
  }
  function isUppercaseLetter(code) {
    return code >= 65 && code <= 90;
  }
  function isLowercaseLetter(code) {
    return code >= 97 && code <= 122;
  }
  function isLetter(code) {
    return isUppercaseLetter(code) || isLowercaseLetter(code);
  }
  function isNonAscii(code) {
    return code >= 128;
  }
  function isNameStart(code) {
    return isLetter(code) || isNonAscii(code) || code === 95;
  }
  function isName(code) {
    return isNameStart(code) || isDigit(code) || code === 45;
  }
  function isNonPrintable(code) {
    return code >= 0 && code <= 8 || code === 11 || code >= 14 && code <= 31 || code === 127;
  }
  function isNewline(code) {
    return code === 10 || code === 13 || code === 12;
  }
  function isWhiteSpace(code) {
    return isNewline(code) || code === 32 || code === 9;
  }
  function isValidEscape(first, second) {
    if (first !== 92) {
      return false;
    }
    if (isNewline(second) || second === EOF) {
      return false;
    }
    return true;
  }
  function isIdentifierStart(first, second, third) {
    if (first === 45) {
      return isNameStart(second) || second === 45 || isValidEscape(second, third);
    }
    if (isNameStart(first)) {
      return true;
    }
    if (first === 92) {
      return isValidEscape(first, second);
    }
    return false;
  }
  function isNumberStart(first, second, third) {
    if (first === 43 || first === 45) {
      if (isDigit(second)) {
        return 2;
      }
      return second === 46 && isDigit(third) ? 3 : 0;
    }
    if (first === 46) {
      return isDigit(second) ? 2 : 0;
    }
    if (isDigit(first)) {
      return 1;
    }
    return 0;
  }
  function isBOM(code) {
    if (code === 65279) {
      return 1;
    }
    if (code === 65534) {
      return 1;
    }
    return 0;
  }
  var CATEGORY = new Array(128);
  charCodeCategory.Eof = 128;
  charCodeCategory.WhiteSpace = 130;
  charCodeCategory.Digit = 131;
  charCodeCategory.NameStart = 132;
  charCodeCategory.NonPrintable = 133;
  for (var i = 0; i < CATEGORY.length; i++) {
    switch (true) {
      case isWhiteSpace(i):
        CATEGORY[i] = charCodeCategory.WhiteSpace;
        break;
      case isDigit(i):
        CATEGORY[i] = charCodeCategory.Digit;
        break;
      case isNameStart(i):
        CATEGORY[i] = charCodeCategory.NameStart;
        break;
      case isNonPrintable(i):
        CATEGORY[i] = charCodeCategory.NonPrintable;
        break;
      default:
        CATEGORY[i] = i || charCodeCategory.Eof;
    }
  }
  function charCodeCategory(code) {
    return code < 128 ? CATEGORY[code] : charCodeCategory.NameStart;
  }
  module2.exports = {
    isDigit,
    isHexDigit,
    isUppercaseLetter,
    isLowercaseLetter,
    isLetter,
    isNonAscii,
    isNameStart,
    isName,
    isNonPrintable,
    isNewline,
    isWhiteSpace,
    isValidEscape,
    isIdentifierStart,
    isNumberStart,
    isBOM,
    charCodeCategory
  };
});

// node_modules/css-tree/lib/tokenizer/utils.js
var require_utils = __commonJS((exports2, module2) => {
  var charCodeDef = require_char_code_definitions();
  var isDigit = charCodeDef.isDigit;
  var isHexDigit = charCodeDef.isHexDigit;
  var isUppercaseLetter = charCodeDef.isUppercaseLetter;
  var isName = charCodeDef.isName;
  var isWhiteSpace = charCodeDef.isWhiteSpace;
  var isValidEscape = charCodeDef.isValidEscape;
  function getCharCode(source, offset) {
    return offset < source.length ? source.charCodeAt(offset) : 0;
  }
  function getNewlineLength(source, offset, code) {
    if (code === 13 && getCharCode(source, offset + 1) === 10) {
      return 2;
    }
    return 1;
  }
  function cmpChar(testStr, offset, referenceCode) {
    var code = testStr.charCodeAt(offset);
    if (isUppercaseLetter(code)) {
      code = code | 32;
    }
    return code === referenceCode;
  }
  function cmpStr(testStr, start, end, referenceStr) {
    if (end - start !== referenceStr.length) {
      return false;
    }
    if (start < 0 || end > testStr.length) {
      return false;
    }
    for (var i = start; i < end; i++) {
      var testCode = testStr.charCodeAt(i);
      var referenceCode = referenceStr.charCodeAt(i - start);
      if (isUppercaseLetter(testCode)) {
        testCode = testCode | 32;
      }
      if (testCode !== referenceCode) {
        return false;
      }
    }
    return true;
  }
  function findWhiteSpaceStart(source, offset) {
    for (; offset >= 0; offset--) {
      if (!isWhiteSpace(source.charCodeAt(offset))) {
        break;
      }
    }
    return offset + 1;
  }
  function findWhiteSpaceEnd(source, offset) {
    for (; offset < source.length; offset++) {
      if (!isWhiteSpace(source.charCodeAt(offset))) {
        break;
      }
    }
    return offset;
  }
  function findDecimalNumberEnd(source, offset) {
    for (; offset < source.length; offset++) {
      if (!isDigit(source.charCodeAt(offset))) {
        break;
      }
    }
    return offset;
  }
  function consumeEscaped(source, offset) {
    offset += 2;
    if (isHexDigit(getCharCode(source, offset - 1))) {
      for (var maxOffset = Math.min(source.length, offset + 5); offset < maxOffset; offset++) {
        if (!isHexDigit(getCharCode(source, offset))) {
          break;
        }
      }
      var code = getCharCode(source, offset);
      if (isWhiteSpace(code)) {
        offset += getNewlineLength(source, offset, code);
      }
    }
    return offset;
  }
  function consumeName(source, offset) {
    for (; offset < source.length; offset++) {
      var code = source.charCodeAt(offset);
      if (isName(code)) {
        continue;
      }
      if (isValidEscape(code, getCharCode(source, offset + 1))) {
        offset = consumeEscaped(source, offset) - 1;
        continue;
      }
      break;
    }
    return offset;
  }
  function consumeNumber(source, offset) {
    var code = source.charCodeAt(offset);
    if (code === 43 || code === 45) {
      code = source.charCodeAt(offset += 1);
    }
    if (isDigit(code)) {
      offset = findDecimalNumberEnd(source, offset + 1);
      code = source.charCodeAt(offset);
    }
    if (code === 46 && isDigit(source.charCodeAt(offset + 1))) {
      code = source.charCodeAt(offset += 2);
      offset = findDecimalNumberEnd(source, offset);
    }
    if (cmpChar(source, offset, 101)) {
      var sign = 0;
      code = source.charCodeAt(offset + 1);
      if (code === 45 || code === 43) {
        sign = 1;
        code = source.charCodeAt(offset + 2);
      }
      if (isDigit(code)) {
        offset = findDecimalNumberEnd(source, offset + 1 + sign + 1);
      }
    }
    return offset;
  }
  function consumeBadUrlRemnants(source, offset) {
    for (; offset < source.length; offset++) {
      var code = source.charCodeAt(offset);
      if (code === 41) {
        offset++;
        break;
      }
      if (isValidEscape(code, getCharCode(source, offset + 1))) {
        offset = consumeEscaped(source, offset);
      }
    }
    return offset;
  }
  module2.exports = {
    consumeEscaped,
    consumeName,
    consumeNumber,
    consumeBadUrlRemnants,
    cmpChar,
    cmpStr,
    getNewlineLength,
    findWhiteSpaceStart,
    findWhiteSpaceEnd
  };
});

// node_modules/css-tree/lib/common/TokenStream.js
var require_TokenStream = __commonJS((exports2, module2) => {
  var constants = require_const();
  var TYPE2 = constants.TYPE;
  var NAME = constants.NAME;
  var utils = require_utils();
  var cmpStr = utils.cmpStr;
  var EOF = TYPE2.EOF;
  var WHITESPACE = TYPE2.WhiteSpace;
  var COMMENT = TYPE2.Comment;
  var OFFSET_MASK = 16777215;
  var TYPE_SHIFT = 24;
  var TokenStream = function() {
    this.offsetAndType = null;
    this.balance = null;
    this.reset();
  };
  TokenStream.prototype = {
    reset: function() {
      this.eof = false;
      this.tokenIndex = -1;
      this.tokenType = 0;
      this.tokenStart = this.firstCharOffset;
      this.tokenEnd = this.firstCharOffset;
    },
    lookupType: function(offset) {
      offset += this.tokenIndex;
      if (offset < this.tokenCount) {
        return this.offsetAndType[offset] >> TYPE_SHIFT;
      }
      return EOF;
    },
    lookupOffset: function(offset) {
      offset += this.tokenIndex;
      if (offset < this.tokenCount) {
        return this.offsetAndType[offset - 1] & OFFSET_MASK;
      }
      return this.source.length;
    },
    lookupValue: function(offset, referenceStr) {
      offset += this.tokenIndex;
      if (offset < this.tokenCount) {
        return cmpStr(this.source, this.offsetAndType[offset - 1] & OFFSET_MASK, this.offsetAndType[offset] & OFFSET_MASK, referenceStr);
      }
      return false;
    },
    getTokenStart: function(tokenIndex) {
      if (tokenIndex === this.tokenIndex) {
        return this.tokenStart;
      }
      if (tokenIndex > 0) {
        return tokenIndex < this.tokenCount ? this.offsetAndType[tokenIndex - 1] & OFFSET_MASK : this.offsetAndType[this.tokenCount] & OFFSET_MASK;
      }
      return this.firstCharOffset;
    },
    getRawLength: function(startToken, mode) {
      var cursor = startToken;
      var balanceEnd;
      var offset = this.offsetAndType[Math.max(cursor - 1, 0)] & OFFSET_MASK;
      var type;
      loop:
        for (; cursor < this.tokenCount; cursor++) {
          balanceEnd = this.balance[cursor];
          if (balanceEnd < startToken) {
            break loop;
          }
          type = this.offsetAndType[cursor] >> TYPE_SHIFT;
          switch (mode(type, this.source, offset)) {
            case 1:
              break loop;
            case 2:
              cursor++;
              break loop;
            default:
              offset = this.offsetAndType[cursor] & OFFSET_MASK;
              if (this.balance[balanceEnd] === cursor) {
                cursor = balanceEnd;
              }
          }
        }
      return cursor - this.tokenIndex;
    },
    isBalanceEdge: function(pos) {
      return this.balance[this.tokenIndex] < pos;
    },
    isDelim: function(code, offset) {
      if (offset) {
        return this.lookupType(offset) === TYPE2.Delim && this.source.charCodeAt(this.lookupOffset(offset)) === code;
      }
      return this.tokenType === TYPE2.Delim && this.source.charCodeAt(this.tokenStart) === code;
    },
    getTokenValue: function() {
      return this.source.substring(this.tokenStart, this.tokenEnd);
    },
    getTokenLength: function() {
      return this.tokenEnd - this.tokenStart;
    },
    substrToCursor: function(start) {
      return this.source.substring(start, this.tokenStart);
    },
    skipWS: function() {
      for (var i = this.tokenIndex, skipTokenCount = 0; i < this.tokenCount; i++, skipTokenCount++) {
        if (this.offsetAndType[i] >> TYPE_SHIFT !== WHITESPACE) {
          break;
        }
      }
      if (skipTokenCount > 0) {
        this.skip(skipTokenCount);
      }
    },
    skipSC: function() {
      while (this.tokenType === WHITESPACE || this.tokenType === COMMENT) {
        this.next();
      }
    },
    skip: function(tokenCount) {
      var next = this.tokenIndex + tokenCount;
      if (next < this.tokenCount) {
        this.tokenIndex = next;
        this.tokenStart = this.offsetAndType[next - 1] & OFFSET_MASK;
        next = this.offsetAndType[next];
        this.tokenType = next >> TYPE_SHIFT;
        this.tokenEnd = next & OFFSET_MASK;
      } else {
        this.tokenIndex = this.tokenCount;
        this.next();
      }
    },
    next: function() {
      var next = this.tokenIndex + 1;
      if (next < this.tokenCount) {
        this.tokenIndex = next;
        this.tokenStart = this.tokenEnd;
        next = this.offsetAndType[next];
        this.tokenType = next >> TYPE_SHIFT;
        this.tokenEnd = next & OFFSET_MASK;
      } else {
        this.tokenIndex = this.tokenCount;
        this.eof = true;
        this.tokenType = EOF;
        this.tokenStart = this.tokenEnd = this.source.length;
      }
    },
    forEachToken(fn) {
      for (var i = 0, offset = this.firstCharOffset; i < this.tokenCount; i++) {
        var start = offset;
        var item = this.offsetAndType[i];
        var end = item & OFFSET_MASK;
        var type = item >> TYPE_SHIFT;
        offset = end;
        fn(type, start, end, i);
      }
    },
    dump() {
      var tokens = new Array(this.tokenCount);
      this.forEachToken((type, start, end, index) => {
        tokens[index] = {
          idx: index,
          type: NAME[type],
          chunk: this.source.substring(start, end),
          balance: this.balance[index]
        };
      });
      return tokens;
    }
  };
  module2.exports = TokenStream;
});

// node_modules/css-tree/lib/definition-syntax/generate.js
var require_generate = __commonJS((exports2, module2) => {
  function noop(value) {
    return value;
  }
  function generateMultiplier(multiplier) {
    if (multiplier.min === 0 && multiplier.max === 0) {
      return "*";
    }
    if (multiplier.min === 0 && multiplier.max === 1) {
      return "?";
    }
    if (multiplier.min === 1 && multiplier.max === 0) {
      return multiplier.comma ? "#" : "+";
    }
    if (multiplier.min === 1 && multiplier.max === 1) {
      return "";
    }
    return (multiplier.comma ? "#" : "") + (multiplier.min === multiplier.max ? "{" + multiplier.min + "}" : "{" + multiplier.min + "," + (multiplier.max !== 0 ? multiplier.max : "") + "}");
  }
  function generateTypeOpts(node) {
    switch (node.type) {
      case "Range":
        return " [" + (node.min === null ? "-\u221E" : node.min) + "," + (node.max === null ? "\u221E" : node.max) + "]";
      default:
        throw new Error("Unknown node type `" + node.type + "`");
    }
  }
  function generateSequence(node, decorate, forceBraces, compact) {
    var combinator = node.combinator === " " || compact ? node.combinator : " " + node.combinator + " ";
    var result = node.terms.map(function(term) {
      return generate(term, decorate, forceBraces, compact);
    }).join(combinator);
    if (node.explicit || forceBraces) {
      result = (compact || result[0] === "," ? "[" : "[ ") + result + (compact ? "]" : " ]");
    }
    return result;
  }
  function generate(node, decorate, forceBraces, compact) {
    var result;
    switch (node.type) {
      case "Group":
        result = generateSequence(node, decorate, forceBraces, compact) + (node.disallowEmpty ? "!" : "");
        break;
      case "Multiplier":
        return generate(node.term, decorate, forceBraces, compact) + decorate(generateMultiplier(node), node);
      case "Type":
        result = "<" + node.name + (node.opts ? decorate(generateTypeOpts(node.opts), node.opts) : "") + ">";
        break;
      case "Property":
        result = "<'" + node.name + "'>";
        break;
      case "Keyword":
        result = node.name;
        break;
      case "AtKeyword":
        result = "@" + node.name;
        break;
      case "Function":
        result = node.name + "(";
        break;
      case "String":
      case "Token":
        result = node.value;
        break;
      case "Comma":
        result = ",";
        break;
      default:
        throw new Error("Unknown node type `" + node.type + "`");
    }
    return decorate(result, node);
  }
  module2.exports = function(node, options) {
    var decorate = noop;
    var forceBraces = false;
    var compact = false;
    if (typeof options === "function") {
      decorate = options;
    } else if (options) {
      forceBraces = Boolean(options.forceBraces);
      compact = Boolean(options.compact);
      if (typeof options.decorate === "function") {
        decorate = options.decorate;
      }
    }
    return generate(node, decorate, forceBraces, compact);
  };
});

// node_modules/css-tree/lib/lexer/error.js
var require_error = __commonJS((exports2, module2) => {
  var createCustomError = require_createCustomError();
  var generate = require_generate();
  var defaultLoc = {offset: 0, line: 1, column: 1};
  function locateMismatch(matchResult, node) {
    const tokens = matchResult.tokens;
    const longestMatch = matchResult.longestMatch;
    const mismatchNode = longestMatch < tokens.length ? tokens[longestMatch].node || null : null;
    const badNode = mismatchNode !== node ? mismatchNode : null;
    let mismatchOffset = 0;
    let mismatchLength = 0;
    let entries = 0;
    let css = "";
    let start;
    let end;
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].value;
      if (i === longestMatch) {
        mismatchLength = token.length;
        mismatchOffset = css.length;
      }
      if (badNode !== null && tokens[i].node === badNode) {
        if (i <= longestMatch) {
          entries++;
        } else {
          entries = 0;
        }
      }
      css += token;
    }
    if (longestMatch === tokens.length || entries > 1) {
      start = fromLoc(badNode || node, "end") || buildLoc(defaultLoc, css);
      end = buildLoc(start);
    } else {
      start = fromLoc(badNode, "start") || buildLoc(fromLoc(node, "start") || defaultLoc, css.slice(0, mismatchOffset));
      end = fromLoc(badNode, "end") || buildLoc(start, css.substr(mismatchOffset, mismatchLength));
    }
    return {
      css,
      mismatchOffset,
      mismatchLength,
      start,
      end
    };
  }
  function fromLoc(node, point) {
    const value = node && node.loc && node.loc[point];
    if (value) {
      return "line" in value ? buildLoc(value) : value;
    }
    return null;
  }
  function buildLoc({offset, line, column}, extra) {
    const loc = {
      offset,
      line,
      column
    };
    if (extra) {
      const lines = extra.split(/\n|\r\n?|\f/);
      loc.offset += extra.length;
      loc.line += lines.length - 1;
      loc.column = lines.length === 1 ? loc.column + extra.length : lines.pop().length + 1;
    }
    return loc;
  }
  var SyntaxReferenceError = function(type, referenceName) {
    const error = createCustomError("SyntaxReferenceError", type + (referenceName ? " `" + referenceName + "`" : ""));
    error.reference = referenceName;
    return error;
  };
  var SyntaxMatchError = function(message, syntax, node, matchResult) {
    const error = createCustomError("SyntaxMatchError", message);
    const {
      css,
      mismatchOffset,
      mismatchLength,
      start,
      end
    } = locateMismatch(matchResult, node);
    error.rawMessage = message;
    error.syntax = syntax ? generate(syntax) : "<generic>";
    error.css = css;
    error.mismatchOffset = mismatchOffset;
    error.mismatchLength = mismatchLength;
    error.message = message + "\n  syntax: " + error.syntax + "\n   value: " + (css || "<empty string>") + "\n  --------" + new Array(error.mismatchOffset + 1).join("-") + "^";
    Object.assign(error, start);
    error.loc = {
      source: node && node.loc && node.loc.source || "<unknown>",
      start,
      end
    };
    return error;
  };
  module2.exports = {
    SyntaxReferenceError,
    SyntaxMatchError
  };
});

// node_modules/css-tree/lib/utils/names.js
var require_names = __commonJS((exports2, module2) => {
  var hasOwnProperty2 = Object.prototype.hasOwnProperty;
  var keywords = Object.create(null);
  var properties = Object.create(null);
  var HYPHENMINUS = 45;
  function isCustomProperty(str, offset) {
    offset = offset || 0;
    return str.length - offset >= 2 && str.charCodeAt(offset) === HYPHENMINUS && str.charCodeAt(offset + 1) === HYPHENMINUS;
  }
  function getVendorPrefix(str, offset) {
    offset = offset || 0;
    if (str.length - offset >= 3) {
      if (str.charCodeAt(offset) === HYPHENMINUS && str.charCodeAt(offset + 1) !== HYPHENMINUS) {
        var secondDashIndex = str.indexOf("-", offset + 2);
        if (secondDashIndex !== -1) {
          return str.substring(offset, secondDashIndex + 1);
        }
      }
    }
    return "";
  }
  function getKeywordDescriptor(keyword) {
    if (hasOwnProperty2.call(keywords, keyword)) {
      return keywords[keyword];
    }
    var name = keyword.toLowerCase();
    if (hasOwnProperty2.call(keywords, name)) {
      return keywords[keyword] = keywords[name];
    }
    var custom = isCustomProperty(name, 0);
    var vendor = !custom ? getVendorPrefix(name, 0) : "";
    return keywords[keyword] = Object.freeze({
      basename: name.substr(vendor.length),
      name,
      vendor,
      prefix: vendor,
      custom
    });
  }
  function getPropertyDescriptor(property) {
    if (hasOwnProperty2.call(properties, property)) {
      return properties[property];
    }
    var name = property;
    var hack = property[0];
    if (hack === "/") {
      hack = property[1] === "/" ? "//" : "/";
    } else if (hack !== "_" && hack !== "*" && hack !== "$" && hack !== "#" && hack !== "+" && hack !== "&") {
      hack = "";
    }
    var custom = isCustomProperty(name, hack.length);
    if (!custom) {
      name = name.toLowerCase();
      if (hasOwnProperty2.call(properties, name)) {
        return properties[property] = properties[name];
      }
    }
    var vendor = !custom ? getVendorPrefix(name, hack.length) : "";
    var prefix = name.substr(0, hack.length + vendor.length);
    return properties[property] = Object.freeze({
      basename: name.substr(prefix.length),
      name: name.substr(hack.length),
      hack,
      vendor,
      prefix,
      custom
    });
  }
  module2.exports = {
    keyword: getKeywordDescriptor,
    property: getPropertyDescriptor,
    isCustomProperty,
    vendorPrefix: getVendorPrefix
  };
});

// node_modules/css-tree/lib/common/adopt-buffer.js
var require_adopt_buffer = __commonJS((exports2, module2) => {
  var MIN_SIZE = 16 * 1024;
  var SafeUint32Array = typeof Uint32Array !== "undefined" ? Uint32Array : Array;
  module2.exports = function adoptBuffer(buffer, size) {
    if (buffer === null || buffer.length < size) {
      return new SafeUint32Array(Math.max(size + 1024, MIN_SIZE));
    }
    return buffer;
  };
});

// node_modules/css-tree/lib/tokenizer/index.js
var require_tokenizer = __commonJS((exports2, module2) => {
  var TokenStream = require_TokenStream();
  var adoptBuffer = require_adopt_buffer();
  var constants = require_const();
  var TYPE2 = constants.TYPE;
  var charCodeDefinitions = require_char_code_definitions();
  var isNewline = charCodeDefinitions.isNewline;
  var isName = charCodeDefinitions.isName;
  var isValidEscape = charCodeDefinitions.isValidEscape;
  var isNumberStart = charCodeDefinitions.isNumberStart;
  var isIdentifierStart = charCodeDefinitions.isIdentifierStart;
  var charCodeCategory = charCodeDefinitions.charCodeCategory;
  var isBOM = charCodeDefinitions.isBOM;
  var utils = require_utils();
  var cmpStr = utils.cmpStr;
  var getNewlineLength = utils.getNewlineLength;
  var findWhiteSpaceEnd = utils.findWhiteSpaceEnd;
  var consumeEscaped = utils.consumeEscaped;
  var consumeName = utils.consumeName;
  var consumeNumber = utils.consumeNumber;
  var consumeBadUrlRemnants = utils.consumeBadUrlRemnants;
  var OFFSET_MASK = 16777215;
  var TYPE_SHIFT = 24;
  function tokenize(source, stream) {
    function getCharCode(offset2) {
      return offset2 < sourceLength ? source.charCodeAt(offset2) : 0;
    }
    function consumeNumericToken() {
      offset = consumeNumber(source, offset);
      if (isIdentifierStart(getCharCode(offset), getCharCode(offset + 1), getCharCode(offset + 2))) {
        type = TYPE2.Dimension;
        offset = consumeName(source, offset);
        return;
      }
      if (getCharCode(offset) === 37) {
        type = TYPE2.Percentage;
        offset++;
        return;
      }
      type = TYPE2.Number;
    }
    function consumeIdentLikeToken() {
      const nameStartOffset = offset;
      offset = consumeName(source, offset);
      if (cmpStr(source, nameStartOffset, offset, "url") && getCharCode(offset) === 40) {
        offset = findWhiteSpaceEnd(source, offset + 1);
        if (getCharCode(offset) === 34 || getCharCode(offset) === 39) {
          type = TYPE2.Function;
          offset = nameStartOffset + 4;
          return;
        }
        consumeUrlToken();
        return;
      }
      if (getCharCode(offset) === 40) {
        type = TYPE2.Function;
        offset++;
        return;
      }
      type = TYPE2.Ident;
    }
    function consumeStringToken(endingCodePoint) {
      if (!endingCodePoint) {
        endingCodePoint = getCharCode(offset++);
      }
      type = TYPE2.String;
      for (; offset < source.length; offset++) {
        var code2 = source.charCodeAt(offset);
        switch (charCodeCategory(code2)) {
          case endingCodePoint:
            offset++;
            return;
          case charCodeCategory.Eof:
            return;
          case charCodeCategory.WhiteSpace:
            if (isNewline(code2)) {
              offset += getNewlineLength(source, offset, code2);
              type = TYPE2.BadString;
              return;
            }
            break;
          case 92:
            if (offset === source.length - 1) {
              break;
            }
            var nextCode = getCharCode(offset + 1);
            if (isNewline(nextCode)) {
              offset += getNewlineLength(source, offset + 1, nextCode);
            } else if (isValidEscape(code2, nextCode)) {
              offset = consumeEscaped(source, offset) - 1;
            }
            break;
        }
      }
    }
    function consumeUrlToken() {
      type = TYPE2.Url;
      offset = findWhiteSpaceEnd(source, offset);
      for (; offset < source.length; offset++) {
        var code2 = source.charCodeAt(offset);
        switch (charCodeCategory(code2)) {
          case 41:
            offset++;
            return;
          case charCodeCategory.Eof:
            return;
          case charCodeCategory.WhiteSpace:
            offset = findWhiteSpaceEnd(source, offset);
            if (getCharCode(offset) === 41 || offset >= source.length) {
              if (offset < source.length) {
                offset++;
              }
              return;
            }
            offset = consumeBadUrlRemnants(source, offset);
            type = TYPE2.BadUrl;
            return;
          case 34:
          case 39:
          case 40:
          case charCodeCategory.NonPrintable:
            offset = consumeBadUrlRemnants(source, offset);
            type = TYPE2.BadUrl;
            return;
          case 92:
            if (isValidEscape(code2, getCharCode(offset + 1))) {
              offset = consumeEscaped(source, offset) - 1;
              break;
            }
            offset = consumeBadUrlRemnants(source, offset);
            type = TYPE2.BadUrl;
            return;
        }
      }
    }
    if (!stream) {
      stream = new TokenStream();
    }
    source = String(source || "");
    var sourceLength = source.length;
    var offsetAndType = adoptBuffer(stream.offsetAndType, sourceLength + 1);
    var balance = adoptBuffer(stream.balance, sourceLength + 1);
    var tokenCount = 0;
    var start = isBOM(getCharCode(0));
    var offset = start;
    var balanceCloseType = 0;
    var balanceStart = 0;
    var balancePrev = 0;
    while (offset < sourceLength) {
      var code = source.charCodeAt(offset);
      var type = 0;
      balance[tokenCount] = sourceLength;
      switch (charCodeCategory(code)) {
        case charCodeCategory.WhiteSpace:
          type = TYPE2.WhiteSpace;
          offset = findWhiteSpaceEnd(source, offset + 1);
          break;
        case 34:
          consumeStringToken();
          break;
        case 35:
          if (isName(getCharCode(offset + 1)) || isValidEscape(getCharCode(offset + 1), getCharCode(offset + 2))) {
            type = TYPE2.Hash;
            offset = consumeName(source, offset + 1);
          } else {
            type = TYPE2.Delim;
            offset++;
          }
          break;
        case 39:
          consumeStringToken();
          break;
        case 40:
          type = TYPE2.LeftParenthesis;
          offset++;
          break;
        case 41:
          type = TYPE2.RightParenthesis;
          offset++;
          break;
        case 43:
          if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
            consumeNumericToken();
          } else {
            type = TYPE2.Delim;
            offset++;
          }
          break;
        case 44:
          type = TYPE2.Comma;
          offset++;
          break;
        case 45:
          if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
            consumeNumericToken();
          } else {
            if (getCharCode(offset + 1) === 45 && getCharCode(offset + 2) === 62) {
              type = TYPE2.CDC;
              offset = offset + 3;
            } else {
              if (isIdentifierStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                consumeIdentLikeToken();
              } else {
                type = TYPE2.Delim;
                offset++;
              }
            }
          }
          break;
        case 46:
          if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
            consumeNumericToken();
          } else {
            type = TYPE2.Delim;
            offset++;
          }
          break;
        case 47:
          if (getCharCode(offset + 1) === 42) {
            type = TYPE2.Comment;
            offset = source.indexOf("*/", offset + 2) + 2;
            if (offset === 1) {
              offset = source.length;
            }
          } else {
            type = TYPE2.Delim;
            offset++;
          }
          break;
        case 58:
          type = TYPE2.Colon;
          offset++;
          break;
        case 59:
          type = TYPE2.Semicolon;
          offset++;
          break;
        case 60:
          if (getCharCode(offset + 1) === 33 && getCharCode(offset + 2) === 45 && getCharCode(offset + 3) === 45) {
            type = TYPE2.CDO;
            offset = offset + 4;
          } else {
            type = TYPE2.Delim;
            offset++;
          }
          break;
        case 64:
          if (isIdentifierStart(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
            type = TYPE2.AtKeyword;
            offset = consumeName(source, offset + 1);
          } else {
            type = TYPE2.Delim;
            offset++;
          }
          break;
        case 91:
          type = TYPE2.LeftSquareBracket;
          offset++;
          break;
        case 92:
          if (isValidEscape(code, getCharCode(offset + 1))) {
            consumeIdentLikeToken();
          } else {
            type = TYPE2.Delim;
            offset++;
          }
          break;
        case 93:
          type = TYPE2.RightSquareBracket;
          offset++;
          break;
        case 123:
          type = TYPE2.LeftCurlyBracket;
          offset++;
          break;
        case 125:
          type = TYPE2.RightCurlyBracket;
          offset++;
          break;
        case charCodeCategory.Digit:
          consumeNumericToken();
          break;
        case charCodeCategory.NameStart:
          consumeIdentLikeToken();
          break;
        case charCodeCategory.Eof:
          break;
        default:
          type = TYPE2.Delim;
          offset++;
      }
      switch (type) {
        case balanceCloseType:
          balancePrev = balanceStart & OFFSET_MASK;
          balanceStart = balance[balancePrev];
          balanceCloseType = balanceStart >> TYPE_SHIFT;
          balance[tokenCount] = balancePrev;
          balance[balancePrev++] = tokenCount;
          for (; balancePrev < tokenCount; balancePrev++) {
            if (balance[balancePrev] === sourceLength) {
              balance[balancePrev] = tokenCount;
            }
          }
          break;
        case TYPE2.LeftParenthesis:
        case TYPE2.Function:
          balance[tokenCount] = balanceStart;
          balanceCloseType = TYPE2.RightParenthesis;
          balanceStart = balanceCloseType << TYPE_SHIFT | tokenCount;
          break;
        case TYPE2.LeftSquareBracket:
          balance[tokenCount] = balanceStart;
          balanceCloseType = TYPE2.RightSquareBracket;
          balanceStart = balanceCloseType << TYPE_SHIFT | tokenCount;
          break;
        case TYPE2.LeftCurlyBracket:
          balance[tokenCount] = balanceStart;
          balanceCloseType = TYPE2.RightCurlyBracket;
          balanceStart = balanceCloseType << TYPE_SHIFT | tokenCount;
          break;
      }
      offsetAndType[tokenCount++] = type << TYPE_SHIFT | offset;
    }
    offsetAndType[tokenCount] = TYPE2.EOF << TYPE_SHIFT | offset;
    balance[tokenCount] = sourceLength;
    balance[sourceLength] = sourceLength;
    while (balanceStart !== 0) {
      balancePrev = balanceStart & OFFSET_MASK;
      balanceStart = balance[balancePrev];
      balance[balancePrev] = sourceLength;
    }
    stream.source = source;
    stream.firstCharOffset = start;
    stream.offsetAndType = offsetAndType;
    stream.tokenCount = tokenCount;
    stream.balance = balance;
    stream.reset();
    stream.next();
    return stream;
  }
  Object.keys(constants).forEach(function(key) {
    tokenize[key] = constants[key];
  });
  Object.keys(charCodeDefinitions).forEach(function(key) {
    tokenize[key] = charCodeDefinitions[key];
  });
  Object.keys(utils).forEach(function(key) {
    tokenize[key] = utils[key];
  });
  module2.exports = tokenize;
});

// node_modules/css-tree/lib/lexer/generic-an-plus-b.js
var require_generic_an_plus_b = __commonJS((exports2, module2) => {
  var isDigit = require_tokenizer().isDigit;
  var cmpChar = require_tokenizer().cmpChar;
  var TYPE2 = require_tokenizer().TYPE;
  var DELIM = TYPE2.Delim;
  var WHITESPACE = TYPE2.WhiteSpace;
  var COMMENT = TYPE2.Comment;
  var IDENT = TYPE2.Ident;
  var NUMBER = TYPE2.Number;
  var DIMENSION = TYPE2.Dimension;
  var PLUSSIGN = 43;
  var HYPHENMINUS = 45;
  var N = 110;
  var DISALLOW_SIGN = true;
  var ALLOW_SIGN = false;
  function isDelim(token, code) {
    return token !== null && token.type === DELIM && token.value.charCodeAt(0) === code;
  }
  function skipSC(token, offset, getNextToken) {
    while (token !== null && (token.type === WHITESPACE || token.type === COMMENT)) {
      token = getNextToken(++offset);
    }
    return offset;
  }
  function checkInteger(token, valueOffset, disallowSign, offset) {
    if (!token) {
      return 0;
    }
    var code = token.value.charCodeAt(valueOffset);
    if (code === PLUSSIGN || code === HYPHENMINUS) {
      if (disallowSign) {
        return 0;
      }
      valueOffset++;
    }
    for (; valueOffset < token.value.length; valueOffset++) {
      if (!isDigit(token.value.charCodeAt(valueOffset))) {
        return 0;
      }
    }
    return offset + 1;
  }
  function consumeB(token, offset_, getNextToken) {
    var sign = false;
    var offset = skipSC(token, offset_, getNextToken);
    token = getNextToken(offset);
    if (token === null) {
      return offset_;
    }
    if (token.type !== NUMBER) {
      if (isDelim(token, PLUSSIGN) || isDelim(token, HYPHENMINUS)) {
        sign = true;
        offset = skipSC(getNextToken(++offset), offset, getNextToken);
        token = getNextToken(offset);
        if (token === null && token.type !== NUMBER) {
          return 0;
        }
      } else {
        return offset_;
      }
    }
    if (!sign) {
      var code = token.value.charCodeAt(0);
      if (code !== PLUSSIGN && code !== HYPHENMINUS) {
        return 0;
      }
    }
    return checkInteger(token, sign ? 0 : 1, sign, offset);
  }
  module2.exports = function anPlusB(token, getNextToken) {
    var offset = 0;
    if (!token) {
      return 0;
    }
    if (token.type === NUMBER) {
      return checkInteger(token, 0, ALLOW_SIGN, offset);
    } else if (token.type === IDENT && token.value.charCodeAt(0) === HYPHENMINUS) {
      if (!cmpChar(token.value, 1, N)) {
        return 0;
      }
      switch (token.value.length) {
        case 2:
          return consumeB(getNextToken(++offset), offset, getNextToken);
        case 3:
          if (token.value.charCodeAt(2) !== HYPHENMINUS) {
            return 0;
          }
          offset = skipSC(getNextToken(++offset), offset, getNextToken);
          token = getNextToken(offset);
          return checkInteger(token, 0, DISALLOW_SIGN, offset);
        default:
          if (token.value.charCodeAt(2) !== HYPHENMINUS) {
            return 0;
          }
          return checkInteger(token, 3, DISALLOW_SIGN, offset);
      }
    } else if (token.type === IDENT || isDelim(token, PLUSSIGN) && getNextToken(offset + 1).type === IDENT) {
      if (token.type !== IDENT) {
        token = getNextToken(++offset);
      }
      if (token === null || !cmpChar(token.value, 0, N)) {
        return 0;
      }
      switch (token.value.length) {
        case 1:
          return consumeB(getNextToken(++offset), offset, getNextToken);
        case 2:
          if (token.value.charCodeAt(1) !== HYPHENMINUS) {
            return 0;
          }
          offset = skipSC(getNextToken(++offset), offset, getNextToken);
          token = getNextToken(offset);
          return checkInteger(token, 0, DISALLOW_SIGN, offset);
        default:
          if (token.value.charCodeAt(1) !== HYPHENMINUS) {
            return 0;
          }
          return checkInteger(token, 2, DISALLOW_SIGN, offset);
      }
    } else if (token.type === DIMENSION) {
      var code = token.value.charCodeAt(0);
      var sign = code === PLUSSIGN || code === HYPHENMINUS ? 1 : 0;
      for (var i = sign; i < token.value.length; i++) {
        if (!isDigit(token.value.charCodeAt(i))) {
          break;
        }
      }
      if (i === sign) {
        return 0;
      }
      if (!cmpChar(token.value, i, N)) {
        return 0;
      }
      if (i + 1 === token.value.length) {
        return consumeB(getNextToken(++offset), offset, getNextToken);
      } else {
        if (token.value.charCodeAt(i + 1) !== HYPHENMINUS) {
          return 0;
        }
        if (i + 2 === token.value.length) {
          offset = skipSC(getNextToken(++offset), offset, getNextToken);
          token = getNextToken(offset);
          return checkInteger(token, 0, DISALLOW_SIGN, offset);
        } else {
          return checkInteger(token, i + 2, DISALLOW_SIGN, offset);
        }
      }
    }
    return 0;
  };
});

// node_modules/css-tree/lib/lexer/generic-urange.js
var require_generic_urange = __commonJS((exports2, module2) => {
  var isHexDigit = require_tokenizer().isHexDigit;
  var cmpChar = require_tokenizer().cmpChar;
  var TYPE2 = require_tokenizer().TYPE;
  var IDENT = TYPE2.Ident;
  var DELIM = TYPE2.Delim;
  var NUMBER = TYPE2.Number;
  var DIMENSION = TYPE2.Dimension;
  var PLUSSIGN = 43;
  var HYPHENMINUS = 45;
  var QUESTIONMARK = 63;
  var U = 117;
  function isDelim(token, code) {
    return token !== null && token.type === DELIM && token.value.charCodeAt(0) === code;
  }
  function startsWith(token, code) {
    return token.value.charCodeAt(0) === code;
  }
  function hexSequence(token, offset, allowDash) {
    for (var pos = offset, hexlen = 0; pos < token.value.length; pos++) {
      var code = token.value.charCodeAt(pos);
      if (code === HYPHENMINUS && allowDash && hexlen !== 0) {
        if (hexSequence(token, offset + hexlen + 1, false) > 0) {
          return 6;
        }
        return 0;
      }
      if (!isHexDigit(code)) {
        return 0;
      }
      if (++hexlen > 6) {
        return 0;
      }
      ;
    }
    return hexlen;
  }
  function withQuestionMarkSequence(consumed, length, getNextToken) {
    if (!consumed) {
      return 0;
    }
    while (isDelim(getNextToken(length), QUESTIONMARK)) {
      if (++consumed > 6) {
        return 0;
      }
      length++;
    }
    return length;
  }
  module2.exports = function urange(token, getNextToken) {
    var length = 0;
    if (token === null || token.type !== IDENT || !cmpChar(token.value, 0, U)) {
      return 0;
    }
    token = getNextToken(++length);
    if (token === null) {
      return 0;
    }
    if (isDelim(token, PLUSSIGN)) {
      token = getNextToken(++length);
      if (token === null) {
        return 0;
      }
      if (token.type === IDENT) {
        return withQuestionMarkSequence(hexSequence(token, 0, true), ++length, getNextToken);
      }
      if (isDelim(token, QUESTIONMARK)) {
        return withQuestionMarkSequence(1, ++length, getNextToken);
      }
      return 0;
    }
    if (token.type === NUMBER) {
      if (!startsWith(token, PLUSSIGN)) {
        return 0;
      }
      var consumedHexLength = hexSequence(token, 1, true);
      if (consumedHexLength === 0) {
        return 0;
      }
      token = getNextToken(++length);
      if (token === null) {
        return length;
      }
      if (token.type === DIMENSION || token.type === NUMBER) {
        if (!startsWith(token, HYPHENMINUS) || !hexSequence(token, 1, false)) {
          return 0;
        }
        return length + 1;
      }
      return withQuestionMarkSequence(consumedHexLength, length, getNextToken);
    }
    if (token.type === DIMENSION) {
      if (!startsWith(token, PLUSSIGN)) {
        return 0;
      }
      return withQuestionMarkSequence(hexSequence(token, 1, true), ++length, getNextToken);
    }
    return 0;
  };
});

// node_modules/css-tree/lib/lexer/generic.js
var require_generic = __commonJS((exports2, module2) => {
  var tokenizer = require_tokenizer();
  var isIdentifierStart = tokenizer.isIdentifierStart;
  var isHexDigit = tokenizer.isHexDigit;
  var isDigit = tokenizer.isDigit;
  var cmpStr = tokenizer.cmpStr;
  var consumeNumber = tokenizer.consumeNumber;
  var TYPE2 = tokenizer.TYPE;
  var anPlusB = require_generic_an_plus_b();
  var urange = require_generic_urange();
  var cssWideKeywords = ["unset", "initial", "inherit"];
  var calcFunctionNames = ["calc(", "-moz-calc(", "-webkit-calc("];
  var LENGTH = {
    px: true,
    mm: true,
    cm: true,
    in: true,
    pt: true,
    pc: true,
    q: true,
    em: true,
    ex: true,
    ch: true,
    rem: true,
    vh: true,
    vw: true,
    vmin: true,
    vmax: true,
    vm: true
  };
  var ANGLE = {
    deg: true,
    grad: true,
    rad: true,
    turn: true
  };
  var TIME = {
    s: true,
    ms: true
  };
  var FREQUENCY = {
    hz: true,
    khz: true
  };
  var RESOLUTION = {
    dpi: true,
    dpcm: true,
    dppx: true,
    x: true
  };
  var FLEX = {
    fr: true
  };
  var DECIBEL = {
    db: true
  };
  var SEMITONES = {
    st: true
  };
  function charCode(str, index) {
    return index < str.length ? str.charCodeAt(index) : 0;
  }
  function eqStr(actual, expected) {
    return cmpStr(actual, 0, actual.length, expected);
  }
  function eqStrAny(actual, expected) {
    for (var i = 0; i < expected.length; i++) {
      if (eqStr(actual, expected[i])) {
        return true;
      }
    }
    return false;
  }
  function isPostfixIeHack(str, offset) {
    if (offset !== str.length - 2) {
      return false;
    }
    return str.charCodeAt(offset) === 92 && isDigit(str.charCodeAt(offset + 1));
  }
  function outOfRange(opts, value, numEnd) {
    if (opts && opts.type === "Range") {
      var num = Number(numEnd !== void 0 && numEnd !== value.length ? value.substr(0, numEnd) : value);
      if (isNaN(num)) {
        return true;
      }
      if (opts.min !== null && num < opts.min) {
        return true;
      }
      if (opts.max !== null && num > opts.max) {
        return true;
      }
    }
    return false;
  }
  function consumeFunction(token, getNextToken) {
    var startIdx = token.index;
    var length = 0;
    do {
      length++;
      if (token.balance <= startIdx) {
        break;
      }
    } while (token = getNextToken(length));
    return length;
  }
  function calc(next) {
    return function(token, getNextToken, opts) {
      if (token === null) {
        return 0;
      }
      if (token.type === TYPE2.Function && eqStrAny(token.value, calcFunctionNames)) {
        return consumeFunction(token, getNextToken);
      }
      return next(token, getNextToken, opts);
    };
  }
  function tokenType(expectedTokenType) {
    return function(token) {
      if (token === null || token.type !== expectedTokenType) {
        return 0;
      }
      return 1;
    };
  }
  function func(name) {
    name = name + "(";
    return function(token, getNextToken) {
      if (token !== null && eqStr(token.value, name)) {
        return consumeFunction(token, getNextToken);
      }
      return 0;
    };
  }
  function customIdent(token) {
    if (token === null || token.type !== TYPE2.Ident) {
      return 0;
    }
    var name = token.value.toLowerCase();
    if (eqStrAny(name, cssWideKeywords)) {
      return 0;
    }
    if (eqStr(name, "default")) {
      return 0;
    }
    return 1;
  }
  function customPropertyName(token) {
    if (token === null || token.type !== TYPE2.Ident) {
      return 0;
    }
    if (charCode(token.value, 0) !== 45 || charCode(token.value, 1) !== 45) {
      return 0;
    }
    return 1;
  }
  function hexColor(token) {
    if (token === null || token.type !== TYPE2.Hash) {
      return 0;
    }
    var length = token.value.length;
    if (length !== 4 && length !== 5 && length !== 7 && length !== 9) {
      return 0;
    }
    for (var i = 1; i < length; i++) {
      if (!isHexDigit(token.value.charCodeAt(i))) {
        return 0;
      }
    }
    return 1;
  }
  function idSelector(token) {
    if (token === null || token.type !== TYPE2.Hash) {
      return 0;
    }
    if (!isIdentifierStart(charCode(token.value, 1), charCode(token.value, 2), charCode(token.value, 3))) {
      return 0;
    }
    return 1;
  }
  function declarationValue(token, getNextToken) {
    if (!token) {
      return 0;
    }
    var length = 0;
    var level = 0;
    var startIdx = token.index;
    scan:
      do {
        switch (token.type) {
          case TYPE2.BadString:
          case TYPE2.BadUrl:
            break scan;
          case TYPE2.RightCurlyBracket:
          case TYPE2.RightParenthesis:
          case TYPE2.RightSquareBracket:
            if (token.balance > token.index || token.balance < startIdx) {
              break scan;
            }
            level--;
            break;
          case TYPE2.Semicolon:
            if (level === 0) {
              break scan;
            }
            break;
          case TYPE2.Delim:
            if (token.value === "!" && level === 0) {
              break scan;
            }
            break;
          case TYPE2.Function:
          case TYPE2.LeftParenthesis:
          case TYPE2.LeftSquareBracket:
          case TYPE2.LeftCurlyBracket:
            level++;
            break;
        }
        length++;
        if (token.balance <= startIdx) {
          break;
        }
      } while (token = getNextToken(length));
    return length;
  }
  function anyValue(token, getNextToken) {
    if (!token) {
      return 0;
    }
    var startIdx = token.index;
    var length = 0;
    scan:
      do {
        switch (token.type) {
          case TYPE2.BadString:
          case TYPE2.BadUrl:
            break scan;
          case TYPE2.RightCurlyBracket:
          case TYPE2.RightParenthesis:
          case TYPE2.RightSquareBracket:
            if (token.balance > token.index || token.balance < startIdx) {
              break scan;
            }
            break;
        }
        length++;
        if (token.balance <= startIdx) {
          break;
        }
      } while (token = getNextToken(length));
    return length;
  }
  function dimension(type) {
    return function(token, getNextToken, opts) {
      if (token === null || token.type !== TYPE2.Dimension) {
        return 0;
      }
      var numberEnd = consumeNumber(token.value, 0);
      if (type !== null) {
        var reverseSolidusOffset = token.value.indexOf("\\", numberEnd);
        var unit = reverseSolidusOffset === -1 || !isPostfixIeHack(token.value, reverseSolidusOffset) ? token.value.substr(numberEnd) : token.value.substring(numberEnd, reverseSolidusOffset);
        if (type.hasOwnProperty(unit.toLowerCase()) === false) {
          return 0;
        }
      }
      if (outOfRange(opts, token.value, numberEnd)) {
        return 0;
      }
      return 1;
    };
  }
  function percentage(token, getNextToken, opts) {
    if (token === null || token.type !== TYPE2.Percentage) {
      return 0;
    }
    if (outOfRange(opts, token.value, token.value.length - 1)) {
      return 0;
    }
    return 1;
  }
  function zero(next) {
    if (typeof next !== "function") {
      next = function() {
        return 0;
      };
    }
    return function(token, getNextToken, opts) {
      if (token !== null && token.type === TYPE2.Number) {
        if (Number(token.value) === 0) {
          return 1;
        }
      }
      return next(token, getNextToken, opts);
    };
  }
  function number(token, getNextToken, opts) {
    if (token === null) {
      return 0;
    }
    var numberEnd = consumeNumber(token.value, 0);
    var isNumber = numberEnd === token.value.length;
    if (!isNumber && !isPostfixIeHack(token.value, numberEnd)) {
      return 0;
    }
    if (outOfRange(opts, token.value, numberEnd)) {
      return 0;
    }
    return 1;
  }
  function integer(token, getNextToken, opts) {
    if (token === null || token.type !== TYPE2.Number) {
      return 0;
    }
    var i = token.value.charCodeAt(0) === 43 || token.value.charCodeAt(0) === 45 ? 1 : 0;
    for (; i < token.value.length; i++) {
      if (!isDigit(token.value.charCodeAt(i))) {
        return 0;
      }
    }
    if (outOfRange(opts, token.value, i)) {
      return 0;
    }
    return 1;
  }
  module2.exports = {
    "ident-token": tokenType(TYPE2.Ident),
    "function-token": tokenType(TYPE2.Function),
    "at-keyword-token": tokenType(TYPE2.AtKeyword),
    "hash-token": tokenType(TYPE2.Hash),
    "string-token": tokenType(TYPE2.String),
    "bad-string-token": tokenType(TYPE2.BadString),
    "url-token": tokenType(TYPE2.Url),
    "bad-url-token": tokenType(TYPE2.BadUrl),
    "delim-token": tokenType(TYPE2.Delim),
    "number-token": tokenType(TYPE2.Number),
    "percentage-token": tokenType(TYPE2.Percentage),
    "dimension-token": tokenType(TYPE2.Dimension),
    "whitespace-token": tokenType(TYPE2.WhiteSpace),
    "CDO-token": tokenType(TYPE2.CDO),
    "CDC-token": tokenType(TYPE2.CDC),
    "colon-token": tokenType(TYPE2.Colon),
    "semicolon-token": tokenType(TYPE2.Semicolon),
    "comma-token": tokenType(TYPE2.Comma),
    "[-token": tokenType(TYPE2.LeftSquareBracket),
    "]-token": tokenType(TYPE2.RightSquareBracket),
    "(-token": tokenType(TYPE2.LeftParenthesis),
    ")-token": tokenType(TYPE2.RightParenthesis),
    "{-token": tokenType(TYPE2.LeftCurlyBracket),
    "}-token": tokenType(TYPE2.RightCurlyBracket),
    string: tokenType(TYPE2.String),
    ident: tokenType(TYPE2.Ident),
    "custom-ident": customIdent,
    "custom-property-name": customPropertyName,
    "hex-color": hexColor,
    "id-selector": idSelector,
    "an-plus-b": anPlusB,
    urange,
    "declaration-value": declarationValue,
    "any-value": anyValue,
    dimension: calc(dimension(null)),
    angle: calc(dimension(ANGLE)),
    decibel: calc(dimension(DECIBEL)),
    frequency: calc(dimension(FREQUENCY)),
    flex: calc(dimension(FLEX)),
    length: calc(zero(dimension(LENGTH))),
    resolution: calc(dimension(RESOLUTION)),
    semitones: calc(dimension(SEMITONES)),
    time: calc(dimension(TIME)),
    percentage: calc(percentage),
    zero: zero(),
    number: calc(number),
    integer: calc(integer),
    "-ms-legacy-expression": func("expression")
  };
});

// node_modules/css-tree/lib/definition-syntax/SyntaxError.js
var require_SyntaxError2 = __commonJS((exports2, module2) => {
  var createCustomError = require_createCustomError();
  module2.exports = function SyntaxError2(message, input, offset) {
    var error = createCustomError("SyntaxError", message);
    error.input = input;
    error.offset = offset;
    error.rawMessage = message;
    error.message = error.rawMessage + "\n  " + error.input + "\n--" + new Array((error.offset || error.input.length) + 1).join("-") + "^";
    return error;
  };
});

// node_modules/css-tree/lib/definition-syntax/tokenizer.js
var require_tokenizer2 = __commonJS((exports2, module2) => {
  var SyntaxError2 = require_SyntaxError2();
  var TAB = 9;
  var N = 10;
  var F = 12;
  var R = 13;
  var SPACE = 32;
  var Tokenizer = function(str) {
    this.str = str;
    this.pos = 0;
  };
  Tokenizer.prototype = {
    charCodeAt: function(pos) {
      return pos < this.str.length ? this.str.charCodeAt(pos) : 0;
    },
    charCode: function() {
      return this.charCodeAt(this.pos);
    },
    nextCharCode: function() {
      return this.charCodeAt(this.pos + 1);
    },
    nextNonWsCode: function(pos) {
      return this.charCodeAt(this.findWsEnd(pos));
    },
    findWsEnd: function(pos) {
      for (; pos < this.str.length; pos++) {
        var code = this.str.charCodeAt(pos);
        if (code !== R && code !== N && code !== F && code !== SPACE && code !== TAB) {
          break;
        }
      }
      return pos;
    },
    substringToPos: function(end) {
      return this.str.substring(this.pos, this.pos = end);
    },
    eat: function(code) {
      if (this.charCode() !== code) {
        this.error("Expect `" + String.fromCharCode(code) + "`");
      }
      this.pos++;
    },
    peek: function() {
      return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
    },
    error: function(message) {
      throw new SyntaxError2(message, this.str, this.pos);
    }
  };
  module2.exports = Tokenizer;
});

// node_modules/css-tree/lib/definition-syntax/parse.js
var require_parse = __commonJS((exports2, module2) => {
  var Tokenizer = require_tokenizer2();
  var TAB = 9;
  var N = 10;
  var F = 12;
  var R = 13;
  var SPACE = 32;
  var EXCLAMATIONMARK = 33;
  var NUMBERSIGN = 35;
  var AMPERSAND = 38;
  var APOSTROPHE = 39;
  var LEFTPARENTHESIS = 40;
  var RIGHTPARENTHESIS = 41;
  var ASTERISK = 42;
  var PLUSSIGN = 43;
  var COMMA = 44;
  var HYPERMINUS = 45;
  var LESSTHANSIGN = 60;
  var GREATERTHANSIGN = 62;
  var QUESTIONMARK = 63;
  var COMMERCIALAT = 64;
  var LEFTSQUAREBRACKET = 91;
  var RIGHTSQUAREBRACKET = 93;
  var LEFTCURLYBRACKET = 123;
  var VERTICALLINE = 124;
  var RIGHTCURLYBRACKET = 125;
  var INFINITY = 8734;
  var NAME_CHAR = createCharMap(function(ch) {
    return /[a-zA-Z0-9\-]/.test(ch);
  });
  var COMBINATOR_PRECEDENCE = {
    " ": 1,
    "&&": 2,
    "||": 3,
    "|": 4
  };
  function createCharMap(fn) {
    var array = typeof Uint32Array === "function" ? new Uint32Array(128) : new Array(128);
    for (var i = 0; i < 128; i++) {
      array[i] = fn(String.fromCharCode(i)) ? 1 : 0;
    }
    return array;
  }
  function scanSpaces(tokenizer) {
    return tokenizer.substringToPos(tokenizer.findWsEnd(tokenizer.pos));
  }
  function scanWord(tokenizer) {
    var end = tokenizer.pos;
    for (; end < tokenizer.str.length; end++) {
      var code = tokenizer.str.charCodeAt(end);
      if (code >= 128 || NAME_CHAR[code] === 0) {
        break;
      }
    }
    if (tokenizer.pos === end) {
      tokenizer.error("Expect a keyword");
    }
    return tokenizer.substringToPos(end);
  }
  function scanNumber(tokenizer) {
    var end = tokenizer.pos;
    for (; end < tokenizer.str.length; end++) {
      var code = tokenizer.str.charCodeAt(end);
      if (code < 48 || code > 57) {
        break;
      }
    }
    if (tokenizer.pos === end) {
      tokenizer.error("Expect a number");
    }
    return tokenizer.substringToPos(end);
  }
  function scanString(tokenizer) {
    var end = tokenizer.str.indexOf("'", tokenizer.pos + 1);
    if (end === -1) {
      tokenizer.pos = tokenizer.str.length;
      tokenizer.error("Expect an apostrophe");
    }
    return tokenizer.substringToPos(end + 1);
  }
  function readMultiplierRange(tokenizer) {
    var min = null;
    var max = null;
    tokenizer.eat(LEFTCURLYBRACKET);
    min = scanNumber(tokenizer);
    if (tokenizer.charCode() === COMMA) {
      tokenizer.pos++;
      if (tokenizer.charCode() !== RIGHTCURLYBRACKET) {
        max = scanNumber(tokenizer);
      }
    } else {
      max = min;
    }
    tokenizer.eat(RIGHTCURLYBRACKET);
    return {
      min: Number(min),
      max: max ? Number(max) : 0
    };
  }
  function readMultiplier(tokenizer) {
    var range = null;
    var comma = false;
    switch (tokenizer.charCode()) {
      case ASTERISK:
        tokenizer.pos++;
        range = {
          min: 0,
          max: 0
        };
        break;
      case PLUSSIGN:
        tokenizer.pos++;
        range = {
          min: 1,
          max: 0
        };
        break;
      case QUESTIONMARK:
        tokenizer.pos++;
        range = {
          min: 0,
          max: 1
        };
        break;
      case NUMBERSIGN:
        tokenizer.pos++;
        comma = true;
        if (tokenizer.charCode() === LEFTCURLYBRACKET) {
          range = readMultiplierRange(tokenizer);
        } else {
          range = {
            min: 1,
            max: 0
          };
        }
        break;
      case LEFTCURLYBRACKET:
        range = readMultiplierRange(tokenizer);
        break;
      default:
        return null;
    }
    return {
      type: "Multiplier",
      comma,
      min: range.min,
      max: range.max,
      term: null
    };
  }
  function maybeMultiplied(tokenizer, node) {
    var multiplier = readMultiplier(tokenizer);
    if (multiplier !== null) {
      multiplier.term = node;
      return multiplier;
    }
    return node;
  }
  function maybeToken(tokenizer) {
    var ch = tokenizer.peek();
    if (ch === "") {
      return null;
    }
    return {
      type: "Token",
      value: ch
    };
  }
  function readProperty(tokenizer) {
    var name;
    tokenizer.eat(LESSTHANSIGN);
    tokenizer.eat(APOSTROPHE);
    name = scanWord(tokenizer);
    tokenizer.eat(APOSTROPHE);
    tokenizer.eat(GREATERTHANSIGN);
    return maybeMultiplied(tokenizer, {
      type: "Property",
      name
    });
  }
  function readTypeRange(tokenizer) {
    var min = null;
    var max = null;
    var sign = 1;
    tokenizer.eat(LEFTSQUAREBRACKET);
    if (tokenizer.charCode() === HYPERMINUS) {
      tokenizer.peek();
      sign = -1;
    }
    if (sign == -1 && tokenizer.charCode() === INFINITY) {
      tokenizer.peek();
    } else {
      min = sign * Number(scanNumber(tokenizer));
    }
    scanSpaces(tokenizer);
    tokenizer.eat(COMMA);
    scanSpaces(tokenizer);
    if (tokenizer.charCode() === INFINITY) {
      tokenizer.peek();
    } else {
      sign = 1;
      if (tokenizer.charCode() === HYPERMINUS) {
        tokenizer.peek();
        sign = -1;
      }
      max = sign * Number(scanNumber(tokenizer));
    }
    tokenizer.eat(RIGHTSQUAREBRACKET);
    if (min === null && max === null) {
      return null;
    }
    return {
      type: "Range",
      min,
      max
    };
  }
  function readType(tokenizer) {
    var name;
    var opts = null;
    tokenizer.eat(LESSTHANSIGN);
    name = scanWord(tokenizer);
    if (tokenizer.charCode() === LEFTPARENTHESIS && tokenizer.nextCharCode() === RIGHTPARENTHESIS) {
      tokenizer.pos += 2;
      name += "()";
    }
    if (tokenizer.charCodeAt(tokenizer.findWsEnd(tokenizer.pos)) === LEFTSQUAREBRACKET) {
      scanSpaces(tokenizer);
      opts = readTypeRange(tokenizer);
    }
    tokenizer.eat(GREATERTHANSIGN);
    return maybeMultiplied(tokenizer, {
      type: "Type",
      name,
      opts
    });
  }
  function readKeywordOrFunction(tokenizer) {
    var name;
    name = scanWord(tokenizer);
    if (tokenizer.charCode() === LEFTPARENTHESIS) {
      tokenizer.pos++;
      return {
        type: "Function",
        name
      };
    }
    return maybeMultiplied(tokenizer, {
      type: "Keyword",
      name
    });
  }
  function regroupTerms(terms, combinators) {
    function createGroup(terms2, combinator2) {
      return {
        type: "Group",
        terms: terms2,
        combinator: combinator2,
        disallowEmpty: false,
        explicit: false
      };
    }
    combinators = Object.keys(combinators).sort(function(a, b) {
      return COMBINATOR_PRECEDENCE[a] - COMBINATOR_PRECEDENCE[b];
    });
    while (combinators.length > 0) {
      var combinator = combinators.shift();
      for (var i = 0, subgroupStart = 0; i < terms.length; i++) {
        var term = terms[i];
        if (term.type === "Combinator") {
          if (term.value === combinator) {
            if (subgroupStart === -1) {
              subgroupStart = i - 1;
            }
            terms.splice(i, 1);
            i--;
          } else {
            if (subgroupStart !== -1 && i - subgroupStart > 1) {
              terms.splice(subgroupStart, i - subgroupStart, createGroup(terms.slice(subgroupStart, i), combinator));
              i = subgroupStart + 1;
            }
            subgroupStart = -1;
          }
        }
      }
      if (subgroupStart !== -1 && combinators.length) {
        terms.splice(subgroupStart, i - subgroupStart, createGroup(terms.slice(subgroupStart, i), combinator));
      }
    }
    return combinator;
  }
  function readImplicitGroup(tokenizer) {
    var terms = [];
    var combinators = {};
    var token;
    var prevToken = null;
    var prevTokenPos = tokenizer.pos;
    while (token = peek(tokenizer)) {
      if (token.type !== "Spaces") {
        if (token.type === "Combinator") {
          if (prevToken === null || prevToken.type === "Combinator") {
            tokenizer.pos = prevTokenPos;
            tokenizer.error("Unexpected combinator");
          }
          combinators[token.value] = true;
        } else if (prevToken !== null && prevToken.type !== "Combinator") {
          combinators[" "] = true;
          terms.push({
            type: "Combinator",
            value: " "
          });
        }
        terms.push(token);
        prevToken = token;
        prevTokenPos = tokenizer.pos;
      }
    }
    if (prevToken !== null && prevToken.type === "Combinator") {
      tokenizer.pos -= prevTokenPos;
      tokenizer.error("Unexpected combinator");
    }
    return {
      type: "Group",
      terms,
      combinator: regroupTerms(terms, combinators) || " ",
      disallowEmpty: false,
      explicit: false
    };
  }
  function readGroup(tokenizer) {
    var result;
    tokenizer.eat(LEFTSQUAREBRACKET);
    result = readImplicitGroup(tokenizer);
    tokenizer.eat(RIGHTSQUAREBRACKET);
    result.explicit = true;
    if (tokenizer.charCode() === EXCLAMATIONMARK) {
      tokenizer.pos++;
      result.disallowEmpty = true;
    }
    return result;
  }
  function peek(tokenizer) {
    var code = tokenizer.charCode();
    if (code < 128 && NAME_CHAR[code] === 1) {
      return readKeywordOrFunction(tokenizer);
    }
    switch (code) {
      case RIGHTSQUAREBRACKET:
        break;
      case LEFTSQUAREBRACKET:
        return maybeMultiplied(tokenizer, readGroup(tokenizer));
      case LESSTHANSIGN:
        return tokenizer.nextCharCode() === APOSTROPHE ? readProperty(tokenizer) : readType(tokenizer);
      case VERTICALLINE:
        return {
          type: "Combinator",
          value: tokenizer.substringToPos(tokenizer.nextCharCode() === VERTICALLINE ? tokenizer.pos + 2 : tokenizer.pos + 1)
        };
      case AMPERSAND:
        tokenizer.pos++;
        tokenizer.eat(AMPERSAND);
        return {
          type: "Combinator",
          value: "&&"
        };
      case COMMA:
        tokenizer.pos++;
        return {
          type: "Comma"
        };
      case APOSTROPHE:
        return maybeMultiplied(tokenizer, {
          type: "String",
          value: scanString(tokenizer)
        });
      case SPACE:
      case TAB:
      case N:
      case R:
      case F:
        return {
          type: "Spaces",
          value: scanSpaces(tokenizer)
        };
      case COMMERCIALAT:
        code = tokenizer.nextCharCode();
        if (code < 128 && NAME_CHAR[code] === 1) {
          tokenizer.pos++;
          return {
            type: "AtKeyword",
            name: scanWord(tokenizer)
          };
        }
        return maybeToken(tokenizer);
      case ASTERISK:
      case PLUSSIGN:
      case QUESTIONMARK:
      case NUMBERSIGN:
      case EXCLAMATIONMARK:
        break;
      case LEFTCURLYBRACKET:
        code = tokenizer.nextCharCode();
        if (code < 48 || code > 57) {
          return maybeToken(tokenizer);
        }
        break;
      default:
        return maybeToken(tokenizer);
    }
  }
  function parse2(source) {
    var tokenizer = new Tokenizer(source);
    var result = readImplicitGroup(tokenizer);
    if (tokenizer.pos !== source.length) {
      tokenizer.error("Unexpected input");
    }
    if (result.terms.length === 1 && result.terms[0].type === "Group") {
      result = result.terms[0];
    }
    return result;
  }
  parse2("[a&&<b>#|<'c'>*||e() f{2} /,(% g#{1,2} h{2,})]!");
  module2.exports = parse2;
});

// node_modules/css-tree/lib/definition-syntax/walk.js
var require_walk = __commonJS((exports2, module2) => {
  var noop = function() {
  };
  function ensureFunction(value) {
    return typeof value === "function" ? value : noop;
  }
  module2.exports = function(node, options, context) {
    function walk2(node2) {
      enter.call(context, node2);
      switch (node2.type) {
        case "Group":
          node2.terms.forEach(walk2);
          break;
        case "Multiplier":
          walk2(node2.term);
          break;
        case "Type":
        case "Property":
        case "Keyword":
        case "AtKeyword":
        case "Function":
        case "String":
        case "Token":
        case "Comma":
          break;
        default:
          throw new Error("Unknown type: " + node2.type);
      }
      leave.call(context, node2);
    }
    var enter = noop;
    var leave = noop;
    if (typeof options === "function") {
      enter = options;
    } else if (options) {
      enter = ensureFunction(options.enter);
      leave = ensureFunction(options.leave);
    }
    if (enter === noop && leave === noop) {
      throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
    }
    walk2(node, context);
  };
});

// node_modules/css-tree/lib/lexer/prepare-tokens.js
var require_prepare_tokens = __commonJS((exports2, module2) => {
  var tokenize = require_tokenizer();
  var TokenStream = require_TokenStream();
  var tokenStream = new TokenStream();
  var astToTokens = {
    decorator: function(handlers) {
      var curNode = null;
      var prev = {len: 0, node: null};
      var nodes = [prev];
      var buffer = "";
      return {
        children: handlers.children,
        node: function(node) {
          var tmp = curNode;
          curNode = node;
          handlers.node.call(this, node);
          curNode = tmp;
        },
        chunk: function(chunk) {
          buffer += chunk;
          if (prev.node !== curNode) {
            nodes.push({
              len: chunk.length,
              node: curNode
            });
          } else {
            prev.len += chunk.length;
          }
        },
        result: function() {
          return prepareTokens(buffer, nodes);
        }
      };
    }
  };
  function prepareTokens(str, nodes) {
    var tokens = [];
    var nodesOffset = 0;
    var nodesIndex = 0;
    var currentNode = nodes ? nodes[nodesIndex].node : null;
    tokenize(str, tokenStream);
    while (!tokenStream.eof) {
      if (nodes) {
        while (nodesIndex < nodes.length && nodesOffset + nodes[nodesIndex].len <= tokenStream.tokenStart) {
          nodesOffset += nodes[nodesIndex++].len;
          currentNode = nodes[nodesIndex].node;
        }
      }
      tokens.push({
        type: tokenStream.tokenType,
        value: tokenStream.getTokenValue(),
        index: tokenStream.tokenIndex,
        balance: tokenStream.balance[tokenStream.tokenIndex],
        node: currentNode
      });
      tokenStream.next();
    }
    return tokens;
  }
  module2.exports = function(value, syntax) {
    if (typeof value === "string") {
      return prepareTokens(value, null);
    }
    return syntax.generate(value, astToTokens);
  };
});

// node_modules/css-tree/lib/lexer/match-graph.js
var require_match_graph = __commonJS((exports2, module2) => {
  var parse2 = require_parse();
  var MATCH = {type: "Match"};
  var MISMATCH = {type: "Mismatch"};
  var DISALLOW_EMPTY = {type: "DisallowEmpty"};
  var LEFTPARENTHESIS = 40;
  var RIGHTPARENTHESIS = 41;
  function createCondition(match, thenBranch, elseBranch) {
    if (thenBranch === MATCH && elseBranch === MISMATCH) {
      return match;
    }
    if (match === MATCH && thenBranch === MATCH && elseBranch === MATCH) {
      return match;
    }
    if (match.type === "If" && match.else === MISMATCH && thenBranch === MATCH) {
      thenBranch = match.then;
      match = match.match;
    }
    return {
      type: "If",
      match,
      then: thenBranch,
      else: elseBranch
    };
  }
  function isFunctionType(name) {
    return name.length > 2 && name.charCodeAt(name.length - 2) === LEFTPARENTHESIS && name.charCodeAt(name.length - 1) === RIGHTPARENTHESIS;
  }
  function isEnumCapatible(term) {
    return term.type === "Keyword" || term.type === "AtKeyword" || term.type === "Function" || term.type === "Type" && isFunctionType(term.name);
  }
  function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
    switch (combinator) {
      case " ":
        var result = MATCH;
        for (var i = terms.length - 1; i >= 0; i--) {
          var term = terms[i];
          result = createCondition(term, result, MISMATCH);
        }
        ;
        return result;
      case "|":
        var result = MISMATCH;
        var map = null;
        for (var i = terms.length - 1; i >= 0; i--) {
          var term = terms[i];
          if (isEnumCapatible(term)) {
            if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
              map = Object.create(null);
              result = createCondition({
                type: "Enum",
                map
              }, MATCH, result);
            }
            if (map !== null) {
              var key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
              if (key in map === false) {
                map[key] = term;
                continue;
              }
            }
          }
          map = null;
          result = createCondition(term, MATCH, result);
        }
        ;
        return result;
      case "&&":
        if (terms.length > 5) {
          return {
            type: "MatchOnce",
            terms,
            all: true
          };
        }
        var result = MISMATCH;
        for (var i = terms.length - 1; i >= 0; i--) {
          var term = terms[i];
          var thenClause;
          if (terms.length > 1) {
            thenClause = buildGroupMatchGraph(combinator, terms.filter(function(newGroupTerm) {
              return newGroupTerm !== term;
            }), false);
          } else {
            thenClause = MATCH;
          }
          result = createCondition(term, thenClause, result);
        }
        ;
        return result;
      case "||":
        if (terms.length > 5) {
          return {
            type: "MatchOnce",
            terms,
            all: false
          };
        }
        var result = atLeastOneTermMatched ? MATCH : MISMATCH;
        for (var i = terms.length - 1; i >= 0; i--) {
          var term = terms[i];
          var thenClause;
          if (terms.length > 1) {
            thenClause = buildGroupMatchGraph(combinator, terms.filter(function(newGroupTerm) {
              return newGroupTerm !== term;
            }), true);
          } else {
            thenClause = MATCH;
          }
          result = createCondition(term, thenClause, result);
        }
        ;
        return result;
    }
  }
  function buildMultiplierMatchGraph(node) {
    var result = MATCH;
    var matchTerm = buildMatchGraph(node.term);
    if (node.max === 0) {
      matchTerm = createCondition(matchTerm, DISALLOW_EMPTY, MISMATCH);
      result = createCondition(matchTerm, null, MISMATCH);
      result.then = createCondition(MATCH, MATCH, result);
      if (node.comma) {
        result.then.else = createCondition({type: "Comma", syntax: node}, result, MISMATCH);
      }
    } else {
      for (var i = node.min || 1; i <= node.max; i++) {
        if (node.comma && result !== MATCH) {
          result = createCondition({type: "Comma", syntax: node}, result, MISMATCH);
        }
        result = createCondition(matchTerm, createCondition(MATCH, MATCH, result), MISMATCH);
      }
    }
    if (node.min === 0) {
      result = createCondition(MATCH, MATCH, result);
    } else {
      for (var i = 0; i < node.min - 1; i++) {
        if (node.comma && result !== MATCH) {
          result = createCondition({type: "Comma", syntax: node}, result, MISMATCH);
        }
        result = createCondition(matchTerm, result, MISMATCH);
      }
    }
    return result;
  }
  function buildMatchGraph(node) {
    if (typeof node === "function") {
      return {
        type: "Generic",
        fn: node
      };
    }
    switch (node.type) {
      case "Group":
        var result = buildGroupMatchGraph(node.combinator, node.terms.map(buildMatchGraph), false);
        if (node.disallowEmpty) {
          result = createCondition(result, DISALLOW_EMPTY, MISMATCH);
        }
        return result;
      case "Multiplier":
        return buildMultiplierMatchGraph(node);
      case "Type":
      case "Property":
        return {
          type: node.type,
          name: node.name,
          syntax: node
        };
      case "Keyword":
        return {
          type: node.type,
          name: node.name.toLowerCase(),
          syntax: node
        };
      case "AtKeyword":
        return {
          type: node.type,
          name: "@" + node.name.toLowerCase(),
          syntax: node
        };
      case "Function":
        return {
          type: node.type,
          name: node.name.toLowerCase() + "(",
          syntax: node
        };
      case "String":
        if (node.value.length === 3) {
          return {
            type: "Token",
            value: node.value.charAt(1),
            syntax: node
          };
        }
        return {
          type: node.type,
          value: node.value.substr(1, node.value.length - 2).replace(/\\'/g, "'"),
          syntax: node
        };
      case "Token":
        return {
          type: node.type,
          value: node.value,
          syntax: node
        };
      case "Comma":
        return {
          type: node.type,
          syntax: node
        };
      default:
        throw new Error("Unknown node type:", node.type);
    }
  }
  module2.exports = {
    MATCH,
    MISMATCH,
    DISALLOW_EMPTY,
    buildMatchGraph: function(syntaxTree, ref) {
      if (typeof syntaxTree === "string") {
        syntaxTree = parse2(syntaxTree);
      }
      return {
        type: "MatchGraph",
        match: buildMatchGraph(syntaxTree),
        syntax: ref || null,
        source: syntaxTree
      };
    }
  };
});

// node_modules/css-tree/lib/lexer/match.js
var require_match = __commonJS((exports2, module2) => {
  var hasOwnProperty2 = Object.prototype.hasOwnProperty;
  var matchGraph = require_match_graph();
  var MATCH = matchGraph.MATCH;
  var MISMATCH = matchGraph.MISMATCH;
  var DISALLOW_EMPTY = matchGraph.DISALLOW_EMPTY;
  var TYPE2 = require_const().TYPE;
  var STUB = 0;
  var TOKEN = 1;
  var OPEN_SYNTAX = 2;
  var CLOSE_SYNTAX = 3;
  var EXIT_REASON_MATCH = "Match";
  var EXIT_REASON_MISMATCH = "Mismatch";
  var EXIT_REASON_ITERATION_LIMIT = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)";
  var ITERATION_LIMIT = 15e3;
  var totalIterationCount = 0;
  function reverseList(list) {
    var prev = null;
    var next = null;
    var item = list;
    while (item !== null) {
      next = item.prev;
      item.prev = prev;
      prev = item;
      item = next;
    }
    return prev;
  }
  function areStringsEqualCaseInsensitive(testStr, referenceStr) {
    if (testStr.length !== referenceStr.length) {
      return false;
    }
    for (var i = 0; i < testStr.length; i++) {
      var testCode = testStr.charCodeAt(i);
      var referenceCode = referenceStr.charCodeAt(i);
      if (testCode >= 65 && testCode <= 90) {
        testCode = testCode | 32;
      }
      if (testCode !== referenceCode) {
        return false;
      }
    }
    return true;
  }
  function isContextEdgeDelim(token) {
    if (token.type !== TYPE2.Delim) {
      return false;
    }
    return token.value !== "?";
  }
  function isCommaContextStart(token) {
    if (token === null) {
      return true;
    }
    return token.type === TYPE2.Comma || token.type === TYPE2.Function || token.type === TYPE2.LeftParenthesis || token.type === TYPE2.LeftSquareBracket || token.type === TYPE2.LeftCurlyBracket || isContextEdgeDelim(token);
  }
  function isCommaContextEnd(token) {
    if (token === null) {
      return true;
    }
    return token.type === TYPE2.RightParenthesis || token.type === TYPE2.RightSquareBracket || token.type === TYPE2.RightCurlyBracket || token.type === TYPE2.Delim;
  }
  function internalMatch(tokens, state, syntaxes) {
    function moveToNextToken() {
      do {
        tokenIndex++;
        token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
      } while (token !== null && (token.type === TYPE2.WhiteSpace || token.type === TYPE2.Comment));
    }
    function getNextToken(offset) {
      var nextIndex = tokenIndex + offset;
      return nextIndex < tokens.length ? tokens[nextIndex] : null;
    }
    function stateSnapshotFromSyntax(nextState, prev) {
      return {
        nextState,
        matchStack,
        syntaxStack,
        thenStack,
        tokenIndex,
        prev
      };
    }
    function pushThenStack(nextState) {
      thenStack = {
        nextState,
        matchStack,
        syntaxStack,
        prev: thenStack
      };
    }
    function pushElseStack(nextState) {
      elseStack = stateSnapshotFromSyntax(nextState, elseStack);
    }
    function addTokenToMatch() {
      matchStack = {
        type: TOKEN,
        syntax: state.syntax,
        token,
        prev: matchStack
      };
      moveToNextToken();
      syntaxStash = null;
      if (tokenIndex > longestMatch) {
        longestMatch = tokenIndex;
      }
    }
    function openSyntax() {
      syntaxStack = {
        syntax: state.syntax,
        opts: state.syntax.opts || syntaxStack !== null && syntaxStack.opts || null,
        prev: syntaxStack
      };
      matchStack = {
        type: OPEN_SYNTAX,
        syntax: state.syntax,
        token: matchStack.token,
        prev: matchStack
      };
    }
    function closeSyntax() {
      if (matchStack.type === OPEN_SYNTAX) {
        matchStack = matchStack.prev;
      } else {
        matchStack = {
          type: CLOSE_SYNTAX,
          syntax: syntaxStack.syntax,
          token: matchStack.token,
          prev: matchStack
        };
      }
      syntaxStack = syntaxStack.prev;
    }
    var syntaxStack = null;
    var thenStack = null;
    var elseStack = null;
    var syntaxStash = null;
    var iterationCount = 0;
    var exitReason = null;
    var token = null;
    var tokenIndex = -1;
    var longestMatch = 0;
    var matchStack = {
      type: STUB,
      syntax: null,
      token: null,
      prev: null
    };
    moveToNextToken();
    while (exitReason === null && ++iterationCount < ITERATION_LIMIT) {
      switch (state.type) {
        case "Match":
          if (thenStack === null) {
            if (token !== null) {
              if (tokenIndex !== tokens.length - 1 || token.value !== "\\0" && token.value !== "\\9") {
                state = MISMATCH;
                break;
              }
            }
            exitReason = EXIT_REASON_MATCH;
            break;
          }
          state = thenStack.nextState;
          if (state === DISALLOW_EMPTY) {
            if (thenStack.matchStack === matchStack) {
              state = MISMATCH;
              break;
            } else {
              state = MATCH;
            }
          }
          while (thenStack.syntaxStack !== syntaxStack) {
            closeSyntax();
          }
          thenStack = thenStack.prev;
          break;
        case "Mismatch":
          if (syntaxStash !== null && syntaxStash !== false) {
            if (elseStack === null || tokenIndex > elseStack.tokenIndex) {
              elseStack = syntaxStash;
              syntaxStash = false;
            }
          } else if (elseStack === null) {
            exitReason = EXIT_REASON_MISMATCH;
            break;
          }
          state = elseStack.nextState;
          thenStack = elseStack.thenStack;
          syntaxStack = elseStack.syntaxStack;
          matchStack = elseStack.matchStack;
          tokenIndex = elseStack.tokenIndex;
          token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
          elseStack = elseStack.prev;
          break;
        case "MatchGraph":
          state = state.match;
          break;
        case "If":
          if (state.else !== MISMATCH) {
            pushElseStack(state.else);
          }
          if (state.then !== MATCH) {
            pushThenStack(state.then);
          }
          state = state.match;
          break;
        case "MatchOnce":
          state = {
            type: "MatchOnceBuffer",
            syntax: state,
            index: 0,
            mask: 0
          };
          break;
        case "MatchOnceBuffer":
          var terms = state.syntax.terms;
          if (state.index === terms.length) {
            if (state.mask === 0 || state.syntax.all) {
              state = MISMATCH;
              break;
            }
            state = MATCH;
            break;
          }
          if (state.mask === (1 << terms.length) - 1) {
            state = MATCH;
            break;
          }
          for (; state.index < terms.length; state.index++) {
            var matchFlag = 1 << state.index;
            if ((state.mask & matchFlag) === 0) {
              pushElseStack(state);
              pushThenStack({
                type: "AddMatchOnce",
                syntax: state.syntax,
                mask: state.mask | matchFlag
              });
              state = terms[state.index++];
              break;
            }
          }
          break;
        case "AddMatchOnce":
          state = {
            type: "MatchOnceBuffer",
            syntax: state.syntax,
            index: 0,
            mask: state.mask
          };
          break;
        case "Enum":
          if (token !== null) {
            var name = token.value.toLowerCase();
            if (name.indexOf("\\") !== -1) {
              name = name.replace(/\\[09].*$/, "");
            }
            if (hasOwnProperty2.call(state.map, name)) {
              state = state.map[name];
              break;
            }
          }
          state = MISMATCH;
          break;
        case "Generic":
          var opts = syntaxStack !== null ? syntaxStack.opts : null;
          var lastTokenIndex = tokenIndex + Math.floor(state.fn(token, getNextToken, opts));
          if (!isNaN(lastTokenIndex) && lastTokenIndex > tokenIndex) {
            while (tokenIndex < lastTokenIndex) {
              addTokenToMatch();
            }
            state = MATCH;
          } else {
            state = MISMATCH;
          }
          break;
        case "Type":
        case "Property":
          var syntaxDict = state.type === "Type" ? "types" : "properties";
          var dictSyntax = hasOwnProperty2.call(syntaxes, syntaxDict) ? syntaxes[syntaxDict][state.name] : null;
          if (!dictSyntax || !dictSyntax.match) {
            throw new Error("Bad syntax reference: " + (state.type === "Type" ? "<" + state.name + ">" : "<'" + state.name + "'>"));
          }
          if (syntaxStash !== false && token !== null && state.type === "Type") {
            var lowPriorityMatching = state.name === "custom-ident" && token.type === TYPE2.Ident || state.name === "length" && token.value === "0";
            if (lowPriorityMatching) {
              if (syntaxStash === null) {
                syntaxStash = stateSnapshotFromSyntax(state, elseStack);
              }
              state = MISMATCH;
              break;
            }
          }
          openSyntax();
          state = dictSyntax.match;
          break;
        case "Keyword":
          var name = state.name;
          if (token !== null) {
            var keywordName = token.value;
            if (keywordName.indexOf("\\") !== -1) {
              keywordName = keywordName.replace(/\\[09].*$/, "");
            }
            if (areStringsEqualCaseInsensitive(keywordName, name)) {
              addTokenToMatch();
              state = MATCH;
              break;
            }
          }
          state = MISMATCH;
          break;
        case "AtKeyword":
        case "Function":
          if (token !== null && areStringsEqualCaseInsensitive(token.value, state.name)) {
            addTokenToMatch();
            state = MATCH;
            break;
          }
          state = MISMATCH;
          break;
        case "Token":
          if (token !== null && token.value === state.value) {
            addTokenToMatch();
            state = MATCH;
            break;
          }
          state = MISMATCH;
          break;
        case "Comma":
          if (token !== null && token.type === TYPE2.Comma) {
            if (isCommaContextStart(matchStack.token)) {
              state = MISMATCH;
            } else {
              addTokenToMatch();
              state = isCommaContextEnd(token) ? MISMATCH : MATCH;
            }
          } else {
            state = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? MATCH : MISMATCH;
          }
          break;
        case "String":
          var string = "";
          for (var lastTokenIndex = tokenIndex; lastTokenIndex < tokens.length && string.length < state.value.length; lastTokenIndex++) {
            string += tokens[lastTokenIndex].value;
          }
          if (areStringsEqualCaseInsensitive(string, state.value)) {
            while (tokenIndex < lastTokenIndex) {
              addTokenToMatch();
            }
            state = MATCH;
          } else {
            state = MISMATCH;
          }
          break;
        default:
          throw new Error("Unknown node type: " + state.type);
      }
    }
    totalIterationCount += iterationCount;
    switch (exitReason) {
      case null:
        console.warn("[csstree-match] BREAK after " + ITERATION_LIMIT + " iterations");
        exitReason = EXIT_REASON_ITERATION_LIMIT;
        matchStack = null;
        break;
      case EXIT_REASON_MATCH:
        while (syntaxStack !== null) {
          closeSyntax();
        }
        break;
      default:
        matchStack = null;
    }
    return {
      tokens,
      reason: exitReason,
      iterations: iterationCount,
      match: matchStack,
      longestMatch
    };
  }
  function matchAsList(tokens, matchGraph2, syntaxes) {
    var matchResult = internalMatch(tokens, matchGraph2, syntaxes || {});
    if (matchResult.match !== null) {
      var item = reverseList(matchResult.match).prev;
      matchResult.match = [];
      while (item !== null) {
        switch (item.type) {
          case STUB:
            break;
          case OPEN_SYNTAX:
          case CLOSE_SYNTAX:
            matchResult.match.push({
              type: item.type,
              syntax: item.syntax
            });
            break;
          default:
            matchResult.match.push({
              token: item.token.value,
              node: item.token.node
            });
            break;
        }
        item = item.prev;
      }
    }
    return matchResult;
  }
  function matchAsTree(tokens, matchGraph2, syntaxes) {
    var matchResult = internalMatch(tokens, matchGraph2, syntaxes || {});
    if (matchResult.match === null) {
      return matchResult;
    }
    var item = matchResult.match;
    var host = matchResult.match = {
      syntax: matchGraph2.syntax || null,
      match: []
    };
    var hostStack = [host];
    item = reverseList(item).prev;
    while (item !== null) {
      switch (item.type) {
        case OPEN_SYNTAX:
          host.match.push(host = {
            syntax: item.syntax,
            match: []
          });
          hostStack.push(host);
          break;
        case CLOSE_SYNTAX:
          hostStack.pop();
          host = hostStack[hostStack.length - 1];
          break;
        default:
          host.match.push({
            syntax: item.syntax || null,
            token: item.token.value,
            node: item.token.node
          });
      }
      item = item.prev;
    }
    return matchResult;
  }
  module2.exports = {
    matchAsList,
    matchAsTree,
    getTotalIterationCount: function() {
      return totalIterationCount;
    }
  };
});

// node_modules/css-tree/lib/lexer/trace.js
var require_trace = __commonJS((exports2, module2) => {
  function getTrace(node) {
    function shouldPutToTrace(syntax) {
      if (syntax === null) {
        return false;
      }
      return syntax.type === "Type" || syntax.type === "Property" || syntax.type === "Keyword";
    }
    function hasMatch(matchNode) {
      if (Array.isArray(matchNode.match)) {
        for (var i = 0; i < matchNode.match.length; i++) {
          if (hasMatch(matchNode.match[i])) {
            if (shouldPutToTrace(matchNode.syntax)) {
              result.unshift(matchNode.syntax);
            }
            return true;
          }
        }
      } else if (matchNode.node === node) {
        result = shouldPutToTrace(matchNode.syntax) ? [matchNode.syntax] : [];
        return true;
      }
      return false;
    }
    var result = null;
    if (this.matched !== null) {
      hasMatch(this.matched);
    }
    return result;
  }
  function testNode(match, node, fn) {
    var trace = getTrace.call(match, node);
    if (trace === null) {
      return false;
    }
    return trace.some(fn);
  }
  function isType(node, type) {
    return testNode(this, node, function(matchNode) {
      return matchNode.type === "Type" && matchNode.name === type;
    });
  }
  function isProperty(node, property) {
    return testNode(this, node, function(matchNode) {
      return matchNode.type === "Property" && matchNode.name === property;
    });
  }
  function isKeyword(node) {
    return testNode(this, node, function(matchNode) {
      return matchNode.type === "Keyword";
    });
  }
  module2.exports = {
    getTrace,
    isType,
    isProperty,
    isKeyword
  };
});

// node_modules/css-tree/lib/lexer/search.js
var require_search = __commonJS((exports2, module2) => {
  var List = require_List();
  function getFirstMatchNode(matchNode) {
    if ("node" in matchNode) {
      return matchNode.node;
    }
    return getFirstMatchNode(matchNode.match[0]);
  }
  function getLastMatchNode(matchNode) {
    if ("node" in matchNode) {
      return matchNode.node;
    }
    return getLastMatchNode(matchNode.match[matchNode.match.length - 1]);
  }
  function matchFragments(lexer, ast, match, type, name) {
    function findFragments(matchNode) {
      if (matchNode.syntax !== null && matchNode.syntax.type === type && matchNode.syntax.name === name) {
        var start = getFirstMatchNode(matchNode);
        var end = getLastMatchNode(matchNode);
        lexer.syntax.walk(ast, function(node, item, list) {
          if (node === start) {
            var nodes = new List();
            do {
              nodes.appendData(item.data);
              if (item.data === end) {
                break;
              }
              item = item.next;
            } while (item !== null);
            fragments.push({
              parent: list,
              nodes
            });
          }
        });
      }
      if (Array.isArray(matchNode.match)) {
        matchNode.match.forEach(findFragments);
      }
    }
    var fragments = [];
    if (match.matched !== null) {
      findFragments(match.matched);
    }
    return fragments;
  }
  module2.exports = {
    matchFragments
  };
});

// node_modules/css-tree/lib/lexer/structure.js
var require_structure = __commonJS((exports2, module2) => {
  var List = require_List();
  var hasOwnProperty2 = Object.prototype.hasOwnProperty;
  function isValidNumber(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value && value >= 0;
  }
  function isValidLocation(loc) {
    return Boolean(loc) && isValidNumber(loc.offset) && isValidNumber(loc.line) && isValidNumber(loc.column);
  }
  function createNodeStructureChecker(type, fields) {
    return function checkNode(node, warn) {
      if (!node || node.constructor !== Object) {
        return warn(node, "Type of node should be an Object");
      }
      for (var key in node) {
        var valid = true;
        if (hasOwnProperty2.call(node, key) === false) {
          continue;
        }
        if (key === "type") {
          if (node.type !== type) {
            warn(node, "Wrong node type `" + node.type + "`, expected `" + type + "`");
          }
        } else if (key === "loc") {
          if (node.loc === null) {
            continue;
          } else if (node.loc && node.loc.constructor === Object) {
            if (typeof node.loc.source !== "string") {
              key += ".source";
            } else if (!isValidLocation(node.loc.start)) {
              key += ".start";
            } else if (!isValidLocation(node.loc.end)) {
              key += ".end";
            } else {
              continue;
            }
          }
          valid = false;
        } else if (fields.hasOwnProperty(key)) {
          for (var i = 0, valid = false; !valid && i < fields[key].length; i++) {
            var fieldType = fields[key][i];
            switch (fieldType) {
              case String:
                valid = typeof node[key] === "string";
                break;
              case Boolean:
                valid = typeof node[key] === "boolean";
                break;
              case null:
                valid = node[key] === null;
                break;
              default:
                if (typeof fieldType === "string") {
                  valid = node[key] && node[key].type === fieldType;
                } else if (Array.isArray(fieldType)) {
                  valid = node[key] instanceof List;
                }
            }
          }
        } else {
          warn(node, "Unknown field `" + key + "` for " + type + " node type");
        }
        if (!valid) {
          warn(node, "Bad value for `" + type + "." + key + "`");
        }
      }
      for (var key in fields) {
        if (hasOwnProperty2.call(fields, key) && hasOwnProperty2.call(node, key) === false) {
          warn(node, "Field `" + type + "." + key + "` is missed");
        }
      }
    };
  }
  function processStructure(name, nodeType) {
    var structure = nodeType.structure;
    var fields = {
      type: String,
      loc: true
    };
    var docs = {
      type: '"' + name + '"'
    };
    for (var key in structure) {
      if (hasOwnProperty2.call(structure, key) === false) {
        continue;
      }
      var docsTypes = [];
      var fieldTypes = fields[key] = Array.isArray(structure[key]) ? structure[key].slice() : [structure[key]];
      for (var i = 0; i < fieldTypes.length; i++) {
        var fieldType = fieldTypes[i];
        if (fieldType === String || fieldType === Boolean) {
          docsTypes.push(fieldType.name);
        } else if (fieldType === null) {
          docsTypes.push("null");
        } else if (typeof fieldType === "string") {
          docsTypes.push("<" + fieldType + ">");
        } else if (Array.isArray(fieldType)) {
          docsTypes.push("List");
        } else {
          throw new Error("Wrong value `" + fieldType + "` in `" + name + "." + key + "` structure definition");
        }
      }
      docs[key] = docsTypes.join(" | ");
    }
    return {
      docs,
      check: createNodeStructureChecker(name, fields)
    };
  }
  module2.exports = {
    getStructureFromConfig: function(config) {
      var structure = {};
      if (config.node) {
        for (var name in config.node) {
          if (hasOwnProperty2.call(config.node, name)) {
            var nodeType = config.node[name];
            if (nodeType.structure) {
              structure[name] = processStructure(name, nodeType);
            } else {
              throw new Error("Missed `structure` field in `" + name + "` node type definition");
            }
          }
        }
      }
      return structure;
    }
  };
});

// node_modules/css-tree/lib/lexer/Lexer.js
var require_Lexer = __commonJS((exports2, module2) => {
  var SyntaxReferenceError = require_error().SyntaxReferenceError;
  var SyntaxMatchError = require_error().SyntaxMatchError;
  var names = require_names();
  var generic = require_generic();
  var parse2 = require_parse();
  var generate = require_generate();
  var walk2 = require_walk();
  var prepareTokens = require_prepare_tokens();
  var buildMatchGraph = require_match_graph().buildMatchGraph;
  var matchAsTree = require_match().matchAsTree;
  var trace = require_trace();
  var search = require_search();
  var getStructureFromConfig = require_structure().getStructureFromConfig;
  var cssWideKeywords = buildMatchGraph("inherit | initial | unset");
  var cssWideKeywordsWithExpression = buildMatchGraph("inherit | initial | unset | <-ms-legacy-expression>");
  function dumpMapSyntax(map, compact, syntaxAsAst) {
    var result = {};
    for (var name in map) {
      if (map[name].syntax) {
        result[name] = syntaxAsAst ? map[name].syntax : generate(map[name].syntax, {compact});
      }
    }
    return result;
  }
  function dumpAtruleMapSyntax(map, compact, syntaxAsAst) {
    const result = {};
    for (const [name, atrule] of Object.entries(map)) {
      result[name] = {
        prelude: atrule.prelude && (syntaxAsAst ? atrule.prelude.syntax : generate(atrule.prelude.syntax, {compact})),
        descriptors: atrule.descriptors && dumpMapSyntax(atrule.descriptors, compact, syntaxAsAst)
      };
    }
    return result;
  }
  function valueHasVar(tokens) {
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].value.toLowerCase() === "var(") {
        return true;
      }
    }
    return false;
  }
  function buildMatchResult(match, error, iterations) {
    return {
      matched: match,
      iterations,
      error,
      getTrace: trace.getTrace,
      isType: trace.isType,
      isProperty: trace.isProperty,
      isKeyword: trace.isKeyword
    };
  }
  function matchSyntax(lexer, syntax, value, useCommon) {
    var tokens = prepareTokens(value, lexer.syntax);
    var result;
    if (valueHasVar(tokens)) {
      return buildMatchResult(null, new Error("Matching for a tree with var() is not supported"));
    }
    if (useCommon) {
      result = matchAsTree(tokens, lexer.valueCommonSyntax, lexer);
    }
    if (!useCommon || !result.match) {
      result = matchAsTree(tokens, syntax.match, lexer);
      if (!result.match) {
        return buildMatchResult(null, new SyntaxMatchError(result.reason, syntax.syntax, value, result), result.iterations);
      }
    }
    return buildMatchResult(result.match, null, result.iterations);
  }
  var Lexer = function(config, syntax, structure) {
    this.valueCommonSyntax = cssWideKeywords;
    this.syntax = syntax;
    this.generic = false;
    this.atrules = {};
    this.properties = {};
    this.types = {};
    this.structure = structure || getStructureFromConfig(config);
    if (config) {
      if (config.types) {
        for (var name in config.types) {
          this.addType_(name, config.types[name]);
        }
      }
      if (config.generic) {
        this.generic = true;
        for (var name in generic) {
          this.addType_(name, generic[name]);
        }
      }
      if (config.atrules) {
        for (var name in config.atrules) {
          this.addAtrule_(name, config.atrules[name]);
        }
      }
      if (config.properties) {
        for (var name in config.properties) {
          this.addProperty_(name, config.properties[name]);
        }
      }
    }
  };
  Lexer.prototype = {
    structure: {},
    checkStructure: function(ast) {
      function collectWarning(node, message) {
        warns.push({
          node,
          message
        });
      }
      var structure = this.structure;
      var warns = [];
      this.syntax.walk(ast, function(node) {
        if (structure.hasOwnProperty(node.type)) {
          structure[node.type].check(node, collectWarning);
        } else {
          collectWarning(node, "Unknown node type `" + node.type + "`");
        }
      });
      return warns.length ? warns : false;
    },
    createDescriptor: function(syntax, type, name, parent = null) {
      var ref = {
        type,
        name
      };
      var descriptor = {
        type,
        name,
        parent,
        syntax: null,
        match: null
      };
      if (typeof syntax === "function") {
        descriptor.match = buildMatchGraph(syntax, ref);
      } else {
        if (typeof syntax === "string") {
          Object.defineProperty(descriptor, "syntax", {
            get: function() {
              Object.defineProperty(descriptor, "syntax", {
                value: parse2(syntax)
              });
              return descriptor.syntax;
            }
          });
        } else {
          descriptor.syntax = syntax;
        }
        Object.defineProperty(descriptor, "match", {
          get: function() {
            Object.defineProperty(descriptor, "match", {
              value: buildMatchGraph(descriptor.syntax, ref)
            });
            return descriptor.match;
          }
        });
      }
      return descriptor;
    },
    addAtrule_: function(name, syntax) {
      if (!syntax) {
        return;
      }
      this.atrules[name] = {
        type: "Atrule",
        name,
        prelude: syntax.prelude ? this.createDescriptor(syntax.prelude, "AtrulePrelude", name) : null,
        descriptors: syntax.descriptors ? Object.keys(syntax.descriptors).reduce((res, descName) => {
          res[descName] = this.createDescriptor(syntax.descriptors[descName], "AtruleDescriptor", descName, name);
          return res;
        }, {}) : null
      };
    },
    addProperty_: function(name, syntax) {
      if (!syntax) {
        return;
      }
      this.properties[name] = this.createDescriptor(syntax, "Property", name);
    },
    addType_: function(name, syntax) {
      if (!syntax) {
        return;
      }
      this.types[name] = this.createDescriptor(syntax, "Type", name);
      if (syntax === generic["-ms-legacy-expression"]) {
        this.valueCommonSyntax = cssWideKeywordsWithExpression;
      }
    },
    checkAtruleName: function(atruleName) {
      if (!this.getAtrule(atruleName)) {
        return new SyntaxReferenceError("Unknown at-rule", "@" + atruleName);
      }
    },
    checkAtrulePrelude: function(atruleName, prelude) {
      let error = this.checkAtruleName(atruleName);
      if (error) {
        return error;
      }
      var atrule = this.getAtrule(atruleName);
      if (!atrule.prelude && prelude) {
        return new SyntaxError("At-rule `@" + atruleName + "` should not contain a prelude");
      }
      if (atrule.prelude && !prelude) {
        return new SyntaxError("At-rule `@" + atruleName + "` should contain a prelude");
      }
    },
    checkAtruleDescriptorName: function(atruleName, descriptorName) {
      let error = this.checkAtruleName(atruleName);
      if (error) {
        return error;
      }
      var atrule = this.getAtrule(atruleName);
      var descriptor = names.keyword(descriptorName);
      if (!atrule.descriptors) {
        return new SyntaxError("At-rule `@" + atruleName + "` has no known descriptors");
      }
      if (!atrule.descriptors[descriptor.name] && !atrule.descriptors[descriptor.basename]) {
        return new SyntaxReferenceError("Unknown at-rule descriptor", descriptorName);
      }
    },
    checkPropertyName: function(propertyName) {
      var property = names.property(propertyName);
      if (property.custom) {
        return new Error("Lexer matching doesn't applicable for custom properties");
      }
      if (!this.getProperty(propertyName)) {
        return new SyntaxReferenceError("Unknown property", propertyName);
      }
    },
    matchAtrulePrelude: function(atruleName, prelude) {
      var error = this.checkAtrulePrelude(atruleName, prelude);
      if (error) {
        return buildMatchResult(null, error);
      }
      if (!prelude) {
        return buildMatchResult(null, null);
      }
      return matchSyntax(this, this.getAtrule(atruleName).prelude, prelude, true);
    },
    matchAtruleDescriptor: function(atruleName, descriptorName, value) {
      var error = this.checkAtruleDescriptorName(atruleName, descriptorName);
      if (error) {
        return buildMatchResult(null, error);
      }
      var atrule = this.getAtrule(atruleName);
      var descriptor = names.keyword(descriptorName);
      return matchSyntax(this, atrule.descriptors[descriptor.name] || atrule.descriptors[descriptor.basename], value, true);
    },
    matchDeclaration: function(node) {
      if (node.type !== "Declaration") {
        return buildMatchResult(null, new Error("Not a Declaration node"));
      }
      return this.matchProperty(node.property, node.value);
    },
    matchProperty: function(propertyName, value) {
      var error = this.checkPropertyName(propertyName);
      if (error) {
        return buildMatchResult(null, error);
      }
      return matchSyntax(this, this.getProperty(propertyName), value, true);
    },
    matchType: function(typeName, value) {
      var typeSyntax = this.getType(typeName);
      if (!typeSyntax) {
        return buildMatchResult(null, new SyntaxReferenceError("Unknown type", typeName));
      }
      return matchSyntax(this, typeSyntax, value, false);
    },
    match: function(syntax, value) {
      if (typeof syntax !== "string" && (!syntax || !syntax.type)) {
        return buildMatchResult(null, new SyntaxReferenceError("Bad syntax"));
      }
      if (typeof syntax === "string" || !syntax.match) {
        syntax = this.createDescriptor(syntax, "Type", "anonymous");
      }
      return matchSyntax(this, syntax, value, false);
    },
    findValueFragments: function(propertyName, value, type, name) {
      return search.matchFragments(this, value, this.matchProperty(propertyName, value), type, name);
    },
    findDeclarationValueFragments: function(declaration, type, name) {
      return search.matchFragments(this, declaration.value, this.matchDeclaration(declaration), type, name);
    },
    findAllFragments: function(ast, type, name) {
      var result = [];
      this.syntax.walk(ast, {
        visit: "Declaration",
        enter: function(declaration) {
          result.push.apply(result, this.findDeclarationValueFragments(declaration, type, name));
        }.bind(this)
      });
      return result;
    },
    getAtrule: function(atruleName, fallbackBasename = true) {
      var atrule = names.keyword(atruleName);
      var atruleEntry = atrule.vendor && fallbackBasename ? this.atrules[atrule.name] || this.atrules[atrule.basename] : this.atrules[atrule.name];
      return atruleEntry || null;
    },
    getAtrulePrelude: function(atruleName, fallbackBasename = true) {
      const atrule = this.getAtrule(atruleName, fallbackBasename);
      return atrule && atrule.prelude || null;
    },
    getAtruleDescriptor: function(atruleName, name) {
      return this.atrules.hasOwnProperty(atruleName) && this.atrules.declarators ? this.atrules[atruleName].declarators[name] || null : null;
    },
    getProperty: function(propertyName, fallbackBasename = true) {
      var property = names.property(propertyName);
      var propertyEntry = property.vendor && fallbackBasename ? this.properties[property.name] || this.properties[property.basename] : this.properties[property.name];
      return propertyEntry || null;
    },
    getType: function(name) {
      return this.types.hasOwnProperty(name) ? this.types[name] : null;
    },
    validate: function() {
      function validate(syntax, name, broken, descriptor) {
        if (broken.hasOwnProperty(name)) {
          return broken[name];
        }
        broken[name] = false;
        if (descriptor.syntax !== null) {
          walk2(descriptor.syntax, function(node) {
            if (node.type !== "Type" && node.type !== "Property") {
              return;
            }
            var map = node.type === "Type" ? syntax.types : syntax.properties;
            var brokenMap = node.type === "Type" ? brokenTypes : brokenProperties;
            if (!map.hasOwnProperty(node.name) || validate(syntax, node.name, brokenMap, map[node.name])) {
              broken[name] = true;
            }
          }, this);
        }
      }
      var brokenTypes = {};
      var brokenProperties = {};
      for (var key in this.types) {
        validate(this, key, brokenTypes, this.types[key]);
      }
      for (var key in this.properties) {
        validate(this, key, brokenProperties, this.properties[key]);
      }
      brokenTypes = Object.keys(brokenTypes).filter(function(name) {
        return brokenTypes[name];
      });
      brokenProperties = Object.keys(brokenProperties).filter(function(name) {
        return brokenProperties[name];
      });
      if (brokenTypes.length || brokenProperties.length) {
        return {
          types: brokenTypes,
          properties: brokenProperties
        };
      }
      return null;
    },
    dump: function(syntaxAsAst, pretty) {
      return {
        generic: this.generic,
        types: dumpMapSyntax(this.types, !pretty, syntaxAsAst),
        properties: dumpMapSyntax(this.properties, !pretty, syntaxAsAst),
        atrules: dumpAtruleMapSyntax(this.atrules, !pretty, syntaxAsAst)
      };
    },
    toString: function() {
      return JSON.stringify(this.dump());
    }
  };
  module2.exports = Lexer;
});

// node_modules/css-tree/lib/definition-syntax/index.js
var require_definition_syntax = __commonJS((exports2, module2) => {
  module2.exports = {
    SyntaxError: require_SyntaxError2(),
    parse: require_parse(),
    generate: require_generate(),
    walk: require_walk()
  };
});

// node_modules/css-tree/lib/common/OffsetToLocation.js
var require_OffsetToLocation = __commonJS((exports2, module2) => {
  var adoptBuffer = require_adopt_buffer();
  var isBOM = require_tokenizer().isBOM;
  var N = 10;
  var F = 12;
  var R = 13;
  function computeLinesAndColumns(host, source) {
    var sourceLength = source.length;
    var lines = adoptBuffer(host.lines, sourceLength);
    var line = host.startLine;
    var columns = adoptBuffer(host.columns, sourceLength);
    var column = host.startColumn;
    var startOffset = source.length > 0 ? isBOM(source.charCodeAt(0)) : 0;
    for (var i = startOffset; i < sourceLength; i++) {
      var code = source.charCodeAt(i);
      lines[i] = line;
      columns[i] = column++;
      if (code === N || code === R || code === F) {
        if (code === R && i + 1 < sourceLength && source.charCodeAt(i + 1) === N) {
          i++;
          lines[i] = line;
          columns[i] = column;
        }
        line++;
        column = 1;
      }
    }
    lines[i] = line;
    columns[i] = column;
    host.lines = lines;
    host.columns = columns;
  }
  var OffsetToLocation = function() {
    this.lines = null;
    this.columns = null;
    this.linesAndColumnsComputed = false;
  };
  OffsetToLocation.prototype = {
    setSource: function(source, startOffset, startLine, startColumn) {
      this.source = source;
      this.startOffset = typeof startOffset === "undefined" ? 0 : startOffset;
      this.startLine = typeof startLine === "undefined" ? 1 : startLine;
      this.startColumn = typeof startColumn === "undefined" ? 1 : startColumn;
      this.linesAndColumnsComputed = false;
    },
    ensureLinesAndColumnsComputed: function() {
      if (!this.linesAndColumnsComputed) {
        computeLinesAndColumns(this, this.source);
        this.linesAndColumnsComputed = true;
      }
    },
    getLocation: function(offset, filename) {
      this.ensureLinesAndColumnsComputed();
      return {
        source: filename,
        offset: this.startOffset + offset,
        line: this.lines[offset],
        column: this.columns[offset]
      };
    },
    getLocationRange: function(start, end, filename) {
      this.ensureLinesAndColumnsComputed();
      return {
        source: filename,
        start: {
          offset: this.startOffset + start,
          line: this.lines[start],
          column: this.columns[start]
        },
        end: {
          offset: this.startOffset + end,
          line: this.lines[end],
          column: this.columns[end]
        }
      };
    }
  };
  module2.exports = OffsetToLocation;
});

// node_modules/css-tree/lib/parser/sequence.js
var require_sequence = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var WHITESPACE = TYPE2.WhiteSpace;
  var COMMENT = TYPE2.Comment;
  module2.exports = function readSequence(recognizer) {
    var children = this.createList();
    var child = null;
    var context = {
      recognizer,
      space: null,
      ignoreWS: false,
      ignoreWSAfter: false
    };
    this.scanner.skipSC();
    while (!this.scanner.eof) {
      switch (this.scanner.tokenType) {
        case COMMENT:
          this.scanner.next();
          continue;
        case WHITESPACE:
          if (context.ignoreWS) {
            this.scanner.next();
          } else {
            context.space = this.WhiteSpace();
          }
          continue;
      }
      child = recognizer.getNode.call(this, context);
      if (child === void 0) {
        break;
      }
      if (context.space !== null) {
        children.push(context.space);
        context.space = null;
      }
      children.push(child);
      if (context.ignoreWSAfter) {
        context.ignoreWSAfter = false;
        context.ignoreWS = true;
      } else {
        context.ignoreWS = false;
      }
    }
    return children;
  };
});

// node_modules/css-tree/lib/parser/create.js
var require_create = __commonJS((exports2, module2) => {
  var OffsetToLocation = require_OffsetToLocation();
  var SyntaxError2 = require_SyntaxError();
  var TokenStream = require_TokenStream();
  var List = require_List();
  var tokenize = require_tokenizer();
  var constants = require_const();
  var {findWhiteSpaceStart, cmpStr} = require_utils();
  var sequence = require_sequence();
  var noop = function() {
  };
  var TYPE2 = constants.TYPE;
  var NAME = constants.NAME;
  var WHITESPACE = TYPE2.WhiteSpace;
  var COMMENT = TYPE2.Comment;
  var IDENT = TYPE2.Ident;
  var FUNCTION = TYPE2.Function;
  var URL = TYPE2.Url;
  var HASH = TYPE2.Hash;
  var PERCENTAGE = TYPE2.Percentage;
  var NUMBER = TYPE2.Number;
  var NUMBERSIGN = 35;
  var NULL = 0;
  function createParseContext(name) {
    return function() {
      return this[name]();
    };
  }
  function processConfig(config) {
    var parserConfig = {
      context: {},
      scope: {},
      atrule: {},
      pseudo: {}
    };
    if (config.parseContext) {
      for (var name in config.parseContext) {
        switch (typeof config.parseContext[name]) {
          case "function":
            parserConfig.context[name] = config.parseContext[name];
            break;
          case "string":
            parserConfig.context[name] = createParseContext(config.parseContext[name]);
            break;
        }
      }
    }
    if (config.scope) {
      for (var name in config.scope) {
        parserConfig.scope[name] = config.scope[name];
      }
    }
    if (config.atrule) {
      for (var name in config.atrule) {
        var atrule = config.atrule[name];
        if (atrule.parse) {
          parserConfig.atrule[name] = atrule.parse;
        }
      }
    }
    if (config.pseudo) {
      for (var name in config.pseudo) {
        var pseudo = config.pseudo[name];
        if (pseudo.parse) {
          parserConfig.pseudo[name] = pseudo.parse;
        }
      }
    }
    if (config.node) {
      for (var name in config.node) {
        parserConfig[name] = config.node[name].parse;
      }
    }
    return parserConfig;
  }
  module2.exports = function createParser(config) {
    var parser = {
      scanner: new TokenStream(),
      locationMap: new OffsetToLocation(),
      filename: "<unknown>",
      needPositions: false,
      onParseError: noop,
      onParseErrorThrow: false,
      parseAtrulePrelude: true,
      parseRulePrelude: true,
      parseValue: true,
      parseCustomProperty: false,
      readSequence: sequence,
      createList: function() {
        return new List();
      },
      createSingleNodeList: function(node) {
        return new List().appendData(node);
      },
      getFirstListNode: function(list) {
        return list && list.first();
      },
      getLastListNode: function(list) {
        return list.last();
      },
      parseWithFallback: function(consumer, fallback) {
        var startToken = this.scanner.tokenIndex;
        try {
          return consumer.call(this);
        } catch (e) {
          if (this.onParseErrorThrow) {
            throw e;
          }
          var fallbackNode = fallback.call(this, startToken);
          this.onParseErrorThrow = true;
          this.onParseError(e, fallbackNode);
          this.onParseErrorThrow = false;
          return fallbackNode;
        }
      },
      lookupNonWSType: function(offset) {
        do {
          var type = this.scanner.lookupType(offset++);
          if (type !== WHITESPACE) {
            return type;
          }
        } while (type !== NULL);
        return NULL;
      },
      eat: function(tokenType) {
        if (this.scanner.tokenType !== tokenType) {
          var offset = this.scanner.tokenStart;
          var message = NAME[tokenType] + " is expected";
          switch (tokenType) {
            case IDENT:
              if (this.scanner.tokenType === FUNCTION || this.scanner.tokenType === URL) {
                offset = this.scanner.tokenEnd - 1;
                message = "Identifier is expected but function found";
              } else {
                message = "Identifier is expected";
              }
              break;
            case HASH:
              if (this.scanner.isDelim(NUMBERSIGN)) {
                this.scanner.next();
                offset++;
                message = "Name is expected";
              }
              break;
            case PERCENTAGE:
              if (this.scanner.tokenType === NUMBER) {
                offset = this.scanner.tokenEnd;
                message = "Percent sign is expected";
              }
              break;
            default:
              if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === tokenType) {
                offset = offset + 1;
              }
          }
          this.error(message, offset);
        }
        this.scanner.next();
      },
      consume: function(tokenType) {
        var value = this.scanner.getTokenValue();
        this.eat(tokenType);
        return value;
      },
      consumeFunctionName: function() {
        var name = this.scanner.source.substring(this.scanner.tokenStart, this.scanner.tokenEnd - 1);
        this.eat(FUNCTION);
        return name;
      },
      getLocation: function(start, end) {
        if (this.needPositions) {
          return this.locationMap.getLocationRange(start, end, this.filename);
        }
        return null;
      },
      getLocationFromList: function(list) {
        if (this.needPositions) {
          var head = this.getFirstListNode(list);
          var tail = this.getLastListNode(list);
          return this.locationMap.getLocationRange(head !== null ? head.loc.start.offset - this.locationMap.startOffset : this.scanner.tokenStart, tail !== null ? tail.loc.end.offset - this.locationMap.startOffset : this.scanner.tokenStart, this.filename);
        }
        return null;
      },
      error: function(message, offset) {
        var location = typeof offset !== "undefined" && offset < this.scanner.source.length ? this.locationMap.getLocation(offset) : this.scanner.eof ? this.locationMap.getLocation(findWhiteSpaceStart(this.scanner.source, this.scanner.source.length - 1)) : this.locationMap.getLocation(this.scanner.tokenStart);
        throw new SyntaxError2(message || "Unexpected input", this.scanner.source, location.offset, location.line, location.column);
      }
    };
    config = processConfig(config || {});
    for (var key in config) {
      parser[key] = config[key];
    }
    return function(source, options) {
      options = options || {};
      var context = options.context || "default";
      var onComment = options.onComment;
      var ast;
      tokenize(source, parser.scanner);
      parser.locationMap.setSource(source, options.offset, options.line, options.column);
      parser.filename = options.filename || "<unknown>";
      parser.needPositions = Boolean(options.positions);
      parser.onParseError = typeof options.onParseError === "function" ? options.onParseError : noop;
      parser.onParseErrorThrow = false;
      parser.parseAtrulePrelude = "parseAtrulePrelude" in options ? Boolean(options.parseAtrulePrelude) : true;
      parser.parseRulePrelude = "parseRulePrelude" in options ? Boolean(options.parseRulePrelude) : true;
      parser.parseValue = "parseValue" in options ? Boolean(options.parseValue) : true;
      parser.parseCustomProperty = "parseCustomProperty" in options ? Boolean(options.parseCustomProperty) : false;
      if (!parser.context.hasOwnProperty(context)) {
        throw new Error("Unknown context `" + context + "`");
      }
      if (typeof onComment === "function") {
        parser.scanner.forEachToken((type, start, end) => {
          if (type === COMMENT) {
            const loc = parser.getLocation(start, end);
            const value = cmpStr(source, end - 2, end, "*/") ? source.slice(start + 2, end - 2) : source.slice(start + 2, end);
            onComment(value, loc);
          }
        });
      }
      ast = parser.context[context].call(parser, options);
      if (!parser.scanner.eof) {
        parser.error();
      }
      return ast;
    };
  };
});

// node_modules/source-map/lib/base64.js
var require_base64 = __commonJS((exports2) => {
  var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  exports2.encode = function(number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }
    throw new TypeError("Must be between 0 and 63: " + number);
  };
  exports2.decode = function(charCode) {
    var bigA = 65;
    var bigZ = 90;
    var littleA = 97;
    var littleZ = 122;
    var zero = 48;
    var nine = 57;
    var plus = 43;
    var slash = 47;
    var littleOffset = 26;
    var numberOffset = 52;
    if (bigA <= charCode && charCode <= bigZ) {
      return charCode - bigA;
    }
    if (littleA <= charCode && charCode <= littleZ) {
      return charCode - littleA + littleOffset;
    }
    if (zero <= charCode && charCode <= nine) {
      return charCode - zero + numberOffset;
    }
    if (charCode == plus) {
      return 62;
    }
    if (charCode == slash) {
      return 63;
    }
    return -1;
  };
});

// node_modules/source-map/lib/base64-vlq.js
var require_base64_vlq = __commonJS((exports2) => {
  var base64 = require_base64();
  var VLQ_BASE_SHIFT = 5;
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
  var VLQ_BASE_MASK = VLQ_BASE - 1;
  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  function toVLQSigned(aValue) {
    return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
  }
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? -shifted : shifted;
  }
  exports2.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);
    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);
    return encoded;
  };
  exports2.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;
    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base64.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);
    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };
});

// node_modules/source-map/lib/util.js
var require_util = __commonJS((exports2) => {
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports2.getArg = getArg;
  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;
  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports2.urlParse = urlParse;
  function urlGenerate(aParsedUrl) {
    var url = "";
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ":";
    }
    url += "//";
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + "@";
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port;
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports2.urlGenerate = urlGenerate;
  function normalize(aPath) {
    var path = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path = url.path;
    }
    var isAbsolute2 = exports2.isAbsolute(path);
    var parts = path.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i];
      if (part === ".") {
        parts.splice(i, 1);
      } else if (part === "..") {
        up++;
      } else if (up > 0) {
        if (part === "") {
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path = parts.join("/");
    if (path === "") {
      path = isAbsolute2 ? "/" : ".";
    }
    if (url) {
      url.path = path;
      return urlGenerate(url);
    }
    return path;
  }
  exports2.normalize = normalize;
  function join2(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    if (aPath === "") {
      aPath = ".";
    }
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || "/";
    }
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }
    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }
    var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports2.join = join2;
  exports2.isAbsolute = function(aPath) {
    return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
  };
  function relative(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    aRoot = aRoot.replace(/\/$/, "");
    var level = 0;
    while (aPath.indexOf(aRoot + "/") !== 0) {
      var index = aRoot.lastIndexOf("/");
      if (index < 0) {
        return aPath;
      }
      aRoot = aRoot.slice(0, index);
      if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
        return aPath;
      }
      ++level;
    }
    return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
  }
  exports2.relative = relative;
  var supportsNullProto = function() {
    var obj = Object.create(null);
    return !("__proto__" in obj);
  }();
  function identity(s) {
    return s;
  }
  function toSetString(aStr) {
    if (isProtoString(aStr)) {
      return "$" + aStr;
    }
    return aStr;
  }
  exports2.toSetString = supportsNullProto ? identity : toSetString;
  function fromSetString(aStr) {
    if (isProtoString(aStr)) {
      return aStr.slice(1);
    }
    return aStr;
  }
  exports2.fromSetString = supportsNullProto ? identity : fromSetString;
  function isProtoString(s) {
    if (!s) {
      return false;
    }
    var length = s.length;
    if (length < 9) {
      return false;
    }
    if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
      return false;
    }
    for (var i = length - 10; i >= 0; i--) {
      if (s.charCodeAt(i) !== 36) {
        return false;
      }
    }
    return true;
  }
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0 || onlyCompareOriginal) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports2.compareByOriginalPositions = compareByOriginalPositions;
  function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0 || onlyCompareGenerated) {
      return cmp;
    }
    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports2.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
  function strcmp(aStr1, aStr2) {
    if (aStr1 === aStr2) {
      return 0;
    }
    if (aStr1 === null) {
      return 1;
    }
    if (aStr2 === null) {
      return -1;
    }
    if (aStr1 > aStr2) {
      return 1;
    }
    return -1;
  }
  function compareByGeneratedPositionsInflated(mappingA, mappingB) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports2.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
  function parseSourceMapInput(str) {
    return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
  }
  exports2.parseSourceMapInput = parseSourceMapInput;
  function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
    sourceURL = sourceURL || "";
    if (sourceRoot) {
      if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
        sourceRoot += "/";
      }
      sourceURL = sourceRoot + sourceURL;
    }
    if (sourceMapURL) {
      var parsed = urlParse(sourceMapURL);
      if (!parsed) {
        throw new Error("sourceMapURL could not be parsed");
      }
      if (parsed.path) {
        var index = parsed.path.lastIndexOf("/");
        if (index >= 0) {
          parsed.path = parsed.path.substring(0, index + 1);
        }
      }
      sourceURL = join2(urlGenerate(parsed), sourceURL);
    }
    return normalize(sourceURL);
  }
  exports2.computeSourceURL = computeSourceURL;
});

// node_modules/source-map/lib/array-set.js
var require_array_set = __commonJS((exports2) => {
  var util = require_util();
  var has = Object.prototype.hasOwnProperty;
  var hasNativeMap = typeof Map !== "undefined";
  function ArraySet() {
    this._array = [];
    this._set = hasNativeMap ? new Map() : Object.create(null);
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };
  ArraySet.prototype.size = function ArraySet_size() {
    return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
    var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      if (hasNativeMap) {
        this._set.set(aStr, idx);
      } else {
        this._set[sStr] = idx;
      }
    }
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    if (hasNativeMap) {
      return this._set.has(aStr);
    } else {
      var sStr = util.toSetString(aStr);
      return has.call(this._set, sStr);
    }
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (hasNativeMap) {
      var idx = this._set.get(aStr);
      if (idx >= 0) {
        return idx;
      }
    } else {
      var sStr = util.toSetString(aStr);
      if (has.call(this._set, sStr)) {
        return this._set[sStr];
      }
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  exports2.ArraySet = ArraySet;
});

// node_modules/source-map/lib/mapping-list.js
var require_mapping_list = __commonJS((exports2) => {
  var util = require_util();
  function generatedPositionAfter(mappingA, mappingB) {
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }
  function MappingList() {
    this._array = [];
    this._sorted = true;
    this._last = {generatedLine: -1, generatedColumn: 0};
  }
  MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };
  MappingList.prototype.add = function MappingList_add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };
  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };
  exports2.MappingList = MappingList;
});

// node_modules/source-map/lib/source-map-generator.js
var require_source_map_generator = __commonJS((exports2) => {
  var base64VLQ = require_base64_vlq();
  var util = require_util();
  var ArraySet = require_array_set().ArraySet;
  var MappingList = require_mapping_list().MappingList;
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, "file", null);
    this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
    this._skipValidation = util.getArg(aArgs, "skipValidation", false);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }
  SourceMapGenerator.prototype._version = 3;
  SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot
    });
    aSourceMapConsumer.eachMapping(function(mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };
      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }
        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };
        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }
      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }
      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };
  SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, "generated");
    var original = util.getArg(aArgs, "original", null);
    var source = util.getArg(aArgs, "source", null);
    var name = util.getArg(aArgs, "name", null);
    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }
    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }
    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }
    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source,
      name
    });
  };
  SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }
    if (aSourceContent != null) {
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };
  SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    var newSources = new ArraySet();
    var newNames = new ArraySet();
    this._mappings.unsortedForEach(function(mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }
      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }
      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }
    }, this);
    this._sources = newSources;
    this._names = newNames;
    aSourceMapConsumer.sources.forEach(function(sourceFile2) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile2 = util.join(aSourceMapPath, sourceFile2);
        }
        if (sourceRoot != null) {
          sourceFile2 = util.relative(sourceRoot, sourceFile2);
        }
        this.setSourceContent(sourceFile2, content);
      }
    }, this);
  };
  SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
    if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
      throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
    }
    if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
      return;
    } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
      return;
    } else {
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };
  SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = "";
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;
    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = "";
      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ";";
          previousGeneratedLine++;
        }
      } else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ",";
        }
      }
      next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;
      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;
        next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;
        next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;
        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }
      result += next;
    }
    return result;
  };
  SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function(source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
    }, this);
  };
  SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }
    return map;
  };
  SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };
  exports2.SourceMapGenerator = SourceMapGenerator;
});

// node_modules/css-tree/lib/generator/sourceMap.js
var require_sourceMap = __commonJS((exports2, module2) => {
  var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
  var trackNodes = {
    Atrule: true,
    Selector: true,
    Declaration: true
  };
  module2.exports = function generateSourceMap(handlers) {
    var map = new SourceMapGenerator();
    var line = 1;
    var column = 0;
    var generated = {
      line: 1,
      column: 0
    };
    var original = {
      line: 0,
      column: 0
    };
    var sourceMappingActive = false;
    var activatedGenerated = {
      line: 1,
      column: 0
    };
    var activatedMapping = {
      generated: activatedGenerated
    };
    var handlersNode = handlers.node;
    handlers.node = function(node) {
      if (node.loc && node.loc.start && trackNodes.hasOwnProperty(node.type)) {
        var nodeLine = node.loc.start.line;
        var nodeColumn = node.loc.start.column - 1;
        if (original.line !== nodeLine || original.column !== nodeColumn) {
          original.line = nodeLine;
          original.column = nodeColumn;
          generated.line = line;
          generated.column = column;
          if (sourceMappingActive) {
            sourceMappingActive = false;
            if (generated.line !== activatedGenerated.line || generated.column !== activatedGenerated.column) {
              map.addMapping(activatedMapping);
            }
          }
          sourceMappingActive = true;
          map.addMapping({
            source: node.loc.source,
            original,
            generated
          });
        }
      }
      handlersNode.call(this, node);
      if (sourceMappingActive && trackNodes.hasOwnProperty(node.type)) {
        activatedGenerated.line = line;
        activatedGenerated.column = column;
      }
    };
    var handlersChunk = handlers.chunk;
    handlers.chunk = function(chunk) {
      for (var i = 0; i < chunk.length; i++) {
        if (chunk.charCodeAt(i) === 10) {
          line++;
          column = 0;
        } else {
          column++;
        }
      }
      handlersChunk(chunk);
    };
    var handlersResult = handlers.result;
    handlers.result = function() {
      if (sourceMappingActive) {
        map.addMapping(activatedMapping);
      }
      return {
        css: handlersResult(),
        map
      };
    };
    return handlers;
  };
});

// node_modules/css-tree/lib/generator/create.js
var require_create2 = __commonJS((exports2, module2) => {
  var sourceMap = require_sourceMap();
  var hasOwnProperty2 = Object.prototype.hasOwnProperty;
  function processChildren(node, delimeter) {
    var list = node.children;
    var prev = null;
    if (typeof delimeter !== "function") {
      list.forEach(this.node, this);
    } else {
      list.forEach(function(node2) {
        if (prev !== null) {
          delimeter.call(this, prev);
        }
        this.node(node2);
        prev = node2;
      }, this);
    }
  }
  module2.exports = function createGenerator(config) {
    function processNode(node) {
      if (hasOwnProperty2.call(types, node.type)) {
        types[node.type].call(this, node);
      } else {
        throw new Error("Unknown node type: " + node.type);
      }
    }
    var types = {};
    if (config.node) {
      for (var name in config.node) {
        types[name] = config.node[name].generate;
      }
    }
    return function(node, options) {
      var buffer = "";
      var handlers = {
        children: processChildren,
        node: processNode,
        chunk: function(chunk) {
          buffer += chunk;
        },
        result: function() {
          return buffer;
        }
      };
      if (options) {
        if (typeof options.decorator === "function") {
          handlers = options.decorator(handlers);
        }
        if (options.sourceMap) {
          handlers = sourceMap(handlers);
        }
      }
      handlers.node(node);
      return handlers.result();
    };
  };
});

// node_modules/css-tree/lib/convertor/create.js
var require_create3 = __commonJS((exports2, module2) => {
  var List = require_List();
  module2.exports = function createConvertors(walk2) {
    return {
      fromPlainObject: function(ast) {
        walk2(ast, {
          enter: function(node) {
            if (node.children && node.children instanceof List === false) {
              node.children = new List().fromArray(node.children);
            }
          }
        });
        return ast;
      },
      toPlainObject: function(ast) {
        walk2(ast, {
          leave: function(node) {
            if (node.children && node.children instanceof List) {
              node.children = node.children.toArray();
            }
          }
        });
        return ast;
      }
    };
  };
});

// node_modules/css-tree/lib/walker/create.js
var require_create4 = __commonJS((exports2, module2) => {
  var hasOwnProperty2 = Object.prototype.hasOwnProperty;
  var noop = function() {
  };
  function ensureFunction(value) {
    return typeof value === "function" ? value : noop;
  }
  function invokeForType(fn, type) {
    return function(node, item, list) {
      if (node.type === type) {
        fn.call(this, node, item, list);
      }
    };
  }
  function getWalkersFromStructure(name, nodeType) {
    var structure = nodeType.structure;
    var walkers = [];
    for (var key in structure) {
      if (hasOwnProperty2.call(structure, key) === false) {
        continue;
      }
      var fieldTypes = structure[key];
      var walker = {
        name: key,
        type: false,
        nullable: false
      };
      if (!Array.isArray(structure[key])) {
        fieldTypes = [structure[key]];
      }
      for (var i = 0; i < fieldTypes.length; i++) {
        var fieldType = fieldTypes[i];
        if (fieldType === null) {
          walker.nullable = true;
        } else if (typeof fieldType === "string") {
          walker.type = "node";
        } else if (Array.isArray(fieldType)) {
          walker.type = "list";
        }
      }
      if (walker.type) {
        walkers.push(walker);
      }
    }
    if (walkers.length) {
      return {
        context: nodeType.walkContext,
        fields: walkers
      };
    }
    return null;
  }
  function getTypesFromConfig(config) {
    var types = {};
    for (var name in config.node) {
      if (hasOwnProperty2.call(config.node, name)) {
        var nodeType = config.node[name];
        if (!nodeType.structure) {
          throw new Error("Missed `structure` field in `" + name + "` node type definition");
        }
        types[name] = getWalkersFromStructure(name, nodeType);
      }
    }
    return types;
  }
  function createTypeIterator(config, reverse) {
    var fields = config.fields.slice();
    var contextName = config.context;
    var useContext = typeof contextName === "string";
    if (reverse) {
      fields.reverse();
    }
    return function(node, context, walk2, walkReducer) {
      var prevContextValue;
      if (useContext) {
        prevContextValue = context[contextName];
        context[contextName] = node;
      }
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var ref = node[field.name];
        if (!field.nullable || ref) {
          if (field.type === "list") {
            var breakWalk = reverse ? ref.reduceRight(walkReducer, false) : ref.reduce(walkReducer, false);
            if (breakWalk) {
              return true;
            }
          } else if (walk2(ref)) {
            return true;
          }
        }
      }
      if (useContext) {
        context[contextName] = prevContextValue;
      }
    };
  }
  function createFastTraveralMap(iterators) {
    return {
      Atrule: {
        StyleSheet: iterators.StyleSheet,
        Atrule: iterators.Atrule,
        Rule: iterators.Rule,
        Block: iterators.Block
      },
      Rule: {
        StyleSheet: iterators.StyleSheet,
        Atrule: iterators.Atrule,
        Rule: iterators.Rule,
        Block: iterators.Block
      },
      Declaration: {
        StyleSheet: iterators.StyleSheet,
        Atrule: iterators.Atrule,
        Rule: iterators.Rule,
        Block: iterators.Block,
        DeclarationList: iterators.DeclarationList
      }
    };
  }
  module2.exports = function createWalker(config) {
    var types = getTypesFromConfig(config);
    var iteratorsNatural = {};
    var iteratorsReverse = {};
    var breakWalk = Symbol("break-walk");
    var skipNode = Symbol("skip-node");
    for (var name in types) {
      if (hasOwnProperty2.call(types, name) && types[name] !== null) {
        iteratorsNatural[name] = createTypeIterator(types[name], false);
        iteratorsReverse[name] = createTypeIterator(types[name], true);
      }
    }
    var fastTraversalIteratorsNatural = createFastTraveralMap(iteratorsNatural);
    var fastTraversalIteratorsReverse = createFastTraveralMap(iteratorsReverse);
    var walk2 = function(root, options) {
      function walkNode(node, item, list) {
        var enterRet = enter.call(context, node, item, list);
        if (enterRet === breakWalk) {
          debugger;
          return true;
        }
        if (enterRet === skipNode) {
          return false;
        }
        if (iterators.hasOwnProperty(node.type)) {
          if (iterators[node.type](node, context, walkNode, walkReducer)) {
            return true;
          }
        }
        if (leave.call(context, node, item, list) === breakWalk) {
          return true;
        }
        return false;
      }
      var walkReducer = (ret, data, item, list) => ret || walkNode(data, item, list);
      var enter = noop;
      var leave = noop;
      var iterators = iteratorsNatural;
      var context = {
        break: breakWalk,
        skip: skipNode,
        root,
        stylesheet: null,
        atrule: null,
        atrulePrelude: null,
        rule: null,
        selector: null,
        block: null,
        declaration: null,
        function: null
      };
      if (typeof options === "function") {
        enter = options;
      } else if (options) {
        enter = ensureFunction(options.enter);
        leave = ensureFunction(options.leave);
        if (options.reverse) {
          iterators = iteratorsReverse;
        }
        if (options.visit) {
          if (fastTraversalIteratorsNatural.hasOwnProperty(options.visit)) {
            iterators = options.reverse ? fastTraversalIteratorsReverse[options.visit] : fastTraversalIteratorsNatural[options.visit];
          } else if (!types.hasOwnProperty(options.visit)) {
            throw new Error("Bad value `" + options.visit + "` for `visit` option (should be: " + Object.keys(types).join(", ") + ")");
          }
          enter = invokeForType(enter, options.visit);
          leave = invokeForType(leave, options.visit);
        }
      }
      if (enter === noop && leave === noop) {
        throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
      }
      walkNode(root);
    };
    walk2.break = breakWalk;
    walk2.skip = skipNode;
    walk2.find = function(ast, fn) {
      var found = null;
      walk2(ast, function(node, item, list) {
        if (fn.call(this, node, item, list)) {
          found = node;
          return breakWalk;
        }
      });
      return found;
    };
    walk2.findLast = function(ast, fn) {
      var found = null;
      walk2(ast, {
        reverse: true,
        enter: function(node, item, list) {
          if (fn.call(this, node, item, list)) {
            found = node;
            return breakWalk;
          }
        }
      });
      return found;
    };
    walk2.findAll = function(ast, fn) {
      var found = [];
      walk2(ast, function(node, item, list) {
        if (fn.call(this, node, item, list)) {
          found.push(node);
        }
      });
      return found;
    };
    return walk2;
  };
});

// node_modules/css-tree/lib/utils/clone.js
var require_clone = __commonJS((exports2, module2) => {
  var List = require_List();
  module2.exports = function clone2(node) {
    var result = {};
    for (var key in node) {
      var value = node[key];
      if (value) {
        if (Array.isArray(value) || value instanceof List) {
          value = value.map(clone2);
        } else if (value.constructor === Object) {
          value = clone2(value);
        }
      }
      result[key] = value;
    }
    return result;
  };
});

// node_modules/css-tree/lib/syntax/config/mix.js
var require_mix = __commonJS((exports2, module2) => {
  var hasOwnProperty2 = Object.prototype.hasOwnProperty;
  var shape = {
    generic: true,
    types: appendOrAssign,
    atrules: {
      prelude: appendOrAssignOrNull,
      descriptors: appendOrAssignOrNull
    },
    properties: appendOrAssign,
    parseContext: assign,
    scope: deepAssign,
    atrule: ["parse"],
    pseudo: ["parse"],
    node: ["name", "structure", "parse", "generate", "walkContext"]
  };
  function isObject(value) {
    return value && value.constructor === Object;
  }
  function copy(value) {
    return isObject(value) ? Object.assign({}, value) : value;
  }
  function assign(dest, src) {
    return Object.assign(dest, src);
  }
  function deepAssign(dest, src) {
    for (const key in src) {
      if (hasOwnProperty2.call(src, key)) {
        if (isObject(dest[key])) {
          deepAssign(dest[key], copy(src[key]));
        } else {
          dest[key] = copy(src[key]);
        }
      }
    }
    return dest;
  }
  function append(a, b) {
    if (typeof b === "string" && /^\s*\|/.test(b)) {
      return typeof a === "string" ? a + b : b.replace(/^\s*\|\s*/, "");
    }
    return b || null;
  }
  function appendOrAssign(a, b) {
    if (typeof b === "string") {
      return append(a, b);
    }
    const result = Object.assign({}, a);
    for (let key in b) {
      if (hasOwnProperty2.call(b, key)) {
        result[key] = append(hasOwnProperty2.call(a, key) ? a[key] : void 0, b[key]);
      }
    }
    return result;
  }
  function appendOrAssignOrNull(a, b) {
    const result = appendOrAssign(a, b);
    return !isObject(result) || Object.keys(result).length ? result : null;
  }
  function mix(dest, src, shape2) {
    for (const key in shape2) {
      if (hasOwnProperty2.call(shape2, key) === false) {
        continue;
      }
      if (shape2[key] === true) {
        if (key in src) {
          if (hasOwnProperty2.call(src, key)) {
            dest[key] = copy(src[key]);
          }
        }
      } else if (shape2[key]) {
        if (typeof shape2[key] === "function") {
          const fn = shape2[key];
          dest[key] = fn({}, dest[key]);
          dest[key] = fn(dest[key] || {}, src[key]);
        } else if (isObject(shape2[key])) {
          const result = {};
          for (let name in dest[key]) {
            result[name] = mix({}, dest[key][name], shape2[key]);
          }
          for (let name in src[key]) {
            result[name] = mix(result[name] || {}, src[key][name], shape2[key]);
          }
          dest[key] = result;
        } else if (Array.isArray(shape2[key])) {
          const res = {};
          const innerShape = shape2[key].reduce(function(s, k) {
            s[k] = true;
            return s;
          }, {});
          for (const [name, value] of Object.entries(dest[key] || {})) {
            res[name] = {};
            if (value) {
              mix(res[name], value, innerShape);
            }
          }
          for (const name in src[key]) {
            if (hasOwnProperty2.call(src[key], name)) {
              if (!res[name]) {
                res[name] = {};
              }
              if (src[key] && src[key][name]) {
                mix(res[name], src[key][name], innerShape);
              }
            }
          }
          dest[key] = res;
        }
      }
    }
    return dest;
  }
  module2.exports = (dest, src) => mix(dest, src, shape);
});

// node_modules/css-tree/lib/syntax/create.js
var require_create5 = __commonJS((exports2) => {
  var List = require_List();
  var SyntaxError2 = require_SyntaxError();
  var TokenStream = require_TokenStream();
  var Lexer = require_Lexer();
  var definitionSyntax = require_definition_syntax();
  var tokenize = require_tokenizer();
  var createParser = require_create();
  var createGenerator = require_create2();
  var createConvertor = require_create3();
  var createWalker = require_create4();
  var clone2 = require_clone();
  var names = require_names();
  var mix = require_mix();
  function createSyntax(config) {
    var parse2 = createParser(config);
    var walk2 = createWalker(config);
    var generate = createGenerator(config);
    var convert2 = createConvertor(walk2);
    var syntax = {
      List,
      SyntaxError: SyntaxError2,
      TokenStream,
      Lexer,
      vendorPrefix: names.vendorPrefix,
      keyword: names.keyword,
      property: names.property,
      isCustomProperty: names.isCustomProperty,
      definitionSyntax,
      lexer: null,
      createLexer: function(config2) {
        return new Lexer(config2, syntax, syntax.lexer.structure);
      },
      tokenize,
      parse: parse2,
      walk: walk2,
      generate,
      find: walk2.find,
      findLast: walk2.findLast,
      findAll: walk2.findAll,
      clone: clone2,
      fromPlainObject: convert2.fromPlainObject,
      toPlainObject: convert2.toPlainObject,
      createSyntax: function(config2) {
        return createSyntax(mix({}, config2));
      },
      fork: function(extension) {
        var base = mix({}, config);
        return createSyntax(typeof extension === "function" ? extension(base, Object.assign) : mix(base, extension));
      }
    };
    syntax.lexer = new Lexer({
      generic: true,
      types: config.types,
      atrules: config.atrules,
      properties: config.properties,
      node: config.node
    }, syntax);
    return syntax;
  }
  exports2.create = function(config) {
    return createSyntax(mix({}, config));
  };
});

// node_modules/mdn-data/css/at-rules.json
var require_at_rules = __commonJS((exports2, module2) => {
  module2.exports = {
    "@charset": {
      syntax: '@charset "<charset>";',
      groups: [
        "CSS Charsets"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@charset"
    },
    "@counter-style": {
      syntax: "@counter-style <counter-style-name> {\n  [ system: <counter-system>; ] ||\n  [ symbols: <counter-symbols>; ] ||\n  [ additive-symbols: <additive-symbols>; ] ||\n  [ negative: <negative-symbol>; ] ||\n  [ prefix: <prefix>; ] ||\n  [ suffix: <suffix>; ] ||\n  [ range: <range>; ] ||\n  [ pad: <padding>; ] ||\n  [ speak-as: <speak-as>; ] ||\n  [ fallback: <counter-style-name>; ]\n}",
      interfaces: [
        "CSSCounterStyleRule"
      ],
      groups: [
        "CSS Counter Styles"
      ],
      descriptors: {
        "additive-symbols": {
          syntax: "[ <integer> && <symbol> ]#",
          media: "all",
          initial: "n/a (required)",
          percentages: "no",
          computed: "asSpecified",
          order: "orderOfAppearance",
          status: "standard"
        },
        fallback: {
          syntax: "<counter-style-name>",
          media: "all",
          initial: "decimal",
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        negative: {
          syntax: "<symbol> <symbol>?",
          media: "all",
          initial: '"-" hyphen-minus',
          percentages: "no",
          computed: "asSpecified",
          order: "orderOfAppearance",
          status: "standard"
        },
        pad: {
          syntax: "<integer> && <symbol>",
          media: "all",
          initial: '0 ""',
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        prefix: {
          syntax: "<symbol>",
          media: "all",
          initial: '""',
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        range: {
          syntax: "[ [ <integer> | infinite ]{2} ]# | auto",
          media: "all",
          initial: "auto",
          percentages: "no",
          computed: "asSpecified",
          order: "orderOfAppearance",
          status: "standard"
        },
        "speak-as": {
          syntax: "auto | bullets | numbers | words | spell-out | <counter-style-name>",
          media: "all",
          initial: "auto",
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        suffix: {
          syntax: "<symbol>",
          media: "all",
          initial: '". "',
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        symbols: {
          syntax: "<symbol>+",
          media: "all",
          initial: "n/a (required)",
          percentages: "no",
          computed: "asSpecified",
          order: "orderOfAppearance",
          status: "standard"
        },
        system: {
          syntax: "cyclic | numeric | alphabetic | symbolic | additive | [ fixed <integer>? ] | [ extends <counter-style-name> ]",
          media: "all",
          initial: "symbolic",
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        }
      },
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@counter-style"
    },
    "@document": {
      syntax: "@document [ <url> | url-prefix(<string>) | domain(<string>) | media-document(<string>) | regexp(<string>) ]# {\n  <group-rule-body>\n}",
      interfaces: [
        "CSSGroupingRule",
        "CSSConditionRule"
      ],
      groups: [
        "CSS Conditional Rules"
      ],
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@document"
    },
    "@font-face": {
      syntax: "@font-face {\n  [ font-family: <family-name>; ] ||\n  [ src: <src>; ] ||\n  [ unicode-range: <unicode-range>; ] ||\n  [ font-variant: <font-variant>; ] ||\n  [ font-feature-settings: <font-feature-settings>; ] ||\n  [ font-variation-settings: <font-variation-settings>; ] ||\n  [ font-stretch: <font-stretch>; ] ||\n  [ font-weight: <font-weight>; ] ||\n  [ font-style: <font-style>; ]\n}",
      interfaces: [
        "CSSFontFaceRule"
      ],
      groups: [
        "CSS Fonts"
      ],
      descriptors: {
        "font-display": {
          syntax: "[ auto | block | swap | fallback | optional ]",
          media: "visual",
          percentages: "no",
          initial: "auto",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "experimental"
        },
        "font-family": {
          syntax: "<family-name>",
          media: "all",
          initial: "n/a (required)",
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        "font-feature-settings": {
          syntax: "normal | <feature-tag-value>#",
          media: "all",
          initial: "normal",
          percentages: "no",
          computed: "asSpecified",
          order: "orderOfAppearance",
          status: "standard"
        },
        "font-variation-settings": {
          syntax: "normal | [ <string> <number> ]#",
          media: "all",
          initial: "normal",
          percentages: "no",
          computed: "asSpecified",
          order: "orderOfAppearance",
          status: "standard"
        },
        "font-stretch": {
          syntax: "<font-stretch-absolute>{1,2}",
          media: "all",
          initial: "normal",
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        "font-style": {
          syntax: "normal | italic | oblique <angle>{0,2}",
          media: "all",
          initial: "normal",
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        "font-weight": {
          syntax: "<font-weight-absolute>{1,2}",
          media: "all",
          initial: "normal",
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        "font-variant": {
          syntax: "normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic(<feature-value-name>) || historical-forms || styleset(<feature-value-name>#) || character-variant(<feature-value-name>#) || swash(<feature-value-name>) || ornaments(<feature-value-name>) || annotation(<feature-value-name>) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]",
          media: "all",
          initial: "normal",
          percentages: "no",
          computed: "asSpecified",
          order: "orderOfAppearance",
          status: "standard"
        },
        src: {
          syntax: "[ <url> [ format( <string># ) ]? | local( <family-name> ) ]#",
          media: "all",
          initial: "n/a (required)",
          percentages: "no",
          computed: "asSpecified",
          order: "orderOfAppearance",
          status: "standard"
        },
        "unicode-range": {
          syntax: "<unicode-range>#",
          media: "all",
          initial: "U+0-10FFFF",
          percentages: "no",
          computed: "asSpecified",
          order: "orderOfAppearance",
          status: "standard"
        }
      },
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@font-face"
    },
    "@font-feature-values": {
      syntax: "@font-feature-values <family-name># {\n  <feature-value-block-list>\n}",
      interfaces: [
        "CSSFontFeatureValuesRule"
      ],
      groups: [
        "CSS Fonts"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@font-feature-values"
    },
    "@import": {
      syntax: "@import [ <string> | <url> ] [ <media-query-list> ]?;",
      groups: [
        "Media Queries"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@import"
    },
    "@keyframes": {
      syntax: "@keyframes <keyframes-name> {\n  <keyframe-block-list>\n}",
      interfaces: [
        "CSSKeyframeRule",
        "CSSKeyframesRule"
      ],
      groups: [
        "CSS Animations"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@keyframes"
    },
    "@media": {
      syntax: "@media <media-query-list> {\n  <group-rule-body>\n}",
      interfaces: [
        "CSSGroupingRule",
        "CSSConditionRule",
        "CSSMediaRule",
        "CSSCustomMediaRule"
      ],
      groups: [
        "CSS Conditional Rules",
        "Media Queries"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@media"
    },
    "@namespace": {
      syntax: "@namespace <namespace-prefix>? [ <string> | <url> ];",
      groups: [
        "CSS Namespaces"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@namespace"
    },
    "@page": {
      syntax: "@page <page-selector-list> {\n  <page-body>\n}",
      interfaces: [
        "CSSPageRule"
      ],
      groups: [
        "CSS Pages"
      ],
      descriptors: {
        bleed: {
          syntax: "auto | <length>",
          media: [
            "visual",
            "paged"
          ],
          initial: "auto",
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        marks: {
          syntax: "none | [ crop || cross ]",
          media: [
            "visual",
            "paged"
          ],
          initial: "none",
          percentages: "no",
          computed: "asSpecified",
          order: "orderOfAppearance",
          status: "standard"
        },
        size: {
          syntax: "<length>{1,2} | auto | [ <page-size> || [ portrait | landscape ] ]",
          media: [
            "visual",
            "paged"
          ],
          initial: "auto",
          percentages: "no",
          computed: "asSpecifiedRelativeToAbsoluteLengths",
          order: "orderOfAppearance",
          status: "standard"
        }
      },
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@page"
    },
    "@property": {
      syntax: "@property <custom-property-name> {\n  <declaration-list>\n}",
      interfaces: [
        "CSS",
        "CSSPropertyRule"
      ],
      groups: [
        "CSS Houdini"
      ],
      descriptors: {
        syntax: {
          syntax: "<string>",
          media: "all",
          percentages: "no",
          initial: "n/a (required)",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "experimental"
        },
        inherits: {
          syntax: "true | false",
          media: "all",
          percentages: "no",
          initial: "auto",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "experimental"
        },
        "initial-value": {
          syntax: "<string>",
          media: "all",
          initial: "n/a (required)",
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "experimental"
        }
      },
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@property"
    },
    "@supports": {
      syntax: "@supports <supports-condition> {\n  <group-rule-body>\n}",
      interfaces: [
        "CSSGroupingRule",
        "CSSConditionRule",
        "CSSSupportsRule"
      ],
      groups: [
        "CSS Conditional Rules"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@supports"
    },
    "@viewport": {
      syntax: "@viewport {\n  <group-rule-body>\n}",
      interfaces: [
        "CSSViewportRule"
      ],
      groups: [
        "CSS Device Adaptation"
      ],
      descriptors: {
        height: {
          syntax: "<viewport-length>{1,2}",
          media: [
            "visual",
            "continuous"
          ],
          initial: [
            "min-height",
            "max-height"
          ],
          percentages: [
            "min-height",
            "max-height"
          ],
          computed: [
            "min-height",
            "max-height"
          ],
          order: "orderOfAppearance",
          status: "standard"
        },
        "max-height": {
          syntax: "<viewport-length>",
          media: [
            "visual",
            "continuous"
          ],
          initial: "auto",
          percentages: "referToHeightOfInitialViewport",
          computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
          order: "uniqueOrder",
          status: "standard"
        },
        "max-width": {
          syntax: "<viewport-length>",
          media: [
            "visual",
            "continuous"
          ],
          initial: "auto",
          percentages: "referToWidthOfInitialViewport",
          computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
          order: "uniqueOrder",
          status: "standard"
        },
        "max-zoom": {
          syntax: "auto | <number> | <percentage>",
          media: [
            "visual",
            "continuous"
          ],
          initial: "auto",
          percentages: "the zoom factor itself",
          computed: "autoNonNegativeOrPercentage",
          order: "uniqueOrder",
          status: "standard"
        },
        "min-height": {
          syntax: "<viewport-length>",
          media: [
            "visual",
            "continuous"
          ],
          initial: "auto",
          percentages: "referToHeightOfInitialViewport",
          computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
          order: "uniqueOrder",
          status: "standard"
        },
        "min-width": {
          syntax: "<viewport-length>",
          media: [
            "visual",
            "continuous"
          ],
          initial: "auto",
          percentages: "referToWidthOfInitialViewport",
          computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
          order: "uniqueOrder",
          status: "standard"
        },
        "min-zoom": {
          syntax: "auto | <number> | <percentage>",
          media: [
            "visual",
            "continuous"
          ],
          initial: "auto",
          percentages: "the zoom factor itself",
          computed: "autoNonNegativeOrPercentage",
          order: "uniqueOrder",
          status: "standard"
        },
        orientation: {
          syntax: "auto | portrait | landscape",
          media: [
            "visual",
            "continuous"
          ],
          initial: "auto",
          percentages: "referToSizeOfBoundingBox",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        "user-zoom": {
          syntax: "zoom | fixed",
          media: [
            "visual",
            "continuous"
          ],
          initial: "zoom",
          percentages: "referToSizeOfBoundingBox",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        "viewport-fit": {
          syntax: "auto | contain | cover",
          media: [
            "visual",
            "continuous"
          ],
          initial: "auto",
          percentages: "no",
          computed: "asSpecified",
          order: "uniqueOrder",
          status: "standard"
        },
        width: {
          syntax: "<viewport-length>{1,2}",
          media: [
            "visual",
            "continuous"
          ],
          initial: [
            "min-width",
            "max-width"
          ],
          percentages: [
            "min-width",
            "max-width"
          ],
          computed: [
            "min-width",
            "max-width"
          ],
          order: "orderOfAppearance",
          status: "standard"
        },
        zoom: {
          syntax: "auto | <number> | <percentage>",
          media: [
            "visual",
            "continuous"
          ],
          initial: "auto",
          percentages: "the zoom factor itself",
          computed: "autoNonNegativeOrPercentage",
          order: "uniqueOrder",
          status: "standard"
        }
      },
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/@viewport"
    }
  };
});

// node_modules/mdn-data/css/properties.json
var require_properties = __commonJS((exports2, module2) => {
  module2.exports = {
    "--*": {
      syntax: "<declaration-value>",
      media: "all",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Variables"
      ],
      initial: "seeProse",
      appliesto: "allElements",
      computed: "asSpecifiedWithVarsSubstituted",
      order: "perGrammar",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/--*"
    },
    "-ms-accelerator": {
      syntax: "false | true",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "false",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-accelerator"
    },
    "-ms-block-progression": {
      syntax: "tb | rl | bt | lr",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "tb",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-block-progression"
    },
    "-ms-content-zoom-chaining": {
      syntax: "none | chained",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "none",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-chaining"
    },
    "-ms-content-zooming": {
      syntax: "none | zoom",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "zoomForTheTopLevelNoneForTheRest",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-content-zooming"
    },
    "-ms-content-zoom-limit": {
      syntax: "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: [
        "-ms-content-zoom-limit-max",
        "-ms-content-zoom-limit-min"
      ],
      groups: [
        "Microsoft Extensions"
      ],
      initial: [
        "-ms-content-zoom-limit-max",
        "-ms-content-zoom-limit-min"
      ],
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: [
        "-ms-content-zoom-limit-max",
        "-ms-content-zoom-limit-min"
      ],
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-limit"
    },
    "-ms-content-zoom-limit-max": {
      syntax: "<percentage>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "maxZoomFactor",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "400%",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-limit-max"
    },
    "-ms-content-zoom-limit-min": {
      syntax: "<percentage>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "minZoomFactor",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "100%",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-limit-min"
    },
    "-ms-content-zoom-snap": {
      syntax: "<'-ms-content-zoom-snap-type'> || <'-ms-content-zoom-snap-points'>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: [
        "-ms-content-zoom-snap-type",
        "-ms-content-zoom-snap-points"
      ],
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: [
        "-ms-content-zoom-snap-type",
        "-ms-content-zoom-snap-points"
      ],
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-snap"
    },
    "-ms-content-zoom-snap-points": {
      syntax: "snapInterval( <percentage>, <percentage> ) | snapList( <percentage># )",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "snapInterval(0%, 100%)",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-snap-points"
    },
    "-ms-content-zoom-snap-type": {
      syntax: "none | proximity | mandatory",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "none",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-content-zoom-snap-type"
    },
    "-ms-filter": {
      syntax: "<string>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: '""',
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-filter"
    },
    "-ms-flow-from": {
      syntax: "[ none | <custom-ident> ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "none",
      appliesto: "nonReplacedElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-flow-from"
    },
    "-ms-flow-into": {
      syntax: "[ none | <custom-ident> ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "none",
      appliesto: "iframeElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-flow-into"
    },
    "-ms-grid-columns": {
      syntax: "none | <track-list> | <auto-track-list>",
      media: "visual",
      inherited: false,
      animationType: "simpleListOfLpcDifferenceLpc",
      percentages: "referToDimensionOfContentArea",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "none",
      appliesto: "gridContainers",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-grid-columns"
    },
    "-ms-grid-rows": {
      syntax: "none | <track-list> | <auto-track-list>",
      media: "visual",
      inherited: false,
      animationType: "simpleListOfLpcDifferenceLpc",
      percentages: "referToDimensionOfContentArea",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "none",
      appliesto: "gridContainers",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-grid-rows"
    },
    "-ms-high-contrast-adjust": {
      syntax: "auto | none",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-high-contrast-adjust"
    },
    "-ms-hyphenate-limit-chars": {
      syntax: "auto | <integer>{1,3}",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-hyphenate-limit-chars"
    },
    "-ms-hyphenate-limit-lines": {
      syntax: "no-limit | <integer>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "no-limit",
      appliesto: "blockContainerElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-hyphenate-limit-lines"
    },
    "-ms-hyphenate-limit-zone": {
      syntax: "<percentage> | <length>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "referToLineBoxWidth",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "0",
      appliesto: "blockContainerElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-hyphenate-limit-zone"
    },
    "-ms-ime-align": {
      syntax: "auto | after",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-ime-align"
    },
    "-ms-overflow-style": {
      syntax: "auto | none | scrollbar | -ms-autohiding-scrollbar",
      media: "interactive",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "auto",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-overflow-style"
    },
    "-ms-scrollbar-3dlight-color": {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "dependsOnUserAgent",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-3dlight-color"
    },
    "-ms-scrollbar-arrow-color": {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "ButtonText",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-arrow-color"
    },
    "-ms-scrollbar-base-color": {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "dependsOnUserAgent",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-base-color"
    },
    "-ms-scrollbar-darkshadow-color": {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "ThreeDDarkShadow",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-darkshadow-color"
    },
    "-ms-scrollbar-face-color": {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "ThreeDFace",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-face-color"
    },
    "-ms-scrollbar-highlight-color": {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "ThreeDHighlight",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-highlight-color"
    },
    "-ms-scrollbar-shadow-color": {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "ThreeDDarkShadow",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-shadow-color"
    },
    "-ms-scrollbar-track-color": {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "Scrollbar",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scrollbar-track-color"
    },
    "-ms-scroll-chaining": {
      syntax: "chained | none",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "chained",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-chaining"
    },
    "-ms-scroll-limit": {
      syntax: "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: [
        "-ms-scroll-limit-x-min",
        "-ms-scroll-limit-y-min",
        "-ms-scroll-limit-x-max",
        "-ms-scroll-limit-y-max"
      ],
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: [
        "-ms-scroll-limit-x-min",
        "-ms-scroll-limit-y-min",
        "-ms-scroll-limit-x-max",
        "-ms-scroll-limit-y-max"
      ],
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-limit"
    },
    "-ms-scroll-limit-x-max": {
      syntax: "auto | <length>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "auto",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-limit-x-max"
    },
    "-ms-scroll-limit-x-min": {
      syntax: "<length>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "0",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-limit-x-min"
    },
    "-ms-scroll-limit-y-max": {
      syntax: "auto | <length>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "auto",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-limit-y-max"
    },
    "-ms-scroll-limit-y-min": {
      syntax: "<length>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "0",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-limit-y-min"
    },
    "-ms-scroll-rails": {
      syntax: "none | railed",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "railed",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-rails"
    },
    "-ms-scroll-snap-points-x": {
      syntax: "snapInterval( <length-percentage>, <length-percentage> ) | snapList( <length-percentage># )",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "snapInterval(0px, 100%)",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-snap-points-x"
    },
    "-ms-scroll-snap-points-y": {
      syntax: "snapInterval( <length-percentage>, <length-percentage> ) | snapList( <length-percentage># )",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "snapInterval(0px, 100%)",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-snap-points-y"
    },
    "-ms-scroll-snap-type": {
      syntax: "none | proximity | mandatory",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "none",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-snap-type"
    },
    "-ms-scroll-snap-x": {
      syntax: "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: [
        "-ms-scroll-snap-type",
        "-ms-scroll-snap-points-x"
      ],
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: [
        "-ms-scroll-snap-type",
        "-ms-scroll-snap-points-x"
      ],
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-snap-x"
    },
    "-ms-scroll-snap-y": {
      syntax: "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: [
        "-ms-scroll-snap-type",
        "-ms-scroll-snap-points-y"
      ],
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: [
        "-ms-scroll-snap-type",
        "-ms-scroll-snap-points-y"
      ],
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-snap-y"
    },
    "-ms-scroll-translation": {
      syntax: "none | vertical-to-horizontal",
      media: "interactive",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-scroll-translation"
    },
    "-ms-text-autospace": {
      syntax: "none | ideograph-alpha | ideograph-numeric | ideograph-parenthesis | ideograph-space",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-text-autospace"
    },
    "-ms-touch-select": {
      syntax: "grippers | none",
      media: "interactive",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "grippers",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-touch-select"
    },
    "-ms-user-select": {
      syntax: "none | element | text",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "text",
      appliesto: "nonReplacedElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-user-select"
    },
    "-ms-wrap-flow": {
      syntax: "auto | both | start | end | maximum | clear",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "auto",
      appliesto: "blockLevelElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-wrap-flow"
    },
    "-ms-wrap-margin": {
      syntax: "<length>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "0",
      appliesto: "exclusionElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-wrap-margin"
    },
    "-ms-wrap-through": {
      syntax: "wrap | none",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "wrap",
      appliesto: "blockLevelElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-ms-wrap-through"
    },
    "-moz-appearance": {
      syntax: "none | button | button-arrow-down | button-arrow-next | button-arrow-previous | button-arrow-up | button-bevel | button-focus | caret | checkbox | checkbox-container | checkbox-label | checkmenuitem | dualbutton | groupbox | listbox | listitem | menuarrow | menubar | menucheckbox | menuimage | menuitem | menuitemtext | menulist | menulist-button | menulist-text | menulist-textfield | menupopup | menuradio | menuseparator | meterbar | meterchunk | progressbar | progressbar-vertical | progresschunk | progresschunk-vertical | radio | radio-container | radio-label | radiomenuitem | range | range-thumb | resizer | resizerpanel | scale-horizontal | scalethumbend | scalethumb-horizontal | scalethumbstart | scalethumbtick | scalethumb-vertical | scale-vertical | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | separator | sheet | spinner | spinner-downbutton | spinner-textfield | spinner-upbutton | splitter | statusbar | statusbarpanel | tab | tabpanel | tabpanels | tab-scroll-arrow-back | tab-scroll-arrow-forward | textfield | textfield-multiline | toolbar | toolbarbutton | toolbarbutton-dropdown | toolbargripper | toolbox | tooltip | treeheader | treeheadercell | treeheadersortarrow | treeitem | treeline | treetwisty | treetwistyopen | treeview | -moz-mac-unified-toolbar | -moz-win-borderless-glass | -moz-win-browsertabbar-toolbox | -moz-win-communicationstext | -moz-win-communications-toolbox | -moz-win-exclude-glass | -moz-win-glass | -moz-win-mediatext | -moz-win-media-toolbox | -moz-window-button-box | -moz-window-button-box-maximized | -moz-window-button-close | -moz-window-button-maximize | -moz-window-button-minimize | -moz-window-button-restore | -moz-window-frame-bottom | -moz-window-frame-left | -moz-window-frame-right | -moz-window-titlebar | -moz-window-titlebar-maximized",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions",
        "WebKit Extensions"
      ],
      initial: "noneButOverriddenInUserAgentCSS",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/appearance"
    },
    "-moz-binding": {
      syntax: "<url> | none",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "none",
      appliesto: "allElementsExceptGeneratedContentOrPseudoElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-binding"
    },
    "-moz-border-bottom-colors": {
      syntax: "<color>+ | none",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-border-bottom-colors"
    },
    "-moz-border-left-colors": {
      syntax: "<color>+ | none",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-border-left-colors"
    },
    "-moz-border-right-colors": {
      syntax: "<color>+ | none",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-border-right-colors"
    },
    "-moz-border-top-colors": {
      syntax: "<color>+ | none",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-border-top-colors"
    },
    "-moz-context-properties": {
      syntax: "none | [ fill | fill-opacity | stroke | stroke-opacity ]#",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "none",
      appliesto: "allElementsThatCanReferenceImages",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-context-properties"
    },
    "-moz-float-edge": {
      syntax: "border-box | content-box | margin-box | padding-box",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "content-box",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-float-edge"
    },
    "-moz-force-broken-image-icon": {
      syntax: "<integer [0,1]>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "0",
      appliesto: "images",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-force-broken-image-icon"
    },
    "-moz-image-region": {
      syntax: "<shape> | auto",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "auto",
      appliesto: "xulImageElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-image-region"
    },
    "-moz-orient": {
      syntax: "inline | block | horizontal | vertical",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "inline",
      appliesto: "anyElementEffectOnProgressAndMeter",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-orient"
    },
    "-moz-outline-radius": {
      syntax: "<outline-radius>{1,4} [ / <outline-radius>{1,4} ]?",
      media: "visual",
      inherited: false,
      animationType: [
        "-moz-outline-radius-topleft",
        "-moz-outline-radius-topright",
        "-moz-outline-radius-bottomright",
        "-moz-outline-radius-bottomleft"
      ],
      percentages: [
        "-moz-outline-radius-topleft",
        "-moz-outline-radius-topright",
        "-moz-outline-radius-bottomright",
        "-moz-outline-radius-bottomleft"
      ],
      groups: [
        "Mozilla Extensions"
      ],
      initial: [
        "-moz-outline-radius-topleft",
        "-moz-outline-radius-topright",
        "-moz-outline-radius-bottomright",
        "-moz-outline-radius-bottomleft"
      ],
      appliesto: "allElements",
      computed: [
        "-moz-outline-radius-topleft",
        "-moz-outline-radius-topright",
        "-moz-outline-radius-bottomright",
        "-moz-outline-radius-bottomleft"
      ],
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-outline-radius"
    },
    "-moz-outline-radius-bottomleft": {
      syntax: "<outline-radius>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-outline-radius-bottomleft"
    },
    "-moz-outline-radius-bottomright": {
      syntax: "<outline-radius>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-outline-radius-bottomright"
    },
    "-moz-outline-radius-topleft": {
      syntax: "<outline-radius>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-outline-radius-topleft"
    },
    "-moz-outline-radius-topright": {
      syntax: "<outline-radius>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-outline-radius-topright"
    },
    "-moz-stack-sizing": {
      syntax: "ignore | stretch-to-fit",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "stretch-to-fit",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-stack-sizing"
    },
    "-moz-text-blink": {
      syntax: "none | blink",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-text-blink"
    },
    "-moz-user-focus": {
      syntax: "ignore | normal | select-after | select-before | select-menu | select-same | select-all | none",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-user-focus"
    },
    "-moz-user-input": {
      syntax: "auto | none | enabled | disabled",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-user-input"
    },
    "-moz-user-modify": {
      syntax: "read-only | read-write | write-only",
      media: "interactive",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "read-only",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-user-modify"
    },
    "-moz-window-dragging": {
      syntax: "drag | no-drag",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "drag",
      appliesto: "allElementsCreatingNativeWindows",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-window-dragging"
    },
    "-moz-window-shadow": {
      syntax: "default | menu | tooltip | sheet | none",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "default",
      appliesto: "allElementsCreatingNativeWindows",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-moz-window-shadow"
    },
    "-webkit-appearance": {
      syntax: "none | button | button-bevel | caret | checkbox | default-button | inner-spin-button | listbox | listitem | media-controls-background | media-controls-fullscreen-background | media-current-time-display | media-enter-fullscreen-button | media-exit-fullscreen-button | media-fullscreen-button | media-mute-button | media-overlay-play-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | media-time-remaining-display | media-toggle-closed-captions-button | media-volume-slider | media-volume-slider-container | media-volume-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | meter | progress-bar | progress-bar-value | push-button | radio | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield | -apple-pay-button",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "noneButOverriddenInUserAgentCSS",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/appearance"
    },
    "-webkit-border-before": {
      syntax: "<'border-width'> || <'border-style'> || <'color'>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: [
        "-webkit-border-before-width"
      ],
      groups: [
        "WebKit Extensions"
      ],
      initial: [
        "border-width",
        "border-style",
        "color"
      ],
      appliesto: "allElements",
      computed: [
        "border-width",
        "border-style",
        "color"
      ],
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-border-before"
    },
    "-webkit-border-before-color": {
      syntax: "<'color'>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      status: "nonstandard"
    },
    "-webkit-border-before-style": {
      syntax: "<'border-style'>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard"
    },
    "-webkit-border-before-width": {
      syntax: "<'border-width'>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "WebKit Extensions"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthZeroIfBorderStyleNoneOrHidden",
      order: "uniqueOrder",
      status: "nonstandard"
    },
    "-webkit-box-reflect": {
      syntax: "[ above | below | right | left ]? <length>? <image>?",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-box-reflect"
    },
    "-webkit-line-clamp": {
      syntax: "none | <integer>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "WebKit Extensions",
        "CSS Overflow"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-line-clamp"
    },
    "-webkit-mask": {
      syntax: "[ <mask-reference> || <position> [ / <bg-size> ]? || <repeat-style> || [ <box> | border | padding | content | text ] || [ <box> | border | padding | content ] ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: [
        "-webkit-mask-image",
        "-webkit-mask-repeat",
        "-webkit-mask-attachment",
        "-webkit-mask-position",
        "-webkit-mask-origin",
        "-webkit-mask-clip"
      ],
      appliesto: "allElements",
      computed: [
        "-webkit-mask-image",
        "-webkit-mask-repeat",
        "-webkit-mask-attachment",
        "-webkit-mask-position",
        "-webkit-mask-origin",
        "-webkit-mask-clip"
      ],
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask"
    },
    "-webkit-mask-attachment": {
      syntax: "<attachment>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "scroll",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-attachment"
    },
    "-webkit-mask-clip": {
      syntax: "[ <box> | border | padding | content | text ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "border",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-clip"
    },
    "-webkit-mask-composite": {
      syntax: "<composite-style>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "source-over",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-composite"
    },
    "-webkit-mask-image": {
      syntax: "<mask-reference>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "absoluteURIOrNone",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-image"
    },
    "-webkit-mask-origin": {
      syntax: "[ <box> | border | padding | content ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "padding",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-origin"
    },
    "-webkit-mask-position": {
      syntax: "<position>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "referToSizeOfElement",
      groups: [
        "WebKit Extensions"
      ],
      initial: "0% 0%",
      appliesto: "allElements",
      computed: "absoluteLengthOrPercentage",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-position"
    },
    "-webkit-mask-position-x": {
      syntax: "[ <length-percentage> | left | center | right ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "referToSizeOfElement",
      groups: [
        "WebKit Extensions"
      ],
      initial: "0%",
      appliesto: "allElements",
      computed: "absoluteLengthOrPercentage",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-position-x"
    },
    "-webkit-mask-position-y": {
      syntax: "[ <length-percentage> | top | center | bottom ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "referToSizeOfElement",
      groups: [
        "WebKit Extensions"
      ],
      initial: "0%",
      appliesto: "allElements",
      computed: "absoluteLengthOrPercentage",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-position-y"
    },
    "-webkit-mask-repeat": {
      syntax: "<repeat-style>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "repeat",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-repeat"
    },
    "-webkit-mask-repeat-x": {
      syntax: "repeat | no-repeat | space | round",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "repeat",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-repeat-x"
    },
    "-webkit-mask-repeat-y": {
      syntax: "repeat | no-repeat | space | round",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "repeat",
      appliesto: "allElements",
      computed: "absoluteLengthOrPercentage",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-mask-repeat-y"
    },
    "-webkit-mask-size": {
      syntax: "<bg-size>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "relativeToBackgroundPositioningArea",
      groups: [
        "WebKit Extensions"
      ],
      initial: "auto auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-size"
    },
    "-webkit-overflow-scrolling": {
      syntax: "auto | touch",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "auto",
      appliesto: "scrollingBoxes",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-overflow-scrolling"
    },
    "-webkit-tap-highlight-color": {
      syntax: "<color>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "black",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-tap-highlight-color"
    },
    "-webkit-text-fill-color": {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "color",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-text-fill-color"
    },
    "-webkit-text-stroke": {
      syntax: "<length> || <color>",
      media: "visual",
      inherited: true,
      animationType: [
        "-webkit-text-stroke-width",
        "-webkit-text-stroke-color"
      ],
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: [
        "-webkit-text-stroke-width",
        "-webkit-text-stroke-color"
      ],
      appliesto: "allElements",
      computed: [
        "-webkit-text-stroke-width",
        "-webkit-text-stroke-color"
      ],
      order: "canonicalOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-text-stroke"
    },
    "-webkit-text-stroke-color": {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "color",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-text-stroke-color"
    },
    "-webkit-text-stroke-width": {
      syntax: "<length>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "absoluteLength",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-text-stroke-width"
    },
    "-webkit-touch-callout": {
      syntax: "default | none",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "default",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/-webkit-touch-callout"
    },
    "-webkit-user-modify": {
      syntax: "read-only | read-write | read-write-plaintext-only",
      media: "interactive",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "WebKit Extensions"
      ],
      initial: "read-only",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard"
    },
    "align-content": {
      syntax: "normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Alignment"
      ],
      initial: "normal",
      appliesto: "multilineFlexContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/align-content"
    },
    "align-items": {
      syntax: "normal | stretch | <baseline-position> | [ <overflow-position>? <self-position> ]",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Alignment"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/align-items"
    },
    "align-self": {
      syntax: "auto | normal | stretch | <baseline-position> | <overflow-position>? <self-position>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Alignment"
      ],
      initial: "auto",
      appliesto: "flexItemsGridItemsAndAbsolutelyPositionedBoxes",
      computed: "autoOnAbsolutelyPositionedElementsValueOfAlignItemsOnParent",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/align-self"
    },
    "align-tracks": {
      syntax: "[ normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position> ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "normal",
      appliesto: "gridContainersWithMasonryLayoutInTheirBlockAxis",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/align-tracks"
    },
    all: {
      syntax: "initial | inherit | unset | revert",
      media: "noPracticalMedia",
      inherited: false,
      animationType: "eachOfShorthandPropertiesExceptUnicodeBiDiAndDirection",
      percentages: "no",
      groups: [
        "CSS Miscellaneous"
      ],
      initial: "noPracticalInitialValue",
      appliesto: "allElements",
      computed: "asSpecifiedAppliesToEachProperty",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/all"
    },
    animation: {
      syntax: "<single-animation>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Animations"
      ],
      initial: [
        "animation-name",
        "animation-duration",
        "animation-timing-function",
        "animation-delay",
        "animation-iteration-count",
        "animation-direction",
        "animation-fill-mode",
        "animation-play-state"
      ],
      appliesto: "allElementsAndPseudos",
      computed: [
        "animation-name",
        "animation-duration",
        "animation-timing-function",
        "animation-delay",
        "animation-direction",
        "animation-iteration-count",
        "animation-fill-mode",
        "animation-play-state"
      ],
      order: "orderOfAppearance",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/animation"
    },
    "animation-delay": {
      syntax: "<time>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Animations"
      ],
      initial: "0s",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/animation-delay"
    },
    "animation-direction": {
      syntax: "<single-animation-direction>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Animations"
      ],
      initial: "normal",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/animation-direction"
    },
    "animation-duration": {
      syntax: "<time>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Animations"
      ],
      initial: "0s",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/animation-duration"
    },
    "animation-fill-mode": {
      syntax: "<single-animation-fill-mode>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Animations"
      ],
      initial: "none",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/animation-fill-mode"
    },
    "animation-iteration-count": {
      syntax: "<single-animation-iteration-count>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Animations"
      ],
      initial: "1",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/animation-iteration-count"
    },
    "animation-name": {
      syntax: "[ none | <keyframes-name> ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Animations"
      ],
      initial: "none",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/animation-name"
    },
    "animation-play-state": {
      syntax: "<single-animation-play-state>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Animations"
      ],
      initial: "running",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/animation-play-state"
    },
    "animation-timing-function": {
      syntax: "<timing-function>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Animations"
      ],
      initial: "ease",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/animation-timing-function"
    },
    appearance: {
      syntax: "none | auto | textfield | menulist-button | <compat-auto>",
      media: "all",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/appearance"
    },
    "aspect-ratio": {
      syntax: "auto | <ratio>",
      media: "all",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "auto",
      appliesto: "allElementsExceptInlineBoxesAndInternalRubyOrTableBoxes",
      computed: "asSpecified",
      order: "perGrammar",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/aspect-ratio"
    },
    azimuth: {
      syntax: "<angle> | [ [ left-side | far-left | left | center-left | center | center-right | right | far-right | right-side ] || behind ] | leftwards | rightwards",
      media: "aural",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Speech"
      ],
      initial: "center",
      appliesto: "allElements",
      computed: "normalizedAngle",
      order: "orderOfAppearance",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/azimuth"
    },
    "backdrop-filter": {
      syntax: "none | <filter-function-list>",
      media: "visual",
      inherited: false,
      animationType: "filterList",
      percentages: "no",
      groups: [
        "Filter Effects"
      ],
      initial: "none",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/backdrop-filter"
    },
    "backface-visibility": {
      syntax: "visible | hidden",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Transforms"
      ],
      initial: "visible",
      appliesto: "transformableElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/backface-visibility"
    },
    background: {
      syntax: "[ <bg-layer> , ]* <final-bg-layer>",
      media: "visual",
      inherited: false,
      animationType: [
        "background-color",
        "background-image",
        "background-clip",
        "background-position",
        "background-size",
        "background-repeat",
        "background-attachment"
      ],
      percentages: [
        "background-position",
        "background-size"
      ],
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "background-image",
        "background-position",
        "background-size",
        "background-repeat",
        "background-origin",
        "background-clip",
        "background-attachment",
        "background-color"
      ],
      appliesto: "allElements",
      computed: [
        "background-image",
        "background-position",
        "background-size",
        "background-repeat",
        "background-origin",
        "background-clip",
        "background-attachment",
        "background-color"
      ],
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background"
    },
    "background-attachment": {
      syntax: "<attachment>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "scroll",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-attachment"
    },
    "background-blend-mode": {
      syntax: "<blend-mode>#",
      media: "none",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Compositing and Blending"
      ],
      initial: "normal",
      appliesto: "allElementsSVGContainerGraphicsAndGraphicsReferencingElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-blend-mode"
    },
    "background-clip": {
      syntax: "<box>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "border-box",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-clip"
    },
    "background-color": {
      syntax: "<color>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "transparent",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-color"
    },
    "background-image": {
      syntax: "<bg-image>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecifiedURLsAbsolute",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-image"
    },
    "background-origin": {
      syntax: "<box>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "padding-box",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-origin"
    },
    "background-position": {
      syntax: "<bg-position>#",
      media: "visual",
      inherited: false,
      animationType: "repeatableListOfSimpleListOfLpc",
      percentages: "referToSizeOfBackgroundPositioningAreaMinusBackgroundImageSize",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "0% 0%",
      appliesto: "allElements",
      computed: "listEachItemTwoKeywordsOriginOffsets",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-position"
    },
    "background-position-x": {
      syntax: "[ center | [ [ left | right | x-start | x-end ]? <length-percentage>? ]! ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "referToWidthOfBackgroundPositioningAreaMinusBackgroundImageHeight",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "left",
      appliesto: "allElements",
      computed: "listEachItemConsistingOfAbsoluteLengthPercentageAndOrigin",
      order: "uniqueOrder",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-position-x"
    },
    "background-position-y": {
      syntax: "[ center | [ [ top | bottom | y-start | y-end ]? <length-percentage>? ]! ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "referToHeightOfBackgroundPositioningAreaMinusBackgroundImageHeight",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "top",
      appliesto: "allElements",
      computed: "listEachItemConsistingOfAbsoluteLengthPercentageAndOrigin",
      order: "uniqueOrder",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-position-y"
    },
    "background-repeat": {
      syntax: "<repeat-style>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "repeat",
      appliesto: "allElements",
      computed: "listEachItemHasTwoKeywordsOnePerDimension",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-repeat"
    },
    "background-size": {
      syntax: "<bg-size>#",
      media: "visual",
      inherited: false,
      animationType: "repeatableListOfSimpleListOfLpc",
      percentages: "relativeToBackgroundPositioningArea",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "auto auto",
      appliesto: "allElements",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/background-size"
    },
    "block-overflow": {
      syntax: "clip | ellipsis | <string>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Overflow"
      ],
      initial: "clip",
      appliesto: "blockContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "experimental"
    },
    "block-size": {
      syntax: "<'width'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "blockSizeOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "auto",
      appliesto: "sameAsWidthAndHeight",
      computed: "sameAsWidthAndHeight",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/block-size"
    },
    border: {
      syntax: "<line-width> || <line-style> || <color>",
      media: "visual",
      inherited: false,
      animationType: [
        "border-color",
        "border-style",
        "border-width"
      ],
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "border-width",
        "border-style",
        "border-color"
      ],
      appliesto: "allElements",
      computed: [
        "border-width",
        "border-style",
        "border-color"
      ],
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border"
    },
    "border-block": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <'color'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: [
        "border-top-width",
        "border-top-style",
        "border-top-color"
      ],
      appliesto: "allElements",
      computed: [
        "border-top-width",
        "border-top-style",
        "border-top-color"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block"
    },
    "border-block-color": {
      syntax: "<'border-top-color'>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-color"
    },
    "border-block-style": {
      syntax: "<'border-top-style'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-style"
    },
    "border-block-width": {
      syntax: "<'border-top-width'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthZeroIfBorderStyleNoneOrHidden",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-width"
    },
    "border-block-end": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <'color'>",
      media: "visual",
      inherited: false,
      animationType: [
        "border-block-end-color",
        "border-block-end-style",
        "border-block-end-width"
      ],
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: [
        "border-top-width",
        "border-top-style",
        "border-top-color"
      ],
      appliesto: "allElements",
      computed: [
        "border-top-width",
        "border-top-style",
        "border-top-color"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-end"
    },
    "border-block-end-color": {
      syntax: "<'border-top-color'>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-end-color"
    },
    "border-block-end-style": {
      syntax: "<'border-top-style'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-end-style"
    },
    "border-block-end-width": {
      syntax: "<'border-top-width'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthZeroIfBorderStyleNoneOrHidden",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-end-width"
    },
    "border-block-start": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <'color'>",
      media: "visual",
      inherited: false,
      animationType: [
        "border-block-start-color",
        "border-block-start-style",
        "border-block-start-width"
      ],
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: [
        "border-width",
        "border-style",
        "color"
      ],
      appliesto: "allElements",
      computed: [
        "border-width",
        "border-style",
        "border-block-start-color"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-start"
    },
    "border-block-start-color": {
      syntax: "<'border-top-color'>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-start-color"
    },
    "border-block-start-style": {
      syntax: "<'border-top-style'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-start-style"
    },
    "border-block-start-width": {
      syntax: "<'border-top-width'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthZeroIfBorderStyleNoneOrHidden",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-block-start-width"
    },
    "border-bottom": {
      syntax: "<line-width> || <line-style> || <color>",
      media: "visual",
      inherited: false,
      animationType: [
        "border-bottom-color",
        "border-bottom-style",
        "border-bottom-width"
      ],
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "border-bottom-width",
        "border-bottom-style",
        "border-bottom-color"
      ],
      appliesto: "allElements",
      computed: [
        "border-bottom-width",
        "border-bottom-style",
        "border-bottom-color"
      ],
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom"
    },
    "border-bottom-color": {
      syntax: "<'border-top-color'>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom-color"
    },
    "border-bottom-left-radius": {
      syntax: "<length-percentage>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "0",
      appliesto: "allElementsUAsNotRequiredWhenCollapse",
      computed: "twoAbsoluteLengthOrPercentages",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom-left-radius"
    },
    "border-bottom-right-radius": {
      syntax: "<length-percentage>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "0",
      appliesto: "allElementsUAsNotRequiredWhenCollapse",
      computed: "twoAbsoluteLengthOrPercentages",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom-right-radius"
    },
    "border-bottom-style": {
      syntax: "<line-style>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom-style"
    },
    "border-bottom-width": {
      syntax: "<line-width>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthOr0IfBorderBottomStyleNoneOrHidden",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-bottom-width"
    },
    "border-collapse": {
      syntax: "collapse | separate",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Table"
      ],
      initial: "separate",
      appliesto: "tableElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-collapse"
    },
    "border-color": {
      syntax: "<color>{1,4}",
      media: "visual",
      inherited: false,
      animationType: [
        "border-bottom-color",
        "border-left-color",
        "border-right-color",
        "border-top-color"
      ],
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "border-top-color",
        "border-right-color",
        "border-bottom-color",
        "border-left-color"
      ],
      appliesto: "allElements",
      computed: [
        "border-bottom-color",
        "border-left-color",
        "border-right-color",
        "border-top-color"
      ],
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-color"
    },
    "border-end-end-radius": {
      syntax: "<length-percentage>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "allElementsUAsNotRequiredWhenCollapse",
      computed: "twoAbsoluteLengthOrPercentages",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-end-end-radius"
    },
    "border-end-start-radius": {
      syntax: "<length-percentage>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "allElementsUAsNotRequiredWhenCollapse",
      computed: "twoAbsoluteLengthOrPercentages",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-end-start-radius"
    },
    "border-image": {
      syntax: "<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: [
        "border-image-slice",
        "border-image-width"
      ],
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "border-image-source",
        "border-image-slice",
        "border-image-width",
        "border-image-outset",
        "border-image-repeat"
      ],
      appliesto: "allElementsExceptTableElementsWhenCollapse",
      computed: [
        "border-image-outset",
        "border-image-repeat",
        "border-image-slice",
        "border-image-source",
        "border-image-width"
      ],
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-image"
    },
    "border-image-outset": {
      syntax: "[ <length> | <number> ]{1,4}",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "0",
      appliesto: "allElementsExceptTableElementsWhenCollapse",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-image-outset"
    },
    "border-image-repeat": {
      syntax: "[ stretch | repeat | round | space ]{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "stretch",
      appliesto: "allElementsExceptTableElementsWhenCollapse",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-image-repeat"
    },
    "border-image-slice": {
      syntax: "<number-percentage>{1,4} && fill?",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "referToSizeOfBorderImage",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "100%",
      appliesto: "allElementsExceptTableElementsWhenCollapse",
      computed: "oneToFourPercentagesOrAbsoluteLengthsPlusFill",
      order: "percentagesOrLengthsFollowedByFill",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-image-slice"
    },
    "border-image-source": {
      syntax: "none | <image>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "none",
      appliesto: "allElementsExceptTableElementsWhenCollapse",
      computed: "noneOrImageWithAbsoluteURI",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-image-source"
    },
    "border-image-width": {
      syntax: "[ <length-percentage> | <number> | auto ]{1,4}",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "referToWidthOrHeightOfBorderImageArea",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "1",
      appliesto: "allElementsExceptTableElementsWhenCollapse",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-image-width"
    },
    "border-inline": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <'color'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: [
        "border-top-width",
        "border-top-style",
        "border-top-color"
      ],
      appliesto: "allElements",
      computed: [
        "border-top-width",
        "border-top-style",
        "border-top-color"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline"
    },
    "border-inline-end": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <'color'>",
      media: "visual",
      inherited: false,
      animationType: [
        "border-inline-end-color",
        "border-inline-end-style",
        "border-inline-end-width"
      ],
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: [
        "border-width",
        "border-style",
        "color"
      ],
      appliesto: "allElements",
      computed: [
        "border-width",
        "border-style",
        "border-inline-end-color"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-end"
    },
    "border-inline-color": {
      syntax: "<'border-top-color'>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-color"
    },
    "border-inline-style": {
      syntax: "<'border-top-style'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-style"
    },
    "border-inline-width": {
      syntax: "<'border-top-width'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthZeroIfBorderStyleNoneOrHidden",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-width"
    },
    "border-inline-end-color": {
      syntax: "<'border-top-color'>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-end-color"
    },
    "border-inline-end-style": {
      syntax: "<'border-top-style'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-end-style"
    },
    "border-inline-end-width": {
      syntax: "<'border-top-width'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthZeroIfBorderStyleNoneOrHidden",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-end-width"
    },
    "border-inline-start": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <'color'>",
      media: "visual",
      inherited: false,
      animationType: [
        "border-inline-start-color",
        "border-inline-start-style",
        "border-inline-start-width"
      ],
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: [
        "border-width",
        "border-style",
        "color"
      ],
      appliesto: "allElements",
      computed: [
        "border-width",
        "border-style",
        "border-inline-start-color"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-start"
    },
    "border-inline-start-color": {
      syntax: "<'border-top-color'>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-start-color"
    },
    "border-inline-start-style": {
      syntax: "<'border-top-style'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-start-style"
    },
    "border-inline-start-width": {
      syntax: "<'border-top-width'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthZeroIfBorderStyleNoneOrHidden",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-inline-start-width"
    },
    "border-left": {
      syntax: "<line-width> || <line-style> || <color>",
      media: "visual",
      inherited: false,
      animationType: [
        "border-left-color",
        "border-left-style",
        "border-left-width"
      ],
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "border-left-width",
        "border-left-style",
        "border-left-color"
      ],
      appliesto: "allElements",
      computed: [
        "border-left-width",
        "border-left-style",
        "border-left-color"
      ],
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-left"
    },
    "border-left-color": {
      syntax: "<color>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-left-color"
    },
    "border-left-style": {
      syntax: "<line-style>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-left-style"
    },
    "border-left-width": {
      syntax: "<line-width>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthOr0IfBorderLeftStyleNoneOrHidden",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-left-width"
    },
    "border-radius": {
      syntax: "<length-percentage>{1,4} [ / <length-percentage>{1,4} ]?",
      media: "visual",
      inherited: false,
      animationType: [
        "border-top-left-radius",
        "border-top-right-radius",
        "border-bottom-right-radius",
        "border-bottom-left-radius"
      ],
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "border-top-left-radius",
        "border-top-right-radius",
        "border-bottom-right-radius",
        "border-bottom-left-radius"
      ],
      appliesto: "allElementsUAsNotRequiredWhenCollapse",
      computed: [
        "border-bottom-left-radius",
        "border-bottom-right-radius",
        "border-top-left-radius",
        "border-top-right-radius"
      ],
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-radius"
    },
    "border-right": {
      syntax: "<line-width> || <line-style> || <color>",
      media: "visual",
      inherited: false,
      animationType: [
        "border-right-color",
        "border-right-style",
        "border-right-width"
      ],
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "border-right-width",
        "border-right-style",
        "border-right-color"
      ],
      appliesto: "allElements",
      computed: [
        "border-right-width",
        "border-right-style",
        "border-right-color"
      ],
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-right"
    },
    "border-right-color": {
      syntax: "<color>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-right-color"
    },
    "border-right-style": {
      syntax: "<line-style>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-right-style"
    },
    "border-right-width": {
      syntax: "<line-width>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthOr0IfBorderRightStyleNoneOrHidden",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-right-width"
    },
    "border-spacing": {
      syntax: "<length> <length>?",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Table"
      ],
      initial: "0",
      appliesto: "tableElements",
      computed: "twoAbsoluteLengths",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-spacing"
    },
    "border-start-end-radius": {
      syntax: "<length-percentage>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "allElementsUAsNotRequiredWhenCollapse",
      computed: "twoAbsoluteLengthOrPercentages",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-start-end-radius"
    },
    "border-start-start-radius": {
      syntax: "<length-percentage>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "allElementsUAsNotRequiredWhenCollapse",
      computed: "twoAbsoluteLengthOrPercentages",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-start-start-radius"
    },
    "border-style": {
      syntax: "<line-style>{1,4}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "border-top-style",
        "border-right-style",
        "border-bottom-style",
        "border-left-style"
      ],
      appliesto: "allElements",
      computed: [
        "border-bottom-style",
        "border-left-style",
        "border-right-style",
        "border-top-style"
      ],
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-style"
    },
    "border-top": {
      syntax: "<line-width> || <line-style> || <color>",
      media: "visual",
      inherited: false,
      animationType: [
        "border-top-color",
        "border-top-style",
        "border-top-width"
      ],
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "border-top-width",
        "border-top-style",
        "border-top-color"
      ],
      appliesto: "allElements",
      computed: [
        "border-top-width",
        "border-top-style",
        "border-top-color"
      ],
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-top"
    },
    "border-top-color": {
      syntax: "<color>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-top-color"
    },
    "border-top-left-radius": {
      syntax: "<length-percentage>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "0",
      appliesto: "allElementsUAsNotRequiredWhenCollapse",
      computed: "twoAbsoluteLengthOrPercentages",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-top-left-radius"
    },
    "border-top-right-radius": {
      syntax: "<length-percentage>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfBorderBox",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "0",
      appliesto: "allElementsUAsNotRequiredWhenCollapse",
      computed: "twoAbsoluteLengthOrPercentages",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-top-right-radius"
    },
    "border-top-style": {
      syntax: "<line-style>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-top-style"
    },
    "border-top-width": {
      syntax: "<line-width>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLengthOr0IfBorderTopStyleNoneOrHidden",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-top-width"
    },
    "border-width": {
      syntax: "<line-width>{1,4}",
      media: "visual",
      inherited: false,
      animationType: [
        "border-bottom-width",
        "border-left-width",
        "border-right-width",
        "border-top-width"
      ],
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: [
        "border-top-width",
        "border-right-width",
        "border-bottom-width",
        "border-left-width"
      ],
      appliesto: "allElements",
      computed: [
        "border-bottom-width",
        "border-left-width",
        "border-right-width",
        "border-top-width"
      ],
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/border-width"
    },
    bottom: {
      syntax: "<length> | <percentage> | auto",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToContainingBlockHeight",
      groups: [
        "CSS Positioning"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/bottom"
    },
    "box-align": {
      syntax: "start | center | end | baseline | stretch",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions",
        "WebKit Extensions"
      ],
      initial: "stretch",
      appliesto: "elementsWithDisplayBoxOrInlineBox",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-align"
    },
    "box-decoration-break": {
      syntax: "slice | clone",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fragmentation"
      ],
      initial: "slice",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-decoration-break"
    },
    "box-direction": {
      syntax: "normal | reverse | inherit",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions",
        "WebKit Extensions"
      ],
      initial: "normal",
      appliesto: "elementsWithDisplayBoxOrInlineBox",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-direction"
    },
    "box-flex": {
      syntax: "<number>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions",
        "WebKit Extensions"
      ],
      initial: "0",
      appliesto: "directChildrenOfElementsWithDisplayMozBoxMozInlineBox",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-flex"
    },
    "box-flex-group": {
      syntax: "<integer>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions",
        "WebKit Extensions"
      ],
      initial: "1",
      appliesto: "inFlowChildrenOfBoxElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-flex-group"
    },
    "box-lines": {
      syntax: "single | multiple",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions",
        "WebKit Extensions"
      ],
      initial: "single",
      appliesto: "boxElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-lines"
    },
    "box-ordinal-group": {
      syntax: "<integer>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions",
        "WebKit Extensions"
      ],
      initial: "1",
      appliesto: "childrenOfBoxElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-ordinal-group"
    },
    "box-orient": {
      syntax: "horizontal | vertical | inline-axis | block-axis | inherit",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions",
        "WebKit Extensions"
      ],
      initial: "inlineAxisHorizontalInXUL",
      appliesto: "elementsWithDisplayBoxOrInlineBox",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-orient"
    },
    "box-pack": {
      syntax: "start | center | end | justify",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions",
        "WebKit Extensions"
      ],
      initial: "start",
      appliesto: "elementsWithDisplayMozBoxMozInlineBox",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-pack"
    },
    "box-shadow": {
      syntax: "none | <shadow>#",
      media: "visual",
      inherited: false,
      animationType: "shadowList",
      percentages: "no",
      groups: [
        "CSS Backgrounds and Borders"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "absoluteLengthsSpecifiedColorAsSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-shadow"
    },
    "box-sizing": {
      syntax: "content-box | border-box",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "content-box",
      appliesto: "allElementsAcceptingWidthOrHeight",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/box-sizing"
    },
    "break-after": {
      syntax: "auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fragmentation"
      ],
      initial: "auto",
      appliesto: "blockLevelElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/break-after"
    },
    "break-before": {
      syntax: "auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fragmentation"
      ],
      initial: "auto",
      appliesto: "blockLevelElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/break-before"
    },
    "break-inside": {
      syntax: "auto | avoid | avoid-page | avoid-column | avoid-region",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fragmentation"
      ],
      initial: "auto",
      appliesto: "blockLevelElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/break-inside"
    },
    "caption-side": {
      syntax: "top | bottom | block-start | block-end | inline-start | inline-end",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Table"
      ],
      initial: "top",
      appliesto: "tableCaptionElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/caption-side"
    },
    "caret-color": {
      syntax: "auto | <color>",
      media: "interactive",
      inherited: true,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asAutoOrColor",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/caret-color"
    },
    clear: {
      syntax: "none | left | right | both | inline-start | inline-end",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Positioning"
      ],
      initial: "none",
      appliesto: "blockLevelElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/clear"
    },
    clip: {
      syntax: "<shape> | auto",
      media: "visual",
      inherited: false,
      animationType: "rectangle",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "auto",
      appliesto: "absolutelyPositionedElements",
      computed: "autoOrRectangle",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/clip"
    },
    "clip-path": {
      syntax: "<clip-source> | [ <basic-shape> || <geometry-box> ] | none",
      media: "visual",
      inherited: false,
      animationType: "basicShapeOtherwiseNo",
      percentages: "referToReferenceBoxWhenSpecifiedOtherwiseBorderBox",
      groups: [
        "CSS Masking"
      ],
      initial: "none",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecifiedURLsAbsolute",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/clip-path"
    },
    color: {
      syntax: "<color>",
      media: "visual",
      inherited: true,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Color"
      ],
      initial: "variesFromBrowserToBrowser",
      appliesto: "allElements",
      computed: "translucentValuesRGBAOtherwiseRGB",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/color"
    },
    "color-adjust": {
      syntax: "economy | exact",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Color"
      ],
      initial: "economy",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/color-adjust"
    },
    "column-count": {
      syntax: "<integer> | auto",
      media: "visual",
      inherited: false,
      animationType: "integer",
      percentages: "no",
      groups: [
        "CSS Columns"
      ],
      initial: "auto",
      appliesto: "blockContainersExceptTableWrappers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/column-count"
    },
    "column-fill": {
      syntax: "auto | balance | balance-all",
      media: "visualInContinuousMediaNoEffectInOverflowColumns",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Columns"
      ],
      initial: "balance",
      appliesto: "multicolElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/column-fill"
    },
    "column-gap": {
      syntax: "normal | <length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfContentArea",
      groups: [
        "CSS Box Alignment"
      ],
      initial: "normal",
      appliesto: "multiColumnElementsFlexContainersGridContainers",
      computed: "asSpecifiedWithLengthsAbsoluteAndNormalComputingToZeroExceptMultiColumn",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/column-gap"
    },
    "column-rule": {
      syntax: "<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>",
      media: "visual",
      inherited: false,
      animationType: [
        "column-rule-color",
        "column-rule-style",
        "column-rule-width"
      ],
      percentages: "no",
      groups: [
        "CSS Columns"
      ],
      initial: [
        "column-rule-width",
        "column-rule-style",
        "column-rule-color"
      ],
      appliesto: "multicolElements",
      computed: [
        "column-rule-color",
        "column-rule-style",
        "column-rule-width"
      ],
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/column-rule"
    },
    "column-rule-color": {
      syntax: "<color>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Columns"
      ],
      initial: "currentcolor",
      appliesto: "multicolElements",
      computed: "computedColor",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/column-rule-color"
    },
    "column-rule-style": {
      syntax: "<'border-style'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Columns"
      ],
      initial: "none",
      appliesto: "multicolElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/column-rule-style"
    },
    "column-rule-width": {
      syntax: "<'border-width'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Columns"
      ],
      initial: "medium",
      appliesto: "multicolElements",
      computed: "absoluteLength0IfColumnRuleStyleNoneOrHidden",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/column-rule-width"
    },
    "column-span": {
      syntax: "none | all",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Columns"
      ],
      initial: "none",
      appliesto: "inFlowBlockLevelElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/column-span"
    },
    "column-width": {
      syntax: "<length> | auto",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Columns"
      ],
      initial: "auto",
      appliesto: "blockContainersExceptTableWrappers",
      computed: "absoluteLengthZeroOrLarger",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/column-width"
    },
    columns: {
      syntax: "<'column-width'> || <'column-count'>",
      media: "visual",
      inherited: false,
      animationType: [
        "column-width",
        "column-count"
      ],
      percentages: "no",
      groups: [
        "CSS Columns"
      ],
      initial: [
        "column-width",
        "column-count"
      ],
      appliesto: "blockContainersExceptTableWrappers",
      computed: [
        "column-width",
        "column-count"
      ],
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/columns"
    },
    contain: {
      syntax: "none | strict | content | [ size || layout || style || paint ]",
      media: "all",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Containment"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/contain"
    },
    content: {
      syntax: "normal | none | [ <content-replacement> | <content-list> ] [/ <string> ]?",
      media: "all",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Generated Content"
      ],
      initial: "normal",
      appliesto: "beforeAndAfterPseudos",
      computed: "normalOnElementsForPseudosNoneAbsoluteURIStringOrAsSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/content"
    },
    "counter-increment": {
      syntax: "[ <custom-ident> <integer>? ]+ | none",
      media: "all",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Counter Styles"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/counter-increment"
    },
    "counter-reset": {
      syntax: "[ <custom-ident> <integer>? ]+ | none",
      media: "all",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Counter Styles"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/counter-reset"
    },
    "counter-set": {
      syntax: "[ <custom-ident> <integer>? ]+ | none",
      media: "all",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Counter Styles"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/counter-set"
    },
    cursor: {
      syntax: "[ [ <url> [ <x> <y> ]? , ]* [ auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing ] ]",
      media: [
        "visual",
        "interactive"
      ],
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecifiedURLsAbsolute",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/cursor"
    },
    direction: {
      syntax: "ltr | rtl",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Writing Modes"
      ],
      initial: "ltr",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/direction"
    },
    display: {
      syntax: "[ <display-outside> || <display-inside> ] | <display-listitem> | <display-internal> | <display-box> | <display-legacy>",
      media: "all",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Display"
      ],
      initial: "inline",
      appliesto: "allElements",
      computed: "asSpecifiedExceptPositionedFloatingAndRootElementsKeywordMaybeDifferent",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/display"
    },
    "empty-cells": {
      syntax: "show | hide",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Table"
      ],
      initial: "show",
      appliesto: "tableCellElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/empty-cells"
    },
    filter: {
      syntax: "none | <filter-function-list>",
      media: "visual",
      inherited: false,
      animationType: "filterList",
      percentages: "no",
      groups: [
        "Filter Effects"
      ],
      initial: "none",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/filter"
    },
    flex: {
      syntax: "none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]",
      media: "visual",
      inherited: false,
      animationType: [
        "flex-grow",
        "flex-shrink",
        "flex-basis"
      ],
      percentages: "no",
      groups: [
        "CSS Flexible Box Layout"
      ],
      initial: [
        "flex-grow",
        "flex-shrink",
        "flex-basis"
      ],
      appliesto: "flexItemsAndInFlowPseudos",
      computed: [
        "flex-grow",
        "flex-shrink",
        "flex-basis"
      ],
      order: "orderOfAppearance",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/flex"
    },
    "flex-basis": {
      syntax: "content | <'width'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToFlexContainersInnerMainSize",
      groups: [
        "CSS Flexible Box Layout"
      ],
      initial: "auto",
      appliesto: "flexItemsAndInFlowPseudos",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "lengthOrPercentageBeforeKeywordIfBothPresent",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/flex-basis"
    },
    "flex-direction": {
      syntax: "row | row-reverse | column | column-reverse",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Flexible Box Layout"
      ],
      initial: "row",
      appliesto: "flexContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/flex-direction"
    },
    "flex-flow": {
      syntax: "<'flex-direction'> || <'flex-wrap'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Flexible Box Layout"
      ],
      initial: [
        "flex-direction",
        "flex-wrap"
      ],
      appliesto: "flexContainers",
      computed: [
        "flex-direction",
        "flex-wrap"
      ],
      order: "orderOfAppearance",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/flex-flow"
    },
    "flex-grow": {
      syntax: "<number>",
      media: "visual",
      inherited: false,
      animationType: "number",
      percentages: "no",
      groups: [
        "CSS Flexible Box Layout"
      ],
      initial: "0",
      appliesto: "flexItemsAndInFlowPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/flex-grow"
    },
    "flex-shrink": {
      syntax: "<number>",
      media: "visual",
      inherited: false,
      animationType: "number",
      percentages: "no",
      groups: [
        "CSS Flexible Box Layout"
      ],
      initial: "1",
      appliesto: "flexItemsAndInFlowPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/flex-shrink"
    },
    "flex-wrap": {
      syntax: "nowrap | wrap | wrap-reverse",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Flexible Box Layout"
      ],
      initial: "nowrap",
      appliesto: "flexContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/flex-wrap"
    },
    float: {
      syntax: "left | right | none | inline-start | inline-end",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Positioning"
      ],
      initial: "none",
      appliesto: "allElementsNoEffectIfDisplayNone",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/float"
    },
    font: {
      syntax: "[ [ <'font-style'> || <font-variant-css21> || <'font-weight'> || <'font-stretch'> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'> ] | caption | icon | menu | message-box | small-caption | status-bar",
      media: "visual",
      inherited: true,
      animationType: [
        "font-style",
        "font-variant",
        "font-weight",
        "font-stretch",
        "font-size",
        "line-height",
        "font-family"
      ],
      percentages: [
        "font-size",
        "line-height"
      ],
      groups: [
        "CSS Fonts"
      ],
      initial: [
        "font-style",
        "font-variant",
        "font-weight",
        "font-stretch",
        "font-size",
        "line-height",
        "font-family"
      ],
      appliesto: "allElements",
      computed: [
        "font-style",
        "font-variant",
        "font-weight",
        "font-stretch",
        "font-size",
        "line-height",
        "font-family"
      ],
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font"
    },
    "font-family": {
      syntax: "[ <family-name> | <generic-family> ]#",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "dependsOnUserAgent",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-family"
    },
    "font-feature-settings": {
      syntax: "normal | <feature-tag-value>#",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-feature-settings"
    },
    "font-kerning": {
      syntax: "auto | normal | none",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-kerning"
    },
    "font-language-override": {
      syntax: "normal | <string>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-language-override"
    },
    "font-optical-sizing": {
      syntax: "auto | none",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-optical-sizing"
    },
    "font-variation-settings": {
      syntax: "normal | [ <string> <number> ]#",
      media: "visual",
      inherited: true,
      animationType: "transform",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-variation-settings"
    },
    "font-size": {
      syntax: "<absolute-size> | <relative-size> | <length-percentage>",
      media: "visual",
      inherited: true,
      animationType: "length",
      percentages: "referToParentElementsFontSize",
      groups: [
        "CSS Fonts"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-size"
    },
    "font-size-adjust": {
      syntax: "none | <number>",
      media: "visual",
      inherited: true,
      animationType: "number",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-size-adjust"
    },
    "font-smooth": {
      syntax: "auto | never | always | <absolute-size> | <length>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-smooth"
    },
    "font-stretch": {
      syntax: "<font-stretch-absolute>",
      media: "visual",
      inherited: true,
      animationType: "fontStretch",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-stretch"
    },
    "font-style": {
      syntax: "normal | italic | oblique <angle>?",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-style"
    },
    "font-synthesis": {
      syntax: "none | [ weight || style ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "weight style",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-synthesis"
    },
    "font-variant": {
      syntax: "normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-variant"
    },
    "font-variant-alternates": {
      syntax: "normal | [ stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-alternates"
    },
    "font-variant-caps": {
      syntax: "normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-caps"
    },
    "font-variant-east-asian": {
      syntax: "normal | [ <east-asian-variant-values> || <east-asian-width-values> || ruby ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-east-asian"
    },
    "font-variant-ligatures": {
      syntax: "normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-ligatures"
    },
    "font-variant-numeric": {
      syntax: "normal | [ <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-numeric"
    },
    "font-variant-position": {
      syntax: "normal | sub | super",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-variant-position"
    },
    "font-weight": {
      syntax: "<font-weight-absolute> | bolder | lighter",
      media: "visual",
      inherited: true,
      animationType: "fontWeight",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "keywordOrNumericalValueBolderLighterTransformedToRealValue",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/font-weight"
    },
    gap: {
      syntax: "<'row-gap'> <'column-gap'>?",
      media: "visual",
      inherited: false,
      animationType: [
        "row-gap",
        "column-gap"
      ],
      percentages: "no",
      groups: [
        "CSS Box Alignment"
      ],
      initial: [
        "row-gap",
        "column-gap"
      ],
      appliesto: "multiColumnElementsFlexContainersGridContainers",
      computed: [
        "row-gap",
        "column-gap"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/gap"
    },
    grid: {
      syntax: "<'grid-template'> | <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? | [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: [
        "grid-template-rows",
        "grid-template-columns",
        "grid-auto-rows",
        "grid-auto-columns"
      ],
      groups: [
        "CSS Grid Layout"
      ],
      initial: [
        "grid-template-rows",
        "grid-template-columns",
        "grid-template-areas",
        "grid-auto-rows",
        "grid-auto-columns",
        "grid-auto-flow",
        "grid-column-gap",
        "grid-row-gap",
        "column-gap",
        "row-gap"
      ],
      appliesto: "gridContainers",
      computed: [
        "grid-template-rows",
        "grid-template-columns",
        "grid-template-areas",
        "grid-auto-rows",
        "grid-auto-columns",
        "grid-auto-flow",
        "grid-column-gap",
        "grid-row-gap",
        "column-gap",
        "row-gap"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid"
    },
    "grid-area": {
      syntax: "<grid-line> [ / <grid-line> ]{0,3}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: [
        "grid-row-start",
        "grid-column-start",
        "grid-row-end",
        "grid-column-end"
      ],
      appliesto: "gridItemsAndBoxesWithinGridContainer",
      computed: [
        "grid-row-start",
        "grid-column-start",
        "grid-row-end",
        "grid-column-end"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-area"
    },
    "grid-auto-columns": {
      syntax: "<track-size>+",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "referToDimensionOfContentArea",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "auto",
      appliesto: "gridContainers",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-auto-columns"
    },
    "grid-auto-flow": {
      syntax: "[ row | column ] || dense",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "row",
      appliesto: "gridContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-auto-flow"
    },
    "grid-auto-rows": {
      syntax: "<track-size>+",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "referToDimensionOfContentArea",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "auto",
      appliesto: "gridContainers",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-auto-rows"
    },
    "grid-column": {
      syntax: "<grid-line> [ / <grid-line> ]?",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: [
        "grid-column-start",
        "grid-column-end"
      ],
      appliesto: "gridItemsAndBoxesWithinGridContainer",
      computed: [
        "grid-column-start",
        "grid-column-end"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-column"
    },
    "grid-column-end": {
      syntax: "<grid-line>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "auto",
      appliesto: "gridItemsAndBoxesWithinGridContainer",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-column-end"
    },
    "grid-column-gap": {
      syntax: "<length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToDimensionOfContentArea",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "0",
      appliesto: "gridContainers",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/column-gap"
    },
    "grid-column-start": {
      syntax: "<grid-line>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "auto",
      appliesto: "gridItemsAndBoxesWithinGridContainer",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-column-start"
    },
    "grid-gap": {
      syntax: "<'grid-row-gap'> <'grid-column-gap'>?",
      media: "visual",
      inherited: false,
      animationType: [
        "grid-row-gap",
        "grid-column-gap"
      ],
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: [
        "grid-row-gap",
        "grid-column-gap"
      ],
      appliesto: "gridContainers",
      computed: [
        "grid-row-gap",
        "grid-column-gap"
      ],
      order: "uniqueOrder",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/gap"
    },
    "grid-row": {
      syntax: "<grid-line> [ / <grid-line> ]?",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: [
        "grid-row-start",
        "grid-row-end"
      ],
      appliesto: "gridItemsAndBoxesWithinGridContainer",
      computed: [
        "grid-row-start",
        "grid-row-end"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-row"
    },
    "grid-row-end": {
      syntax: "<grid-line>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "auto",
      appliesto: "gridItemsAndBoxesWithinGridContainer",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-row-end"
    },
    "grid-row-gap": {
      syntax: "<length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToDimensionOfContentArea",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "0",
      appliesto: "gridContainers",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/row-gap"
    },
    "grid-row-start": {
      syntax: "<grid-line>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "auto",
      appliesto: "gridItemsAndBoxesWithinGridContainer",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-row-start"
    },
    "grid-template": {
      syntax: "none | [ <'grid-template-rows'> / <'grid-template-columns'> ] | [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: [
        "grid-template-columns",
        "grid-template-rows"
      ],
      groups: [
        "CSS Grid Layout"
      ],
      initial: [
        "grid-template-columns",
        "grid-template-rows",
        "grid-template-areas"
      ],
      appliesto: "gridContainers",
      computed: [
        "grid-template-columns",
        "grid-template-rows",
        "grid-template-areas"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-template"
    },
    "grid-template-areas": {
      syntax: "none | <string>+",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "none",
      appliesto: "gridContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-template-areas"
    },
    "grid-template-columns": {
      syntax: "none | <track-list> | <auto-track-list> | subgrid <line-name-list>?",
      media: "visual",
      inherited: false,
      animationType: "simpleListOfLpcDifferenceLpc",
      percentages: "referToDimensionOfContentArea",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "none",
      appliesto: "gridContainers",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-template-columns"
    },
    "grid-template-rows": {
      syntax: "none | <track-list> | <auto-track-list> | subgrid <line-name-list>?",
      media: "visual",
      inherited: false,
      animationType: "simpleListOfLpcDifferenceLpc",
      percentages: "referToDimensionOfContentArea",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "none",
      appliesto: "gridContainers",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/grid-template-rows"
    },
    "hanging-punctuation": {
      syntax: "none | [ first || [ force-end | allow-end ] || last ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/hanging-punctuation"
    },
    height: {
      syntax: "auto | <length> | <percentage> | min-content | max-content | fit-content(<length-percentage>)",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "regardingHeightOfGeneratedBoxContainingBlockPercentagesRelativeToContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "auto",
      appliesto: "allElementsButNonReplacedAndTableColumns",
      computed: "percentageAutoOrAbsoluteLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/height"
    },
    hyphens: {
      syntax: "none | manual | auto",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "manual",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/hyphens"
    },
    "image-orientation": {
      syntax: "from-image | <angle> | [ <angle>? flip ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Images"
      ],
      initial: "from-image",
      appliesto: "allElements",
      computed: "angleRoundedToNextQuarter",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/image-orientation"
    },
    "image-rendering": {
      syntax: "auto | crisp-edges | pixelated",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Images"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/image-rendering"
    },
    "image-resolution": {
      syntax: "[ from-image || <resolution> ] && snap?",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Images"
      ],
      initial: "1dppx",
      appliesto: "allElements",
      computed: "asSpecifiedWithExceptionOfResolution",
      order: "uniqueOrder",
      status: "experimental"
    },
    "ime-mode": {
      syntax: "auto | normal | active | inactive | disabled",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "auto",
      appliesto: "textFields",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/ime-mode"
    },
    "initial-letter": {
      syntax: "normal | [ <number> <integer>? ]",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Inline"
      ],
      initial: "normal",
      appliesto: "firstLetterPseudoElementsAndInlineLevelFirstChildren",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/initial-letter"
    },
    "initial-letter-align": {
      syntax: "[ auto | alphabetic | hanging | ideographic ]",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Inline"
      ],
      initial: "auto",
      appliesto: "firstLetterPseudoElementsAndInlineLevelFirstChildren",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/initial-letter-align"
    },
    "inline-size": {
      syntax: "<'width'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "inlineSizeOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "auto",
      appliesto: "sameAsWidthAndHeight",
      computed: "sameAsWidthAndHeight",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/inline-size"
    },
    inset: {
      syntax: "<'top'>{1,4}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "logicalHeightOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "sameAsBoxOffsets",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/inset"
    },
    "inset-block": {
      syntax: "<'top'>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "logicalHeightOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "sameAsBoxOffsets",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/inset-block"
    },
    "inset-block-end": {
      syntax: "<'top'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "logicalHeightOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "sameAsBoxOffsets",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/inset-block-end"
    },
    "inset-block-start": {
      syntax: "<'top'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "logicalHeightOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "sameAsBoxOffsets",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/inset-block-start"
    },
    "inset-inline": {
      syntax: "<'top'>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "sameAsBoxOffsets",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/inset-inline"
    },
    "inset-inline-end": {
      syntax: "<'top'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "sameAsBoxOffsets",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/inset-inline-end"
    },
    "inset-inline-start": {
      syntax: "<'top'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "sameAsBoxOffsets",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/inset-inline-start"
    },
    isolation: {
      syntax: "auto | isolate",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Compositing and Blending"
      ],
      initial: "auto",
      appliesto: "allElementsSVGContainerGraphicsAndGraphicsReferencingElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/isolation"
    },
    "justify-content": {
      syntax: "normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ]",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Alignment"
      ],
      initial: "normal",
      appliesto: "flexContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/justify-content"
    },
    "justify-items": {
      syntax: "normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ] | legacy | legacy && [ left | right | center ]",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Alignment"
      ],
      initial: "legacy",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/justify-items"
    },
    "justify-self": {
      syntax: "auto | normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ]",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Alignment"
      ],
      initial: "auto",
      appliesto: "blockLevelBoxesAndAbsolutelyPositionedBoxesAndGridItems",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/justify-self"
    },
    "justify-tracks": {
      syntax: "[ normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ] ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "normal",
      appliesto: "gridContainersWithMasonryLayoutInTheirInlineAxis",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/justify-tracks"
    },
    left: {
      syntax: "<length> | <percentage> | auto",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Positioning"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/left"
    },
    "letter-spacing": {
      syntax: "normal | <length>",
      media: "visual",
      inherited: true,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "optimumValueOfAbsoluteLengthOrNormal",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/letter-spacing"
    },
    "line-break": {
      syntax: "auto | loose | normal | strict | anywhere",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/line-break"
    },
    "line-clamp": {
      syntax: "none | <integer>",
      media: "visual",
      inherited: false,
      animationType: "integer",
      percentages: "no",
      groups: [
        "CSS Overflow"
      ],
      initial: "none",
      appliesto: "blockContainersExceptMultiColumnContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "experimental"
    },
    "line-height": {
      syntax: "normal | <number> | <length> | <percentage>",
      media: "visual",
      inherited: true,
      animationType: "numberOrLength",
      percentages: "referToElementFontSize",
      groups: [
        "CSS Fonts"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "absoluteLengthOrAsSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/line-height"
    },
    "line-height-step": {
      syntax: "<length>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fonts"
      ],
      initial: "0",
      appliesto: "blockContainers",
      computed: "absoluteLength",
      order: "perGrammar",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/line-height-step"
    },
    "list-style": {
      syntax: "<'list-style-type'> || <'list-style-position'> || <'list-style-image'>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Lists and Counters"
      ],
      initial: [
        "list-style-type",
        "list-style-position",
        "list-style-image"
      ],
      appliesto: "listItems",
      computed: [
        "list-style-image",
        "list-style-position",
        "list-style-type"
      ],
      order: "orderOfAppearance",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/list-style"
    },
    "list-style-image": {
      syntax: "<url> | none",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Lists and Counters"
      ],
      initial: "none",
      appliesto: "listItems",
      computed: "noneOrImageWithAbsoluteURI",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/list-style-image"
    },
    "list-style-position": {
      syntax: "inside | outside",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Lists and Counters"
      ],
      initial: "outside",
      appliesto: "listItems",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/list-style-position"
    },
    "list-style-type": {
      syntax: "<counter-style> | <string> | none",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Lists and Counters"
      ],
      initial: "disc",
      appliesto: "listItems",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/list-style-type"
    },
    margin: {
      syntax: "[ <length> | <percentage> | auto ]{1,4}",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: [
        "margin-bottom",
        "margin-left",
        "margin-right",
        "margin-top"
      ],
      appliesto: "allElementsExceptTableDisplayTypes",
      computed: [
        "margin-bottom",
        "margin-left",
        "margin-right",
        "margin-top"
      ],
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin"
    },
    "margin-block": {
      syntax: "<'margin-left'>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "dependsOnLayoutModel",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "sameAsMargin",
      computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-block"
    },
    "margin-block-end": {
      syntax: "<'margin-left'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "dependsOnLayoutModel",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "sameAsMargin",
      computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-block-end"
    },
    "margin-block-start": {
      syntax: "<'margin-left'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "dependsOnLayoutModel",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "sameAsMargin",
      computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-block-start"
    },
    "margin-bottom": {
      syntax: "<length> | <percentage> | auto",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "0",
      appliesto: "allElementsExceptTableDisplayTypes",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-bottom"
    },
    "margin-inline": {
      syntax: "<'margin-left'>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "dependsOnLayoutModel",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "sameAsMargin",
      computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-inline"
    },
    "margin-inline-end": {
      syntax: "<'margin-left'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "dependsOnLayoutModel",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "sameAsMargin",
      computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-inline-end"
    },
    "margin-inline-start": {
      syntax: "<'margin-left'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "dependsOnLayoutModel",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "sameAsMargin",
      computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-inline-start"
    },
    "margin-left": {
      syntax: "<length> | <percentage> | auto",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "0",
      appliesto: "allElementsExceptTableDisplayTypes",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-left"
    },
    "margin-right": {
      syntax: "<length> | <percentage> | auto",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "0",
      appliesto: "allElementsExceptTableDisplayTypes",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-right"
    },
    "margin-top": {
      syntax: "<length> | <percentage> | auto",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "0",
      appliesto: "allElementsExceptTableDisplayTypes",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-top"
    },
    "margin-trim": {
      syntax: "none | in-flow | all",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Model"
      ],
      initial: "none",
      appliesto: "blockContainersAndMultiColumnContainers",
      computed: "asSpecified",
      order: "perGrammar",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/margin-trim"
    },
    mask: {
      syntax: "<mask-layer>#",
      media: "visual",
      inherited: false,
      animationType: [
        "mask-image",
        "mask-mode",
        "mask-repeat",
        "mask-position",
        "mask-clip",
        "mask-origin",
        "mask-size",
        "mask-composite"
      ],
      percentages: [
        "mask-position"
      ],
      groups: [
        "CSS Masking"
      ],
      initial: [
        "mask-image",
        "mask-mode",
        "mask-repeat",
        "mask-position",
        "mask-clip",
        "mask-origin",
        "mask-size",
        "mask-composite"
      ],
      appliesto: "allElementsSVGContainerElements",
      computed: [
        "mask-image",
        "mask-mode",
        "mask-repeat",
        "mask-position",
        "mask-clip",
        "mask-origin",
        "mask-size",
        "mask-composite"
      ],
      order: "perGrammar",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask"
    },
    "mask-border": {
      syntax: "<'mask-border-source'> || <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? || <'mask-border-repeat'> || <'mask-border-mode'>",
      media: "visual",
      inherited: false,
      animationType: [
        "mask-border-mode",
        "mask-border-outset",
        "mask-border-repeat",
        "mask-border-slice",
        "mask-border-source",
        "mask-border-width"
      ],
      percentages: [
        "mask-border-slice",
        "mask-border-width"
      ],
      groups: [
        "CSS Masking"
      ],
      initial: [
        "mask-border-mode",
        "mask-border-outset",
        "mask-border-repeat",
        "mask-border-slice",
        "mask-border-source",
        "mask-border-width"
      ],
      appliesto: "allElementsSVGContainerElements",
      computed: [
        "mask-border-mode",
        "mask-border-outset",
        "mask-border-repeat",
        "mask-border-slice",
        "mask-border-source",
        "mask-border-width"
      ],
      order: "perGrammar",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-border"
    },
    "mask-border-mode": {
      syntax: "luminance | alpha",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "alpha",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-mode"
    },
    "mask-border-outset": {
      syntax: "[ <length> | <number> ]{1,4}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "0",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-outset"
    },
    "mask-border-repeat": {
      syntax: "[ stretch | repeat | round | space ]{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "stretch",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-repeat"
    },
    "mask-border-slice": {
      syntax: "<number-percentage>{1,4} fill?",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "referToSizeOfMaskBorderImage",
      groups: [
        "CSS Masking"
      ],
      initial: "0",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-slice"
    },
    "mask-border-source": {
      syntax: "none | <image>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "none",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecifiedURLsAbsolute",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-source"
    },
    "mask-border-width": {
      syntax: "[ <length-percentage> | <number> | auto ]{1,4}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "relativeToMaskBorderImageArea",
      groups: [
        "CSS Masking"
      ],
      initial: "auto",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-border-width"
    },
    "mask-clip": {
      syntax: "[ <geometry-box> | no-clip ]#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "border-box",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-clip"
    },
    "mask-composite": {
      syntax: "<compositing-operator>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "add",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-composite"
    },
    "mask-image": {
      syntax: "<mask-reference>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "none",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecifiedURLsAbsolute",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-image"
    },
    "mask-mode": {
      syntax: "<masking-mode>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "match-source",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-mode"
    },
    "mask-origin": {
      syntax: "<geometry-box>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "border-box",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-origin"
    },
    "mask-position": {
      syntax: "<position>#",
      media: "visual",
      inherited: false,
      animationType: "repeatableListOfSimpleListOfLpc",
      percentages: "referToSizeOfMaskPaintingArea",
      groups: [
        "CSS Masking"
      ],
      initial: "center",
      appliesto: "allElementsSVGContainerElements",
      computed: "consistsOfTwoKeywordsForOriginAndOffsets",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-position"
    },
    "mask-repeat": {
      syntax: "<repeat-style>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "no-repeat",
      appliesto: "allElementsSVGContainerElements",
      computed: "consistsOfTwoDimensionKeywords",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-repeat"
    },
    "mask-size": {
      syntax: "<bg-size>#",
      media: "visual",
      inherited: false,
      animationType: "repeatableListOfSimpleListOfLpc",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "auto",
      appliesto: "allElementsSVGContainerElements",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-size"
    },
    "mask-type": {
      syntax: "luminance | alpha",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Masking"
      ],
      initial: "luminance",
      appliesto: "maskElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mask-type"
    },
    "masonry-auto-flow": {
      syntax: "[ pack | next ] || [ definite-first | ordered ]",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Grid Layout"
      ],
      initial: "pack",
      appliesto: "gridContainersWithMasonryLayout",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/masonry-auto-flow"
    },
    "math-style": {
      syntax: "normal | compact",
      media: "visual",
      inherited: true,
      animationType: "notAnimatable",
      percentages: "no",
      groups: [
        "MathML"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/math-style"
    },
    "max-block-size": {
      syntax: "<'max-width'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "blockSizeOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "sameAsWidthAndHeight",
      computed: "sameAsMaxWidthAndMaxHeight",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/max-block-size"
    },
    "max-height": {
      syntax: "none | <length-percentage> | min-content | max-content | fit-content(<length-percentage>)",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "regardingHeightOfGeneratedBoxContainingBlockPercentagesNone",
      groups: [
        "CSS Box Model"
      ],
      initial: "none",
      appliesto: "allElementsButNonReplacedAndTableColumns",
      computed: "percentageAsSpecifiedAbsoluteLengthOrNone",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/max-height"
    },
    "max-inline-size": {
      syntax: "<'max-width'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "inlineSizeOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "sameAsWidthAndHeight",
      computed: "sameAsMaxWidthAndMaxHeight",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/max-inline-size"
    },
    "max-lines": {
      syntax: "none | <integer>",
      media: "visual",
      inherited: false,
      animationType: "integer",
      percentages: "no",
      groups: [
        "CSS Overflow"
      ],
      initial: "none",
      appliesto: "blockContainersExceptMultiColumnContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "experimental"
    },
    "max-width": {
      syntax: "none | <length-percentage> | min-content | max-content | fit-content(<length-percentage>)",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "none",
      appliesto: "allElementsButNonReplacedAndTableRows",
      computed: "percentageAsSpecifiedAbsoluteLengthOrNone",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/max-width"
    },
    "min-block-size": {
      syntax: "<'min-width'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "blockSizeOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "sameAsWidthAndHeight",
      computed: "sameAsMinWidthAndMinHeight",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/min-block-size"
    },
    "min-height": {
      syntax: "auto | <length> | <percentage> | min-content | max-content | fit-content(<length-percentage>)",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "regardingHeightOfGeneratedBoxContainingBlockPercentages0",
      groups: [
        "CSS Box Model"
      ],
      initial: "auto",
      appliesto: "allElementsButNonReplacedAndTableColumns",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/min-height"
    },
    "min-inline-size": {
      syntax: "<'min-width'>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "inlineSizeOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "sameAsWidthAndHeight",
      computed: "sameAsMinWidthAndMinHeight",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/min-inline-size"
    },
    "min-width": {
      syntax: "auto | <length> | <percentage> | min-content | max-content | fit-content(<length-percentage>)",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "auto",
      appliesto: "allElementsButNonReplacedAndTableRows",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/min-width"
    },
    "mix-blend-mode": {
      syntax: "<blend-mode>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Compositing and Blending"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/mix-blend-mode"
    },
    "object-fit": {
      syntax: "fill | contain | cover | none | scale-down",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Images"
      ],
      initial: "fill",
      appliesto: "replacedElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/object-fit"
    },
    "object-position": {
      syntax: "<position>",
      media: "visual",
      inherited: true,
      animationType: "repeatableListOfSimpleListOfLpc",
      percentages: "referToWidthAndHeightOfElement",
      groups: [
        "CSS Images"
      ],
      initial: "50% 50%",
      appliesto: "replacedElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/object-position"
    },
    offset: {
      syntax: "[ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> || <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]?",
      media: "visual",
      inherited: false,
      animationType: [
        "offset-position",
        "offset-path",
        "offset-distance",
        "offset-anchor",
        "offset-rotate"
      ],
      percentages: [
        "offset-position",
        "offset-distance",
        "offset-anchor"
      ],
      groups: [
        "CSS Motion Path"
      ],
      initial: [
        "offset-position",
        "offset-path",
        "offset-distance",
        "offset-anchor",
        "offset-rotate"
      ],
      appliesto: "transformableElements",
      computed: [
        "offset-position",
        "offset-path",
        "offset-distance",
        "offset-anchor",
        "offset-rotate"
      ],
      order: "perGrammar",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/offset"
    },
    "offset-anchor": {
      syntax: "auto | <position>",
      media: "visual",
      inherited: false,
      animationType: "position",
      percentages: "relativeToWidthAndHeight",
      groups: [
        "CSS Motion Path"
      ],
      initial: "auto",
      appliesto: "transformableElements",
      computed: "forLengthAbsoluteValueOtherwisePercentage",
      order: "perGrammar",
      status: "standard"
    },
    "offset-distance": {
      syntax: "<length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToTotalPathLength",
      groups: [
        "CSS Motion Path"
      ],
      initial: "0",
      appliesto: "transformableElements",
      computed: "forLengthAbsoluteValueOtherwisePercentage",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/offset-distance"
    },
    "offset-path": {
      syntax: "none | ray( [ <angle> && <size> && contain? ] ) | <path()> | <url> | [ <basic-shape> || <geometry-box> ]",
      media: "visual",
      inherited: false,
      animationType: "angleOrBasicShapeOrPath",
      percentages: "no",
      groups: [
        "CSS Motion Path"
      ],
      initial: "none",
      appliesto: "transformableElements",
      computed: "asSpecified",
      order: "perGrammar",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/offset-path"
    },
    "offset-position": {
      syntax: "auto | <position>",
      media: "visual",
      inherited: false,
      animationType: "position",
      percentages: "referToSizeOfContainingBlock",
      groups: [
        "CSS Motion Path"
      ],
      initial: "auto",
      appliesto: "transformableElements",
      computed: "forLengthAbsoluteValueOtherwisePercentage",
      order: "perGrammar",
      status: "experimental"
    },
    "offset-rotate": {
      syntax: "[ auto | reverse ] || <angle>",
      media: "visual",
      inherited: false,
      animationType: "angleOrBasicShapeOrPath",
      percentages: "no",
      groups: [
        "CSS Motion Path"
      ],
      initial: "auto",
      appliesto: "transformableElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/offset-rotate"
    },
    opacity: {
      syntax: "<alpha-value>",
      media: "visual",
      inherited: false,
      animationType: "number",
      percentages: "no",
      groups: [
        "CSS Color"
      ],
      initial: "1.0",
      appliesto: "allElements",
      computed: "specifiedValueClipped0To1",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/opacity"
    },
    order: {
      syntax: "<integer>",
      media: "visual",
      inherited: false,
      animationType: "integer",
      percentages: "no",
      groups: [
        "CSS Flexible Box Layout"
      ],
      initial: "0",
      appliesto: "flexItemsGridItemsAbsolutelyPositionedContainerChildren",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/order"
    },
    orphans: {
      syntax: "<integer>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fragmentation"
      ],
      initial: "2",
      appliesto: "blockContainerElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/orphans"
    },
    outline: {
      syntax: "[ <'outline-color'> || <'outline-style'> || <'outline-width'> ]",
      media: [
        "visual",
        "interactive"
      ],
      inherited: false,
      animationType: [
        "outline-color",
        "outline-width",
        "outline-style"
      ],
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: [
        "outline-color",
        "outline-style",
        "outline-width"
      ],
      appliesto: "allElements",
      computed: [
        "outline-color",
        "outline-width",
        "outline-style"
      ],
      order: "orderOfAppearance",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/outline"
    },
    "outline-color": {
      syntax: "<color> | invert",
      media: [
        "visual",
        "interactive"
      ],
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "invertOrCurrentColor",
      appliesto: "allElements",
      computed: "invertForTranslucentColorRGBAOtherwiseRGB",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/outline-color"
    },
    "outline-offset": {
      syntax: "<length>",
      media: [
        "visual",
        "interactive"
      ],
      inherited: false,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/outline-offset"
    },
    "outline-style": {
      syntax: "auto | <'border-style'>",
      media: [
        "visual",
        "interactive"
      ],
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/outline-style"
    },
    "outline-width": {
      syntax: "<line-width>",
      media: [
        "visual",
        "interactive"
      ],
      inherited: false,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "medium",
      appliesto: "allElements",
      computed: "absoluteLength0ForNone",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/outline-width"
    },
    overflow: {
      syntax: "[ visible | hidden | clip | scroll | auto ]{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Overflow"
      ],
      initial: "visible",
      appliesto: "blockContainersFlexContainersGridContainers",
      computed: [
        "overflow-x",
        "overflow-y"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/overflow"
    },
    "overflow-anchor": {
      syntax: "auto | none",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Scroll Anchoring"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard"
    },
    "overflow-block": {
      syntax: "visible | hidden | clip | scroll | auto",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Overflow"
      ],
      initial: "auto",
      appliesto: "blockContainersFlexContainersGridContainers",
      computed: "asSpecifiedButVisibleOrClipReplacedToAutoOrHiddenIfOtherValueDifferent",
      order: "perGrammar",
      status: "standard"
    },
    "overflow-clip-box": {
      syntax: "padding-box | content-box",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Mozilla Extensions"
      ],
      initial: "padding-box",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Mozilla/CSS/overflow-clip-box"
    },
    "overflow-inline": {
      syntax: "visible | hidden | clip | scroll | auto",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Overflow"
      ],
      initial: "auto",
      appliesto: "blockContainersFlexContainersGridContainers",
      computed: "asSpecifiedButVisibleOrClipReplacedToAutoOrHiddenIfOtherValueDifferent",
      order: "perGrammar",
      status: "standard"
    },
    "overflow-wrap": {
      syntax: "normal | break-word | anywhere",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "normal",
      appliesto: "nonReplacedInlineElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/overflow-wrap"
    },
    "overflow-x": {
      syntax: "visible | hidden | clip | scroll | auto",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Overflow"
      ],
      initial: "visible",
      appliesto: "blockContainersFlexContainersGridContainers",
      computed: "asSpecifiedButVisibleOrClipReplacedToAutoOrHiddenIfOtherValueDifferent",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/overflow-x"
    },
    "overflow-y": {
      syntax: "visible | hidden | clip | scroll | auto",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Overflow"
      ],
      initial: "visible",
      appliesto: "blockContainersFlexContainersGridContainers",
      computed: "asSpecifiedButVisibleOrClipReplacedToAutoOrHiddenIfOtherValueDifferent",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/overflow-y"
    },
    "overscroll-behavior": {
      syntax: "[ contain | none | auto ]{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Model"
      ],
      initial: "auto",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior"
    },
    "overscroll-behavior-block": {
      syntax: "contain | none | auto",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Model"
      ],
      initial: "auto",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-block"
    },
    "overscroll-behavior-inline": {
      syntax: "contain | none | auto",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Model"
      ],
      initial: "auto",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-inline"
    },
    "overscroll-behavior-x": {
      syntax: "contain | none | auto",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Model"
      ],
      initial: "auto",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-x"
    },
    "overscroll-behavior-y": {
      syntax: "contain | none | auto",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Model"
      ],
      initial: "auto",
      appliesto: "nonReplacedBlockAndInlineBlockElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior-y"
    },
    padding: {
      syntax: "[ <length> | <percentage> ]{1,4}",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: [
        "padding-bottom",
        "padding-left",
        "padding-right",
        "padding-top"
      ],
      appliesto: "allElementsExceptInternalTableDisplayTypes",
      computed: [
        "padding-bottom",
        "padding-left",
        "padding-right",
        "padding-top"
      ],
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding"
    },
    "padding-block": {
      syntax: "<'padding-left'>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding-block"
    },
    "padding-block-end": {
      syntax: "<'padding-left'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding-block-end"
    },
    "padding-block-start": {
      syntax: "<'padding-left'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding-block-start"
    },
    "padding-bottom": {
      syntax: "<length> | <percentage>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "0",
      appliesto: "allElementsExceptInternalTableDisplayTypes",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding-bottom"
    },
    "padding-inline": {
      syntax: "<'padding-left'>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding-inline"
    },
    "padding-inline-end": {
      syntax: "<'padding-left'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding-inline-end"
    },
    "padding-inline-start": {
      syntax: "<'padding-left'>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "logicalWidthOfContainingBlock",
      groups: [
        "CSS Logical Properties"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding-inline-start"
    },
    "padding-left": {
      syntax: "<length> | <percentage>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "0",
      appliesto: "allElementsExceptInternalTableDisplayTypes",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding-left"
    },
    "padding-right": {
      syntax: "<length> | <percentage>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "0",
      appliesto: "allElementsExceptInternalTableDisplayTypes",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding-right"
    },
    "padding-top": {
      syntax: "<length> | <percentage>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "0",
      appliesto: "allElementsExceptInternalTableDisplayTypes",
      computed: "percentageAsSpecifiedOrAbsoluteLength",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/padding-top"
    },
    "page-break-after": {
      syntax: "auto | always | avoid | left | right | recto | verso",
      media: [
        "visual",
        "paged"
      ],
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Pages"
      ],
      initial: "auto",
      appliesto: "blockElementsInNormalFlow",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/page-break-after"
    },
    "page-break-before": {
      syntax: "auto | always | avoid | left | right | recto | verso",
      media: [
        "visual",
        "paged"
      ],
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Pages"
      ],
      initial: "auto",
      appliesto: "blockElementsInNormalFlow",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/page-break-before"
    },
    "page-break-inside": {
      syntax: "auto | avoid",
      media: [
        "visual",
        "paged"
      ],
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Pages"
      ],
      initial: "auto",
      appliesto: "blockElementsInNormalFlow",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/page-break-inside"
    },
    "paint-order": {
      syntax: "normal | [ fill || stroke || markers ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "normal",
      appliesto: "textElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/paint-order"
    },
    perspective: {
      syntax: "none | <length>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Transforms"
      ],
      initial: "none",
      appliesto: "transformableElements",
      computed: "absoluteLengthOrNone",
      order: "uniqueOrder",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/perspective"
    },
    "perspective-origin": {
      syntax: "<position>",
      media: "visual",
      inherited: false,
      animationType: "simpleListOfLpc",
      percentages: "referToSizeOfBoundingBox",
      groups: [
        "CSS Transforms"
      ],
      initial: "50% 50%",
      appliesto: "transformableElements",
      computed: "forLengthAbsoluteValueOtherwisePercentage",
      order: "oneOrTwoValuesLengthAbsoluteKeywordsPercentages",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/perspective-origin"
    },
    "place-content": {
      syntax: "<'align-content'> <'justify-content'>?",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Alignment"
      ],
      initial: "normal",
      appliesto: "multilineFlexContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/place-content"
    },
    "place-items": {
      syntax: "<'align-items'> <'justify-items'>?",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Alignment"
      ],
      initial: [
        "align-items",
        "justify-items"
      ],
      appliesto: "allElements",
      computed: [
        "align-items",
        "justify-items"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/place-items"
    },
    "place-self": {
      syntax: "<'align-self'> <'justify-self'>?",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Box Alignment"
      ],
      initial: [
        "align-self",
        "justify-self"
      ],
      appliesto: "blockLevelBoxesAndAbsolutelyPositionedBoxesAndGridItems",
      computed: [
        "align-self",
        "justify-self"
      ],
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/place-self"
    },
    "pointer-events": {
      syntax: "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Pointer Events"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/pointer-events"
    },
    position: {
      syntax: "static | relative | absolute | sticky | fixed",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Positioning"
      ],
      initial: "static",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/position"
    },
    quotes: {
      syntax: "none | auto | [ <string> <string> ]+",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Generated Content"
      ],
      initial: "dependsOnUserAgent",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/quotes"
    },
    resize: {
      syntax: "none | both | horizontal | vertical | block | inline",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "none",
      appliesto: "elementsWithOverflowNotVisibleAndReplacedElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/resize"
    },
    right: {
      syntax: "<length> | <percentage> | auto",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Positioning"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/right"
    },
    rotate: {
      syntax: "none | <angle> | [ x | y | z | <number>{3} ] && <angle>",
      media: "visual",
      inherited: false,
      animationType: "transform",
      percentages: "no",
      groups: [
        "CSS Transforms"
      ],
      initial: "none",
      appliesto: "transformableElements",
      computed: "asSpecified",
      order: "perGrammar",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/rotate"
    },
    "row-gap": {
      syntax: "normal | <length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToDimensionOfContentArea",
      groups: [
        "CSS Box Alignment"
      ],
      initial: "normal",
      appliesto: "multiColumnElementsFlexContainersGridContainers",
      computed: "asSpecifiedWithLengthsAbsoluteAndNormalComputingToZeroExceptMultiColumn",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/row-gap"
    },
    "ruby-align": {
      syntax: "start | center | space-between | space-around",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Ruby"
      ],
      initial: "space-around",
      appliesto: "rubyBasesAnnotationsBaseAnnotationContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/ruby-align"
    },
    "ruby-merge": {
      syntax: "separate | collapse | auto",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Ruby"
      ],
      initial: "separate",
      appliesto: "rubyAnnotationsContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "experimental"
    },
    "ruby-position": {
      syntax: "over | under | inter-character",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Ruby"
      ],
      initial: "over",
      appliesto: "rubyAnnotationsContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/ruby-position"
    },
    scale: {
      syntax: "none | <number>{1,3}",
      media: "visual",
      inherited: false,
      animationType: "transform",
      percentages: "no",
      groups: [
        "CSS Transforms"
      ],
      initial: "none",
      appliesto: "transformableElements",
      computed: "asSpecified",
      order: "perGrammar",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scale"
    },
    "scrollbar-color": {
      syntax: "auto | dark | light | <color>{2}",
      media: "visual",
      inherited: true,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Scrollbars"
      ],
      initial: "auto",
      appliesto: "scrollingBoxes",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scrollbar-color"
    },
    "scrollbar-gutter": {
      syntax: "auto | [ stable | always ] && both? && force?",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Overflow"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scrollbar-gutter"
    },
    "scrollbar-width": {
      syntax: "auto | thin | none",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Scrollbars"
      ],
      initial: "auto",
      appliesto: "scrollingBoxes",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scrollbar-width"
    },
    "scroll-behavior": {
      syntax: "auto | smooth",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSSOM View"
      ],
      initial: "auto",
      appliesto: "scrollingBoxes",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-behavior"
    },
    "scroll-margin": {
      syntax: "<length>{1,4}",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin"
    },
    "scroll-margin-block": {
      syntax: "<length>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block"
    },
    "scroll-margin-block-start": {
      syntax: "<length>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-start"
    },
    "scroll-margin-block-end": {
      syntax: "<length>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-block-end"
    },
    "scroll-margin-bottom": {
      syntax: "<length>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-bottom"
    },
    "scroll-margin-inline": {
      syntax: "<length>{1,2}",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline"
    },
    "scroll-margin-inline-start": {
      syntax: "<length>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-start"
    },
    "scroll-margin-inline-end": {
      syntax: "<length>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-inline-end"
    },
    "scroll-margin-left": {
      syntax: "<length>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-left"
    },
    "scroll-margin-right": {
      syntax: "<length>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-right"
    },
    "scroll-margin-top": {
      syntax: "<length>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-margin-top"
    },
    "scroll-padding": {
      syntax: "[ auto | <length-percentage> ]{1,4}",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding"
    },
    "scroll-padding-block": {
      syntax: "[ auto | <length-percentage> ]{1,2}",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block"
    },
    "scroll-padding-block-start": {
      syntax: "auto | <length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block-start"
    },
    "scroll-padding-block-end": {
      syntax: "auto | <length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-block-end"
    },
    "scroll-padding-bottom": {
      syntax: "auto | <length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-bottom"
    },
    "scroll-padding-inline": {
      syntax: "[ auto | <length-percentage> ]{1,2}",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline"
    },
    "scroll-padding-inline-start": {
      syntax: "auto | <length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline-start"
    },
    "scroll-padding-inline-end": {
      syntax: "auto | <length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-inline-end"
    },
    "scroll-padding-left": {
      syntax: "auto | <length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-left"
    },
    "scroll-padding-right": {
      syntax: "auto | <length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-right"
    },
    "scroll-padding-top": {
      syntax: "auto | <length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "relativeToTheScrollContainersScrollport",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "auto",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-padding-top"
    },
    "scroll-snap-align": {
      syntax: "[ none | start | end | center ]{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-align"
    },
    "scroll-snap-coordinate": {
      syntax: "none | <position>#",
      media: "interactive",
      inherited: false,
      animationType: "position",
      percentages: "referToBorderBox",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-coordinate"
    },
    "scroll-snap-destination": {
      syntax: "<position>",
      media: "interactive",
      inherited: false,
      animationType: "position",
      percentages: "relativeToScrollContainerPaddingBoxAxis",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "0px 0px",
      appliesto: "scrollContainers",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-destination"
    },
    "scroll-snap-points-x": {
      syntax: "none | repeat( <length-percentage> )",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "relativeToScrollContainerPaddingBoxAxis",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "none",
      appliesto: "scrollContainers",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-points-x"
    },
    "scroll-snap-points-y": {
      syntax: "none | repeat( <length-percentage> )",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "relativeToScrollContainerPaddingBoxAxis",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "none",
      appliesto: "scrollContainers",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-points-y"
    },
    "scroll-snap-stop": {
      syntax: "normal | always",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-stop"
    },
    "scroll-snap-type": {
      syntax: "none | [ x | y | block | inline | both ] [ mandatory | proximity ]?",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type"
    },
    "scroll-snap-type-x": {
      syntax: "none | mandatory | proximity",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "none",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type-x"
    },
    "scroll-snap-type-y": {
      syntax: "none | mandatory | proximity",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Scroll Snap"
      ],
      initial: "none",
      appliesto: "scrollContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "obsolete",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type-y"
    },
    "shape-image-threshold": {
      syntax: "<alpha-value>",
      media: "visual",
      inherited: false,
      animationType: "number",
      percentages: "no",
      groups: [
        "CSS Shapes"
      ],
      initial: "0.0",
      appliesto: "floats",
      computed: "specifiedValueNumberClipped0To1",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/shape-image-threshold"
    },
    "shape-margin": {
      syntax: "<length-percentage>",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Shapes"
      ],
      initial: "0",
      appliesto: "floats",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/shape-margin"
    },
    "shape-outside": {
      syntax: "none | <shape-box> || <basic-shape> | <image>",
      media: "visual",
      inherited: false,
      animationType: "basicShapeOtherwiseNo",
      percentages: "no",
      groups: [
        "CSS Shapes"
      ],
      initial: "none",
      appliesto: "floats",
      computed: "asDefinedForBasicShapeWithAbsoluteURIOtherwiseAsSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/shape-outside"
    },
    "tab-size": {
      syntax: "<integer> | <length>",
      media: "visual",
      inherited: true,
      animationType: "length",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "8",
      appliesto: "blockContainers",
      computed: "specifiedIntegerOrAbsoluteLength",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/tab-size"
    },
    "table-layout": {
      syntax: "auto | fixed",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Table"
      ],
      initial: "auto",
      appliesto: "tableElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/table-layout"
    },
    "text-align": {
      syntax: "start | end | left | right | center | justify | match-parent",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "startOrNamelessValueIfLTRRightIfRTL",
      appliesto: "blockContainers",
      computed: "asSpecifiedExceptMatchParent",
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-align"
    },
    "text-align-last": {
      syntax: "auto | start | end | left | right | center | justify",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "auto",
      appliesto: "blockContainers",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-align-last"
    },
    "text-combine-upright": {
      syntax: "none | all | [ digits <integer>? ]",
      media: "visual",
      inherited: true,
      animationType: "notAnimatable",
      percentages: "no",
      groups: [
        "CSS Writing Modes"
      ],
      initial: "none",
      appliesto: "nonReplacedInlineElements",
      computed: "keywordPlusIntegerIfDigits",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-combine-upright"
    },
    "text-decoration": {
      syntax: "<'text-decoration-line'> || <'text-decoration-style'> || <'text-decoration-color'> || <'text-decoration-thickness'>",
      media: "visual",
      inherited: false,
      animationType: [
        "text-decoration-color",
        "text-decoration-style",
        "text-decoration-line",
        "text-decoration-thickness"
      ],
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: [
        "text-decoration-color",
        "text-decoration-style",
        "text-decoration-line"
      ],
      appliesto: "allElements",
      computed: [
        "text-decoration-line",
        "text-decoration-style",
        "text-decoration-color",
        "text-decoration-thickness"
      ],
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration"
    },
    "text-decoration-color": {
      syntax: "<color>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-color"
    },
    "text-decoration-line": {
      syntax: "none | [ underline || overline || line-through || blink ] | spelling-error | grammar-error",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-line"
    },
    "text-decoration-skip": {
      syntax: "none | [ objects || [ spaces | [ leading-spaces || trailing-spaces ] ] || edges || box-decoration ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "objects",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-skip"
    },
    "text-decoration-skip-ink": {
      syntax: "auto | all | none",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-skip-ink"
    },
    "text-decoration-style": {
      syntax: "solid | double | dotted | dashed | wavy",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "solid",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-style"
    },
    "text-decoration-thickness": {
      syntax: "auto | from-font | <length> | <percentage> ",
      media: "visual",
      inherited: false,
      animationType: "byComputedValueType",
      percentages: "referToElementFontSize",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-decoration-thickness"
    },
    "text-emphasis": {
      syntax: "<'text-emphasis-style'> || <'text-emphasis-color'>",
      media: "visual",
      inherited: false,
      animationType: [
        "text-emphasis-color",
        "text-emphasis-style"
      ],
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: [
        "text-emphasis-style",
        "text-emphasis-color"
      ],
      appliesto: "allElements",
      computed: [
        "text-emphasis-style",
        "text-emphasis-color"
      ],
      order: "orderOfAppearance",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-emphasis"
    },
    "text-emphasis-color": {
      syntax: "<color>",
      media: "visual",
      inherited: false,
      animationType: "color",
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "currentcolor",
      appliesto: "allElements",
      computed: "computedColor",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-emphasis-color"
    },
    "text-emphasis-position": {
      syntax: "[ over | under ] && [ right | left ]",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "over right",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-emphasis-position"
    },
    "text-emphasis-style": {
      syntax: "none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-emphasis-style"
    },
    "text-indent": {
      syntax: "<length-percentage> && hanging? && each-line?",
      media: "visual",
      inherited: true,
      animationType: "lpc",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Text"
      ],
      initial: "0",
      appliesto: "blockContainers",
      computed: "percentageOrAbsoluteLengthPlusKeywords",
      order: "lengthOrPercentageBeforeKeywords",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-indent"
    },
    "text-justify": {
      syntax: "auto | inter-character | inter-word | none",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "auto",
      appliesto: "inlineLevelAndTableCellElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-justify"
    },
    "text-orientation": {
      syntax: "mixed | upright | sideways",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Writing Modes"
      ],
      initial: "mixed",
      appliesto: "allElementsExceptTableRowGroupsRowsColumnGroupsAndColumns",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-orientation"
    },
    "text-overflow": {
      syntax: "[ clip | ellipsis | <string> ]{1,2}",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "clip",
      appliesto: "blockContainerElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-overflow"
    },
    "text-rendering": {
      syntax: "auto | optimizeSpeed | optimizeLegibility | geometricPrecision",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Miscellaneous"
      ],
      initial: "auto",
      appliesto: "textElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-rendering"
    },
    "text-shadow": {
      syntax: "none | <shadow-t>#",
      media: "visual",
      inherited: true,
      animationType: "shadowList",
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "colorPlusThreeAbsoluteLengths",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-shadow"
    },
    "text-size-adjust": {
      syntax: "none | auto | <percentage>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "referToSizeOfFont",
      groups: [
        "CSS Text"
      ],
      initial: "autoForSmartphoneBrowsersSupportingInflation",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "experimental",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-size-adjust"
    },
    "text-transform": {
      syntax: "none | capitalize | uppercase | lowercase | full-width | full-size-kana",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "none",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-transform"
    },
    "text-underline-offset": {
      syntax: "auto | <length> | <percentage> ",
      media: "visual",
      inherited: true,
      animationType: "byComputedValueType",
      percentages: "referToElementFontSize",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-underline-offset"
    },
    "text-underline-position": {
      syntax: "auto | from-font | [ under || [ left | right ] ]",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text Decoration"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "orderOfAppearance",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/text-underline-position"
    },
    top: {
      syntax: "<length> | <percentage> | auto",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToContainingBlockHeight",
      groups: [
        "CSS Positioning"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "lengthAbsolutePercentageAsSpecifiedOtherwiseAuto",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/top"
    },
    "touch-action": {
      syntax: "auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "Pointer Events"
      ],
      initial: "auto",
      appliesto: "allElementsExceptNonReplacedInlineElementsTableRowsColumnsRowColumnGroups",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/touch-action"
    },
    transform: {
      syntax: "none | <transform-list>",
      media: "visual",
      inherited: false,
      animationType: "transform",
      percentages: "referToSizeOfBoundingBox",
      groups: [
        "CSS Transforms"
      ],
      initial: "none",
      appliesto: "transformableElements",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "uniqueOrder",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/transform"
    },
    "transform-box": {
      syntax: "content-box | border-box | fill-box | stroke-box | view-box",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Transforms"
      ],
      initial: "view-box",
      appliesto: "transformableElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/transform-box"
    },
    "transform-origin": {
      syntax: "[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?",
      media: "visual",
      inherited: false,
      animationType: "simpleListOfLpc",
      percentages: "referToSizeOfBoundingBox",
      groups: [
        "CSS Transforms"
      ],
      initial: "50% 50% 0",
      appliesto: "transformableElements",
      computed: "forLengthAbsoluteValueOtherwisePercentage",
      order: "oneOrTwoValuesLengthAbsoluteKeywordsPercentages",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/transform-origin"
    },
    "transform-style": {
      syntax: "flat | preserve-3d",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Transforms"
      ],
      initial: "flat",
      appliesto: "transformableElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/transform-style"
    },
    transition: {
      syntax: "<single-transition>#",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Transitions"
      ],
      initial: [
        "transition-delay",
        "transition-duration",
        "transition-property",
        "transition-timing-function"
      ],
      appliesto: "allElementsAndPseudos",
      computed: [
        "transition-delay",
        "transition-duration",
        "transition-property",
        "transition-timing-function"
      ],
      order: "orderOfAppearance",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/transition"
    },
    "transition-delay": {
      syntax: "<time>#",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Transitions"
      ],
      initial: "0s",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/transition-delay"
    },
    "transition-duration": {
      syntax: "<time>#",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Transitions"
      ],
      initial: "0s",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/transition-duration"
    },
    "transition-property": {
      syntax: "none | <single-transition-property>#",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Transitions"
      ],
      initial: "all",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/transition-property"
    },
    "transition-timing-function": {
      syntax: "<timing-function>#",
      media: "interactive",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Transitions"
      ],
      initial: "ease",
      appliesto: "allElementsAndPseudos",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/transition-timing-function"
    },
    translate: {
      syntax: "none | <length-percentage> [ <length-percentage> <length>? ]?",
      media: "visual",
      inherited: false,
      animationType: "transform",
      percentages: "referToSizeOfBoundingBox",
      groups: [
        "CSS Transforms"
      ],
      initial: "none",
      appliesto: "transformableElements",
      computed: "asSpecifiedRelativeToAbsoluteLengths",
      order: "perGrammar",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/translate"
    },
    "unicode-bidi": {
      syntax: "normal | embed | isolate | bidi-override | isolate-override | plaintext",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Writing Modes"
      ],
      initial: "normal",
      appliesto: "allElementsSomeValuesNoEffectOnNonInlineElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/unicode-bidi"
    },
    "user-select": {
      syntax: "auto | text | none | contain | all",
      media: "visual",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Basic User Interface"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/user-select"
    },
    "vertical-align": {
      syntax: "baseline | sub | super | text-top | text-bottom | middle | top | bottom | <percentage> | <length>",
      media: "visual",
      inherited: false,
      animationType: "length",
      percentages: "referToLineHeight",
      groups: [
        "CSS Table"
      ],
      initial: "baseline",
      appliesto: "inlineLevelAndTableCellElements",
      computed: "absoluteLengthOrKeyword",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/vertical-align"
    },
    visibility: {
      syntax: "visible | hidden | collapse",
      media: "visual",
      inherited: true,
      animationType: "visibility",
      percentages: "no",
      groups: [
        "CSS Box Model"
      ],
      initial: "visible",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/visibility"
    },
    "white-space": {
      syntax: "normal | pre | nowrap | pre-wrap | pre-line | break-spaces",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/white-space"
    },
    widows: {
      syntax: "<integer>",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Fragmentation"
      ],
      initial: "2",
      appliesto: "blockContainerElements",
      computed: "asSpecified",
      order: "perGrammar",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/widows"
    },
    width: {
      syntax: "auto | <length> | <percentage> | min-content | max-content | fit-content(<length-percentage>)",
      media: "visual",
      inherited: false,
      animationType: "lpc",
      percentages: "referToWidthOfContainingBlock",
      groups: [
        "CSS Box Model"
      ],
      initial: "auto",
      appliesto: "allElementsButNonReplacedAndTableRows",
      computed: "percentageAutoOrAbsoluteLength",
      order: "lengthOrPercentageBeforeKeywordIfBothPresent",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/width"
    },
    "will-change": {
      syntax: "auto | <animateable-feature>#",
      media: "all",
      inherited: false,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Will Change"
      ],
      initial: "auto",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/will-change"
    },
    "word-break": {
      syntax: "normal | break-all | keep-all | break-word",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/word-break"
    },
    "word-spacing": {
      syntax: "normal | <length-percentage>",
      media: "visual",
      inherited: true,
      animationType: "length",
      percentages: "referToWidthOfAffectedGlyph",
      groups: [
        "CSS Text"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "optimumMinAndMaxValueOfAbsoluteLengthPercentageOrNormal",
      order: "uniqueOrder",
      alsoAppliesTo: [
        "::first-letter",
        "::first-line",
        "::placeholder"
      ],
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/word-spacing"
    },
    "word-wrap": {
      syntax: "normal | break-word",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Text"
      ],
      initial: "normal",
      appliesto: "nonReplacedInlineElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/overflow-wrap"
    },
    "writing-mode": {
      syntax: "horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr",
      media: "visual",
      inherited: true,
      animationType: "discrete",
      percentages: "no",
      groups: [
        "CSS Writing Modes"
      ],
      initial: "horizontal-tb",
      appliesto: "allElementsExceptTableRowColumnGroupsTableRowsColumns",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/writing-mode"
    },
    "z-index": {
      syntax: "auto | <integer>",
      media: "visual",
      inherited: false,
      animationType: "integer",
      percentages: "no",
      groups: [
        "CSS Positioning"
      ],
      initial: "auto",
      appliesto: "positionedElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      stacking: true,
      status: "standard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/z-index"
    },
    zoom: {
      syntax: "normal | reset | <number> | <percentage>",
      media: "visual",
      inherited: false,
      animationType: "integer",
      percentages: "no",
      groups: [
        "Microsoft Extensions"
      ],
      initial: "normal",
      appliesto: "allElements",
      computed: "asSpecified",
      order: "uniqueOrder",
      status: "nonstandard",
      mdn_url: "https://developer.mozilla.org/docs/Web/CSS/zoom"
    }
  };
});

// node_modules/mdn-data/css/syntaxes.json
var require_syntaxes = __commonJS((exports2, module2) => {
  module2.exports = {
    "absolute-size": {
      syntax: "xx-small | x-small | small | medium | large | x-large | xx-large | xxx-large"
    },
    "alpha-value": {
      syntax: "<number> | <percentage>"
    },
    "angle-percentage": {
      syntax: "<angle> | <percentage>"
    },
    "angular-color-hint": {
      syntax: "<angle-percentage>"
    },
    "angular-color-stop": {
      syntax: "<color> && <color-stop-angle>?"
    },
    "angular-color-stop-list": {
      syntax: "[ <angular-color-stop> [, <angular-color-hint>]? ]# , <angular-color-stop>"
    },
    "animateable-feature": {
      syntax: "scroll-position | contents | <custom-ident>"
    },
    attachment: {
      syntax: "scroll | fixed | local"
    },
    "attr()": {
      syntax: "attr( <attr-name> <type-or-unit>? [, <attr-fallback> ]? )"
    },
    "attr-matcher": {
      syntax: "[ '~' | '|' | '^' | '$' | '*' ]? '='"
    },
    "attr-modifier": {
      syntax: "i | s"
    },
    "attribute-selector": {
      syntax: "'[' <wq-name> ']' | '[' <wq-name> <attr-matcher> [ <string-token> | <ident-token> ] <attr-modifier>? ']'"
    },
    "auto-repeat": {
      syntax: "repeat( [ auto-fill | auto-fit ] , [ <line-names>? <fixed-size> ]+ <line-names>? )"
    },
    "auto-track-list": {
      syntax: "[ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>? <auto-repeat>\n[ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>?"
    },
    "baseline-position": {
      syntax: "[ first | last ]? baseline"
    },
    "basic-shape": {
      syntax: "<inset()> | <circle()> | <ellipse()> | <polygon()> | <path()>"
    },
    "bg-image": {
      syntax: "none | <image>"
    },
    "bg-layer": {
      syntax: "<bg-image> || <bg-position> [ / <bg-size> ]? || <repeat-style> || <attachment> || <box> || <box>"
    },
    "bg-position": {
      syntax: "[ [ left | center | right | top | bottom | <length-percentage> ] | [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ] | [ center | [ left | right ] <length-percentage>? ] && [ center | [ top | bottom ] <length-percentage>? ] ]"
    },
    "bg-size": {
      syntax: "[ <length-percentage> | auto ]{1,2} | cover | contain"
    },
    "blur()": {
      syntax: "blur( <length> )"
    },
    "blend-mode": {
      syntax: "normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity"
    },
    box: {
      syntax: "border-box | padding-box | content-box"
    },
    "brightness()": {
      syntax: "brightness( <number-percentage> )"
    },
    "calc()": {
      syntax: "calc( <calc-sum> )"
    },
    "calc-sum": {
      syntax: "<calc-product> [ [ '+' | '-' ] <calc-product> ]*"
    },
    "calc-product": {
      syntax: "<calc-value> [ '*' <calc-value> | '/' <number> ]*"
    },
    "calc-value": {
      syntax: "<number> | <dimension> | <percentage> | ( <calc-sum> )"
    },
    "cf-final-image": {
      syntax: "<image> | <color>"
    },
    "cf-mixing-image": {
      syntax: "<percentage>? && <image>"
    },
    "circle()": {
      syntax: "circle( [ <shape-radius> ]? [ at <position> ]? )"
    },
    "clamp()": {
      syntax: "clamp( <calc-sum>#{3} )"
    },
    "class-selector": {
      syntax: "'.' <ident-token>"
    },
    "clip-source": {
      syntax: "<url>"
    },
    color: {
      syntax: "<rgb()> | <rgba()> | <hsl()> | <hsla()> | <hex-color> | <named-color> | currentcolor | <deprecated-system-color>"
    },
    "color-stop": {
      syntax: "<color-stop-length> | <color-stop-angle>"
    },
    "color-stop-angle": {
      syntax: "<angle-percentage>{1,2}"
    },
    "color-stop-length": {
      syntax: "<length-percentage>{1,2}"
    },
    "color-stop-list": {
      syntax: "[ <linear-color-stop> [, <linear-color-hint>]? ]# , <linear-color-stop>"
    },
    combinator: {
      syntax: "'>' | '+' | '~' | [ '||' ]"
    },
    "common-lig-values": {
      syntax: "[ common-ligatures | no-common-ligatures ]"
    },
    "compat-auto": {
      syntax: "searchfield | textarea | push-button | slider-horizontal | checkbox | radio | square-button | menulist | listbox | meter | progress-bar | button"
    },
    "composite-style": {
      syntax: "clear | copy | source-over | source-in | source-out | source-atop | destination-over | destination-in | destination-out | destination-atop | xor"
    },
    "compositing-operator": {
      syntax: "add | subtract | intersect | exclude"
    },
    "compound-selector": {
      syntax: "[ <type-selector>? <subclass-selector>* [ <pseudo-element-selector> <pseudo-class-selector>* ]* ]!"
    },
    "compound-selector-list": {
      syntax: "<compound-selector>#"
    },
    "complex-selector": {
      syntax: "<compound-selector> [ <combinator>? <compound-selector> ]*"
    },
    "complex-selector-list": {
      syntax: "<complex-selector>#"
    },
    "conic-gradient()": {
      syntax: "conic-gradient( [ from <angle> ]? [ at <position> ]?, <angular-color-stop-list> )"
    },
    "contextual-alt-values": {
      syntax: "[ contextual | no-contextual ]"
    },
    "content-distribution": {
      syntax: "space-between | space-around | space-evenly | stretch"
    },
    "content-list": {
      syntax: "[ <string> | contents | <image> | <quote> | <target> | <leader()> ]+"
    },
    "content-position": {
      syntax: "center | start | end | flex-start | flex-end"
    },
    "content-replacement": {
      syntax: "<image>"
    },
    "contrast()": {
      syntax: "contrast( [ <number-percentage> ] )"
    },
    "counter()": {
      syntax: "counter( <custom-ident>, <counter-style>? )"
    },
    "counter-style": {
      syntax: "<counter-style-name> | symbols()"
    },
    "counter-style-name": {
      syntax: "<custom-ident>"
    },
    "counters()": {
      syntax: "counters( <custom-ident>, <string>, <counter-style>? )"
    },
    "cross-fade()": {
      syntax: "cross-fade( <cf-mixing-image> , <cf-final-image>? )"
    },
    "cubic-bezier-timing-function": {
      syntax: "ease | ease-in | ease-out | ease-in-out | cubic-bezier(<number [0,1]>, <number>, <number [0,1]>, <number>)"
    },
    "deprecated-system-color": {
      syntax: "ActiveBorder | ActiveCaption | AppWorkspace | Background | ButtonFace | ButtonHighlight | ButtonShadow | ButtonText | CaptionText | GrayText | Highlight | HighlightText | InactiveBorder | InactiveCaption | InactiveCaptionText | InfoBackground | InfoText | Menu | MenuText | Scrollbar | ThreeDDarkShadow | ThreeDFace | ThreeDHighlight | ThreeDLightShadow | ThreeDShadow | Window | WindowFrame | WindowText"
    },
    "discretionary-lig-values": {
      syntax: "[ discretionary-ligatures | no-discretionary-ligatures ]"
    },
    "display-box": {
      syntax: "contents | none"
    },
    "display-inside": {
      syntax: "flow | flow-root | table | flex | grid | ruby"
    },
    "display-internal": {
      syntax: "table-row-group | table-header-group | table-footer-group | table-row | table-cell | table-column-group | table-column | table-caption | ruby-base | ruby-text | ruby-base-container | ruby-text-container"
    },
    "display-legacy": {
      syntax: "inline-block | inline-list-item | inline-table | inline-flex | inline-grid"
    },
    "display-listitem": {
      syntax: "<display-outside>? && [ flow | flow-root ]? && list-item"
    },
    "display-outside": {
      syntax: "block | inline | run-in"
    },
    "drop-shadow()": {
      syntax: "drop-shadow( <length>{2,3} <color>? )"
    },
    "east-asian-variant-values": {
      syntax: "[ jis78 | jis83 | jis90 | jis04 | simplified | traditional ]"
    },
    "east-asian-width-values": {
      syntax: "[ full-width | proportional-width ]"
    },
    "element()": {
      syntax: "element( <id-selector> )"
    },
    "ellipse()": {
      syntax: "ellipse( [ <shape-radius>{2} ]? [ at <position> ]? )"
    },
    "ending-shape": {
      syntax: "circle | ellipse"
    },
    "env()": {
      syntax: "env( <custom-ident> , <declaration-value>? )"
    },
    "explicit-track-list": {
      syntax: "[ <line-names>? <track-size> ]+ <line-names>?"
    },
    "family-name": {
      syntax: "<string> | <custom-ident>+"
    },
    "feature-tag-value": {
      syntax: "<string> [ <integer> | on | off ]?"
    },
    "feature-type": {
      syntax: "@stylistic | @historical-forms | @styleset | @character-variant | @swash | @ornaments | @annotation"
    },
    "feature-value-block": {
      syntax: "<feature-type> '{' <feature-value-declaration-list> '}'"
    },
    "feature-value-block-list": {
      syntax: "<feature-value-block>+"
    },
    "feature-value-declaration": {
      syntax: "<custom-ident>: <integer>+;"
    },
    "feature-value-declaration-list": {
      syntax: "<feature-value-declaration>"
    },
    "feature-value-name": {
      syntax: "<custom-ident>"
    },
    "fill-rule": {
      syntax: "nonzero | evenodd"
    },
    "filter-function": {
      syntax: "<blur()> | <brightness()> | <contrast()> | <drop-shadow()> | <grayscale()> | <hue-rotate()> | <invert()> | <opacity()> | <saturate()> | <sepia()>"
    },
    "filter-function-list": {
      syntax: "[ <filter-function> | <url> ]+"
    },
    "final-bg-layer": {
      syntax: "<'background-color'> || <bg-image> || <bg-position> [ / <bg-size> ]? || <repeat-style> || <attachment> || <box> || <box>"
    },
    "fit-content()": {
      syntax: "fit-content( [ <length> | <percentage> ] )"
    },
    "fixed-breadth": {
      syntax: "<length-percentage>"
    },
    "fixed-repeat": {
      syntax: "repeat( [ <positive-integer> ] , [ <line-names>? <fixed-size> ]+ <line-names>? )"
    },
    "fixed-size": {
      syntax: "<fixed-breadth> | minmax( <fixed-breadth> , <track-breadth> ) | minmax( <inflexible-breadth> , <fixed-breadth> )"
    },
    "font-stretch-absolute": {
      syntax: "normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | <percentage>"
    },
    "font-variant-css21": {
      syntax: "[ normal | small-caps ]"
    },
    "font-weight-absolute": {
      syntax: "normal | bold | <number [1,1000]>"
    },
    "frequency-percentage": {
      syntax: "<frequency> | <percentage>"
    },
    "general-enclosed": {
      syntax: "[ <function-token> <any-value> ) ] | ( <ident> <any-value> )"
    },
    "generic-family": {
      syntax: "serif | sans-serif | cursive | fantasy | monospace"
    },
    "generic-name": {
      syntax: "serif | sans-serif | cursive | fantasy | monospace"
    },
    "geometry-box": {
      syntax: "<shape-box> | fill-box | stroke-box | view-box"
    },
    gradient: {
      syntax: "<linear-gradient()> | <repeating-linear-gradient()> | <radial-gradient()> | <repeating-radial-gradient()> | <conic-gradient()>"
    },
    "grayscale()": {
      syntax: "grayscale( <number-percentage> )"
    },
    "grid-line": {
      syntax: "auto | <custom-ident> | [ <integer> && <custom-ident>? ] | [ span && [ <integer> || <custom-ident> ] ]"
    },
    "historical-lig-values": {
      syntax: "[ historical-ligatures | no-historical-ligatures ]"
    },
    "hsl()": {
      syntax: "hsl( <hue> <percentage> <percentage> [ / <alpha-value> ]? ) | hsl( <hue>, <percentage>, <percentage>, <alpha-value>? )"
    },
    "hsla()": {
      syntax: "hsla( <hue> <percentage> <percentage> [ / <alpha-value> ]? ) | hsla( <hue>, <percentage>, <percentage>, <alpha-value>? )"
    },
    hue: {
      syntax: "<number> | <angle>"
    },
    "hue-rotate()": {
      syntax: "hue-rotate( <angle> )"
    },
    "id-selector": {
      syntax: "<hash-token>"
    },
    image: {
      syntax: "<url> | <image()> | <image-set()> | <element()> | <paint()> | <cross-fade()> | <gradient>"
    },
    "image()": {
      syntax: "image( <image-tags>? [ <image-src>? , <color>? ]! )"
    },
    "image-set()": {
      syntax: "image-set( <image-set-option># )"
    },
    "image-set-option": {
      syntax: "[ <image> | <string> ] <resolution>"
    },
    "image-src": {
      syntax: "<url> | <string>"
    },
    "image-tags": {
      syntax: "ltr | rtl"
    },
    "inflexible-breadth": {
      syntax: "<length> | <percentage> | min-content | max-content | auto"
    },
    "inset()": {
      syntax: "inset( <length-percentage>{1,4} [ round <'border-radius'> ]? )"
    },
    "invert()": {
      syntax: "invert( <number-percentage> )"
    },
    "keyframes-name": {
      syntax: "<custom-ident> | <string>"
    },
    "keyframe-block": {
      syntax: "<keyframe-selector># {\n  <declaration-list>\n}"
    },
    "keyframe-block-list": {
      syntax: "<keyframe-block>+"
    },
    "keyframe-selector": {
      syntax: "from | to | <percentage>"
    },
    "leader()": {
      syntax: "leader( <leader-type> )"
    },
    "leader-type": {
      syntax: "dotted | solid | space | <string>"
    },
    "length-percentage": {
      syntax: "<length> | <percentage>"
    },
    "line-names": {
      syntax: "'[' <custom-ident>* ']'"
    },
    "line-name-list": {
      syntax: "[ <line-names> | <name-repeat> ]+"
    },
    "line-style": {
      syntax: "none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset"
    },
    "line-width": {
      syntax: "<length> | thin | medium | thick"
    },
    "linear-color-hint": {
      syntax: "<length-percentage>"
    },
    "linear-color-stop": {
      syntax: "<color> <color-stop-length>?"
    },
    "linear-gradient()": {
      syntax: "linear-gradient( [ <angle> | to <side-or-corner> ]? , <color-stop-list> )"
    },
    "mask-layer": {
      syntax: "<mask-reference> || <position> [ / <bg-size> ]? || <repeat-style> || <geometry-box> || [ <geometry-box> | no-clip ] || <compositing-operator> || <masking-mode>"
    },
    "mask-position": {
      syntax: "[ <length-percentage> | left | center | right ] [ <length-percentage> | top | center | bottom ]?"
    },
    "mask-reference": {
      syntax: "none | <image> | <mask-source>"
    },
    "mask-source": {
      syntax: "<url>"
    },
    "masking-mode": {
      syntax: "alpha | luminance | match-source"
    },
    "matrix()": {
      syntax: "matrix( <number>#{6} )"
    },
    "matrix3d()": {
      syntax: "matrix3d( <number>#{16} )"
    },
    "max()": {
      syntax: "max( <calc-sum># )"
    },
    "media-and": {
      syntax: "<media-in-parens> [ and <media-in-parens> ]+"
    },
    "media-condition": {
      syntax: "<media-not> | <media-and> | <media-or> | <media-in-parens>"
    },
    "media-condition-without-or": {
      syntax: "<media-not> | <media-and> | <media-in-parens>"
    },
    "media-feature": {
      syntax: "( [ <mf-plain> | <mf-boolean> | <mf-range> ] )"
    },
    "media-in-parens": {
      syntax: "( <media-condition> ) | <media-feature> | <general-enclosed>"
    },
    "media-not": {
      syntax: "not <media-in-parens>"
    },
    "media-or": {
      syntax: "<media-in-parens> [ or <media-in-parens> ]+"
    },
    "media-query": {
      syntax: "<media-condition> | [ not | only ]? <media-type> [ and <media-condition-without-or> ]?"
    },
    "media-query-list": {
      syntax: "<media-query>#"
    },
    "media-type": {
      syntax: "<ident>"
    },
    "mf-boolean": {
      syntax: "<mf-name>"
    },
    "mf-name": {
      syntax: "<ident>"
    },
    "mf-plain": {
      syntax: "<mf-name> : <mf-value>"
    },
    "mf-range": {
      syntax: "<mf-name> [ '<' | '>' ]? '='? <mf-value>\n| <mf-value> [ '<' | '>' ]? '='? <mf-name>\n| <mf-value> '<' '='? <mf-name> '<' '='? <mf-value>\n| <mf-value> '>' '='? <mf-name> '>' '='? <mf-value>"
    },
    "mf-value": {
      syntax: "<number> | <dimension> | <ident> | <ratio>"
    },
    "min()": {
      syntax: "min( <calc-sum># )"
    },
    "minmax()": {
      syntax: "minmax( [ <length> | <percentage> | min-content | max-content | auto ] , [ <length> | <percentage> | <flex> | min-content | max-content | auto ] )"
    },
    "named-color": {
      syntax: "transparent | aliceblue | antiquewhite | aqua | aquamarine | azure | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | cadetblue | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | green | greenyellow | grey | honeydew | hotpink | indianred | indigo | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | magenta | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | seagreen | seashell | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | tomato | turquoise | violet | wheat | white | whitesmoke | yellow | yellowgreen"
    },
    "namespace-prefix": {
      syntax: "<ident>"
    },
    "ns-prefix": {
      syntax: "[ <ident-token> | '*' ]? '|'"
    },
    "number-percentage": {
      syntax: "<number> | <percentage>"
    },
    "numeric-figure-values": {
      syntax: "[ lining-nums | oldstyle-nums ]"
    },
    "numeric-fraction-values": {
      syntax: "[ diagonal-fractions | stacked-fractions ]"
    },
    "numeric-spacing-values": {
      syntax: "[ proportional-nums | tabular-nums ]"
    },
    nth: {
      syntax: "<an-plus-b> | even | odd"
    },
    "opacity()": {
      syntax: "opacity( [ <number-percentage> ] )"
    },
    "overflow-position": {
      syntax: "unsafe | safe"
    },
    "outline-radius": {
      syntax: "<length> | <percentage>"
    },
    "page-body": {
      syntax: "<declaration>? [ ; <page-body> ]? | <page-margin-box> <page-body>"
    },
    "page-margin-box": {
      syntax: "<page-margin-box-type> '{' <declaration-list> '}'"
    },
    "page-margin-box-type": {
      syntax: "@top-left-corner | @top-left | @top-center | @top-right | @top-right-corner | @bottom-left-corner | @bottom-left | @bottom-center | @bottom-right | @bottom-right-corner | @left-top | @left-middle | @left-bottom | @right-top | @right-middle | @right-bottom"
    },
    "page-selector-list": {
      syntax: "[ <page-selector># ]?"
    },
    "page-selector": {
      syntax: "<pseudo-page>+ | <ident> <pseudo-page>*"
    },
    "path()": {
      syntax: "path( [ <fill-rule>, ]? <string> )"
    },
    "paint()": {
      syntax: "paint( <ident>, <declaration-value>? )"
    },
    "perspective()": {
      syntax: "perspective( <length> )"
    },
    "polygon()": {
      syntax: "polygon( <fill-rule>? , [ <length-percentage> <length-percentage> ]# )"
    },
    position: {
      syntax: "[ [ left | center | right ] || [ top | center | bottom ] | [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ]? | [ [ left | right ] <length-percentage> ] && [ [ top | bottom ] <length-percentage> ] ]"
    },
    "pseudo-class-selector": {
      syntax: "':' <ident-token> | ':' <function-token> <any-value> ')'"
    },
    "pseudo-element-selector": {
      syntax: "':' <pseudo-class-selector>"
    },
    "pseudo-page": {
      syntax: ": [ left | right | first | blank ]"
    },
    quote: {
      syntax: "open-quote | close-quote | no-open-quote | no-close-quote"
    },
    "radial-gradient()": {
      syntax: "radial-gradient( [ <ending-shape> || <size> ]? [ at <position> ]? , <color-stop-list> )"
    },
    "relative-selector": {
      syntax: "<combinator>? <complex-selector>"
    },
    "relative-selector-list": {
      syntax: "<relative-selector>#"
    },
    "relative-size": {
      syntax: "larger | smaller"
    },
    "repeat-style": {
      syntax: "repeat-x | repeat-y | [ repeat | space | round | no-repeat ]{1,2}"
    },
    "repeating-linear-gradient()": {
      syntax: "repeating-linear-gradient( [ <angle> | to <side-or-corner> ]? , <color-stop-list> )"
    },
    "repeating-radial-gradient()": {
      syntax: "repeating-radial-gradient( [ <ending-shape> || <size> ]? [ at <position> ]? , <color-stop-list> )"
    },
    "rgb()": {
      syntax: "rgb( <percentage>{3} [ / <alpha-value> ]? ) | rgb( <number>{3} [ / <alpha-value> ]? ) | rgb( <percentage>#{3} , <alpha-value>? ) | rgb( <number>#{3} , <alpha-value>? )"
    },
    "rgba()": {
      syntax: "rgba( <percentage>{3} [ / <alpha-value> ]? ) | rgba( <number>{3} [ / <alpha-value> ]? ) | rgba( <percentage>#{3} , <alpha-value>? ) | rgba( <number>#{3} , <alpha-value>? )"
    },
    "rotate()": {
      syntax: "rotate( [ <angle> | <zero> ] )"
    },
    "rotate3d()": {
      syntax: "rotate3d( <number> , <number> , <number> , [ <angle> | <zero> ] )"
    },
    "rotateX()": {
      syntax: "rotateX( [ <angle> | <zero> ] )"
    },
    "rotateY()": {
      syntax: "rotateY( [ <angle> | <zero> ] )"
    },
    "rotateZ()": {
      syntax: "rotateZ( [ <angle> | <zero> ] )"
    },
    "saturate()": {
      syntax: "saturate( <number-percentage> )"
    },
    "scale()": {
      syntax: "scale( <number> , <number>? )"
    },
    "scale3d()": {
      syntax: "scale3d( <number> , <number> , <number> )"
    },
    "scaleX()": {
      syntax: "scaleX( <number> )"
    },
    "scaleY()": {
      syntax: "scaleY( <number> )"
    },
    "scaleZ()": {
      syntax: "scaleZ( <number> )"
    },
    "self-position": {
      syntax: "center | start | end | self-start | self-end | flex-start | flex-end"
    },
    "shape-radius": {
      syntax: "<length-percentage> | closest-side | farthest-side"
    },
    "skew()": {
      syntax: "skew( [ <angle> | <zero> ] , [ <angle> | <zero> ]? )"
    },
    "skewX()": {
      syntax: "skewX( [ <angle> | <zero> ] )"
    },
    "skewY()": {
      syntax: "skewY( [ <angle> | <zero> ] )"
    },
    "sepia()": {
      syntax: "sepia( <number-percentage> )"
    },
    shadow: {
      syntax: "inset? && <length>{2,4} && <color>?"
    },
    "shadow-t": {
      syntax: "[ <length>{2,3} && <color>? ]"
    },
    shape: {
      syntax: "rect(<top>, <right>, <bottom>, <left>)"
    },
    "shape-box": {
      syntax: "<box> | margin-box"
    },
    "side-or-corner": {
      syntax: "[ left | right ] || [ top | bottom ]"
    },
    "single-animation": {
      syntax: "<time> || <timing-function> || <time> || <single-animation-iteration-count> || <single-animation-direction> || <single-animation-fill-mode> || <single-animation-play-state> || [ none | <keyframes-name> ]"
    },
    "single-animation-direction": {
      syntax: "normal | reverse | alternate | alternate-reverse"
    },
    "single-animation-fill-mode": {
      syntax: "none | forwards | backwards | both"
    },
    "single-animation-iteration-count": {
      syntax: "infinite | <number>"
    },
    "single-animation-play-state": {
      syntax: "running | paused"
    },
    "single-transition": {
      syntax: "[ none | <single-transition-property> ] || <time> || <timing-function> || <time>"
    },
    "single-transition-property": {
      syntax: "all | <custom-ident>"
    },
    size: {
      syntax: "closest-side | farthest-side | closest-corner | farthest-corner | <length> | <length-percentage>{2}"
    },
    "step-position": {
      syntax: "jump-start | jump-end | jump-none | jump-both | start | end"
    },
    "step-timing-function": {
      syntax: "step-start | step-end | steps(<integer>[, <step-position>]?)"
    },
    "subclass-selector": {
      syntax: "<id-selector> | <class-selector> | <attribute-selector> | <pseudo-class-selector>"
    },
    "supports-condition": {
      syntax: "not <supports-in-parens> | <supports-in-parens> [ and <supports-in-parens> ]* | <supports-in-parens> [ or <supports-in-parens> ]*"
    },
    "supports-in-parens": {
      syntax: "( <supports-condition> ) | <supports-feature> | <general-enclosed>"
    },
    "supports-feature": {
      syntax: "<supports-decl> | <supports-selector-fn>"
    },
    "supports-decl": {
      syntax: "( <declaration> )"
    },
    "supports-selector-fn": {
      syntax: "selector( <complex-selector> )"
    },
    symbol: {
      syntax: "<string> | <image> | <custom-ident>"
    },
    target: {
      syntax: "<target-counter()> | <target-counters()> | <target-text()>"
    },
    "target-counter()": {
      syntax: "target-counter( [ <string> | <url> ] , <custom-ident> , <counter-style>? )"
    },
    "target-counters()": {
      syntax: "target-counters( [ <string> | <url> ] , <custom-ident> , <string> , <counter-style>? )"
    },
    "target-text()": {
      syntax: "target-text( [ <string> | <url> ] , [ content | before | after | first-letter ]? )"
    },
    "time-percentage": {
      syntax: "<time> | <percentage>"
    },
    "timing-function": {
      syntax: "linear | <cubic-bezier-timing-function> | <step-timing-function>"
    },
    "track-breadth": {
      syntax: "<length-percentage> | <flex> | min-content | max-content | auto"
    },
    "track-list": {
      syntax: "[ <line-names>? [ <track-size> | <track-repeat> ] ]+ <line-names>?"
    },
    "track-repeat": {
      syntax: "repeat( [ <positive-integer> ] , [ <line-names>? <track-size> ]+ <line-names>? )"
    },
    "track-size": {
      syntax: "<track-breadth> | minmax( <inflexible-breadth> , <track-breadth> ) | fit-content( [ <length> | <percentage> ] )"
    },
    "transform-function": {
      syntax: "<matrix()> | <translate()> | <translateX()> | <translateY()> | <scale()> | <scaleX()> | <scaleY()> | <rotate()> | <skew()> | <skewX()> | <skewY()> | <matrix3d()> | <translate3d()> | <translateZ()> | <scale3d()> | <scaleZ()> | <rotate3d()> | <rotateX()> | <rotateY()> | <rotateZ()> | <perspective()>"
    },
    "transform-list": {
      syntax: "<transform-function>+"
    },
    "translate()": {
      syntax: "translate( <length-percentage> , <length-percentage>? )"
    },
    "translate3d()": {
      syntax: "translate3d( <length-percentage> , <length-percentage> , <length> )"
    },
    "translateX()": {
      syntax: "translateX( <length-percentage> )"
    },
    "translateY()": {
      syntax: "translateY( <length-percentage> )"
    },
    "translateZ()": {
      syntax: "translateZ( <length> )"
    },
    "type-or-unit": {
      syntax: "string | color | url | integer | number | length | angle | time | frequency | cap | ch | em | ex | ic | lh | rlh | rem | vb | vi | vw | vh | vmin | vmax | mm | Q | cm | in | pt | pc | px | deg | grad | rad | turn | ms | s | Hz | kHz | %"
    },
    "type-selector": {
      syntax: "<wq-name> | <ns-prefix>? '*'"
    },
    "var()": {
      syntax: "var( <custom-property-name> , <declaration-value>? )"
    },
    "viewport-length": {
      syntax: "auto | <length-percentage>"
    },
    "wq-name": {
      syntax: "<ns-prefix>? <ident-token>"
    }
  };
});

// node_modules/css-tree/data/patch.json
var require_patch = __commonJS((exports2, module2) => {
  module2.exports = {
    atrules: {
      charset: {
        prelude: "<string>"
      },
      "font-face": {
        descriptors: {
          "unicode-range": {
            comment: "replaces <unicode-range>, an old production name",
            syntax: "<urange>#"
          }
        }
      }
    },
    properties: {
      "-moz-background-clip": {
        comment: "deprecated syntax in old Firefox, https://developer.mozilla.org/en/docs/Web/CSS/background-clip",
        syntax: "padding | border"
      },
      "-moz-border-radius-bottomleft": {
        comment: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-left-radius",
        syntax: "<'border-bottom-left-radius'>"
      },
      "-moz-border-radius-bottomright": {
        comment: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-right-radius",
        syntax: "<'border-bottom-right-radius'>"
      },
      "-moz-border-radius-topleft": {
        comment: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-left-radius",
        syntax: "<'border-top-left-radius'>"
      },
      "-moz-border-radius-topright": {
        comment: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-right-radius",
        syntax: "<'border-bottom-right-radius'>"
      },
      "-moz-control-character-visibility": {
        comment: "firefox specific keywords, https://bugzilla.mozilla.org/show_bug.cgi?id=947588",
        syntax: "visible | hidden"
      },
      "-moz-osx-font-smoothing": {
        comment: "misssed old syntax https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth",
        syntax: "auto | grayscale"
      },
      "-moz-user-select": {
        comment: "https://developer.mozilla.org/en-US/docs/Web/CSS/user-select",
        syntax: "none | text | all | -moz-none"
      },
      "-ms-flex-align": {
        comment: "misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-align",
        syntax: "start | end | center | baseline | stretch"
      },
      "-ms-flex-item-align": {
        comment: "misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-align",
        syntax: "auto | start | end | center | baseline | stretch"
      },
      "-ms-flex-line-pack": {
        comment: "misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-line-pack",
        syntax: "start | end | center | justify | distribute | stretch"
      },
      "-ms-flex-negative": {
        comment: "misssed old syntax implemented in IE; TODO: find references for comfirmation",
        syntax: "<'flex-shrink'>"
      },
      "-ms-flex-pack": {
        comment: "misssed old syntax implemented in IE, https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/#flex-pack",
        syntax: "start | end | center | justify | distribute"
      },
      "-ms-flex-order": {
        comment: "misssed old syntax implemented in IE; https://msdn.microsoft.com/en-us/library/jj127303(v=vs.85).aspx",
        syntax: "<integer>"
      },
      "-ms-flex-positive": {
        comment: "misssed old syntax implemented in IE; TODO: find references for comfirmation",
        syntax: "<'flex-grow'>"
      },
      "-ms-flex-preferred-size": {
        comment: "misssed old syntax implemented in IE; TODO: find references for comfirmation",
        syntax: "<'flex-basis'>"
      },
      "-ms-interpolation-mode": {
        comment: "https://msdn.microsoft.com/en-us/library/ff521095(v=vs.85).aspx",
        syntax: "nearest-neighbor | bicubic"
      },
      "-ms-grid-column-align": {
        comment: "add this property first since it uses as fallback for flexbox, https://msdn.microsoft.com/en-us/library/windows/apps/hh466338.aspx",
        syntax: "start | end | center | stretch"
      },
      "-ms-grid-row-align": {
        comment: "add this property first since it uses as fallback for flexbox, https://msdn.microsoft.com/en-us/library/windows/apps/hh466348.aspx",
        syntax: "start | end | center | stretch"
      },
      "-ms-hyphenate-limit-last": {
        comment: "misssed old syntax implemented in IE; https://www.w3.org/TR/css-text-4/#hyphenate-line-limits",
        syntax: "none | always | column | page | spread"
      },
      "-webkit-appearance": {
        comment: "webkit specific keywords",
        references: [
          "http://css-infos.net/property/-webkit-appearance"
        ],
        syntax: "none | button | button-bevel | caps-lock-indicator | caret | checkbox | default-button | inner-spin-button | listbox | listitem | media-controls-background | media-controls-fullscreen-background | media-current-time-display | media-enter-fullscreen-button | media-exit-fullscreen-button | media-fullscreen-button | media-mute-button | media-overlay-play-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | media-time-remaining-display | media-toggle-closed-captions-button | media-volume-slider | media-volume-slider-container | media-volume-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | meter | progress-bar | progress-bar-value | push-button | radio | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbargripper-horizontal | scrollbargripper-vertical | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield | -apple-pay-button"
      },
      "-webkit-background-clip": {
        comment: "https://developer.mozilla.org/en/docs/Web/CSS/background-clip",
        syntax: "[ <box> | border | padding | content | text ]#"
      },
      "-webkit-column-break-after": {
        comment: "added, http://help.dottoro.com/lcrthhhv.php",
        syntax: "always | auto | avoid"
      },
      "-webkit-column-break-before": {
        comment: "added, http://help.dottoro.com/lcxquvkf.php",
        syntax: "always | auto | avoid"
      },
      "-webkit-column-break-inside": {
        comment: "added, http://help.dottoro.com/lclhnthl.php",
        syntax: "always | auto | avoid"
      },
      "-webkit-font-smoothing": {
        comment: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth",
        syntax: "auto | none | antialiased | subpixel-antialiased"
      },
      "-webkit-mask-box-image": {
        comment: "missed; https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-mask-box-image",
        syntax: "[ <url> | <gradient> | none ] [ <length-percentage>{4} <-webkit-mask-box-repeat>{2} ]?"
      },
      "-webkit-print-color-adjust": {
        comment: "missed",
        references: [
          "https://developer.mozilla.org/en/docs/Web/CSS/-webkit-print-color-adjust"
        ],
        syntax: "economy | exact"
      },
      "-webkit-text-security": {
        comment: "missed; http://help.dottoro.com/lcbkewgt.php",
        syntax: "none | circle | disc | square"
      },
      "-webkit-user-drag": {
        comment: "missed; http://help.dottoro.com/lcbixvwm.php",
        syntax: "none | element | auto"
      },
      "-webkit-user-select": {
        comment: "auto is supported by old webkit, https://developer.mozilla.org/en-US/docs/Web/CSS/user-select",
        syntax: "auto | none | text | all"
      },
      "alignment-baseline": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/text.html#AlignmentBaselineProperty"
        ],
        syntax: "auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical"
      },
      "baseline-shift": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/text.html#BaselineShiftProperty"
        ],
        syntax: "baseline | sub | super | <svg-length>"
      },
      behavior: {
        comment: "added old IE property https://msdn.microsoft.com/en-us/library/ms530723(v=vs.85).aspx",
        syntax: "<url>+"
      },
      "clip-rule": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/masking.html#ClipRuleProperty"
        ],
        syntax: "nonzero | evenodd"
      },
      cue: {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<'cue-before'> <'cue-after'>?"
      },
      "cue-after": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<url> <decibel>? | none"
      },
      "cue-before": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<url> <decibel>? | none"
      },
      cursor: {
        comment: "added legacy keywords: hand, -webkit-grab. -webkit-grabbing, -webkit-zoom-in, -webkit-zoom-out, -moz-grab, -moz-grabbing, -moz-zoom-in, -moz-zoom-out",
        references: [
          "https://www.sitepoint.com/css3-cursor-styles/"
        ],
        syntax: "[ [ <url> [ <x> <y> ]? , ]* [ auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing | hand | -webkit-grab | -webkit-grabbing | -webkit-zoom-in | -webkit-zoom-out | -moz-grab | -moz-grabbing | -moz-zoom-in | -moz-zoom-out ] ]"
      },
      display: {
        comment: "extended with -ms-flexbox",
        syntax: "| <-non-standard-display>"
      },
      position: {
        comment: "extended with -webkit-sticky",
        syntax: "| -webkit-sticky"
      },
      "dominant-baseline": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/text.html#DominantBaselineProperty"
        ],
        syntax: "auto | use-script | no-change | reset-size | ideographic | alphabetic | hanging | mathematical | central | middle | text-after-edge | text-before-edge"
      },
      "image-rendering": {
        comment: "extended with <-non-standard-image-rendering>, added SVG keywords optimizeSpeed and optimizeQuality",
        references: [
          "https://developer.mozilla.org/en/docs/Web/CSS/image-rendering",
          "https://www.w3.org/TR/SVG/painting.html#ImageRenderingProperty"
        ],
        syntax: "| optimizeSpeed | optimizeQuality | <-non-standard-image-rendering>"
      },
      fill: {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#FillProperty"
        ],
        syntax: "<paint>"
      },
      "fill-opacity": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#FillProperty"
        ],
        syntax: "<number-zero-one>"
      },
      "fill-rule": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#FillProperty"
        ],
        syntax: "nonzero | evenodd"
      },
      filter: {
        comment: "extend with IE legacy syntaxes",
        syntax: "| <-ms-filter-function-list>"
      },
      "glyph-orientation-horizontal": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/text.html#GlyphOrientationHorizontalProperty"
        ],
        syntax: "<angle>"
      },
      "glyph-orientation-vertical": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/text.html#GlyphOrientationVerticalProperty"
        ],
        syntax: "<angle>"
      },
      kerning: {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/text.html#KerningProperty"
        ],
        syntax: "auto | <svg-length>"
      },
      "letter-spacing": {
        comment: "fix syntax <length> -> <length-percentage>",
        references: [
          "https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/letter-spacing"
        ],
        syntax: "normal | <length-percentage>"
      },
      marker: {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#MarkerProperties"
        ],
        syntax: "none | <url>"
      },
      "marker-end": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#MarkerProperties"
        ],
        syntax: "none | <url>"
      },
      "marker-mid": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#MarkerProperties"
        ],
        syntax: "none | <url>"
      },
      "marker-start": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#MarkerProperties"
        ],
        syntax: "none | <url>"
      },
      "max-width": {
        comment: "fix auto -> none (https://github.com/mdn/data/pull/431); extend by non-standard width keywords https://developer.mozilla.org/en-US/docs/Web/CSS/max-width",
        syntax: "none | <length-percentage> | min-content | max-content | fit-content(<length-percentage>) | <-non-standard-width>"
      },
      "min-width": {
        comment: "extend by non-standard width keywords https://developer.mozilla.org/en-US/docs/Web/CSS/width",
        syntax: "auto | <length-percentage> | min-content | max-content | fit-content(<length-percentage>) | <-non-standard-width>"
      },
      overflow: {
        comment: "extend by vendor keywords https://developer.mozilla.org/en-US/docs/Web/CSS/overflow",
        syntax: "| <-non-standard-overflow>"
      },
      pause: {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<'pause-before'> <'pause-after'>?"
      },
      "pause-after": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<time> | none | x-weak | weak | medium | strong | x-strong"
      },
      "pause-before": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<time> | none | x-weak | weak | medium | strong | x-strong"
      },
      rest: {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<'rest-before'> <'rest-after'>?"
      },
      "rest-after": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<time> | none | x-weak | weak | medium | strong | x-strong"
      },
      "rest-before": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<time> | none | x-weak | weak | medium | strong | x-strong"
      },
      "shape-rendering": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#ShapeRenderingPropert"
        ],
        syntax: "auto | optimizeSpeed | crispEdges | geometricPrecision"
      },
      src: {
        comment: "added @font-face's src property https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src",
        syntax: "[ <url> [ format( <string># ) ]? | local( <family-name> ) ]#"
      },
      speak: {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "auto | none | normal"
      },
      "speak-as": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "normal | spell-out || digits || [ literal-punctuation | no-punctuation ]"
      },
      stroke: {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
        ],
        syntax: "<paint>"
      },
      "stroke-dasharray": {
        comment: "added SVG property; a list of comma and/or white space separated <length>s and <percentage>s",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
        ],
        syntax: "none | [ <svg-length>+ ]#"
      },
      "stroke-dashoffset": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
        ],
        syntax: "<svg-length>"
      },
      "stroke-linecap": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
        ],
        syntax: "butt | round | square"
      },
      "stroke-linejoin": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
        ],
        syntax: "miter | round | bevel"
      },
      "stroke-miterlimit": {
        comment: "added SVG property (<miterlimit> = <number-one-or-greater>) ",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
        ],
        syntax: "<number-one-or-greater>"
      },
      "stroke-opacity": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
        ],
        syntax: "<number-zero-one>"
      },
      "stroke-width": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/painting.html#StrokeProperties"
        ],
        syntax: "<svg-length>"
      },
      "text-anchor": {
        comment: "added SVG property",
        references: [
          "https://www.w3.org/TR/SVG/text.html#TextAlignmentProperties"
        ],
        syntax: "start | middle | end"
      },
      "unicode-bidi": {
        comment: "added prefixed keywords https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-bidi",
        syntax: "| -moz-isolate | -moz-isolate-override | -moz-plaintext | -webkit-isolate | -webkit-isolate-override | -webkit-plaintext"
      },
      "unicode-range": {
        comment: "added missed property https://developer.mozilla.org/en-US/docs/Web/CSS/%40font-face/unicode-range",
        syntax: "<urange>#"
      },
      "voice-balance": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<number> | left | center | right | leftwards | rightwards"
      },
      "voice-duration": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "auto | <time>"
      },
      "voice-family": {
        comment: "<name> -> <family-name>, https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "[ [ <family-name> | <generic-voice> ] , ]* [ <family-name> | <generic-voice> ] | preserve"
      },
      "voice-pitch": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<frequency> && absolute | [ [ x-low | low | medium | high | x-high ] || [ <frequency> | <semitones> | <percentage> ] ]"
      },
      "voice-range": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "<frequency> && absolute | [ [ x-low | low | medium | high | x-high ] || [ <frequency> | <semitones> | <percentage> ] ]"
      },
      "voice-rate": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "[ normal | x-slow | slow | medium | fast | x-fast ] || <percentage>"
      },
      "voice-stress": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "normal | strong | moderate | none | reduced"
      },
      "voice-volume": {
        comment: "https://www.w3.org/TR/css3-speech/#property-index",
        syntax: "silent | [ [ x-soft | soft | medium | loud | x-loud ] || <decibel> ]"
      },
      "writing-mode": {
        comment: "extend with SVG keywords",
        syntax: "| <svg-writing-mode>"
      }
    },
    syntaxes: {
      "-legacy-gradient": {
        comment: "added collection of legacy gradient syntaxes",
        syntax: "<-webkit-gradient()> | <-legacy-linear-gradient> | <-legacy-repeating-linear-gradient> | <-legacy-radial-gradient> | <-legacy-repeating-radial-gradient>"
      },
      "-legacy-linear-gradient": {
        comment: "like standard syntax but w/o `to` keyword https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient",
        syntax: "-moz-linear-gradient( <-legacy-linear-gradient-arguments> ) | -webkit-linear-gradient( <-legacy-linear-gradient-arguments> ) | -o-linear-gradient( <-legacy-linear-gradient-arguments> )"
      },
      "-legacy-repeating-linear-gradient": {
        comment: "like standard syntax but w/o `to` keyword https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient",
        syntax: "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> ) | -webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> ) | -o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )"
      },
      "-legacy-linear-gradient-arguments": {
        comment: "like standard syntax but w/o `to` keyword https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient",
        syntax: "[ <angle> | <side-or-corner> ]? , <color-stop-list>"
      },
      "-legacy-radial-gradient": {
        comment: "deprecated syntax that implemented by some browsers https://www.w3.org/TR/2011/WD-css3-images-20110908/#radial-gradients",
        syntax: "-moz-radial-gradient( <-legacy-radial-gradient-arguments> ) | -webkit-radial-gradient( <-legacy-radial-gradient-arguments> ) | -o-radial-gradient( <-legacy-radial-gradient-arguments> )"
      },
      "-legacy-repeating-radial-gradient": {
        comment: "deprecated syntax that implemented by some browsers https://www.w3.org/TR/2011/WD-css3-images-20110908/#radial-gradients",
        syntax: "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> ) | -webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> ) | -o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )"
      },
      "-legacy-radial-gradient-arguments": {
        comment: "deprecated syntax that implemented by some browsers https://www.w3.org/TR/2011/WD-css3-images-20110908/#radial-gradients",
        syntax: "[ <position> , ]? [ [ [ <-legacy-radial-gradient-shape> || <-legacy-radial-gradient-size> ] | [ <length> | <percentage> ]{2} ] , ]? <color-stop-list>"
      },
      "-legacy-radial-gradient-size": {
        comment: "before a standard it contains 2 extra keywords (`contain` and `cover`) https://www.w3.org/TR/2011/WD-css3-images-20110908/#ltsize",
        syntax: "closest-side | closest-corner | farthest-side | farthest-corner | contain | cover"
      },
      "-legacy-radial-gradient-shape": {
        comment: "define to double sure it doesn't extends in future https://www.w3.org/TR/2011/WD-css3-images-20110908/#ltshape",
        syntax: "circle | ellipse"
      },
      "-non-standard-font": {
        comment: "non standard fonts",
        references: [
          "https://webkit.org/blog/3709/using-the-system-font-in-web-content/"
        ],
        syntax: "-apple-system-body | -apple-system-headline | -apple-system-subheadline | -apple-system-caption1 | -apple-system-caption2 | -apple-system-footnote | -apple-system-short-body | -apple-system-short-headline | -apple-system-short-subheadline | -apple-system-short-caption1 | -apple-system-short-footnote | -apple-system-tall-body"
      },
      "-non-standard-color": {
        comment: "non standard colors",
        references: [
          "http://cssdot.ru/%D0%A1%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D1%87%D0%BD%D0%B8%D0%BA_CSS/color-i305.html",
          "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Mozilla_Color_Preference_Extensions"
        ],
        syntax: "-moz-ButtonDefault | -moz-ButtonHoverFace | -moz-ButtonHoverText | -moz-CellHighlight | -moz-CellHighlightText | -moz-Combobox | -moz-ComboboxText | -moz-Dialog | -moz-DialogText | -moz-dragtargetzone | -moz-EvenTreeRow | -moz-Field | -moz-FieldText | -moz-html-CellHighlight | -moz-html-CellHighlightText | -moz-mac-accentdarkestshadow | -moz-mac-accentdarkshadow | -moz-mac-accentface | -moz-mac-accentlightesthighlight | -moz-mac-accentlightshadow | -moz-mac-accentregularhighlight | -moz-mac-accentregularshadow | -moz-mac-chrome-active | -moz-mac-chrome-inactive | -moz-mac-focusring | -moz-mac-menuselect | -moz-mac-menushadow | -moz-mac-menutextselect | -moz-MenuHover | -moz-MenuHoverText | -moz-MenuBarText | -moz-MenuBarHoverText | -moz-nativehyperlinktext | -moz-OddTreeRow | -moz-win-communicationstext | -moz-win-mediatext | -moz-activehyperlinktext | -moz-default-background-color | -moz-default-color | -moz-hyperlinktext | -moz-visitedhyperlinktext | -webkit-activelink | -webkit-focus-ring-color | -webkit-link | -webkit-text"
      },
      "-non-standard-image-rendering": {
        comment: "non-standard keywords http://phrogz.net/tmp/canvas_image_zoom.html",
        syntax: "optimize-contrast | -moz-crisp-edges | -o-crisp-edges | -webkit-optimize-contrast"
      },
      "-non-standard-overflow": {
        comment: "non-standard keywords https://developer.mozilla.org/en-US/docs/Web/CSS/overflow",
        syntax: "-moz-scrollbars-none | -moz-scrollbars-horizontal | -moz-scrollbars-vertical | -moz-hidden-unscrollable"
      },
      "-non-standard-width": {
        comment: "non-standard keywords https://developer.mozilla.org/en-US/docs/Web/CSS/width",
        syntax: "fill-available | min-intrinsic | intrinsic | -moz-available | -moz-fit-content | -moz-min-content | -moz-max-content | -webkit-min-content | -webkit-max-content"
      },
      "-webkit-gradient()": {
        comment: "first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/ - TODO: simplify when after match algorithm improvement ( [, point, radius | , point] -> [, radius]? , point )",
        syntax: "-webkit-gradient( <-webkit-gradient-type>, <-webkit-gradient-point> [, <-webkit-gradient-point> | , <-webkit-gradient-radius>, <-webkit-gradient-point> ] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )"
      },
      "-webkit-gradient-color-stop": {
        comment: "first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/",
        syntax: "from( <color> ) | color-stop( [ <number-zero-one> | <percentage> ] , <color> ) | to( <color> )"
      },
      "-webkit-gradient-point": {
        comment: "first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/",
        syntax: "[ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ]"
      },
      "-webkit-gradient-radius": {
        comment: "first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/",
        syntax: "<length> | <percentage>"
      },
      "-webkit-gradient-type": {
        comment: "first Apple proposal gradient syntax https://webkit.org/blog/175/introducing-css-gradients/",
        syntax: "linear | radial"
      },
      "-webkit-mask-box-repeat": {
        comment: "missed; https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-mask-box-image",
        syntax: "repeat | stretch | round"
      },
      "-webkit-mask-clip-style": {
        comment: "missed; there is no enough information about `-webkit-mask-clip` property, but looks like all those keywords are working",
        syntax: "border | border-box | padding | padding-box | content | content-box | text"
      },
      "-ms-filter-function-list": {
        comment: "https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter",
        syntax: "<-ms-filter-function>+"
      },
      "-ms-filter-function": {
        comment: "https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter",
        syntax: "<-ms-filter-function-progid> | <-ms-filter-function-legacy>"
      },
      "-ms-filter-function-progid": {
        comment: "https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter",
        syntax: "'progid:' [ <ident-token> '.' ]* [ <ident-token> | <function-token> <any-value>? ) ]"
      },
      "-ms-filter-function-legacy": {
        comment: "https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-filter",
        syntax: "<ident-token> | <function-token> <any-value>? )"
      },
      "-ms-filter": {
        syntax: "<string>"
      },
      age: {
        comment: "https://www.w3.org/TR/css3-speech/#voice-family",
        syntax: "child | young | old"
      },
      "attr-name": {
        syntax: "<wq-name>"
      },
      "attr-fallback": {
        syntax: "<any-value>"
      },
      "border-radius": {
        comment: "missed, https://drafts.csswg.org/css-backgrounds-3/#the-border-radius",
        syntax: "<length-percentage>{1,2}"
      },
      bottom: {
        comment: "missed; not sure we should add it, but no others except `shape` is using it so it's ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect",
        syntax: "<length> | auto"
      },
      "content-list": {
        comment: "missed -> https://drafts.csswg.org/css-content/#typedef-content-list (document-url, <target> and leader() is omitted util stabilization)",
        syntax: "[ <string> | contents | <image> | <quote> | <target> | <leader()> | <attr()> | counter( <ident>, <'list-style-type'>? ) ]+"
      },
      "element()": {
        comment: "https://drafts.csswg.org/css-gcpm/#element-syntax & https://drafts.csswg.org/css-images-4/#element-notation",
        syntax: "element( <custom-ident> , [ first | start | last | first-except ]? ) | element( <id-selector> )"
      },
      "generic-voice": {
        comment: "https://www.w3.org/TR/css3-speech/#voice-family",
        syntax: "[ <age>? <gender> <integer>? ]"
      },
      gender: {
        comment: "https://www.w3.org/TR/css3-speech/#voice-family",
        syntax: "male | female | neutral"
      },
      "generic-family": {
        comment: "added -apple-system",
        references: [
          "https://webkit.org/blog/3709/using-the-system-font-in-web-content/"
        ],
        syntax: "| -apple-system"
      },
      gradient: {
        comment: "added legacy syntaxes support",
        syntax: "| <-legacy-gradient>"
      },
      left: {
        comment: "missed; not sure we should add it, but no others except `shape` is using it so it's ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect",
        syntax: "<length> | auto"
      },
      "mask-image": {
        comment: "missed; https://drafts.fxtf.org/css-masking-1/#the-mask-image",
        syntax: "<mask-reference>#"
      },
      "name-repeat": {
        comment: "missed, and looks like obsolete, keep it as is since other property syntaxes should be changed too; https://www.w3.org/TR/2015/WD-css-grid-1-20150917/#typedef-name-repeat",
        syntax: "repeat( [ <positive-integer> | auto-fill ], <line-names>+)"
      },
      "named-color": {
        comment: "added non standard color names",
        syntax: "| <-non-standard-color>"
      },
      paint: {
        comment: "used by SVG https://www.w3.org/TR/SVG/painting.html#SpecifyingPaint",
        syntax: "none | <color> | <url> [ none | <color> ]? | context-fill | context-stroke"
      },
      "page-size": {
        comment: "https://www.w3.org/TR/css-page-3/#typedef-page-size-page-size",
        syntax: "A5 | A4 | A3 | B5 | B4 | JIS-B5 | JIS-B4 | letter | legal | ledger"
      },
      ratio: {
        comment: "missed, https://drafts.csswg.org/mediaqueries-4/#typedef-ratio",
        syntax: "<integer> / <integer>"
      },
      right: {
        comment: "missed; not sure we should add it, but no others except `shape` is using it so it's ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect",
        syntax: "<length> | auto"
      },
      shape: {
        comment: "missed spaces in function body and add backwards compatible syntax",
        syntax: "rect( <top>, <right>, <bottom>, <left> ) | rect( <top> <right> <bottom> <left> )"
      },
      "svg-length": {
        comment: "All coordinates and lengths in SVG can be specified with or without a unit identifier",
        references: [
          "https://www.w3.org/TR/SVG11/coords.html#Units"
        ],
        syntax: "<percentage> | <length> | <number>"
      },
      "svg-writing-mode": {
        comment: "SVG specific keywords (deprecated for CSS)",
        references: [
          "https://developer.mozilla.org/en/docs/Web/CSS/writing-mode",
          "https://www.w3.org/TR/SVG/text.html#WritingModeProperty"
        ],
        syntax: "lr-tb | rl-tb | tb-rl | lr | rl | tb"
      },
      top: {
        comment: "missed; not sure we should add it, but no others except `shape` is using it so it's ok for now; https://drafts.fxtf.org/css-masking-1/#funcdef-clip-rect",
        syntax: "<length> | auto"
      },
      "track-group": {
        comment: "used by old grid-columns and grid-rows syntax v0",
        syntax: "'(' [ <string>* <track-minmax> <string>* ]+ ')' [ '[' <positive-integer> ']' ]? | <track-minmax>"
      },
      "track-list-v0": {
        comment: "used by old grid-columns and grid-rows syntax v0",
        syntax: "[ <string>* <track-group> <string>* ]+ | none"
      },
      "track-minmax": {
        comment: "used by old grid-columns and grid-rows syntax v0",
        syntax: "minmax( <track-breadth> , <track-breadth> ) | auto | <track-breadth> | fit-content"
      },
      x: {
        comment: "missed; not sure we should add it, but no others except `cursor` is using it so it's ok for now; https://drafts.csswg.org/css-ui-3/#cursor",
        syntax: "<number>"
      },
      y: {
        comment: "missed; not sure we should add it, but no others except `cursor` is using so it's ok for now; https://drafts.csswg.org/css-ui-3/#cursor",
        syntax: "<number>"
      },
      declaration: {
        comment: "missed, restored by https://drafts.csswg.org/css-syntax",
        syntax: "<ident-token> : <declaration-value>? [ '!' important ]?"
      },
      "declaration-list": {
        comment: "missed, restored by https://drafts.csswg.org/css-syntax",
        syntax: "[ <declaration>? ';' ]* <declaration>?"
      },
      url: {
        comment: "https://drafts.csswg.org/css-values-4/#urls",
        syntax: "url( <string> <url-modifier>* ) | <url-token>"
      },
      "url-modifier": {
        comment: "https://drafts.csswg.org/css-values-4/#typedef-url-modifier",
        syntax: "<ident> | <function-token> <any-value> )"
      },
      "number-zero-one": {
        syntax: "<number [0,1]>"
      },
      "number-one-or-greater": {
        syntax: "<number [1,\u221E]>"
      },
      "positive-integer": {
        syntax: "<integer [0,\u221E]>"
      },
      "-non-standard-display": {
        syntax: "-ms-inline-flexbox | -ms-grid | -ms-inline-grid | -webkit-flex | -webkit-inline-flex | -webkit-box | -webkit-inline-box | -moz-inline-stack | -moz-box | -moz-inline-box"
      }
    }
  };
});

// node_modules/css-tree/data/index.js
var require_data = __commonJS((exports2, module2) => {
  var mdnAtrules = require_at_rules();
  var mdnProperties = require_properties();
  var mdnSyntaxes = require_syntaxes();
  var patch = require_patch();
  var extendSyntax = /^\s*\|\s*/;
  function preprocessAtrules(dict) {
    const result = Object.create(null);
    for (const atruleName in dict) {
      const atrule = dict[atruleName];
      let descriptors = null;
      if (atrule.descriptors) {
        descriptors = Object.create(null);
        for (const descriptor in atrule.descriptors) {
          descriptors[descriptor] = atrule.descriptors[descriptor].syntax;
        }
      }
      result[atruleName.substr(1)] = {
        prelude: atrule.syntax.trim().match(/^@\S+\s+([^;\{]*)/)[1].trim() || null,
        descriptors
      };
    }
    return result;
  }
  function patchDictionary(dict, patchDict) {
    const result = {};
    for (const key in dict) {
      result[key] = dict[key].syntax || dict[key];
    }
    for (const key in patchDict) {
      if (key in dict) {
        if (patchDict[key].syntax) {
          result[key] = extendSyntax.test(patchDict[key].syntax) ? result[key] + " " + patchDict[key].syntax.trim() : patchDict[key].syntax;
        } else {
          delete result[key];
        }
      } else {
        if (patchDict[key].syntax) {
          result[key] = patchDict[key].syntax.replace(extendSyntax, "");
        }
      }
    }
    return result;
  }
  function unpackSyntaxes(dict) {
    const result = {};
    for (const key in dict) {
      result[key] = dict[key].syntax;
    }
    return result;
  }
  function patchAtrules(dict, patchDict) {
    const result = {};
    for (const key in dict) {
      const patchDescriptors = patchDict[key] && patchDict[key].descriptors || null;
      result[key] = {
        prelude: key in patchDict && "prelude" in patchDict[key] ? patchDict[key].prelude : dict[key].prelude || null,
        descriptors: dict[key].descriptors ? patchDictionary(dict[key].descriptors, patchDescriptors || {}) : patchDescriptors && unpackSyntaxes(patchDescriptors)
      };
    }
    for (const key in patchDict) {
      if (!hasOwnProperty.call(dict, key)) {
        result[key] = {
          prelude: patchDict[key].prelude || null,
          descriptors: patchDict[key].descriptors && unpackSyntaxes(patchDict[key].descriptors)
        };
      }
    }
    return result;
  }
  module2.exports = {
    types: patchDictionary(mdnSyntaxes, patch.syntaxes),
    atrules: patchAtrules(preprocessAtrules(mdnAtrules), patch.atrules),
    properties: patchDictionary(mdnProperties, patch.properties)
  };
});

// node_modules/css-tree/lib/syntax/node/AnPlusB.js
var require_AnPlusB = __commonJS((exports2, module2) => {
  var cmpChar = require_tokenizer().cmpChar;
  var isDigit = require_tokenizer().isDigit;
  var TYPE2 = require_tokenizer().TYPE;
  var WHITESPACE = TYPE2.WhiteSpace;
  var COMMENT = TYPE2.Comment;
  var IDENT = TYPE2.Ident;
  var NUMBER = TYPE2.Number;
  var DIMENSION = TYPE2.Dimension;
  var PLUSSIGN = 43;
  var HYPHENMINUS = 45;
  var N = 110;
  var DISALLOW_SIGN = true;
  var ALLOW_SIGN = false;
  function checkInteger(offset, disallowSign) {
    var pos = this.scanner.tokenStart + offset;
    var code = this.scanner.source.charCodeAt(pos);
    if (code === PLUSSIGN || code === HYPHENMINUS) {
      if (disallowSign) {
        this.error("Number sign is not allowed");
      }
      pos++;
    }
    for (; pos < this.scanner.tokenEnd; pos++) {
      if (!isDigit(this.scanner.source.charCodeAt(pos))) {
        this.error("Integer is expected", pos);
      }
    }
  }
  function checkTokenIsInteger(disallowSign) {
    return checkInteger.call(this, 0, disallowSign);
  }
  function expectCharCode(offset, code) {
    if (!cmpChar(this.scanner.source, this.scanner.tokenStart + offset, code)) {
      var msg = "";
      switch (code) {
        case N:
          msg = "N is expected";
          break;
        case HYPHENMINUS:
          msg = "HyphenMinus is expected";
          break;
      }
      this.error(msg, this.scanner.tokenStart + offset);
    }
  }
  function consumeB() {
    var offset = 0;
    var sign = 0;
    var type = this.scanner.tokenType;
    while (type === WHITESPACE || type === COMMENT) {
      type = this.scanner.lookupType(++offset);
    }
    if (type !== NUMBER) {
      if (this.scanner.isDelim(PLUSSIGN, offset) || this.scanner.isDelim(HYPHENMINUS, offset)) {
        sign = this.scanner.isDelim(PLUSSIGN, offset) ? PLUSSIGN : HYPHENMINUS;
        do {
          type = this.scanner.lookupType(++offset);
        } while (type === WHITESPACE || type === COMMENT);
        if (type !== NUMBER) {
          this.scanner.skip(offset);
          checkTokenIsInteger.call(this, DISALLOW_SIGN);
        }
      } else {
        return null;
      }
    }
    if (offset > 0) {
      this.scanner.skip(offset);
    }
    if (sign === 0) {
      type = this.scanner.source.charCodeAt(this.scanner.tokenStart);
      if (type !== PLUSSIGN && type !== HYPHENMINUS) {
        this.error("Number sign is expected");
      }
    }
    checkTokenIsInteger.call(this, sign !== 0);
    return sign === HYPHENMINUS ? "-" + this.consume(NUMBER) : this.consume(NUMBER);
  }
  module2.exports = {
    name: "AnPlusB",
    structure: {
      a: [String, null],
      b: [String, null]
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var a = null;
      var b = null;
      if (this.scanner.tokenType === NUMBER) {
        checkTokenIsInteger.call(this, ALLOW_SIGN);
        b = this.consume(NUMBER);
      } else if (this.scanner.tokenType === IDENT && cmpChar(this.scanner.source, this.scanner.tokenStart, HYPHENMINUS)) {
        a = "-1";
        expectCharCode.call(this, 1, N);
        switch (this.scanner.getTokenLength()) {
          case 2:
            this.scanner.next();
            b = consumeB.call(this);
            break;
          case 3:
            expectCharCode.call(this, 2, HYPHENMINUS);
            this.scanner.next();
            this.scanner.skipSC();
            checkTokenIsInteger.call(this, DISALLOW_SIGN);
            b = "-" + this.consume(NUMBER);
            break;
          default:
            expectCharCode.call(this, 2, HYPHENMINUS);
            checkInteger.call(this, 3, DISALLOW_SIGN);
            this.scanner.next();
            b = this.scanner.substrToCursor(start + 2);
        }
      } else if (this.scanner.tokenType === IDENT || this.scanner.isDelim(PLUSSIGN) && this.scanner.lookupType(1) === IDENT) {
        var sign = 0;
        a = "1";
        if (this.scanner.isDelim(PLUSSIGN)) {
          sign = 1;
          this.scanner.next();
        }
        expectCharCode.call(this, 0, N);
        switch (this.scanner.getTokenLength()) {
          case 1:
            this.scanner.next();
            b = consumeB.call(this);
            break;
          case 2:
            expectCharCode.call(this, 1, HYPHENMINUS);
            this.scanner.next();
            this.scanner.skipSC();
            checkTokenIsInteger.call(this, DISALLOW_SIGN);
            b = "-" + this.consume(NUMBER);
            break;
          default:
            expectCharCode.call(this, 1, HYPHENMINUS);
            checkInteger.call(this, 2, DISALLOW_SIGN);
            this.scanner.next();
            b = this.scanner.substrToCursor(start + sign + 1);
        }
      } else if (this.scanner.tokenType === DIMENSION) {
        var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
        var sign = code === PLUSSIGN || code === HYPHENMINUS;
        for (var i = this.scanner.tokenStart + sign; i < this.scanner.tokenEnd; i++) {
          if (!isDigit(this.scanner.source.charCodeAt(i))) {
            break;
          }
        }
        if (i === this.scanner.tokenStart + sign) {
          this.error("Integer is expected", this.scanner.tokenStart + sign);
        }
        expectCharCode.call(this, i - this.scanner.tokenStart, N);
        a = this.scanner.source.substring(start, i);
        if (i + 1 === this.scanner.tokenEnd) {
          this.scanner.next();
          b = consumeB.call(this);
        } else {
          expectCharCode.call(this, i - this.scanner.tokenStart + 1, HYPHENMINUS);
          if (i + 2 === this.scanner.tokenEnd) {
            this.scanner.next();
            this.scanner.skipSC();
            checkTokenIsInteger.call(this, DISALLOW_SIGN);
            b = "-" + this.consume(NUMBER);
          } else {
            checkInteger.call(this, i - this.scanner.tokenStart + 2, DISALLOW_SIGN);
            this.scanner.next();
            b = this.scanner.substrToCursor(i + 1);
          }
        }
      } else {
        this.error();
      }
      if (a !== null && a.charCodeAt(0) === PLUSSIGN) {
        a = a.substr(1);
      }
      if (b !== null && b.charCodeAt(0) === PLUSSIGN) {
        b = b.substr(1);
      }
      return {
        type: "AnPlusB",
        loc: this.getLocation(start, this.scanner.tokenStart),
        a,
        b
      };
    },
    generate: function(node) {
      var a = node.a !== null && node.a !== void 0;
      var b = node.b !== null && node.b !== void 0;
      if (a) {
        this.chunk(node.a === "+1" ? "+n" : node.a === "1" ? "n" : node.a === "-1" ? "-n" : node.a + "n");
        if (b) {
          b = String(node.b);
          if (b.charAt(0) === "-" || b.charAt(0) === "+") {
            this.chunk(b.charAt(0));
            this.chunk(b.substr(1));
          } else {
            this.chunk("+");
            this.chunk(b);
          }
        }
      } else {
        this.chunk(String(node.b));
      }
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Raw.js
var require_Raw = __commonJS((exports2, module2) => {
  var tokenizer = require_tokenizer();
  var TYPE2 = tokenizer.TYPE;
  var WhiteSpace = TYPE2.WhiteSpace;
  var Semicolon = TYPE2.Semicolon;
  var LeftCurlyBracket = TYPE2.LeftCurlyBracket;
  var Delim = TYPE2.Delim;
  var EXCLAMATIONMARK = 33;
  function getOffsetExcludeWS() {
    if (this.scanner.tokenIndex > 0) {
      if (this.scanner.lookupType(-1) === WhiteSpace) {
        return this.scanner.tokenIndex > 1 ? this.scanner.getTokenStart(this.scanner.tokenIndex - 1) : this.scanner.firstCharOffset;
      }
    }
    return this.scanner.tokenStart;
  }
  function balanceEnd() {
    return 0;
  }
  function leftCurlyBracket(tokenType) {
    return tokenType === LeftCurlyBracket ? 1 : 0;
  }
  function leftCurlyBracketOrSemicolon(tokenType) {
    return tokenType === LeftCurlyBracket || tokenType === Semicolon ? 1 : 0;
  }
  function exclamationMarkOrSemicolon(tokenType, source, offset) {
    if (tokenType === Delim && source.charCodeAt(offset) === EXCLAMATIONMARK) {
      return 1;
    }
    return tokenType === Semicolon ? 1 : 0;
  }
  function semicolonIncluded(tokenType) {
    return tokenType === Semicolon ? 2 : 0;
  }
  module2.exports = {
    name: "Raw",
    structure: {
      value: String
    },
    parse: function(startToken, mode, excludeWhiteSpace) {
      var startOffset = this.scanner.getTokenStart(startToken);
      var endOffset;
      this.scanner.skip(this.scanner.getRawLength(startToken, mode || balanceEnd));
      if (excludeWhiteSpace && this.scanner.tokenStart > startOffset) {
        endOffset = getOffsetExcludeWS.call(this);
      } else {
        endOffset = this.scanner.tokenStart;
      }
      return {
        type: "Raw",
        loc: this.getLocation(startOffset, endOffset),
        value: this.scanner.source.substring(startOffset, endOffset)
      };
    },
    generate: function(node) {
      this.chunk(node.value);
    },
    mode: {
      default: balanceEnd,
      leftCurlyBracket,
      leftCurlyBracketOrSemicolon,
      exclamationMarkOrSemicolon,
      semicolonIncluded
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Atrule.js
var require_Atrule = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var rawMode = require_Raw().mode;
  var ATKEYWORD = TYPE2.AtKeyword;
  var SEMICOLON = TYPE2.Semicolon;
  var LEFTCURLYBRACKET = TYPE2.LeftCurlyBracket;
  var RIGHTCURLYBRACKET = TYPE2.RightCurlyBracket;
  function consumeRaw(startToken) {
    return this.Raw(startToken, rawMode.leftCurlyBracketOrSemicolon, true);
  }
  function isDeclarationBlockAtrule() {
    for (var offset = 1, type; type = this.scanner.lookupType(offset); offset++) {
      if (type === RIGHTCURLYBRACKET) {
        return true;
      }
      if (type === LEFTCURLYBRACKET || type === ATKEYWORD) {
        return false;
      }
    }
    return false;
  }
  module2.exports = {
    name: "Atrule",
    structure: {
      name: String,
      prelude: ["AtrulePrelude", "Raw", null],
      block: ["Block", null]
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var name;
      var nameLowerCase;
      var prelude = null;
      var block = null;
      this.eat(ATKEYWORD);
      name = this.scanner.substrToCursor(start + 1);
      nameLowerCase = name.toLowerCase();
      this.scanner.skipSC();
      if (this.scanner.eof === false && this.scanner.tokenType !== LEFTCURLYBRACKET && this.scanner.tokenType !== SEMICOLON) {
        if (this.parseAtrulePrelude) {
          prelude = this.parseWithFallback(this.AtrulePrelude.bind(this, name), consumeRaw);
          if (prelude.type === "AtrulePrelude" && prelude.children.head === null) {
            prelude = null;
          }
        } else {
          prelude = consumeRaw.call(this, this.scanner.tokenIndex);
        }
        this.scanner.skipSC();
      }
      switch (this.scanner.tokenType) {
        case SEMICOLON:
          this.scanner.next();
          break;
        case LEFTCURLYBRACKET:
          if (this.atrule.hasOwnProperty(nameLowerCase) && typeof this.atrule[nameLowerCase].block === "function") {
            block = this.atrule[nameLowerCase].block.call(this);
          } else {
            block = this.Block(isDeclarationBlockAtrule.call(this));
          }
          break;
      }
      return {
        type: "Atrule",
        loc: this.getLocation(start, this.scanner.tokenStart),
        name,
        prelude,
        block
      };
    },
    generate: function(node) {
      this.chunk("@");
      this.chunk(node.name);
      if (node.prelude !== null) {
        this.chunk(" ");
        this.node(node.prelude);
      }
      if (node.block) {
        this.node(node.block);
      } else {
        this.chunk(";");
      }
    },
    walkContext: "atrule"
  };
});

// node_modules/css-tree/lib/syntax/node/AtrulePrelude.js
var require_AtrulePrelude = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var SEMICOLON = TYPE2.Semicolon;
  var LEFTCURLYBRACKET = TYPE2.LeftCurlyBracket;
  module2.exports = {
    name: "AtrulePrelude",
    structure: {
      children: [[]]
    },
    parse: function(name) {
      var children = null;
      if (name !== null) {
        name = name.toLowerCase();
      }
      this.scanner.skipSC();
      if (this.atrule.hasOwnProperty(name) && typeof this.atrule[name].prelude === "function") {
        children = this.atrule[name].prelude.call(this);
      } else {
        children = this.readSequence(this.scope.AtrulePrelude);
      }
      this.scanner.skipSC();
      if (this.scanner.eof !== true && this.scanner.tokenType !== LEFTCURLYBRACKET && this.scanner.tokenType !== SEMICOLON) {
        this.error("Semicolon or block is expected");
      }
      if (children === null) {
        children = this.createList();
      }
      return {
        type: "AtrulePrelude",
        loc: this.getLocationFromList(children),
        children
      };
    },
    generate: function(node) {
      this.children(node);
    },
    walkContext: "atrulePrelude"
  };
});

// node_modules/css-tree/lib/syntax/node/AttributeSelector.js
var require_AttributeSelector = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var IDENT = TYPE2.Ident;
  var STRING = TYPE2.String;
  var COLON = TYPE2.Colon;
  var LEFTSQUAREBRACKET = TYPE2.LeftSquareBracket;
  var RIGHTSQUAREBRACKET = TYPE2.RightSquareBracket;
  var DOLLARSIGN = 36;
  var ASTERISK = 42;
  var EQUALSSIGN = 61;
  var CIRCUMFLEXACCENT = 94;
  var VERTICALLINE = 124;
  var TILDE = 126;
  function getAttributeName() {
    if (this.scanner.eof) {
      this.error("Unexpected end of input");
    }
    var start = this.scanner.tokenStart;
    var expectIdent = false;
    var checkColon = true;
    if (this.scanner.isDelim(ASTERISK)) {
      expectIdent = true;
      checkColon = false;
      this.scanner.next();
    } else if (!this.scanner.isDelim(VERTICALLINE)) {
      this.eat(IDENT);
    }
    if (this.scanner.isDelim(VERTICALLINE)) {
      if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 1) !== EQUALSSIGN) {
        this.scanner.next();
        this.eat(IDENT);
      } else if (expectIdent) {
        this.error("Identifier is expected", this.scanner.tokenEnd);
      }
    } else if (expectIdent) {
      this.error("Vertical line is expected");
    }
    if (checkColon && this.scanner.tokenType === COLON) {
      this.scanner.next();
      this.eat(IDENT);
    }
    return {
      type: "Identifier",
      loc: this.getLocation(start, this.scanner.tokenStart),
      name: this.scanner.substrToCursor(start)
    };
  }
  function getOperator() {
    var start = this.scanner.tokenStart;
    var code = this.scanner.source.charCodeAt(start);
    if (code !== EQUALSSIGN && code !== TILDE && code !== CIRCUMFLEXACCENT && code !== DOLLARSIGN && code !== ASTERISK && code !== VERTICALLINE) {
      this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected");
    }
    this.scanner.next();
    if (code !== EQUALSSIGN) {
      if (!this.scanner.isDelim(EQUALSSIGN)) {
        this.error("Equal sign is expected");
      }
      this.scanner.next();
    }
    return this.scanner.substrToCursor(start);
  }
  module2.exports = {
    name: "AttributeSelector",
    structure: {
      name: "Identifier",
      matcher: [String, null],
      value: ["String", "Identifier", null],
      flags: [String, null]
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var name;
      var matcher = null;
      var value = null;
      var flags = null;
      this.eat(LEFTSQUAREBRACKET);
      this.scanner.skipSC();
      name = getAttributeName.call(this);
      this.scanner.skipSC();
      if (this.scanner.tokenType !== RIGHTSQUAREBRACKET) {
        if (this.scanner.tokenType !== IDENT) {
          matcher = getOperator.call(this);
          this.scanner.skipSC();
          value = this.scanner.tokenType === STRING ? this.String() : this.Identifier();
          this.scanner.skipSC();
        }
        if (this.scanner.tokenType === IDENT) {
          flags = this.scanner.getTokenValue();
          this.scanner.next();
          this.scanner.skipSC();
        }
      }
      this.eat(RIGHTSQUAREBRACKET);
      return {
        type: "AttributeSelector",
        loc: this.getLocation(start, this.scanner.tokenStart),
        name,
        matcher,
        value,
        flags
      };
    },
    generate: function(node) {
      var flagsPrefix = " ";
      this.chunk("[");
      this.node(node.name);
      if (node.matcher !== null) {
        this.chunk(node.matcher);
        if (node.value !== null) {
          this.node(node.value);
          if (node.value.type === "String") {
            flagsPrefix = "";
          }
        }
      }
      if (node.flags !== null) {
        this.chunk(flagsPrefix);
        this.chunk(node.flags);
      }
      this.chunk("]");
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Block.js
var require_Block = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var rawMode = require_Raw().mode;
  var WHITESPACE = TYPE2.WhiteSpace;
  var COMMENT = TYPE2.Comment;
  var SEMICOLON = TYPE2.Semicolon;
  var ATKEYWORD = TYPE2.AtKeyword;
  var LEFTCURLYBRACKET = TYPE2.LeftCurlyBracket;
  var RIGHTCURLYBRACKET = TYPE2.RightCurlyBracket;
  function consumeRaw(startToken) {
    return this.Raw(startToken, null, true);
  }
  function consumeRule() {
    return this.parseWithFallback(this.Rule, consumeRaw);
  }
  function consumeRawDeclaration(startToken) {
    return this.Raw(startToken, rawMode.semicolonIncluded, true);
  }
  function consumeDeclaration() {
    if (this.scanner.tokenType === SEMICOLON) {
      return consumeRawDeclaration.call(this, this.scanner.tokenIndex);
    }
    var node = this.parseWithFallback(this.Declaration, consumeRawDeclaration);
    if (this.scanner.tokenType === SEMICOLON) {
      this.scanner.next();
    }
    return node;
  }
  module2.exports = {
    name: "Block",
    structure: {
      children: [[
        "Atrule",
        "Rule",
        "Declaration"
      ]]
    },
    parse: function(isDeclaration) {
      var consumer = isDeclaration ? consumeDeclaration : consumeRule;
      var start = this.scanner.tokenStart;
      var children = this.createList();
      this.eat(LEFTCURLYBRACKET);
      scan:
        while (!this.scanner.eof) {
          switch (this.scanner.tokenType) {
            case RIGHTCURLYBRACKET:
              break scan;
            case WHITESPACE:
            case COMMENT:
              this.scanner.next();
              break;
            case ATKEYWORD:
              children.push(this.parseWithFallback(this.Atrule, consumeRaw));
              break;
            default:
              children.push(consumer.call(this));
          }
        }
      if (!this.scanner.eof) {
        this.eat(RIGHTCURLYBRACKET);
      }
      return {
        type: "Block",
        loc: this.getLocation(start, this.scanner.tokenStart),
        children
      };
    },
    generate: function(node) {
      this.chunk("{");
      this.children(node, function(prev) {
        if (prev.type === "Declaration") {
          this.chunk(";");
        }
      });
      this.chunk("}");
    },
    walkContext: "block"
  };
});

// node_modules/css-tree/lib/syntax/node/Brackets.js
var require_Brackets = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var LEFTSQUAREBRACKET = TYPE2.LeftSquareBracket;
  var RIGHTSQUAREBRACKET = TYPE2.RightSquareBracket;
  module2.exports = {
    name: "Brackets",
    structure: {
      children: [[]]
    },
    parse: function(readSequence, recognizer) {
      var start = this.scanner.tokenStart;
      var children = null;
      this.eat(LEFTSQUAREBRACKET);
      children = readSequence.call(this, recognizer);
      if (!this.scanner.eof) {
        this.eat(RIGHTSQUAREBRACKET);
      }
      return {
        type: "Brackets",
        loc: this.getLocation(start, this.scanner.tokenStart),
        children
      };
    },
    generate: function(node) {
      this.chunk("[");
      this.children(node);
      this.chunk("]");
    }
  };
});

// node_modules/css-tree/lib/syntax/node/CDC.js
var require_CDC = __commonJS((exports2, module2) => {
  var CDC = require_tokenizer().TYPE.CDC;
  module2.exports = {
    name: "CDC",
    structure: [],
    parse: function() {
      var start = this.scanner.tokenStart;
      this.eat(CDC);
      return {
        type: "CDC",
        loc: this.getLocation(start, this.scanner.tokenStart)
      };
    },
    generate: function() {
      this.chunk("-->");
    }
  };
});

// node_modules/css-tree/lib/syntax/node/CDO.js
var require_CDO = __commonJS((exports2, module2) => {
  var CDO = require_tokenizer().TYPE.CDO;
  module2.exports = {
    name: "CDO",
    structure: [],
    parse: function() {
      var start = this.scanner.tokenStart;
      this.eat(CDO);
      return {
        type: "CDO",
        loc: this.getLocation(start, this.scanner.tokenStart)
      };
    },
    generate: function() {
      this.chunk("<!--");
    }
  };
});

// node_modules/css-tree/lib/syntax/node/ClassSelector.js
var require_ClassSelector = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var IDENT = TYPE2.Ident;
  var FULLSTOP = 46;
  module2.exports = {
    name: "ClassSelector",
    structure: {
      name: String
    },
    parse: function() {
      if (!this.scanner.isDelim(FULLSTOP)) {
        this.error("Full stop is expected");
      }
      this.scanner.next();
      return {
        type: "ClassSelector",
        loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
        name: this.consume(IDENT)
      };
    },
    generate: function(node) {
      this.chunk(".");
      this.chunk(node.name);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Combinator.js
var require_Combinator = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var IDENT = TYPE2.Ident;
  var PLUSSIGN = 43;
  var SOLIDUS = 47;
  var GREATERTHANSIGN = 62;
  var TILDE = 126;
  module2.exports = {
    name: "Combinator",
    structure: {
      name: String
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
      switch (code) {
        case GREATERTHANSIGN:
        case PLUSSIGN:
        case TILDE:
          this.scanner.next();
          break;
        case SOLIDUS:
          this.scanner.next();
          if (this.scanner.tokenType !== IDENT || this.scanner.lookupValue(0, "deep") === false) {
            this.error("Identifier `deep` is expected");
          }
          this.scanner.next();
          if (!this.scanner.isDelim(SOLIDUS)) {
            this.error("Solidus is expected");
          }
          this.scanner.next();
          break;
        default:
          this.error("Combinator is expected");
      }
      return {
        type: "Combinator",
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(start)
      };
    },
    generate: function(node) {
      this.chunk(node.name);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Comment.js
var require_Comment = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var COMMENT = TYPE2.Comment;
  var ASTERISK = 42;
  var SOLIDUS = 47;
  module2.exports = {
    name: "Comment",
    structure: {
      value: String
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var end = this.scanner.tokenEnd;
      this.eat(COMMENT);
      if (end - start + 2 >= 2 && this.scanner.source.charCodeAt(end - 2) === ASTERISK && this.scanner.source.charCodeAt(end - 1) === SOLIDUS) {
        end -= 2;
      }
      return {
        type: "Comment",
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.source.substring(start + 2, end)
      };
    },
    generate: function(node) {
      this.chunk("/*");
      this.chunk(node.value);
      this.chunk("*/");
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Declaration.js
var require_Declaration = __commonJS((exports2, module2) => {
  var isCustomProperty = require_names().isCustomProperty;
  var TYPE2 = require_tokenizer().TYPE;
  var rawMode = require_Raw().mode;
  var IDENT = TYPE2.Ident;
  var HASH = TYPE2.Hash;
  var COLON = TYPE2.Colon;
  var SEMICOLON = TYPE2.Semicolon;
  var DELIM = TYPE2.Delim;
  var WHITESPACE = TYPE2.WhiteSpace;
  var EXCLAMATIONMARK = 33;
  var NUMBERSIGN = 35;
  var DOLLARSIGN = 36;
  var AMPERSAND = 38;
  var ASTERISK = 42;
  var PLUSSIGN = 43;
  var SOLIDUS = 47;
  function consumeValueRaw(startToken) {
    return this.Raw(startToken, rawMode.exclamationMarkOrSemicolon, true);
  }
  function consumeCustomPropertyRaw(startToken) {
    return this.Raw(startToken, rawMode.exclamationMarkOrSemicolon, false);
  }
  function consumeValue() {
    var startValueToken = this.scanner.tokenIndex;
    var value = this.Value();
    if (value.type !== "Raw" && this.scanner.eof === false && this.scanner.tokenType !== SEMICOLON && this.scanner.isDelim(EXCLAMATIONMARK) === false && this.scanner.isBalanceEdge(startValueToken) === false) {
      this.error();
    }
    return value;
  }
  module2.exports = {
    name: "Declaration",
    structure: {
      important: [Boolean, String],
      property: String,
      value: ["Value", "Raw"]
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var startToken = this.scanner.tokenIndex;
      var property = readProperty.call(this);
      var customProperty = isCustomProperty(property);
      var parseValue = customProperty ? this.parseCustomProperty : this.parseValue;
      var consumeRaw = customProperty ? consumeCustomPropertyRaw : consumeValueRaw;
      var important = false;
      var value;
      this.scanner.skipSC();
      this.eat(COLON);
      const valueStart = this.scanner.tokenIndex;
      if (!customProperty) {
        this.scanner.skipSC();
      }
      if (parseValue) {
        value = this.parseWithFallback(consumeValue, consumeRaw);
      } else {
        value = consumeRaw.call(this, this.scanner.tokenIndex);
      }
      if (customProperty && value.type === "Value" && value.children.isEmpty()) {
        for (let offset = valueStart - this.scanner.tokenIndex; offset <= 0; offset++) {
          if (this.scanner.lookupType(offset) === WHITESPACE) {
            value.children.appendData({
              type: "WhiteSpace",
              loc: null,
              value: " "
            });
            break;
          }
        }
      }
      if (this.scanner.isDelim(EXCLAMATIONMARK)) {
        important = getImportant.call(this);
        this.scanner.skipSC();
      }
      if (this.scanner.eof === false && this.scanner.tokenType !== SEMICOLON && this.scanner.isBalanceEdge(startToken) === false) {
        this.error();
      }
      return {
        type: "Declaration",
        loc: this.getLocation(start, this.scanner.tokenStart),
        important,
        property,
        value
      };
    },
    generate: function(node) {
      this.chunk(node.property);
      this.chunk(":");
      this.node(node.value);
      if (node.important) {
        this.chunk(node.important === true ? "!important" : "!" + node.important);
      }
    },
    walkContext: "declaration"
  };
  function readProperty() {
    var start = this.scanner.tokenStart;
    var prefix = 0;
    if (this.scanner.tokenType === DELIM) {
      switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
        case ASTERISK:
        case DOLLARSIGN:
        case PLUSSIGN:
        case NUMBERSIGN:
        case AMPERSAND:
          this.scanner.next();
          break;
        case SOLIDUS:
          this.scanner.next();
          if (this.scanner.isDelim(SOLIDUS)) {
            this.scanner.next();
          }
          break;
      }
    }
    if (prefix) {
      this.scanner.skip(prefix);
    }
    if (this.scanner.tokenType === HASH) {
      this.eat(HASH);
    } else {
      this.eat(IDENT);
    }
    return this.scanner.substrToCursor(start);
  }
  function getImportant() {
    this.eat(DELIM);
    this.scanner.skipSC();
    var important = this.consume(IDENT);
    return important === "important" ? true : important;
  }
});

// node_modules/css-tree/lib/syntax/node/DeclarationList.js
var require_DeclarationList = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var rawMode = require_Raw().mode;
  var WHITESPACE = TYPE2.WhiteSpace;
  var COMMENT = TYPE2.Comment;
  var SEMICOLON = TYPE2.Semicolon;
  function consumeRaw(startToken) {
    return this.Raw(startToken, rawMode.semicolonIncluded, true);
  }
  module2.exports = {
    name: "DeclarationList",
    structure: {
      children: [[
        "Declaration"
      ]]
    },
    parse: function() {
      var children = this.createList();
      scan:
        while (!this.scanner.eof) {
          switch (this.scanner.tokenType) {
            case WHITESPACE:
            case COMMENT:
            case SEMICOLON:
              this.scanner.next();
              break;
            default:
              children.push(this.parseWithFallback(this.Declaration, consumeRaw));
          }
        }
      return {
        type: "DeclarationList",
        loc: this.getLocationFromList(children),
        children
      };
    },
    generate: function(node) {
      this.children(node, function(prev) {
        if (prev.type === "Declaration") {
          this.chunk(";");
        }
      });
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Dimension.js
var require_Dimension = __commonJS((exports2, module2) => {
  var consumeNumber = require_utils().consumeNumber;
  var TYPE2 = require_tokenizer().TYPE;
  var DIMENSION = TYPE2.Dimension;
  module2.exports = {
    name: "Dimension",
    structure: {
      value: String,
      unit: String
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var numberEnd = consumeNumber(this.scanner.source, start);
      this.eat(DIMENSION);
      return {
        type: "Dimension",
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.source.substring(start, numberEnd),
        unit: this.scanner.source.substring(numberEnd, this.scanner.tokenStart)
      };
    },
    generate: function(node) {
      this.chunk(node.value);
      this.chunk(node.unit);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Function.js
var require_Function = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var RIGHTPARENTHESIS = TYPE2.RightParenthesis;
  module2.exports = {
    name: "Function",
    structure: {
      name: String,
      children: [[]]
    },
    parse: function(readSequence, recognizer) {
      var start = this.scanner.tokenStart;
      var name = this.consumeFunctionName();
      var nameLowerCase = name.toLowerCase();
      var children;
      children = recognizer.hasOwnProperty(nameLowerCase) ? recognizer[nameLowerCase].call(this, recognizer) : readSequence.call(this, recognizer);
      if (!this.scanner.eof) {
        this.eat(RIGHTPARENTHESIS);
      }
      return {
        type: "Function",
        loc: this.getLocation(start, this.scanner.tokenStart),
        name,
        children
      };
    },
    generate: function(node) {
      this.chunk(node.name);
      this.chunk("(");
      this.children(node);
      this.chunk(")");
    },
    walkContext: "function"
  };
});

// node_modules/css-tree/lib/syntax/node/Hash.js
var require_Hash = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var HASH = TYPE2.Hash;
  module2.exports = {
    name: "Hash",
    structure: {
      value: String
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      this.eat(HASH);
      return {
        type: "Hash",
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.substrToCursor(start + 1)
      };
    },
    generate: function(node) {
      this.chunk("#");
      this.chunk(node.value);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Identifier.js
var require_Identifier = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var IDENT = TYPE2.Ident;
  module2.exports = {
    name: "Identifier",
    structure: {
      name: String
    },
    parse: function() {
      return {
        type: "Identifier",
        loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
        name: this.consume(IDENT)
      };
    },
    generate: function(node) {
      this.chunk(node.name);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/IdSelector.js
var require_IdSelector = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var HASH = TYPE2.Hash;
  module2.exports = {
    name: "IdSelector",
    structure: {
      name: String
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      this.eat(HASH);
      return {
        type: "IdSelector",
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(start + 1)
      };
    },
    generate: function(node) {
      this.chunk("#");
      this.chunk(node.name);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/MediaFeature.js
var require_MediaFeature = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var IDENT = TYPE2.Ident;
  var NUMBER = TYPE2.Number;
  var DIMENSION = TYPE2.Dimension;
  var LEFTPARENTHESIS = TYPE2.LeftParenthesis;
  var RIGHTPARENTHESIS = TYPE2.RightParenthesis;
  var COLON = TYPE2.Colon;
  var DELIM = TYPE2.Delim;
  module2.exports = {
    name: "MediaFeature",
    structure: {
      name: String,
      value: ["Identifier", "Number", "Dimension", "Ratio", null]
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var name;
      var value = null;
      this.eat(LEFTPARENTHESIS);
      this.scanner.skipSC();
      name = this.consume(IDENT);
      this.scanner.skipSC();
      if (this.scanner.tokenType !== RIGHTPARENTHESIS) {
        this.eat(COLON);
        this.scanner.skipSC();
        switch (this.scanner.tokenType) {
          case NUMBER:
            if (this.lookupNonWSType(1) === DELIM) {
              value = this.Ratio();
            } else {
              value = this.Number();
            }
            break;
          case DIMENSION:
            value = this.Dimension();
            break;
          case IDENT:
            value = this.Identifier();
            break;
          default:
            this.error("Number, dimension, ratio or identifier is expected");
        }
        this.scanner.skipSC();
      }
      this.eat(RIGHTPARENTHESIS);
      return {
        type: "MediaFeature",
        loc: this.getLocation(start, this.scanner.tokenStart),
        name,
        value
      };
    },
    generate: function(node) {
      this.chunk("(");
      this.chunk(node.name);
      if (node.value !== null) {
        this.chunk(":");
        this.node(node.value);
      }
      this.chunk(")");
    }
  };
});

// node_modules/css-tree/lib/syntax/node/MediaQuery.js
var require_MediaQuery = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var WHITESPACE = TYPE2.WhiteSpace;
  var COMMENT = TYPE2.Comment;
  var IDENT = TYPE2.Ident;
  var LEFTPARENTHESIS = TYPE2.LeftParenthesis;
  module2.exports = {
    name: "MediaQuery",
    structure: {
      children: [[
        "Identifier",
        "MediaFeature",
        "WhiteSpace"
      ]]
    },
    parse: function() {
      this.scanner.skipSC();
      var children = this.createList();
      var child = null;
      var space = null;
      scan:
        while (!this.scanner.eof) {
          switch (this.scanner.tokenType) {
            case COMMENT:
              this.scanner.next();
              continue;
            case WHITESPACE:
              space = this.WhiteSpace();
              continue;
            case IDENT:
              child = this.Identifier();
              break;
            case LEFTPARENTHESIS:
              child = this.MediaFeature();
              break;
            default:
              break scan;
          }
          if (space !== null) {
            children.push(space);
            space = null;
          }
          children.push(child);
        }
      if (child === null) {
        this.error("Identifier or parenthesis is expected");
      }
      return {
        type: "MediaQuery",
        loc: this.getLocationFromList(children),
        children
      };
    },
    generate: function(node) {
      this.children(node);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/MediaQueryList.js
var require_MediaQueryList = __commonJS((exports2, module2) => {
  var COMMA = require_tokenizer().TYPE.Comma;
  module2.exports = {
    name: "MediaQueryList",
    structure: {
      children: [[
        "MediaQuery"
      ]]
    },
    parse: function(relative) {
      var children = this.createList();
      this.scanner.skipSC();
      while (!this.scanner.eof) {
        children.push(this.MediaQuery(relative));
        if (this.scanner.tokenType !== COMMA) {
          break;
        }
        this.scanner.next();
      }
      return {
        type: "MediaQueryList",
        loc: this.getLocationFromList(children),
        children
      };
    },
    generate: function(node) {
      this.children(node, function() {
        this.chunk(",");
      });
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Nth.js
var require_Nth = __commonJS((exports2, module2) => {
  module2.exports = {
    name: "Nth",
    structure: {
      nth: ["AnPlusB", "Identifier"],
      selector: ["SelectorList", null]
    },
    parse: function(allowOfClause) {
      this.scanner.skipSC();
      var start = this.scanner.tokenStart;
      var end = start;
      var selector = null;
      var query;
      if (this.scanner.lookupValue(0, "odd") || this.scanner.lookupValue(0, "even")) {
        query = this.Identifier();
      } else {
        query = this.AnPlusB();
      }
      this.scanner.skipSC();
      if (allowOfClause && this.scanner.lookupValue(0, "of")) {
        this.scanner.next();
        selector = this.SelectorList();
        if (this.needPositions) {
          end = this.getLastListNode(selector.children).loc.end.offset;
        }
      } else {
        if (this.needPositions) {
          end = query.loc.end.offset;
        }
      }
      return {
        type: "Nth",
        loc: this.getLocation(start, end),
        nth: query,
        selector
      };
    },
    generate: function(node) {
      this.node(node.nth);
      if (node.selector !== null) {
        this.chunk(" of ");
        this.node(node.selector);
      }
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Number.js
var require_Number = __commonJS((exports2, module2) => {
  var NUMBER = require_tokenizer().TYPE.Number;
  module2.exports = {
    name: "Number",
    structure: {
      value: String
    },
    parse: function() {
      return {
        type: "Number",
        loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
        value: this.consume(NUMBER)
      };
    },
    generate: function(node) {
      this.chunk(node.value);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Operator.js
var require_Operator = __commonJS((exports2, module2) => {
  module2.exports = {
    name: "Operator",
    structure: {
      value: String
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      this.scanner.next();
      return {
        type: "Operator",
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.substrToCursor(start)
      };
    },
    generate: function(node) {
      this.chunk(node.value);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Parentheses.js
var require_Parentheses = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var LEFTPARENTHESIS = TYPE2.LeftParenthesis;
  var RIGHTPARENTHESIS = TYPE2.RightParenthesis;
  module2.exports = {
    name: "Parentheses",
    structure: {
      children: [[]]
    },
    parse: function(readSequence, recognizer) {
      var start = this.scanner.tokenStart;
      var children = null;
      this.eat(LEFTPARENTHESIS);
      children = readSequence.call(this, recognizer);
      if (!this.scanner.eof) {
        this.eat(RIGHTPARENTHESIS);
      }
      return {
        type: "Parentheses",
        loc: this.getLocation(start, this.scanner.tokenStart),
        children
      };
    },
    generate: function(node) {
      this.chunk("(");
      this.children(node);
      this.chunk(")");
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Percentage.js
var require_Percentage = __commonJS((exports2, module2) => {
  var consumeNumber = require_utils().consumeNumber;
  var TYPE2 = require_tokenizer().TYPE;
  var PERCENTAGE = TYPE2.Percentage;
  module2.exports = {
    name: "Percentage",
    structure: {
      value: String
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var numberEnd = consumeNumber(this.scanner.source, start);
      this.eat(PERCENTAGE);
      return {
        type: "Percentage",
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.source.substring(start, numberEnd)
      };
    },
    generate: function(node) {
      this.chunk(node.value);
      this.chunk("%");
    }
  };
});

// node_modules/css-tree/lib/syntax/node/PseudoClassSelector.js
var require_PseudoClassSelector = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var IDENT = TYPE2.Ident;
  var FUNCTION = TYPE2.Function;
  var COLON = TYPE2.Colon;
  var RIGHTPARENTHESIS = TYPE2.RightParenthesis;
  module2.exports = {
    name: "PseudoClassSelector",
    structure: {
      name: String,
      children: [["Raw"], null]
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var children = null;
      var name;
      var nameLowerCase;
      this.eat(COLON);
      if (this.scanner.tokenType === FUNCTION) {
        name = this.consumeFunctionName();
        nameLowerCase = name.toLowerCase();
        if (this.pseudo.hasOwnProperty(nameLowerCase)) {
          this.scanner.skipSC();
          children = this.pseudo[nameLowerCase].call(this);
          this.scanner.skipSC();
        } else {
          children = this.createList();
          children.push(this.Raw(this.scanner.tokenIndex, null, false));
        }
        this.eat(RIGHTPARENTHESIS);
      } else {
        name = this.consume(IDENT);
      }
      return {
        type: "PseudoClassSelector",
        loc: this.getLocation(start, this.scanner.tokenStart),
        name,
        children
      };
    },
    generate: function(node) {
      this.chunk(":");
      this.chunk(node.name);
      if (node.children !== null) {
        this.chunk("(");
        this.children(node);
        this.chunk(")");
      }
    },
    walkContext: "function"
  };
});

// node_modules/css-tree/lib/syntax/node/PseudoElementSelector.js
var require_PseudoElementSelector = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var IDENT = TYPE2.Ident;
  var FUNCTION = TYPE2.Function;
  var COLON = TYPE2.Colon;
  var RIGHTPARENTHESIS = TYPE2.RightParenthesis;
  module2.exports = {
    name: "PseudoElementSelector",
    structure: {
      name: String,
      children: [["Raw"], null]
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var children = null;
      var name;
      var nameLowerCase;
      this.eat(COLON);
      this.eat(COLON);
      if (this.scanner.tokenType === FUNCTION) {
        name = this.consumeFunctionName();
        nameLowerCase = name.toLowerCase();
        if (this.pseudo.hasOwnProperty(nameLowerCase)) {
          this.scanner.skipSC();
          children = this.pseudo[nameLowerCase].call(this);
          this.scanner.skipSC();
        } else {
          children = this.createList();
          children.push(this.Raw(this.scanner.tokenIndex, null, false));
        }
        this.eat(RIGHTPARENTHESIS);
      } else {
        name = this.consume(IDENT);
      }
      return {
        type: "PseudoElementSelector",
        loc: this.getLocation(start, this.scanner.tokenStart),
        name,
        children
      };
    },
    generate: function(node) {
      this.chunk("::");
      this.chunk(node.name);
      if (node.children !== null) {
        this.chunk("(");
        this.children(node);
        this.chunk(")");
      }
    },
    walkContext: "function"
  };
});

// node_modules/css-tree/lib/syntax/node/Ratio.js
var require_Ratio = __commonJS((exports2, module2) => {
  var isDigit = require_tokenizer().isDigit;
  var TYPE2 = require_tokenizer().TYPE;
  var NUMBER = TYPE2.Number;
  var DELIM = TYPE2.Delim;
  var SOLIDUS = 47;
  var FULLSTOP = 46;
  function consumeNumber() {
    this.scanner.skipWS();
    var value = this.consume(NUMBER);
    for (var i = 0; i < value.length; i++) {
      var code = value.charCodeAt(i);
      if (!isDigit(code) && code !== FULLSTOP) {
        this.error("Unsigned number is expected", this.scanner.tokenStart - value.length + i);
      }
    }
    if (Number(value) === 0) {
      this.error("Zero number is not allowed", this.scanner.tokenStart - value.length);
    }
    return value;
  }
  module2.exports = {
    name: "Ratio",
    structure: {
      left: String,
      right: String
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var left = consumeNumber.call(this);
      var right;
      this.scanner.skipWS();
      if (!this.scanner.isDelim(SOLIDUS)) {
        this.error("Solidus is expected");
      }
      this.eat(DELIM);
      right = consumeNumber.call(this);
      return {
        type: "Ratio",
        loc: this.getLocation(start, this.scanner.tokenStart),
        left,
        right
      };
    },
    generate: function(node) {
      this.chunk(node.left);
      this.chunk("/");
      this.chunk(node.right);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Rule.js
var require_Rule = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var rawMode = require_Raw().mode;
  var LEFTCURLYBRACKET = TYPE2.LeftCurlyBracket;
  function consumeRaw(startToken) {
    return this.Raw(startToken, rawMode.leftCurlyBracket, true);
  }
  function consumePrelude() {
    var prelude = this.SelectorList();
    if (prelude.type !== "Raw" && this.scanner.eof === false && this.scanner.tokenType !== LEFTCURLYBRACKET) {
      this.error();
    }
    return prelude;
  }
  module2.exports = {
    name: "Rule",
    structure: {
      prelude: ["SelectorList", "Raw"],
      block: ["Block"]
    },
    parse: function() {
      var startToken = this.scanner.tokenIndex;
      var startOffset = this.scanner.tokenStart;
      var prelude;
      var block;
      if (this.parseRulePrelude) {
        prelude = this.parseWithFallback(consumePrelude, consumeRaw);
      } else {
        prelude = consumeRaw.call(this, startToken);
      }
      block = this.Block(true);
      return {
        type: "Rule",
        loc: this.getLocation(startOffset, this.scanner.tokenStart),
        prelude,
        block
      };
    },
    generate: function(node) {
      this.node(node.prelude);
      this.node(node.block);
    },
    walkContext: "rule"
  };
});

// node_modules/css-tree/lib/syntax/node/Selector.js
var require_Selector = __commonJS((exports2, module2) => {
  module2.exports = {
    name: "Selector",
    structure: {
      children: [[
        "TypeSelector",
        "IdSelector",
        "ClassSelector",
        "AttributeSelector",
        "PseudoClassSelector",
        "PseudoElementSelector",
        "Combinator",
        "WhiteSpace"
      ]]
    },
    parse: function() {
      var children = this.readSequence(this.scope.Selector);
      if (this.getFirstListNode(children) === null) {
        this.error("Selector is expected");
      }
      return {
        type: "Selector",
        loc: this.getLocationFromList(children),
        children
      };
    },
    generate: function(node) {
      this.children(node);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/SelectorList.js
var require_SelectorList = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var COMMA = TYPE2.Comma;
  module2.exports = {
    name: "SelectorList",
    structure: {
      children: [[
        "Selector",
        "Raw"
      ]]
    },
    parse: function() {
      var children = this.createList();
      while (!this.scanner.eof) {
        children.push(this.Selector());
        if (this.scanner.tokenType === COMMA) {
          this.scanner.next();
          continue;
        }
        break;
      }
      return {
        type: "SelectorList",
        loc: this.getLocationFromList(children),
        children
      };
    },
    generate: function(node) {
      this.children(node, function() {
        this.chunk(",");
      });
    },
    walkContext: "selector"
  };
});

// node_modules/css-tree/lib/syntax/node/String.js
var require_String = __commonJS((exports2, module2) => {
  var STRING = require_tokenizer().TYPE.String;
  module2.exports = {
    name: "String",
    structure: {
      value: String
    },
    parse: function() {
      return {
        type: "String",
        loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
        value: this.consume(STRING)
      };
    },
    generate: function(node) {
      this.chunk(node.value);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/StyleSheet.js
var require_StyleSheet = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var WHITESPACE = TYPE2.WhiteSpace;
  var COMMENT = TYPE2.Comment;
  var ATKEYWORD = TYPE2.AtKeyword;
  var CDO = TYPE2.CDO;
  var CDC = TYPE2.CDC;
  var EXCLAMATIONMARK = 33;
  function consumeRaw(startToken) {
    return this.Raw(startToken, null, false);
  }
  module2.exports = {
    name: "StyleSheet",
    structure: {
      children: [[
        "Comment",
        "CDO",
        "CDC",
        "Atrule",
        "Rule",
        "Raw"
      ]]
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var children = this.createList();
      var child;
      scan:
        while (!this.scanner.eof) {
          switch (this.scanner.tokenType) {
            case WHITESPACE:
              this.scanner.next();
              continue;
            case COMMENT:
              if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 2) !== EXCLAMATIONMARK) {
                this.scanner.next();
                continue;
              }
              child = this.Comment();
              break;
            case CDO:
              child = this.CDO();
              break;
            case CDC:
              child = this.CDC();
              break;
            case ATKEYWORD:
              child = this.parseWithFallback(this.Atrule, consumeRaw);
              break;
            default:
              child = this.parseWithFallback(this.Rule, consumeRaw);
          }
          children.push(child);
        }
      return {
        type: "StyleSheet",
        loc: this.getLocation(start, this.scanner.tokenStart),
        children
      };
    },
    generate: function(node) {
      this.children(node);
    },
    walkContext: "stylesheet"
  };
});

// node_modules/css-tree/lib/syntax/node/TypeSelector.js
var require_TypeSelector = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var IDENT = TYPE2.Ident;
  var ASTERISK = 42;
  var VERTICALLINE = 124;
  function eatIdentifierOrAsterisk() {
    if (this.scanner.tokenType !== IDENT && this.scanner.isDelim(ASTERISK) === false) {
      this.error("Identifier or asterisk is expected");
    }
    this.scanner.next();
  }
  module2.exports = {
    name: "TypeSelector",
    structure: {
      name: String
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      if (this.scanner.isDelim(VERTICALLINE)) {
        this.scanner.next();
        eatIdentifierOrAsterisk.call(this);
      } else {
        eatIdentifierOrAsterisk.call(this);
        if (this.scanner.isDelim(VERTICALLINE)) {
          this.scanner.next();
          eatIdentifierOrAsterisk.call(this);
        }
      }
      return {
        type: "TypeSelector",
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(start)
      };
    },
    generate: function(node) {
      this.chunk(node.name);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/UnicodeRange.js
var require_UnicodeRange = __commonJS((exports2, module2) => {
  var isHexDigit = require_tokenizer().isHexDigit;
  var cmpChar = require_tokenizer().cmpChar;
  var TYPE2 = require_tokenizer().TYPE;
  var NAME = require_tokenizer().NAME;
  var IDENT = TYPE2.Ident;
  var NUMBER = TYPE2.Number;
  var DIMENSION = TYPE2.Dimension;
  var PLUSSIGN = 43;
  var HYPHENMINUS = 45;
  var QUESTIONMARK = 63;
  var U = 117;
  function eatHexSequence(offset, allowDash) {
    for (var pos = this.scanner.tokenStart + offset, len = 0; pos < this.scanner.tokenEnd; pos++) {
      var code = this.scanner.source.charCodeAt(pos);
      if (code === HYPHENMINUS && allowDash && len !== 0) {
        if (eatHexSequence.call(this, offset + len + 1, false) === 0) {
          this.error();
        }
        return -1;
      }
      if (!isHexDigit(code)) {
        this.error(allowDash && len !== 0 ? "HyphenMinus" + (len < 6 ? " or hex digit" : "") + " is expected" : len < 6 ? "Hex digit is expected" : "Unexpected input", pos);
      }
      if (++len > 6) {
        this.error("Too many hex digits", pos);
      }
      ;
    }
    this.scanner.next();
    return len;
  }
  function eatQuestionMarkSequence(max) {
    var count = 0;
    while (this.scanner.isDelim(QUESTIONMARK)) {
      if (++count > max) {
        this.error("Too many question marks");
      }
      this.scanner.next();
    }
  }
  function startsWith(code) {
    if (this.scanner.source.charCodeAt(this.scanner.tokenStart) !== code) {
      this.error(NAME[code] + " is expected");
    }
  }
  function scanUnicodeRange() {
    var hexLength = 0;
    if (this.scanner.isDelim(PLUSSIGN)) {
      this.scanner.next();
      if (this.scanner.tokenType === IDENT) {
        hexLength = eatHexSequence.call(this, 0, true);
        if (hexLength > 0) {
          eatQuestionMarkSequence.call(this, 6 - hexLength);
        }
        return;
      }
      if (this.scanner.isDelim(QUESTIONMARK)) {
        this.scanner.next();
        eatQuestionMarkSequence.call(this, 5);
        return;
      }
      this.error("Hex digit or question mark is expected");
      return;
    }
    if (this.scanner.tokenType === NUMBER) {
      startsWith.call(this, PLUSSIGN);
      hexLength = eatHexSequence.call(this, 1, true);
      if (this.scanner.isDelim(QUESTIONMARK)) {
        eatQuestionMarkSequence.call(this, 6 - hexLength);
        return;
      }
      if (this.scanner.tokenType === DIMENSION || this.scanner.tokenType === NUMBER) {
        startsWith.call(this, HYPHENMINUS);
        eatHexSequence.call(this, 1, false);
        return;
      }
      return;
    }
    if (this.scanner.tokenType === DIMENSION) {
      startsWith.call(this, PLUSSIGN);
      hexLength = eatHexSequence.call(this, 1, true);
      if (hexLength > 0) {
        eatQuestionMarkSequence.call(this, 6 - hexLength);
      }
      return;
    }
    this.error();
  }
  module2.exports = {
    name: "UnicodeRange",
    structure: {
      value: String
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      if (!cmpChar(this.scanner.source, start, U)) {
        this.error("U is expected");
      }
      if (!cmpChar(this.scanner.source, start + 1, PLUSSIGN)) {
        this.error("Plus sign is expected");
      }
      this.scanner.next();
      scanUnicodeRange.call(this);
      return {
        type: "UnicodeRange",
        loc: this.getLocation(start, this.scanner.tokenStart),
        value: this.scanner.substrToCursor(start)
      };
    },
    generate: function(node) {
      this.chunk(node.value);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Url.js
var require_Url = __commonJS((exports2, module2) => {
  var isWhiteSpace = require_tokenizer().isWhiteSpace;
  var cmpStr = require_tokenizer().cmpStr;
  var TYPE2 = require_tokenizer().TYPE;
  var FUNCTION = TYPE2.Function;
  var URL = TYPE2.Url;
  var RIGHTPARENTHESIS = TYPE2.RightParenthesis;
  module2.exports = {
    name: "Url",
    structure: {
      value: ["String", "Raw"]
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var value;
      switch (this.scanner.tokenType) {
        case URL:
          var rawStart = start + 4;
          var rawEnd = this.scanner.tokenEnd - 1;
          while (rawStart < rawEnd && isWhiteSpace(this.scanner.source.charCodeAt(rawStart))) {
            rawStart++;
          }
          while (rawStart < rawEnd && isWhiteSpace(this.scanner.source.charCodeAt(rawEnd - 1))) {
            rawEnd--;
          }
          value = {
            type: "Raw",
            loc: this.getLocation(rawStart, rawEnd),
            value: this.scanner.source.substring(rawStart, rawEnd)
          };
          this.eat(URL);
          break;
        case FUNCTION:
          if (!cmpStr(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(")) {
            this.error("Function name must be `url`");
          }
          this.eat(FUNCTION);
          this.scanner.skipSC();
          value = this.String();
          this.scanner.skipSC();
          this.eat(RIGHTPARENTHESIS);
          break;
        default:
          this.error("Url or Function is expected");
      }
      return {
        type: "Url",
        loc: this.getLocation(start, this.scanner.tokenStart),
        value
      };
    },
    generate: function(node) {
      this.chunk("url");
      this.chunk("(");
      this.node(node.value);
      this.chunk(")");
    }
  };
});

// node_modules/css-tree/lib/syntax/node/Value.js
var require_Value = __commonJS((exports2, module2) => {
  module2.exports = {
    name: "Value",
    structure: {
      children: [[]]
    },
    parse: function() {
      var start = this.scanner.tokenStart;
      var children = this.readSequence(this.scope.Value);
      return {
        type: "Value",
        loc: this.getLocation(start, this.scanner.tokenStart),
        children
      };
    },
    generate: function(node) {
      this.children(node);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/WhiteSpace.js
var require_WhiteSpace = __commonJS((exports2, module2) => {
  var WHITESPACE = require_tokenizer().TYPE.WhiteSpace;
  var SPACE = Object.freeze({
    type: "WhiteSpace",
    loc: null,
    value: " "
  });
  module2.exports = {
    name: "WhiteSpace",
    structure: {
      value: String
    },
    parse: function() {
      this.eat(WHITESPACE);
      return SPACE;
    },
    generate: function(node) {
      this.chunk(node.value);
    }
  };
});

// node_modules/css-tree/lib/syntax/node/index.js
var require_node = __commonJS((exports2, module2) => {
  module2.exports = {
    AnPlusB: require_AnPlusB(),
    Atrule: require_Atrule(),
    AtrulePrelude: require_AtrulePrelude(),
    AttributeSelector: require_AttributeSelector(),
    Block: require_Block(),
    Brackets: require_Brackets(),
    CDC: require_CDC(),
    CDO: require_CDO(),
    ClassSelector: require_ClassSelector(),
    Combinator: require_Combinator(),
    Comment: require_Comment(),
    Declaration: require_Declaration(),
    DeclarationList: require_DeclarationList(),
    Dimension: require_Dimension(),
    Function: require_Function(),
    Hash: require_Hash(),
    Identifier: require_Identifier(),
    IdSelector: require_IdSelector(),
    MediaFeature: require_MediaFeature(),
    MediaQuery: require_MediaQuery(),
    MediaQueryList: require_MediaQueryList(),
    Nth: require_Nth(),
    Number: require_Number(),
    Operator: require_Operator(),
    Parentheses: require_Parentheses(),
    Percentage: require_Percentage(),
    PseudoClassSelector: require_PseudoClassSelector(),
    PseudoElementSelector: require_PseudoElementSelector(),
    Ratio: require_Ratio(),
    Raw: require_Raw(),
    Rule: require_Rule(),
    Selector: require_Selector(),
    SelectorList: require_SelectorList(),
    String: require_String(),
    StyleSheet: require_StyleSheet(),
    TypeSelector: require_TypeSelector(),
    UnicodeRange: require_UnicodeRange(),
    Url: require_Url(),
    Value: require_Value(),
    WhiteSpace: require_WhiteSpace()
  };
});

// node_modules/css-tree/lib/syntax/config/lexer.js
var require_lexer = __commonJS((exports2, module2) => {
  var data = require_data();
  module2.exports = {
    generic: true,
    types: data.types,
    atrules: data.atrules,
    properties: data.properties,
    node: require_node()
  };
});

// node_modules/css-tree/lib/syntax/scope/default.js
var require_default = __commonJS((exports2, module2) => {
  var cmpChar = require_tokenizer().cmpChar;
  var cmpStr = require_tokenizer().cmpStr;
  var TYPE2 = require_tokenizer().TYPE;
  var IDENT = TYPE2.Ident;
  var STRING = TYPE2.String;
  var NUMBER = TYPE2.Number;
  var FUNCTION = TYPE2.Function;
  var URL = TYPE2.Url;
  var HASH = TYPE2.Hash;
  var DIMENSION = TYPE2.Dimension;
  var PERCENTAGE = TYPE2.Percentage;
  var LEFTPARENTHESIS = TYPE2.LeftParenthesis;
  var LEFTSQUAREBRACKET = TYPE2.LeftSquareBracket;
  var COMMA = TYPE2.Comma;
  var DELIM = TYPE2.Delim;
  var NUMBERSIGN = 35;
  var ASTERISK = 42;
  var PLUSSIGN = 43;
  var HYPHENMINUS = 45;
  var SOLIDUS = 47;
  var U = 117;
  module2.exports = function defaultRecognizer(context) {
    switch (this.scanner.tokenType) {
      case HASH:
        return this.Hash();
      case COMMA:
        context.space = null;
        context.ignoreWSAfter = true;
        return this.Operator();
      case LEFTPARENTHESIS:
        return this.Parentheses(this.readSequence, context.recognizer);
      case LEFTSQUAREBRACKET:
        return this.Brackets(this.readSequence, context.recognizer);
      case STRING:
        return this.String();
      case DIMENSION:
        return this.Dimension();
      case PERCENTAGE:
        return this.Percentage();
      case NUMBER:
        return this.Number();
      case FUNCTION:
        return cmpStr(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, context.recognizer);
      case URL:
        return this.Url();
      case IDENT:
        if (cmpChar(this.scanner.source, this.scanner.tokenStart, U) && cmpChar(this.scanner.source, this.scanner.tokenStart + 1, PLUSSIGN)) {
          return this.UnicodeRange();
        } else {
          return this.Identifier();
        }
      case DELIM:
        var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
        if (code === SOLIDUS || code === ASTERISK || code === PLUSSIGN || code === HYPHENMINUS) {
          return this.Operator();
        }
        if (code === NUMBERSIGN) {
          this.error("Hex or identifier is expected", this.scanner.tokenStart + 1);
        }
        break;
    }
  };
});

// node_modules/css-tree/lib/syntax/scope/atrulePrelude.js
var require_atrulePrelude = __commonJS((exports2, module2) => {
  module2.exports = {
    getNode: require_default()
  };
});

// node_modules/css-tree/lib/syntax/scope/selector.js
var require_selector = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var DELIM = TYPE2.Delim;
  var IDENT = TYPE2.Ident;
  var DIMENSION = TYPE2.Dimension;
  var PERCENTAGE = TYPE2.Percentage;
  var NUMBER = TYPE2.Number;
  var HASH = TYPE2.Hash;
  var COLON = TYPE2.Colon;
  var LEFTSQUAREBRACKET = TYPE2.LeftSquareBracket;
  var NUMBERSIGN = 35;
  var ASTERISK = 42;
  var PLUSSIGN = 43;
  var SOLIDUS = 47;
  var FULLSTOP = 46;
  var GREATERTHANSIGN = 62;
  var VERTICALLINE = 124;
  var TILDE = 126;
  function getNode(context) {
    switch (this.scanner.tokenType) {
      case LEFTSQUAREBRACKET:
        return this.AttributeSelector();
      case HASH:
        return this.IdSelector();
      case COLON:
        if (this.scanner.lookupType(1) === COLON) {
          return this.PseudoElementSelector();
        } else {
          return this.PseudoClassSelector();
        }
      case IDENT:
        return this.TypeSelector();
      case NUMBER:
      case PERCENTAGE:
        return this.Percentage();
      case DIMENSION:
        if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === FULLSTOP) {
          this.error("Identifier is expected", this.scanner.tokenStart + 1);
        }
        break;
      case DELIM:
        var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
        switch (code) {
          case PLUSSIGN:
          case GREATERTHANSIGN:
          case TILDE:
            context.space = null;
            context.ignoreWSAfter = true;
            return this.Combinator();
          case SOLIDUS:
            return this.Combinator();
          case FULLSTOP:
            return this.ClassSelector();
          case ASTERISK:
          case VERTICALLINE:
            return this.TypeSelector();
          case NUMBERSIGN:
            return this.IdSelector();
        }
        break;
    }
  }
  module2.exports = {
    getNode
  };
});

// node_modules/css-tree/lib/syntax/function/expression.js
var require_expression = __commonJS((exports2, module2) => {
  module2.exports = function() {
    return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex, null, false));
  };
});

// node_modules/css-tree/lib/syntax/function/var.js
var require_var = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var rawMode = require_Raw().mode;
  var COMMA = TYPE2.Comma;
  var WHITESPACE = TYPE2.WhiteSpace;
  module2.exports = function() {
    var children = this.createList();
    this.scanner.skipSC();
    children.push(this.Identifier());
    this.scanner.skipSC();
    if (this.scanner.tokenType === COMMA) {
      children.push(this.Operator());
      const startIndex = this.scanner.tokenIndex;
      const value = this.parseCustomProperty ? this.Value(null) : this.Raw(this.scanner.tokenIndex, rawMode.exclamationMarkOrSemicolon, false);
      if (value.type === "Value" && value.children.isEmpty()) {
        for (let offset = startIndex - this.scanner.tokenIndex; offset <= 0; offset++) {
          if (this.scanner.lookupType(offset) === WHITESPACE) {
            value.children.appendData({
              type: "WhiteSpace",
              loc: null,
              value: " "
            });
            break;
          }
        }
      }
      children.push(value);
    }
    return children;
  };
});

// node_modules/css-tree/lib/syntax/scope/value.js
var require_value = __commonJS((exports2, module2) => {
  module2.exports = {
    getNode: require_default(),
    expression: require_expression(),
    var: require_var()
  };
});

// node_modules/css-tree/lib/syntax/scope/index.js
var require_scope = __commonJS((exports2, module2) => {
  module2.exports = {
    AtrulePrelude: require_atrulePrelude(),
    Selector: require_selector(),
    Value: require_value()
  };
});

// node_modules/css-tree/lib/syntax/atrule/font-face.js
var require_font_face = __commonJS((exports2, module2) => {
  module2.exports = {
    parse: {
      prelude: null,
      block: function() {
        return this.Block(true);
      }
    }
  };
});

// node_modules/css-tree/lib/syntax/atrule/import.js
var require_import = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var STRING = TYPE2.String;
  var IDENT = TYPE2.Ident;
  var URL = TYPE2.Url;
  var FUNCTION = TYPE2.Function;
  var LEFTPARENTHESIS = TYPE2.LeftParenthesis;
  module2.exports = {
    parse: {
      prelude: function() {
        var children = this.createList();
        this.scanner.skipSC();
        switch (this.scanner.tokenType) {
          case STRING:
            children.push(this.String());
            break;
          case URL:
          case FUNCTION:
            children.push(this.Url());
            break;
          default:
            this.error("String or url() is expected");
        }
        if (this.lookupNonWSType(0) === IDENT || this.lookupNonWSType(0) === LEFTPARENTHESIS) {
          children.push(this.WhiteSpace());
          children.push(this.MediaQueryList());
        }
        return children;
      },
      block: null
    }
  };
});

// node_modules/css-tree/lib/syntax/atrule/media.js
var require_media = __commonJS((exports2, module2) => {
  module2.exports = {
    parse: {
      prelude: function() {
        return this.createSingleNodeList(this.MediaQueryList());
      },
      block: function() {
        return this.Block(false);
      }
    }
  };
});

// node_modules/css-tree/lib/syntax/atrule/page.js
var require_page = __commonJS((exports2, module2) => {
  module2.exports = {
    parse: {
      prelude: function() {
        return this.createSingleNodeList(this.SelectorList());
      },
      block: function() {
        return this.Block(true);
      }
    }
  };
});

// node_modules/css-tree/lib/syntax/atrule/supports.js
var require_supports = __commonJS((exports2, module2) => {
  var TYPE2 = require_tokenizer().TYPE;
  var WHITESPACE = TYPE2.WhiteSpace;
  var COMMENT = TYPE2.Comment;
  var IDENT = TYPE2.Ident;
  var FUNCTION = TYPE2.Function;
  var COLON = TYPE2.Colon;
  var LEFTPARENTHESIS = TYPE2.LeftParenthesis;
  function consumeRaw() {
    return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex, null, false));
  }
  function parentheses() {
    this.scanner.skipSC();
    if (this.scanner.tokenType === IDENT && this.lookupNonWSType(1) === COLON) {
      return this.createSingleNodeList(this.Declaration());
    }
    return readSequence.call(this);
  }
  function readSequence() {
    var children = this.createList();
    var space = null;
    var child;
    this.scanner.skipSC();
    scan:
      while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
          case WHITESPACE:
            space = this.WhiteSpace();
            continue;
          case COMMENT:
            this.scanner.next();
            continue;
          case FUNCTION:
            child = this.Function(consumeRaw, this.scope.AtrulePrelude);
            break;
          case IDENT:
            child = this.Identifier();
            break;
          case LEFTPARENTHESIS:
            child = this.Parentheses(parentheses, this.scope.AtrulePrelude);
            break;
          default:
            break scan;
        }
        if (space !== null) {
          children.push(space);
          space = null;
        }
        children.push(child);
      }
    return children;
  }
  module2.exports = {
    parse: {
      prelude: function() {
        var children = readSequence.call(this);
        if (this.getFirstListNode(children) === null) {
          this.error("Condition is expected");
        }
        return children;
      },
      block: function() {
        return this.Block(false);
      }
    }
  };
});

// node_modules/css-tree/lib/syntax/atrule/index.js
var require_atrule = __commonJS((exports2, module2) => {
  module2.exports = {
    "font-face": require_font_face(),
    import: require_import(),
    media: require_media(),
    page: require_page(),
    supports: require_supports()
  };
});

// node_modules/css-tree/lib/syntax/pseudo/dir.js
var require_dir = __commonJS((exports2, module2) => {
  module2.exports = {
    parse: function() {
      return this.createSingleNodeList(this.Identifier());
    }
  };
});

// node_modules/css-tree/lib/syntax/pseudo/has.js
var require_has = __commonJS((exports2, module2) => {
  module2.exports = {
    parse: function() {
      return this.createSingleNodeList(this.SelectorList());
    }
  };
});

// node_modules/css-tree/lib/syntax/pseudo/lang.js
var require_lang = __commonJS((exports2, module2) => {
  module2.exports = {
    parse: function() {
      return this.createSingleNodeList(this.Identifier());
    }
  };
});

// node_modules/css-tree/lib/syntax/pseudo/common/selectorList.js
var require_selectorList = __commonJS((exports2, module2) => {
  module2.exports = {
    parse: function selectorList() {
      return this.createSingleNodeList(this.SelectorList());
    }
  };
});

// node_modules/css-tree/lib/syntax/pseudo/matches.js
var require_matches = __commonJS((exports2, module2) => {
  module2.exports = require_selectorList();
});

// node_modules/css-tree/lib/syntax/pseudo/not.js
var require_not = __commonJS((exports2, module2) => {
  module2.exports = require_selectorList();
});

// node_modules/css-tree/lib/syntax/pseudo/common/nthWithOfClause.js
var require_nthWithOfClause = __commonJS((exports2, module2) => {
  var ALLOW_OF_CLAUSE = true;
  module2.exports = {
    parse: function nthWithOfClause() {
      return this.createSingleNodeList(this.Nth(ALLOW_OF_CLAUSE));
    }
  };
});

// node_modules/css-tree/lib/syntax/pseudo/nth-child.js
var require_nth_child = __commonJS((exports2, module2) => {
  module2.exports = require_nthWithOfClause();
});

// node_modules/css-tree/lib/syntax/pseudo/nth-last-child.js
var require_nth_last_child = __commonJS((exports2, module2) => {
  module2.exports = require_nthWithOfClause();
});

// node_modules/css-tree/lib/syntax/pseudo/common/nth.js
var require_nth = __commonJS((exports2, module2) => {
  var DISALLOW_OF_CLAUSE = false;
  module2.exports = {
    parse: function nth() {
      return this.createSingleNodeList(this.Nth(DISALLOW_OF_CLAUSE));
    }
  };
});

// node_modules/css-tree/lib/syntax/pseudo/nth-last-of-type.js
var require_nth_last_of_type = __commonJS((exports2, module2) => {
  module2.exports = require_nth();
});

// node_modules/css-tree/lib/syntax/pseudo/nth-of-type.js
var require_nth_of_type = __commonJS((exports2, module2) => {
  module2.exports = require_nth();
});

// node_modules/css-tree/lib/syntax/pseudo/slotted.js
var require_slotted = __commonJS((exports2, module2) => {
  module2.exports = {
    parse: function compoundSelector() {
      return this.createSingleNodeList(this.Selector());
    }
  };
});

// node_modules/css-tree/lib/syntax/pseudo/index.js
var require_pseudo = __commonJS((exports2, module2) => {
  module2.exports = {
    dir: require_dir(),
    has: require_has(),
    lang: require_lang(),
    matches: require_matches(),
    not: require_not(),
    "nth-child": require_nth_child(),
    "nth-last-child": require_nth_last_child(),
    "nth-last-of-type": require_nth_last_of_type(),
    "nth-of-type": require_nth_of_type(),
    slotted: require_slotted()
  };
});

// node_modules/css-tree/lib/syntax/config/parser.js
var require_parser = __commonJS((exports2, module2) => {
  module2.exports = {
    parseContext: {
      default: "StyleSheet",
      stylesheet: "StyleSheet",
      atrule: "Atrule",
      atrulePrelude: function(options) {
        return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
      },
      mediaQueryList: "MediaQueryList",
      mediaQuery: "MediaQuery",
      rule: "Rule",
      selectorList: "SelectorList",
      selector: "Selector",
      block: function() {
        return this.Block(true);
      },
      declarationList: "DeclarationList",
      declaration: "Declaration",
      value: "Value"
    },
    scope: require_scope(),
    atrule: require_atrule(),
    pseudo: require_pseudo(),
    node: require_node()
  };
});

// node_modules/css-tree/lib/syntax/config/walker.js
var require_walker = __commonJS((exports2, module2) => {
  module2.exports = {
    node: require_node()
  };
});

// node_modules/css-tree/package.json
var require_package = __commonJS((exports2, module2) => {
  module2.exports = {
    name: "css-tree",
    version: "1.1.2",
    description: "A tool set for CSS: fast detailed parser (CSS \u2192 AST), walker (AST traversal), generator (AST \u2192 CSS) and lexer (validation and matching) based on specs and browser implementations",
    author: "Roman Dvornov <rdvornov@gmail.com> (https://github.com/lahmatiy)",
    license: "MIT",
    repository: "csstree/csstree",
    keywords: [
      "css",
      "ast",
      "tokenizer",
      "parser",
      "walker",
      "lexer",
      "generator",
      "utils",
      "syntax",
      "validation"
    ],
    main: "lib/index.js",
    unpkg: "dist/csstree.min.js",
    jsdelivr: "dist/csstree.min.js",
    scripts: {
      build: "rollup --config",
      lint: "eslint data lib scripts test && node scripts/review-syntax-patch --lint && node scripts/update-docs --lint",
      "lint-and-test": "npm run lint && npm test",
      "update:docs": "node scripts/update-docs",
      "review:syntax-patch": "node scripts/review-syntax-patch",
      test: "mocha --reporter progress",
      coverage: "nyc npm test",
      travis: "nyc npm run lint-and-test && npm run coveralls",
      coveralls: "nyc report --reporter=text-lcov | coveralls",
      prepublishOnly: "npm run build",
      hydrogen: "node --trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces --redirect-code-traces-to=code.asm --trace_hydrogen_file=code.cfg --print-opt-code bin/parse --stat -o /dev/null"
    },
    dependencies: {
      "mdn-data": "2.0.14",
      "source-map": "^0.6.1"
    },
    devDependencies: {
      "@rollup/plugin-commonjs": "^11.0.2",
      "@rollup/plugin-json": "^4.0.2",
      "@rollup/plugin-node-resolve": "^7.1.1",
      coveralls: "^3.0.9",
      eslint: "^6.8.0",
      "json-to-ast": "^2.1.0",
      mocha: "^6.2.3",
      nyc: "^14.1.1",
      rollup: "^1.32.1",
      "rollup-plugin-terser": "^5.3.0"
    },
    engines: {
      node: ">=8.0.0"
    },
    files: [
      "data",
      "dist",
      "lib"
    ]
  };
});

// node_modules/css-tree/lib/syntax/index.js
var require_syntax = __commonJS((exports2, module2) => {
  function merge() {
    var dest = {};
    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i];
      for (var key in src) {
        dest[key] = src[key];
      }
    }
    return dest;
  }
  module2.exports = require_create5().create(merge(require_lexer(), require_parser(), require_walker()));
  module2.exports.version = require_package().version;
});

// node_modules/css-tree/lib/index.js
var require_lib = __commonJS((exports2, module2) => {
  module2.exports = require_syntax();
});

// src/index.ts
__markAsModule(exports);
__export(exports, {
  activate: () => activate,
  deactivate: () => deactivate
});

// node_modules/node-fetch/lib/index.mjs
var import_stream = __toModule(require("stream"));
var import_http = __toModule(require("http"));
var import_url = __toModule(require("url"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var Readable = import_stream.default.Readable;
var BUFFER = Symbol("buffer");
var TYPE = Symbol("type");
var Blob = class {
  constructor() {
    this[TYPE] = "";
    const blobParts = arguments[0];
    const options = arguments[1];
    const buffers = [];
    let size = 0;
    if (blobParts) {
      const a = blobParts;
      const length = Number(a.length);
      for (let i = 0; i < length; i++) {
        const element = a[i];
        let buffer;
        if (element instanceof Buffer) {
          buffer = element;
        } else if (ArrayBuffer.isView(element)) {
          buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
        } else if (element instanceof ArrayBuffer) {
          buffer = Buffer.from(element);
        } else if (element instanceof Blob) {
          buffer = element[BUFFER];
        } else {
          buffer = Buffer.from(typeof element === "string" ? element : String(element));
        }
        size += buffer.length;
        buffers.push(buffer);
      }
    }
    this[BUFFER] = Buffer.concat(buffers);
    let type = options && options.type !== void 0 && String(options.type).toLowerCase();
    if (type && !/[^\u0020-\u007E]/.test(type)) {
      this[TYPE] = type;
    }
  }
  get size() {
    return this[BUFFER].length;
  }
  get type() {
    return this[TYPE];
  }
  text() {
    return Promise.resolve(this[BUFFER].toString());
  }
  arrayBuffer() {
    const buf = this[BUFFER];
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return Promise.resolve(ab);
  }
  stream() {
    const readable = new Readable();
    readable._read = function() {
    };
    readable.push(this[BUFFER]);
    readable.push(null);
    return readable;
  }
  toString() {
    return "[object Blob]";
  }
  slice() {
    const size = this.size;
    const start = arguments[0];
    const end = arguments[1];
    let relativeStart, relativeEnd;
    if (start === void 0) {
      relativeStart = 0;
    } else if (start < 0) {
      relativeStart = Math.max(size + start, 0);
    } else {
      relativeStart = Math.min(start, size);
    }
    if (end === void 0) {
      relativeEnd = size;
    } else if (end < 0) {
      relativeEnd = Math.max(size + end, 0);
    } else {
      relativeEnd = Math.min(end, size);
    }
    const span = Math.max(relativeEnd - relativeStart, 0);
    const buffer = this[BUFFER];
    const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
    const blob = new Blob([], {type: arguments[2]});
    blob[BUFFER] = slicedBuffer;
    return blob;
  }
};
Object.defineProperties(Blob.prototype, {
  size: {enumerable: true},
  type: {enumerable: true},
  slice: {enumerable: true}
});
Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
  value: "Blob",
  writable: false,
  enumerable: false,
  configurable: true
});
function FetchError(message, type, systemError) {
  Error.call(this, message);
  this.message = message;
  this.type = type;
  if (systemError) {
    this.code = this.errno = systemError.code;
  }
  Error.captureStackTrace(this, this.constructor);
}
FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = "FetchError";
var convert;
try {
  convert = require("encoding").convert;
} catch (e) {
}
var INTERNALS = Symbol("Body internals");
var PassThrough = import_stream.default.PassThrough;
function Body(body) {
  var _this = this;
  var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
  let size = _ref$size === void 0 ? 0 : _ref$size;
  var _ref$timeout = _ref.timeout;
  let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
  if (body == null) {
    body = null;
  } else if (isURLSearchParams(body)) {
    body = Buffer.from(body.toString());
  } else if (isBlob(body))
    ;
  else if (Buffer.isBuffer(body))
    ;
  else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
    body = Buffer.from(body);
  } else if (ArrayBuffer.isView(body)) {
    body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  } else if (body instanceof import_stream.default)
    ;
  else {
    body = Buffer.from(String(body));
  }
  this[INTERNALS] = {
    body,
    disturbed: false,
    error: null
  };
  this.size = size;
  this.timeout = timeout;
  if (body instanceof import_stream.default) {
    body.on("error", function(err) {
      const error = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
      _this[INTERNALS].error = error;
    });
  }
}
Body.prototype = {
  get body() {
    return this[INTERNALS].body;
  },
  get bodyUsed() {
    return this[INTERNALS].disturbed;
  },
  arrayBuffer() {
    return consumeBody.call(this).then(function(buf) {
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    });
  },
  blob() {
    let ct = this.headers && this.headers.get("content-type") || "";
    return consumeBody.call(this).then(function(buf) {
      return Object.assign(new Blob([], {
        type: ct.toLowerCase()
      }), {
        [BUFFER]: buf
      });
    });
  },
  json() {
    var _this2 = this;
    return consumeBody.call(this).then(function(buffer) {
      try {
        return JSON.parse(buffer.toString());
      } catch (err) {
        return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
      }
    });
  },
  text() {
    return consumeBody.call(this).then(function(buffer) {
      return buffer.toString();
    });
  },
  buffer() {
    return consumeBody.call(this);
  },
  textConverted() {
    var _this3 = this;
    return consumeBody.call(this).then(function(buffer) {
      return convertBody(buffer, _this3.headers);
    });
  }
};
Object.defineProperties(Body.prototype, {
  body: {enumerable: true},
  bodyUsed: {enumerable: true},
  arrayBuffer: {enumerable: true},
  blob: {enumerable: true},
  json: {enumerable: true},
  text: {enumerable: true}
});
Body.mixIn = function(proto) {
  for (const name of Object.getOwnPropertyNames(Body.prototype)) {
    if (!(name in proto)) {
      const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
      Object.defineProperty(proto, name, desc);
    }
  }
};
function consumeBody() {
  var _this4 = this;
  if (this[INTERNALS].disturbed) {
    return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
  }
  this[INTERNALS].disturbed = true;
  if (this[INTERNALS].error) {
    return Body.Promise.reject(this[INTERNALS].error);
  }
  let body = this.body;
  if (body === null) {
    return Body.Promise.resolve(Buffer.alloc(0));
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return Body.Promise.resolve(body);
  }
  if (!(body instanceof import_stream.default)) {
    return Body.Promise.resolve(Buffer.alloc(0));
  }
  let accum = [];
  let accumBytes = 0;
  let abort = false;
  return new Body.Promise(function(resolve, reject) {
    let resTimeout;
    if (_this4.timeout) {
      resTimeout = setTimeout(function() {
        abort = true;
        reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
      }, _this4.timeout);
    }
    body.on("error", function(err) {
      if (err.name === "AbortError") {
        abort = true;
        reject(err);
      } else {
        reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
      }
    });
    body.on("data", function(chunk) {
      if (abort || chunk === null) {
        return;
      }
      if (_this4.size && accumBytes + chunk.length > _this4.size) {
        abort = true;
        reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
        return;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    });
    body.on("end", function() {
      if (abort) {
        return;
      }
      clearTimeout(resTimeout);
      try {
        resolve(Buffer.concat(accum, accumBytes));
      } catch (err) {
        reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
      }
    });
  });
}
function convertBody(buffer, headers) {
  if (typeof convert !== "function") {
    throw new Error("The package `encoding` must be installed to use the textConverted() function");
  }
  const ct = headers.get("content-type");
  let charset = "utf-8";
  let res, str;
  if (ct) {
    res = /charset=([^;]*)/i.exec(ct);
  }
  str = buffer.slice(0, 1024).toString();
  if (!res && str) {
    res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
  }
  if (!res && str) {
    res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
    if (!res) {
      res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
      if (res) {
        res.pop();
      }
    }
    if (res) {
      res = /charset=(.*)/i.exec(res.pop());
    }
  }
  if (!res && str) {
    res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
  }
  if (res) {
    charset = res.pop();
    if (charset === "gb2312" || charset === "gbk") {
      charset = "gb18030";
    }
  }
  return convert(buffer, "UTF-8", charset).toString();
}
function isURLSearchParams(obj) {
  if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
    return false;
  }
  return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
}
function isBlob(obj) {
  return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}
function clone(instance) {
  let p1, p2;
  let body = instance.body;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new PassThrough();
    p2 = new PassThrough();
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS].body = p1;
    body = p2;
  }
  return body;
}
function extractContentType(body) {
  if (body === null) {
    return null;
  } else if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  } else if (isURLSearchParams(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  } else if (isBlob(body)) {
    return body.type || null;
  } else if (Buffer.isBuffer(body)) {
    return null;
  } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
    return null;
  } else if (ArrayBuffer.isView(body)) {
    return null;
  } else if (typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  } else if (body instanceof import_stream.default) {
    return null;
  } else {
    return "text/plain;charset=UTF-8";
  }
}
function getTotalBytes(instance) {
  const body = instance.body;
  if (body === null) {
    return 0;
  } else if (isBlob(body)) {
    return body.size;
  } else if (Buffer.isBuffer(body)) {
    return body.length;
  } else if (body && typeof body.getLengthSync === "function") {
    if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
      return body.getLengthSync();
    }
    return null;
  } else {
    return null;
  }
}
function writeToStream(dest, instance) {
  const body = instance.body;
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
}
Body.Promise = global.Promise;
var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
function validateName(name) {
  name = `${name}`;
  if (invalidTokenRegex.test(name) || name === "") {
    throw new TypeError(`${name} is not a legal HTTP header name`);
  }
}
function validateValue(value) {
  value = `${value}`;
  if (invalidHeaderCharRegex.test(value)) {
    throw new TypeError(`${value} is not a legal HTTP header value`);
  }
}
function find(map, name) {
  name = name.toLowerCase();
  for (const key in map) {
    if (key.toLowerCase() === name) {
      return key;
    }
  }
  return void 0;
}
var MAP = Symbol("map");
var Headers = class {
  constructor() {
    let init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
    this[MAP] = Object.create(null);
    if (init instanceof Headers) {
      const rawHeaders = init.raw();
      const headerNames = Object.keys(rawHeaders);
      for (const headerName of headerNames) {
        for (const value of rawHeaders[headerName]) {
          this.append(headerName, value);
        }
      }
      return;
    }
    if (init == null)
      ;
    else if (typeof init === "object") {
      const method = init[Symbol.iterator];
      if (method != null) {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        const pairs = [];
        for (const pair of init) {
          if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
            throw new TypeError("Each header pair must be iterable");
          }
          pairs.push(Array.from(pair));
        }
        for (const pair of pairs) {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          this.append(pair[0], pair[1]);
        }
      } else {
        for (const key of Object.keys(init)) {
          const value = init[key];
          this.append(key, value);
        }
      }
    } else {
      throw new TypeError("Provided initializer must be an object");
    }
  }
  get(name) {
    name = `${name}`;
    validateName(name);
    const key = find(this[MAP], name);
    if (key === void 0) {
      return null;
    }
    return this[MAP][key].join(", ");
  }
  forEach(callback) {
    let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
    let pairs = getHeaders(this);
    let i = 0;
    while (i < pairs.length) {
      var _pairs$i = pairs[i];
      const name = _pairs$i[0], value = _pairs$i[1];
      callback.call(thisArg, value, name, this);
      pairs = getHeaders(this);
      i++;
    }
  }
  set(name, value) {
    name = `${name}`;
    value = `${value}`;
    validateName(name);
    validateValue(value);
    const key = find(this[MAP], name);
    this[MAP][key !== void 0 ? key : name] = [value];
  }
  append(name, value) {
    name = `${name}`;
    value = `${value}`;
    validateName(name);
    validateValue(value);
    const key = find(this[MAP], name);
    if (key !== void 0) {
      this[MAP][key].push(value);
    } else {
      this[MAP][name] = [value];
    }
  }
  has(name) {
    name = `${name}`;
    validateName(name);
    return find(this[MAP], name) !== void 0;
  }
  delete(name) {
    name = `${name}`;
    validateName(name);
    const key = find(this[MAP], name);
    if (key !== void 0) {
      delete this[MAP][key];
    }
  }
  raw() {
    return this[MAP];
  }
  keys() {
    return createHeadersIterator(this, "key");
  }
  values() {
    return createHeadersIterator(this, "value");
  }
  [Symbol.iterator]() {
    return createHeadersIterator(this, "key+value");
  }
};
Headers.prototype.entries = Headers.prototype[Symbol.iterator];
Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
  value: "Headers",
  writable: false,
  enumerable: false,
  configurable: true
});
Object.defineProperties(Headers.prototype, {
  get: {enumerable: true},
  forEach: {enumerable: true},
  set: {enumerable: true},
  append: {enumerable: true},
  has: {enumerable: true},
  delete: {enumerable: true},
  keys: {enumerable: true},
  values: {enumerable: true},
  entries: {enumerable: true}
});
function getHeaders(headers) {
  let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
  const keys = Object.keys(headers[MAP]).sort();
  return keys.map(kind === "key" ? function(k) {
    return k.toLowerCase();
  } : kind === "value" ? function(k) {
    return headers[MAP][k].join(", ");
  } : function(k) {
    return [k.toLowerCase(), headers[MAP][k].join(", ")];
  });
}
var INTERNAL = Symbol("internal");
function createHeadersIterator(target, kind) {
  const iterator = Object.create(HeadersIteratorPrototype);
  iterator[INTERNAL] = {
    target,
    kind,
    index: 0
  };
  return iterator;
}
var HeadersIteratorPrototype = Object.setPrototypeOf({
  next() {
    if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
      throw new TypeError("Value of `this` is not a HeadersIterator");
    }
    var _INTERNAL = this[INTERNAL];
    const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
    const values = getHeaders(target, kind);
    const len = values.length;
    if (index >= len) {
      return {
        value: void 0,
        done: true
      };
    }
    this[INTERNAL].index = index + 1;
    return {
      value: values[index],
      done: false
    };
  }
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
  value: "HeadersIterator",
  writable: false,
  enumerable: false,
  configurable: true
});
function exportNodeCompatibleHeaders(headers) {
  const obj = Object.assign({__proto__: null}, headers[MAP]);
  const hostHeaderKey = find(headers[MAP], "Host");
  if (hostHeaderKey !== void 0) {
    obj[hostHeaderKey] = obj[hostHeaderKey][0];
  }
  return obj;
}
function createHeadersLenient(obj) {
  const headers = new Headers();
  for (const name of Object.keys(obj)) {
    if (invalidTokenRegex.test(name)) {
      continue;
    }
    if (Array.isArray(obj[name])) {
      for (const val of obj[name]) {
        if (invalidHeaderCharRegex.test(val)) {
          continue;
        }
        if (headers[MAP][name] === void 0) {
          headers[MAP][name] = [val];
        } else {
          headers[MAP][name].push(val);
        }
      }
    } else if (!invalidHeaderCharRegex.test(obj[name])) {
      headers[MAP][name] = [obj[name]];
    }
  }
  return headers;
}
var INTERNALS$1 = Symbol("Response internals");
var STATUS_CODES = import_http.default.STATUS_CODES;
var Response = class {
  constructor() {
    let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
    let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    Body.call(this, body, opts);
    const status = opts.status || 200;
    const headers = new Headers(opts.headers);
    if (body != null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: opts.url,
      status,
      statusText: opts.statusText || STATUS_CODES[status],
      headers,
      counter: opts.counter
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  clone() {
    return new Response(clone(this), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected
    });
  }
};
Body.mixIn(Response.prototype);
Object.defineProperties(Response.prototype, {
  url: {enumerable: true},
  status: {enumerable: true},
  ok: {enumerable: true},
  redirected: {enumerable: true},
  statusText: {enumerable: true},
  headers: {enumerable: true},
  clone: {enumerable: true}
});
Object.defineProperty(Response.prototype, Symbol.toStringTag, {
  value: "Response",
  writable: false,
  enumerable: false,
  configurable: true
});
var INTERNALS$2 = Symbol("Request internals");
var parse_url = import_url.default.parse;
var format_url = import_url.default.format;
var streamDestructionSupported = "destroy" in import_stream.default.Readable.prototype;
function isRequest(input) {
  return typeof input === "object" && typeof input[INTERNALS$2] === "object";
}
function isAbortSignal(signal) {
  const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
  return !!(proto && proto.constructor.name === "AbortSignal");
}
var Request = class {
  constructor(input) {
    let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let parsedURL;
    if (!isRequest(input)) {
      if (input && input.href) {
        parsedURL = parse_url(input.href);
      } else {
        parsedURL = parse_url(`${input}`);
      }
      input = {};
    } else {
      parsedURL = parse_url(input.url);
    }
    let method = init.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
    Body.call(this, inputBody, {
      timeout: init.timeout || input.timeout || 0,
      size: init.size || input.size || 0
    });
    const headers = new Headers(init.headers || input.headers || {});
    if (inputBody != null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init)
      signal = init.signal;
    if (signal != null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS$2] = {
      method,
      redirect: init.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init.follow !== void 0 ? init.follow : input.follow !== void 0 ? input.follow : 20;
    this.compress = init.compress !== void 0 ? init.compress : input.compress !== void 0 ? input.compress : true;
    this.counter = init.counter || input.counter || 0;
    this.agent = init.agent || input.agent;
  }
  get method() {
    return this[INTERNALS$2].method;
  }
  get url() {
    return format_url(this[INTERNALS$2].parsedURL);
  }
  get headers() {
    return this[INTERNALS$2].headers;
  }
  get redirect() {
    return this[INTERNALS$2].redirect;
  }
  get signal() {
    return this[INTERNALS$2].signal;
  }
  clone() {
    return new Request(this);
  }
};
Body.mixIn(Request.prototype);
Object.defineProperty(Request.prototype, Symbol.toStringTag, {
  value: "Request",
  writable: false,
  enumerable: false,
  configurable: true
});
Object.defineProperties(Request.prototype, {
  method: {enumerable: true},
  url: {enumerable: true},
  headers: {enumerable: true},
  redirect: {enumerable: true},
  clone: {enumerable: true},
  signal: {enumerable: true}
});
function getNodeRequestOptions(request) {
  const parsedURL = request[INTERNALS$2].parsedURL;
  const headers = new Headers(request[INTERNALS$2].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  if (!parsedURL.protocol || !parsedURL.hostname) {
    throw new TypeError("Only absolute URLs are supported");
  }
  if (!/^https?:$/.test(parsedURL.protocol)) {
    throw new TypeError("Only HTTP(S) protocols are supported");
  }
  if (request.signal && request.body instanceof import_stream.default.Readable && !streamDestructionSupported) {
    throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
  }
  let contentLengthValue = null;
  if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body != null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number") {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate");
  }
  let agent = request.agent;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  return Object.assign({}, parsedURL, {
    method: request.method,
    headers: exportNodeCompatibleHeaders(headers),
    agent
  });
}
function AbortError(message) {
  Error.call(this, message);
  this.type = "aborted";
  this.message = message;
  Error.captureStackTrace(this, this.constructor);
}
AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = "AbortError";
var PassThrough$1 = import_stream.default.PassThrough;
var resolve_url = import_url.default.resolve;
function fetch(url, opts) {
  if (!fetch.Promise) {
    throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
  }
  Body.Promise = fetch.Promise;
  return new fetch.Promise(function(resolve, reject) {
    const request = new Request(url, opts);
    const options = getNodeRequestOptions(request);
    const send = (options.protocol === "https:" ? import_https.default : import_http.default).request;
    const signal = request.signal;
    let response = null;
    const abort = function abort2() {
      let error = new AbortError("The user aborted a request.");
      reject(error);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error);
      }
      if (!response || !response.body)
        return;
      response.body.emit("error", error);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = function abortAndFinalize2() {
      abort();
      finalize();
    };
    const req = send(options);
    let reqTimeout;
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    function finalize() {
      req.abort();
      if (signal)
        signal.removeEventListener("abort", abortAndFinalize);
      clearTimeout(reqTimeout);
    }
    if (request.timeout) {
      req.once("socket", function(socket) {
        reqTimeout = setTimeout(function() {
          reject(new FetchError(`network timeout at: ${request.url}`, "request-timeout"));
          finalize();
        }, request.timeout);
      });
    }
    req.on("error", function(err) {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    req.on("response", function(res) {
      clearTimeout(reqTimeout);
      const headers = createHeadersLenient(res.headers);
      if (fetch.isRedirect(res.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : resolve_url(request.url, location);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (err) {
                reject(err);
              }
            }
            break;
          case "follow":
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOpts = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              timeout: request.timeout,
              size: request.size
            };
            if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
              requestOpts.method = "GET";
              requestOpts.body = void 0;
              requestOpts.headers.delete("content-length");
            }
            resolve(fetch(new Request(locationURL, requestOpts)));
            finalize();
            return;
        }
      }
      res.once("end", function() {
        if (signal)
          signal.removeEventListener("abort", abortAndFinalize);
      });
      let body = res.pipe(new PassThrough$1());
      const response_options = {
        url: request.url,
        status: res.statusCode,
        statusText: res.statusMessage,
        headers,
        size: request.size,
        timeout: request.timeout,
        counter: request.counter
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
        response = new Response(body, response_options);
        resolve(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings == "gzip" || codings == "x-gzip") {
        body = body.pipe(import_zlib.default.createGunzip(zlibOptions));
        response = new Response(body, response_options);
        resolve(response);
        return;
      }
      if (codings == "deflate" || codings == "x-deflate") {
        const raw = res.pipe(new PassThrough$1());
        raw.once("data", function(chunk) {
          if ((chunk[0] & 15) === 8) {
            body = body.pipe(import_zlib.default.createInflate());
          } else {
            body = body.pipe(import_zlib.default.createInflateRaw());
          }
          response = new Response(body, response_options);
          resolve(response);
        });
        return;
      }
      if (codings == "br" && typeof import_zlib.default.createBrotliDecompress === "function") {
        body = body.pipe(import_zlib.default.createBrotliDecompress());
        response = new Response(body, response_options);
        resolve(response);
        return;
      }
      response = new Response(body, response_options);
      resolve(response);
    });
    writeToStream(req, request);
  });
}
fetch.isRedirect = function(code) {
  return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};
fetch.Promise = global.Promise;
var lib_default = fetch;

// src/completion.ts
var import_css_tree = __toModule(require_lib());
var import_path = __toModule(require("path"));
var import_coc = __toModule(require("coc.nvim"));
var SelectorCompletionItemProvider = class {
  constructor() {
    this.start = import_coc.Position.create(0, 0);
    this.cache = new Map();
    this.files = new Map();
    this.watchers = new Map();
    this.isRemote = /^https?:\/\//i;
    this.canComplete = /(id|class|className)\s*=\s*("|')(?:(?!\2).)*$/is;
    this.findLinkRel = /rel\s*=\s*("|')((?:(?!\1).)+)\1/is;
    this.findLinkHref = /href\s*=\s*("|')((?:(?!\1).)+)\1/is;
    this.findExtended = /(?:{{<|{{>|{%\s*extends|@extends\s*\()\s*("|')?([./A-Za-z_0-9\\\-]+)\1\s*(?:\)|%}|}})/i;
  }
  dispose() {
    this.watchers.forEach((e) => e.dispose());
    this.watchers.clear();
    this.cache.clear();
    this.files.clear();
  }
  watchFile(path, listener) {
    if (this.watchers.has(path)) {
      return;
    }
    const watcher = import_coc.workspace.createFileSystemWatcher(path);
    watcher.onDidCreate(listener);
    watcher.onDidChange(listener);
    watcher.onDidDelete(listener);
    this.watchers.set(path, watcher);
  }
  getStyleSheets(uri) {
    return import_coc.workspace.getConfiguration("html-css-support", uri.toString()).get("styleSheets", []);
  }
  getPath(uri, path, ext) {
    const folder = import_coc.workspace.getWorkspaceFolder(uri.toString());
    const name = ext ? import_path.join(import_path.dirname(path), import_path.basename(path, ext) + ext) : path;
    return folder ? import_path.join(import_path.isAbsolute(path) ? folder.uri : import_path.dirname(uri.fsPath), name) : import_path.join(import_path.dirname(uri.fsPath), name);
  }
  parseTextToItems(text, items) {
    import_css_tree.walk(import_css_tree.parse(text), (node) => {
      let kind;
      switch (node.type) {
        case "ClassSelector":
          kind = import_coc.CompletionItemKind.Enum;
          break;
        case "IdSelector":
          kind = import_coc.CompletionItemKind.Value;
          break;
        default:
          return;
      }
      const resultCompletionItem = {
        label: node.name,
        kind
      };
      items.push(resultCompletionItem);
    });
  }
  async fetchLocal(path) {
    if (this.cache.has(path)) {
      return;
    }
    const items = [];
    try {
      const content = await import_coc.workspace.readFile(path);
      this.parseTextToItems(content.toString(), items);
    } catch (error) {
    }
    this.cache.set(path, items);
    this.watchFile(path, () => this.cache.delete(path));
  }
  async fetchRemote(path) {
    if (this.cache.has(path)) {
      return;
    }
    const items = [];
    try {
      const res = await lib_default(path);
      if (res.ok) {
        const text = await res.text();
        this.parseTextToItems(text, items);
      }
    } catch (error) {
    }
    this.cache.set(path, items);
  }
  async fetch(uri, path) {
    if (this.isRemote.test(path)) {
      await this.fetchRemote(path);
    } else {
      const base = import_path.basename(uri.fsPath, import_path.extname(uri.fsPath));
      path = this.getPath(uri, path.replace(/\${\s*fileBasenameNoExtension\s*}/, base));
      await this.fetchLocal(path);
    }
    return path;
  }
  findEmbedded(uri, keys, text) {
    const key = uri.toString();
    const items = [];
    const findStyles = /<style[^>]*>([^<]+)<\/style>/gi;
    let style;
    while ((style = findStyles.exec(text)) !== null) {
      this.parseTextToItems(style[1], items);
    }
    this.cache.set(key, items);
    keys.add(key);
  }
  async findFixed(uri, keys) {
    for (const key of this.getStyleSheets(uri)) {
      keys.add(await this.fetch(uri, key));
    }
  }
  async findLinks(uri, keys, text) {
    const findLinks = /<link([^>]+)>/gi;
    let link, rel, href;
    while ((link = findLinks.exec(text)) !== null) {
      rel = this.findLinkRel.exec(link[1]);
      if (rel && rel[2] === "stylesheet") {
        href = this.findLinkHref.exec(link[1]);
        if (href) {
          keys.add(await this.fetch(uri, href[2]));
        }
      }
    }
  }
  async findInherited(uri, keys, text, level = 0) {
    const extended = this.findExtended.exec(text);
    if (extended && level < 3) {
      level++;
      const name = extended[2];
      const ext = import_path.extname(name) || import_path.extname(uri.fsPath);
      const path = this.getPath(uri, name, ext);
      const file = import_coc.Uri.file(path);
      let text2 = this.files.get(path);
      if (!text2) {
        try {
          text2 = (await import_coc.workspace.readFile(file.toString())).toString();
        } catch (error) {
          text2 = "n/a";
        }
        this.files.set(path, text2);
        this.watchFile(path, () => this.files.delete(path));
      }
      this.findEmbedded(file, keys, text2);
      await this.findLinks(file, keys, text2);
      await this.findInherited(file, keys, text2, level);
    }
  }
  async findAll(document) {
    const keys = new Set();
    const uri = document.uri;
    const text = document.getText();
    this.findEmbedded(import_coc.Uri.parse(uri), keys, text);
    await this.findFixed(import_coc.Uri.parse(uri), keys);
    await this.findLinks(import_coc.Uri.parse(uri), keys, text);
    await this.findInherited(import_coc.Uri.parse(uri), keys, text);
    const ids = new Map();
    const classes = new Map();
    keys.forEach((key) => {
      var _a;
      return (_a = this.cache.get(key)) == null ? void 0 : _a.forEach((e) => (e.kind === import_coc.CompletionItemKind.Value ? ids : classes).set(e.label, e));
    });
    return {ids, classes};
  }
  async validate(document) {
    const context = await this.findAll(document);
    const text = document.getText();
    const diagnostics = [];
    const findAttribute = /(id|class|className)\s*=\s*("|')(.*?)\2/gis;
    let attribute, offset, findSelector, value, anchor, end, start;
    while ((attribute = findAttribute.exec(text)) !== null) {
      offset = findAttribute.lastIndex - attribute[3].length + attribute[3].indexOf(attribute[2]);
      findSelector = /([^(\[{}\])\s]+)(?![^(\[{]*[}\])])/gi;
      while ((value = findSelector.exec(attribute[3])) !== null) {
        if (!(attribute[1] === "id" ? context.ids : context.classes).has(value[1])) {
          anchor = findSelector.lastIndex + offset;
          end = document.positionAt(anchor);
          start = document.positionAt(anchor - value[1].length);
          diagnostics.push(import_coc.Diagnostic.create(import_coc.Range.create(start, end), `CSS selector '${value[1]}' not found.`, import_coc.DiagnosticSeverity.Information));
        }
      }
    }
    return diagnostics;
  }
  provideCompletionItems(document, position) {
    return new Promise((resolve, reject) => {
      const range = import_coc.Range.create(this.start, position);
      const text = document.getText(range);
      const canComplete = this.canComplete.exec(text);
      if (canComplete) {
        this.findAll(document).then((context) => resolve([...(canComplete[1] === "id" ? context.ids : context.classes).values()]));
      } else {
        reject();
      }
    });
  }
};

// src/index.ts
var import_coc2 = __toModule(require("coc.nvim"));
async function activate(context) {
  const config = import_coc2.workspace.getConfiguration("html-css-support");
  const isEnable = config.get("enable", true);
  if (!isEnable) {
    return;
  }
  const enabledLanguages = config.get("enabledLanguages", ["html"]);
  const provider = new SelectorCompletionItemProvider();
  context.subscriptions.push(import_coc2.commands.registerCommand("html-css-support.dispose", () => provider.dispose()), import_coc2.languages.registerCompletionItemProvider("html-css-support", "HCS", enabledLanguages, provider), provider);
}
function deactivate() {
}
