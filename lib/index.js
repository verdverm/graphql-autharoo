'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _switch = require('./switch');

var _switch2 = _interopRequireDefault(_switch);

var _batching = require('./batching');

var _batching2 = _interopRequireDefault(_batching);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  authSwitch: _switch2.default,
  authBatching: _batching2.default
};