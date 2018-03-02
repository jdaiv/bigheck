var ATTACKS = [
  [ // 0: Down Slash
    keyframe(0, -60, -Math.PI / 6, "inOutBack", 0.3, false),
    keyframe(30, -30, Math.PI / 1.2, "linear", 0.1, true),
    keyframe(20, -30, Math.PI / 2, "linear", 0.2, false)
  ],
  [ // 1: Forward Jab
    keyframe(-80, -40, Math.PI / 2, "inOutBack", 0.3, false),
    keyframe(64, -40, Math.PI / 2, "outQuart", 0.15, true),
    keyframe(20, -35, Math.PI / 2, "inQuart", 0.1, false)
  ],
  [ // 2: Up Slash
    keyframe(40, -40, Math.PI / 2, "inOutBack", 0.2, false),
    keyframe(16, -60, Math.PI / 4, "inQuart", 0.1, true),
    keyframe(-16, -50, -Math.PI / 4, "outQuart", 0.1, true),
    keyframe(-10, -40, -Math.PI / 3, "linear", 0.1, false)
  ],
  [ // 3: Down Jab
    keyframe(0, -80, Math.PI, "inOutBack", 0.3, false),
    // keyframe(0, -60, Math.PI + Math.PI / 8, "outQuart", 0.15, false),
    // keyframe(0, -50, Math.PI - Math.PI / 8, "linear", 0.15, true),
    keyframe(0, -60, Math.PI, "inOutBack", 0.4, true),
  ],
  [ // 4: Up Swipe
    keyframe(16, -60, Math.PI / 4, "inQuart", 0.1, true),
    keyframe(-16, -50, -Math.PI / 4, "outQuart", 0.2, true),
    keyframe(-10, -40, -Math.PI / 3, "linear", 0.1, false)
  ],
  [ // 5: Back Slash
    keyframe(10, -40, 0, "linear", 0.1, true),
    keyframe(20, -30, -Math.PI, "linear", 0.15, true),
    keyframe(10, -40, 0, "inQuad", 0.2, false),
  ]
];

var ATTACK_INFO = [
  {
    damage: 30,
    knockback: [200, 2000],
  },
  {
    damage: 5,
    knockback: [400, -600],
  },
  {
    damage: 10,
    knockback: [-200, -1200],
  },
  {
    damage: 25,
    knockback: [0,2000],
  },
  {
    damage: 15,
    knockback: [-200, -600],
  },
  {
    damage: 25,
    knockback: [-400, -600],
  },
];