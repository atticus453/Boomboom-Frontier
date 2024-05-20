System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Button, find, EditBox, Prefab, instantiate, Label, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, MultiSelect;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

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
      EditBox = _cc.EditBox;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Label = _cc.Label;
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
        constructor(...args) {
          super(...args);
          this.roomPosY = 100;

          // roomHeight: number = 100;
          _initializerDefineProperty(this, "roomName", _descriptor, this);

          _initializerDefineProperty(this, "roomPrefab", _descriptor2, this);
        }

        start() {
          let creatRoomButton = find("Canvas/creatRoom").getComponent(Button);
          creatRoomButton.node.on(Node.EventType.MOUSE_UP, this.addRoom, this);
          const roomRef = firebase.database().ref('rooms/');
          roomRef.once('value', snapshot => {
            if (snapshot.exists()) {
              const roomList = snapshot.val();

              for (let room in roomList) {
                const roomNode = instantiate(this.roomPrefab);
                roomNode.getChildByName("Label").getComponent(Label).string = roomList[room].roomName;
                roomNode.setPosition(0, this.roomPosY, 0);
                this.roomPosY -= 150;
                find("Canvas/Rooms").addChild(roomNode);
              }
            } else {
              console.log("No rooms found.");
            }
          }, error => {
            console.error("Failed to fetch room list: ", error);
          });
        }

        async addRoom() {
          try {
            if (this.roomName.string) {
              const newRoom = await firebase.database().ref('rooms/' + this.roomName.string);
              await newRoom.set({
                roomName: this.roomName.string,
                users: [],
                isReady: false,
                userCnt: 1
              });
              const roomNode = instantiate(this.roomPrefab);
              console.log(roomNode);
              roomNode.getChildByName("Label").getComponent(Label).string = this.roomName.string;
              roomNode.setPosition(0, this.roomPosY, 0);
              this.roomPosY -= 150;
              find("Canvas/Rooms").addChild(roomNode);
              this.roomName.string = "";
              alert("Room created successfully");
            }
          } catch (error) {
            console.log(error);
          }
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "roomName", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "roomPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4840064f1c8314bacaf28f88f24c72e3ddc0f6c4.js.map