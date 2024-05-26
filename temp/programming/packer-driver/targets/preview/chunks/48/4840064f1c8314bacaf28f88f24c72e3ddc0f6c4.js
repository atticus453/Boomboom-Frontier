System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Button, find, director, EditBox, Prefab, instantiate, Label, MultiRoom, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, MultiSelect;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMultiRoom(extras) {
    _reporterNs.report("MultiRoom", "./MultiRoom", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Button = _cc.Button;
      find = _cc.find;
      director = _cc.director;
      EditBox = _cc.EditBox;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Label = _cc.Label;
    }, function (_unresolved_2) {
      MultiRoom = _unresolved_2.MultiRoom;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f8e14gXc9ZPNKrHfMF1zxxP", "MultiSelect", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Button', 'find', 'director', 'log', 'EditBox', 'Prefab', 'instantiate', 'resources', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MultiSelect", MultiSelect = (_dec = ccclass('MultiSelect'), _dec2 = property({
        type: EditBox
      }), _dec3 = property({
        type: Prefab
      }), _dec(_class = (_class2 = class MultiSelect extends Component {
        constructor() {
          super(...arguments);
          this.roomPosY = 100;
          // roomHeight: number = 100;
          this.roomID = 0;

          _initializerDefineProperty(this, "roomName", _descriptor, this);

          _initializerDefineProperty(this, "roomPrefab", _descriptor2, this);
        }

        start() {
          var _this = this;

          var creatRoomButton = find("Canvas/creatRoom").getComponent(Button);
          creatRoomButton.node.on(Node.EventType.MOUSE_UP, this.addRoom, this);
          var roomRef = firebase.database().ref('rooms/');
          roomRef.once('value', snapshot => {
            if (snapshot.exists()) {
              var roomList = snapshot.val();

              var _loop = function _loop(room) {
                var roomNode = instantiate(_this.roomPrefab); // console.log(roomList[room]);

                roomNode.getChildByName("Label").getComponent(Label).string = roomList[room].roomName;
                roomNode.setPosition(0, _this.roomPosY, 0);
                _this.roomPosY -= 150;
                find("Canvas/Rooms").addChild(roomNode);
                roomNode.on(Node.EventType.MOUSE_UP, () => {
                  (_crd && MultiRoom === void 0 ? (_reportPossibleCrUseOfMultiRoom({
                    error: Error()
                  }), MultiRoom) : MultiRoom).roomID = roomList[room].key;
                  director.loadScene("MultiRoom");
                });
              };

              for (var room in roomList) {
                _loop(room);
              }
            } else {
              console.log("No rooms found.");
            }
          }, error => {
            console.error("Failed to fetch room list: ", error);
          });
        }

        addRoom() {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            try {
              if (_this2.roomName.string) {
                var roomsRef = firebase.database().ref('rooms');
                var newRoomRef = roomsRef.push();
                _this2.roomID = newRoomRef.key;
                var user = yield firebase.auth().currentUser;
                yield newRoomRef.set({
                  roomName: _this2.roomName.string,
                  users: [user.uid],
                  isReady: false,
                  userCnt: 1,
                  key: _this2.roomID
                });
                var roomNode = instantiate(_this2.roomPrefab);
                console.log(roomNode);
                roomNode.getChildByName("Label").getComponent(Label).string = _this2.roomName.string;
                roomNode.setPosition(0, _this2.roomPosY, 0);
                _this2.roomPosY -= 150;
                find("Canvas/Rooms").addChild(roomNode);
                _this2.roomName.string = "";
                alert("Room created successfully");
              }
            } catch (error) {
              console.log(error);
            }
          })();
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "roomName", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "roomPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4840064f1c8314bacaf28f88f24c72e3ddc0f6c4.js.map