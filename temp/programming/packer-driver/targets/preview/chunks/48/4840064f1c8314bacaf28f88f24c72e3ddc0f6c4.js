System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Button, find, _dec, _class, _crd, ccclass, property, MultiSelect;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Button = _cc.Button;
      find = _cc.find;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f8e14gXc9ZPNKrHfMF1zxxP", "MultiSelect", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Button', 'find', 'director']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MultiSelect", MultiSelect = (_dec = ccclass('MultiSelect'), _dec(_class = class MultiSelect extends Component {
        start() {
          var creatRoomButton = find("Canvas/creatRoom").getComponent(Button);
          creatRoomButton.node.on(Node.EventType.MOUSE_UP, this.addRoom, this);
        }

        addRoom() {
          return _asyncToGenerator(function* () {
            var roomName = prompt("Enter Room Name: ");

            if (roomName) {
              try {
                var newRoom = yield firebase.database().ref('rooms/' + roomName);
                yield newRoom.set({
                  roomName: roomName,
                  users: [],
                  isReady: false,
                  userCnt: 1
                });
              } catch (error) {
                alert(error.message);
              }
            }
          })();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4840064f1c8314bacaf28f88f24c72e3ddc0f6c4.js.map