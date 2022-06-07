'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RollupPluginPreprocess;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _preprocess = require('./lib/preprocess');

var _preprocess2 = _interopRequireDefault(_preprocess);

var _rollupPluginutils = require('rollup-pluginutils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {string|string[]} [include=['**\/*.js']]
 * @param {string|string[]} [exclude='node_modules/**']
 * @param {Object} [context=process.env]
 * @param {Object} [options={}]
 * @returns {{ name: string, transform: function }}
 */
function RollupPluginPreprocess() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$include = _ref.include,
    include = _ref$include === undefined ? ['**/*.vue'] : _ref$include,
    _ref$exclude = _ref.exclude,
    exclude = _ref$exclude === undefined ? 'node_modules/**' : _ref$exclude,
    _ref$context = _ref.context,
    context = _ref$context === undefined ? process && process.env || {} : _ref$context,
    _ref$options = _ref.options,
    options = _ref$options === undefined ? {} : _ref$options;

  var filter = (0, _rollupPluginutils.createFilter)(include, exclude);

  return {
    name: 'preprocess',

    /**
     * @param {string} fileName
     * @returns {(string|undefined)}
     */
    load: function (fileName) {

      if (filter(fileName)) {
        var data = _fs2.default.readFileSync(fileName, 'utf8');
        if (!options.type) {
          var ext = _path2.default.extname(fileName);

          if (ext) {
            options.type = ext.substr(1);
          }
        }

        return _preprocess2.default.preprocess(data, context, options);
      }
    }
  };
};
