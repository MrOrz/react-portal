'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _CSSPropertyOperations = require('react/lib/CSSPropertyOperations');

var _CSSPropertyOperations2 = _interopRequireDefault(_CSSPropertyOperations);

var _shallowCompare = require('react/lib/shallowCompare');

var _shallowCompare2 = _interopRequireDefault(_shallowCompare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KEYCODES = {
  ESCAPE: 27
};

var Portal = function (_React$Component) {
  _inherits(Portal, _React$Component);

  function Portal() {
    _classCallCheck(this, Portal);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Portal).call(this));

    _this.state = { active: false };
    _this.handleWrapperClick = _this.handleWrapperClick.bind(_this);
    _this.closePortal = _this.closePortal.bind(_this);
    _this.handleOutsideMouseClick = _this.handleOutsideMouseClick.bind(_this);
    _this.handleKeydown = _this.handleKeydown.bind(_this);
    _this.portal = null;
    _this.node = null;
    return _this;
  }

  _createClass(Portal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.closeOnEsc) {
        document.addEventListener('keydown', this.handleKeydown);
      }

      if (this.props.closeOnOutsideClick) {
        document.addEventListener('mousedown', this.handleOutsideMouseClick);
        document.addEventListener('touchstart', this.handleOutsideMouseClick);
      }

      if (this.props.isOpened) {
        this.openPortal();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      // portal's 'is open' state is handled through the prop isOpened
      if (typeof newProps.isOpened !== 'undefined') {
        if (newProps.isOpened) {
          if (this.state.active) {
            this.renderPortal(newProps);
          } else {
            this.openPortal(newProps);
          }
        }
        if (!newProps.isOpened && this.state.active) {
          this.closePortal();
        }
      }

      // portal handles its own 'is open' state
      if (typeof newProps.isOpened === 'undefined' && this.state.active) {
        this.renderPortal(newProps);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.closeOnEsc) {
        document.removeEventListener('keydown', this.handleKeydown);
      }

      if (this.props.closeOnOutsideClick) {
        document.removeEventListener('mousedown', this.handleOutsideMouseClick);
        document.removeEventListener('touchstart', this.handleOutsideMouseClick);
      }

      this.closePortal();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return (0, _shallowCompare2.default)(this, nextProps, nextState);
    }
  }, {
    key: 'renderPortal',
    value: function renderPortal(props) {
      if (!this.node) {
        this.node = document.createElement('div');
        if (props.className) {
          this.node.className = props.className;
        }
        if (props.style) {
          _CSSPropertyOperations2.default.setValueForStyles(this.node, props.style);
        }
        document.body.appendChild(this.node);
      }
      this.portal = _reactDom2.default.unstable_renderSubtreeIntoContainer(this, _react2.default.cloneElement(props.children, { closePortal: this.closePortal }), this.node, this.props.onUpdate);
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.openByClickOn) {
        return _react2.default.createElement(
          'div',
          { className: 'openByClickOn', onClick: this.handleWrapperClick },
          this.props.openByClickOn
        );
      } else {
        return null;
      }
    }
  }, {
    key: 'handleWrapperClick',
    value: function handleWrapperClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.openPortal();
    }
  }, {
    key: 'openPortal',
    value: function openPortal() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

      this.setState({ active: true });
      this.renderPortal(props);

      this.props.onOpen(this.node);
    }
  }, {
    key: 'closePortal',
    value: function closePortal() {
      var _this2 = this;

      var resetPortalState = function resetPortalState() {
        if (_this2.node) {
          _reactDom2.default.unmountComponentAtNode(_this2.node);
          document.body.removeChild(_this2.node);
        }
        _this2.portal = null;
        _this2.node = null;
        _this2.setState({ active: false });
      };

      if (this.props.beforeClose) {
        this.props.beforeClose(this.node, resetPortalState);
      } else {
        resetPortalState(this.node);
      }

      this.props.onClose();
    }
  }, {
    key: 'handleOutsideMouseClick',
    value: function handleOutsideMouseClick(e) {
      if (!this.state.active) {
        return;
      }

      var root = (0, _reactDom.findDOMNode)(this.portal);
      if (root.contains(e.target) || e.target.tagName === 'HTML') {
        return;
      }

      e.stopPropagation();
      this.closePortal();
    }
  }, {
    key: 'handleKeydown',
    value: function handleKeydown(e) {
      if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
        this.closePortal();
      }
    }
  }]);

  return Portal;
}(_react2.default.Component);

exports.default = Portal;

Portal.propTypes = {
  className: _react2.default.PropTypes.string,
  style: _react2.default.PropTypes.object,
  children: _react2.default.PropTypes.element.isRequired,
  openByClickOn: _react2.default.PropTypes.element,
  closeOnEsc: _react2.default.PropTypes.bool,
  closeOnOutsideClick: _react2.default.PropTypes.bool,
  isOpened: _react2.default.PropTypes.bool,
  onOpen: _react2.default.PropTypes.func,
  onClose: _react2.default.PropTypes.func,
  beforeClose: _react2.default.PropTypes.func,
  onUpdate: _react2.default.PropTypes.func
};

Portal.defaultProps = {
  onOpen: function onOpen() {},
  onClose: function onClose() {},
  onUpdate: function onUpdate() {}
};
