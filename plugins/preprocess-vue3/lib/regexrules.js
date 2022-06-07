
module.exports = {
  simple: {
    echo: "^@echo[ \t]+(.*?)[ \t]*$"
  },
  html: {
    echo: "<!--[ \t]*@echo[ \t]+(.*?)[ \t]*(?:-->|!>)",

    if: [
      {
        start: "[ \t]*<!--[ \t]*@(ifndef|ifdef|if)[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?",
        end: "[ \t]*<!(?:--)?[ \t]*@endif[ \t]*(?:-->|!>)(?:[ \t]*\n)?"
      }
    ],
    else: "[ \t]*<!(?:--)?[ \t]*@else[ \t]*(?:-->|!>)(?:[ \t]*\n)?",
  },
  js: {
    echo: [
      "/\\*[ \t]*@echo[ \t]+(.*?)[ \t]*\\*(?:\\*|/)",
      "//[ \t]*@echo[ \t]+(.*?)[ \t]*$",
      "<!--[ \t]*@echo[ \t]+(.*?)[ \t]*(?:-->|!>)"
    ],

    if: [
      {
        start: "[ \t]*(?://|/\\*)[ \t]*@(ifndef|ifdef|if)[ \t]+([^\n*]*)(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?",
        end: "[ \t]*(?://|/\\*)[ \t]*@endif[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?"
      },
      {
        start: "[ \t]*<!--[ \t]*@(ifndef|ifdef|if)[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?",
        end: "[ \t]*<!(?:--)?[ \t]*@endif[ \t]*(?:-->|!>)(?:[ \t]*\n)?"
      }
    ],
    else: "[ \t]*(?://|/\\*|<!--)[ \t]*@else[ \t]*(?:\\*(?:\\*|/)|-->)?(?:[ \t]*\n)?",
  },
  coffee: {
    echo: "#+[ \t]*@echo[ \t]+(.*?)[ \t]*$",
    if: [
      {
        start: "^[ \t]*#+[ \t]*@(ifndef|ifdef|if)[ \t]+(.*?)[ \t]*\n+",
        end: "^[ \t]*#+[ \t]*@endif[ \t]*\n?"
      }
    ],
    else: "^[ \t]*#+[ \t]*@else[ \t]*\n?",
  }
};

module.exports.xml = module.exports.html;

module.exports.javascript = module.exports.js;
module.exports.jsx = module.exports.js;
module.exports.json = module.exports.js;
module.exports.c = module.exports.js;
module.exports.cc = module.exports.js;
module.exports.cpp = module.exports.js;
module.exports.cs = module.exports.js;
module.exports.csharp = module.exports.js;
module.exports.java = module.exports.js;
module.exports.less = module.exports.js;
module.exports.sass = module.exports.js;
module.exports.scss = module.exports.js;
module.exports.css = module.exports.js;
module.exports.php = module.exports.js;
module.exports.ts = module.exports.js;
module.exports.tsx = module.exports.js;
module.exports.peg = module.exports.js;
module.exports.pegjs = module.exports.js;
module.exports.jade = module.exports.js;
module.exports.styl = module.exports.js;
module.exports.go = module.exports.js;

module.exports.bash = module.exports.coffee;
module.exports.shell = module.exports.coffee;
module.exports.sh = module.exports.coffee;
