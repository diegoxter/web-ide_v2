const aergo_lua = {
  // lua modules
  string: {
    byte: "byte(${1:str}, ${2:start}, ${3:end})",
    char: "char(${1:charCode...})",
    dump: "dump(${1:function})",
    find: "find(${1:str}, ${2:pattern}, ${3:index}, ${4:plain})",
    format: 'format("${1:text}", ${2:value...})',
    gmatch: "gmatch(${1:str}, ${2:pattern})",
    gsub: "gsub(${1:str}, ${2:pattern}, ${3:replace}, ${4:n})",
    len: "len(${1:str})",
    lower: "lower(${1:str})",
    match: "match(${1:str}, ${2:pattern}, ${3:index})",
    rep: "rep(${1:str}, ${2:n})",
    reverse: "reverse(${1:str})",
    sub: "sub(${1:str}, ${2:start}, ${3:end})",
    upper: "upper(${1:str})",
  },
  math: {
    abs: "abs(${1:x})",
    ceil: "ceil(${1:x})",
    floor: "floor(${1:x})",
    pow: "pow(${1:base}, ${2:exp})",
    max: "max(${1:v1}, ${2:v2...})",
    min: "min(${1:v1}, ${2:v2...})",
  },
  table: {
    concat: "concat(${1:table}, ${2:separator}, ${3:start}, ${4:end})",
    insert: "insert(${1:table}, ${2:pos}, ${3:item})",
    maxn: "maxn(${1:table})",
    remove: "remove(${1:table}, ${2:pos})",
    sort: "sort(${1:table}, ${2:comparator})",
  },
  bit: {
    tobit: "tobit(${1:x})",
    tohex: "tohex(${1:x}, ${2:n})",
    bnot: "bnot(${1:x})",
    band: "band(${1:v1}, ${2:v2...})",
    bor: "bor(${1:v1}, ${2:v2...})",
    bxor: "bxor(${1:v1}, ${2:v2...})",
    lshift: "lshift(${1:x}, ${2:n})",
    rshift: "rshift(${1:x}, ${2:n})",
    arshift: "arshift(${1:x}, ${2:n})",
    rol: "rol(${1:x}, ${2:n})",
    ror: "ror(${1:x}, ${2:n})",
    bswap: "bswap(${1:x})",
  },

  // aergo modules
  state: {
    var: "var {\n  ${1:key} = ${2:value}\n}",
    value: "value()",
    map: "map()",
    array: "array(${1:size})",
  },
  system: {
    getBlockheight: "getBlockheight()",
    getPrevBlockHash: "getPrevBlockHash()",
    getTxhash: "getTxhash()",
    getTimestamp: "getTimestamp()",
    getContractID: "getContractID()",
    getAmount: "getAmount()",
    getCreator: "getCreator()",
    getSender: "getSender()",
    getOrigin: "getOrigin()",
    setItem: "setItem(${1:key}, ${2:value})",
    getItem: "getItem(${1:key})",
    isContract: "isContract(${1:address})",
    isFeeDelegation: "isFeeDelegation()",
    print: "print(${1:args...})",
  },
  contract: {
    send: "send(${1:address}, ${2:amount})",
    deploy: "deploy(${1:code}, ${2:args...})",
    "deploy.value": "deploy.value(${1:amount})(${2:code}, ${3:args...})",
    call: "call(${1:address}, ${2:funcName}, ${3:args...})",
    "call.value": "call.value(${1:amount})(${2:address}, ${3:funcName}, ${4:args...})",
    delegatecall: "delegatecall(${1:address}, ${2:funcName}, ${3:args...})",
    balance: "balance(${1:address})",
    event: "event(${1:eventName}, ${2:args...})",
    stake: "stake(${1:amount})",
    unstake: "unstake(${1:amount})",
    vote: "vote(${1:targets...})",
  },
  db: {
    exec: 'exec("${1:statement}", ${2:values...})',
    query: 'query("${1:statement}", ${2:values...})',
    prepare: 'prepare("${1:statement}")',
    last_insert_rowid: "last_insert_rowid()",
  },
  json: {
    encode: "encode(${1:rawValue})",
    decode: "decode(${1:encoded})",
  },
  crypto: {
    sha256: "sha256(${1:content})",
    ecverify: "ecverify(${1:hash}, ${2:signature}, ${3:address})",
  },
  bignum: {
    number: "number(${1:value})",
    isbignum: "isbignum(${1:value})",
    isneg: "isneg(${1:value})",
    iszero: "iszero(${1:value})",
    tonumber: "tonumber(${1:value})",
    tostring: "tostring(${1:value})",
    neg: "neg(${1:value})",
    sqrt: "sqrt(${1:value})",
    compare: "compare(${1:value1}, ${2:value2})",
    add: "add(${1:value1}, ${2:value2})",
    sub: "sub(${1:value1}, ${2:value2})",
    mul: "mul(${1:value1}, ${2:value2})",
    mod: "mod(${1:target}, ${2:value})",
    div: "div(${1:target}, ${2:value})",
    pow: "pow(${1:base}, ${2:exponent})",
    divmod: "divmod(${1:target}, ${2:value})",
    powmod: "powmod(${1:base}, ${2:exponent}, ${3:modValue})",
  },
  abi: {
    register: "register(${1:func...})",
    payable: "payable(${1:func...})",
    register_view: "register_view(${1:func...})",
    fee_delegation: "fee_delegation(${1:func...})",
  },
};

var modules = Object.keys(aergo_lua).reduce(function (res, key) {
  res[key] = Object.keys(aergo_lua[key]);
  return res;
}, {});

export const snippets = [];

Object.keys(aergo_lua).map(function (key) {
  Object.keys(aergo_lua[key]).map(function (key2) {
    snippets.push({
      name: key + "." + key2,
      code: key + "." + aergo_lua[key][key2],
    });
  });
});

snippets.push({
  name: "assert",
  code: 'assert(${1:expression}, "${2:failure message}")',
});

function lastWord(words) {
  var n = words.split(/[\s;\(\[\{,\+\-\*/=<>\?\:\.]+/);
  return n[n.length - 2];
}

export const myCompleter = {
  getCompletions: function (session, pos, prefix, callback) {
    var line = session.getLine(pos.row);
    var lineStart = line.slice(0, pos.column - prefix.length);
    var myList = [];
    var score = 1000;

    if (lineStart.slice(-1) == ".") {
      var name = lastWord(lineStart);
      if (modules[name]) {
        myList = modules[name];
        score = Number.MAX_VALUE;
      }
    } else {
      myList = Object.keys(modules);
    }

    callback(
      null,
      myList.map((entry) => {
        return {
          value: entry,
          score: score,
        };
      }),
    );
  },
};

let snippetManager;

export const doLiveAutocomplete = function (e) {
  var editor = e.editor;
  if (e.command.name === "insertstring") {
    // if Tab is pressed, do not reopen the autocomplete popup
    var completer_visible = editor.completer && editor.completer.activated;
    if (completer_visible && !(e.args && e.args.slice(-1) == ".")) {
      return;
    }
    // only autocomplete if there is a prefix that can be matched
    if (/[\w.]/.test(e.args)) {
      editor.execCommand("startAutocomplete");
    }
  } else if (e.command.name === "Tab" && snippetManager) {
    snippetManager.expandWithTab(editor);
  }
};

export function registerSnippets(ace, mode, snippetText) {
  snippetManager = ace.require("ace/snippets").snippetManager;

  var id = "ace/mode/lua";
  var m = snippetManager.files[id];

  m.scope = mode;
  m.snippetText = snippetText;
  m.snippet = snippetManager.parseSnippetFile(snippetText, m.scope);

  snippetManager.register(m.snippet, m.scope);
}

export function createSnippets(snippets) {
  return snippets
    .map(function ({ name, code }) {
      return [
        "snippet " + name,
        code
          .split("\n")
          .map((c) => "\t" + c)
          .join("\n"),
      ].join("\n");
    })
    .join("\n");
}

export const script = `
function test()
  return 'Hello World!'
end



abi.register(test)

--[[

Available Lua modules:
  string  math  table  bit

Available Aergo modules:
  system  contract  db  crypto  bignum  json

]]
`;
