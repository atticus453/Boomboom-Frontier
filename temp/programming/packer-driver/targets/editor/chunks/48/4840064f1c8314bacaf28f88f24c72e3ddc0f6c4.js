System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Button, find, _dec, _class, _crd, ccclass, property, MultiSelect;

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
          let creatRoomButton = find("Canvas/creatRoom").getComponent(Button);
          creatRoomButton.node.on(Node.EventType.MOUSE_UP, this.addRoom, this);
        }

        async addRoom() {
          const roomName = prompt("Enter Room Name: ");

          if (roomName) {
            try {
              const newRoom = await firebase.database().ref('rooms/' + roomName);
              await newRoom.set({
                roomName: roomName,
                users: [],
                isReady: false,
                userCnt: 1
              });
            } catch (error) {
              alert(error.message);
            }
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4840064f1c8314bacaf28f88f24c72e3ddc0f6c4.js.map