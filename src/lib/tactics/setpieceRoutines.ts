/**
 * Per-team accurate set piece routines for the top Premier League teams.
 * Coordinates: (0,0) = top-left, (100,100) = bottom-right.
 * Goal mouth spans roughly x=38–62, y=0.
 * Corner kicks: (0,100) left corner, (100,100) right corner (attacking end).
 * Attacking free-kicks at approx y=20–35.
 *
 * These routines model 2024/25 documented set-piece tendencies.
 */

import type { SetPieceRoutine } from './set-pieces'

export interface TeamSetPieces {
  corners: SetPieceRoutine[]
  freeKicks: SetPieceRoutine[]
}

// ─── Liverpool (40) ──────────────────────────────────────────────────────────
// Key: Trent/Robertson delivery; Van Dijk/Konaté flick-ons; near-post runners
const LIVERPOOL: TeamSetPieces = {
  corners: [
    {
      id: 'lfc-corner-vvd-flick',
      name: 'Van Dijk Near-Post Flick-On',
      type: 'corner',
      side: 'right',
      phase: 'attacking',
      description: 'Trent delivers inswinging to the near post. Van Dijk attacks early at the near post to flick on, with Konaté and Salah arriving at back post and penalty spot.',
      ballStartX: 100,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Trent (Taker)',   startX: 100, startY: 4,  path: [],                                                     role: 'taker'   },
        { playerId: 2, name: 'Van Dijk',         startX: 78,  startY: 14, path: [{ x: 82, y: 6 }],                                     role: 'runner'  },
        { playerId: 3, name: 'Konaté',           startX: 42,  startY: 20, path: [{ x: 28, y: 8 }],                                     role: 'runner'  },
        { playerId: 4, name: 'Salah',            startX: 55,  startY: 18, path: [{ x: 50, y: 10 }],                                    role: 'runner'  },
        { playerId: 5, name: 'Blocker 1',        startX: 65,  startY: 18, path: [{ x: 62, y: 13 }],                                    role: 'blocker' },
        { playerId: 6, name: 'Blocker 2',        startX: 58,  startY: 22, path: [{ x: 55, y: 16 }],                                    role: 'blocker' },
        { playerId: 7, name: 'Diaz (edge)',      startX: 70,  startY: 28, path: [],                                                     role: 'decoy'   },
      ],
    },
    {
      id: 'lfc-corner-robertson-far',
      name: 'Robertson Far-Post Delivery',
      type: 'corner',
      side: 'left',
      phase: 'attacking',
      description: 'Robertson outswinging to the back post. Konaté attacks back post, Van Dijk the penalty spot, Núñez peels off the back of the last defender at the near post.',
      ballStartX: 0,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Robertson (Taker)', startX: 0,   startY: 4,  path: [],                           role: 'taker'   },
        { playerId: 2, name: 'Konaté',            startX: 28,  startY: 18, path: [{ x: 18, y: 7 }],           role: 'runner'  },
        { playerId: 3, name: 'Van Dijk',          startX: 50,  startY: 20, path: [{ x: 50, y: 12 }],          role: 'runner'  },
        { playerId: 4, name: 'Núñez',             startX: 72,  startY: 16, path: [{ x: 75, y: 8 }],           role: 'runner'  },
        { playerId: 5, name: 'Blocker',           startX: 55,  startY: 22, path: [{ x: 52, y: 15 }],          role: 'blocker' },
        { playerId: 6, name: 'Edge of Box',       startX: 38,  startY: 30, path: [],                           role: 'decoy'   },
      ],
    },
  ],
  freeKicks: [
    {
      id: 'lfc-fk-trent-direct',
      name: 'Trent Direct Strike',
      type: 'freekick',
      side: 'right',
      phase: 'attacking',
      description: 'Trent Alexander-Arnold curls his right foot around the wall from 25 yards right of centre. Two runners peel into the box for rebounds.',
      ballStartX: 65,
      ballStartY: 27,
      routes: [
        { playerId: 1, name: 'Trent (Taker)',  startX: 65,  startY: 27, path: [],                                          role: 'taker'  },
        { playerId: 2, name: 'Dummy Runner',   startX: 67,  startY: 27, path: [{ x: 78, y: 20 }],                         role: 'decoy'  },
        { playerId: 3, name: 'Back-Post Run',  startX: 35,  startY: 22, path: [{ x: 22, y: 10 }],                         role: 'runner' },
        { playerId: 4, name: 'Penalty Spot',   startX: 50,  startY: 20, path: [{ x: 50, y: 13 }],                         role: 'runner' },
      ],
    },
  ],
}

// ─── Arsenal (42) ─────────────────────────────────────────────────────────────
// Key: Zonal blocking; back-post Saliba; Rice direct FK; corner near-post flood
const ARSENAL: TeamSetPieces = {
  corners: [
    {
      id: 'ars-corner-saliba-back',
      name: 'Saliba Back-Post Run',
      type: 'corner',
      side: 'right',
      phase: 'attacking',
      description: 'Inswinging delivery from the right. Zonal blockers hold in the six-yard box, Saliba makes a late back-post run while Havertz attacks the near post.',
      ballStartX: 100,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Saka (Taker)',   startX: 100, startY: 4,  path: [],                           role: 'taker'   },
        { playerId: 2, name: 'Saliba',          startX: 38,  startY: 22, path: [{ x: 22, y: 8 }],           role: 'runner'  },
        { playerId: 3, name: 'Havertz',         startX: 74,  startY: 16, path: [{ x: 78, y: 7 }],           role: 'runner'  },
        { playerId: 4, name: 'Magalhães',       startX: 52,  startY: 18, path: [{ x: 50, y: 10 }],          role: 'runner'  },
        { playerId: 5, name: 'Zonal Block 1',  startX: 62,  startY: 14, path: [],                           role: 'blocker' },
        { playerId: 6, name: 'Zonal Block 2',  startX: 55,  startY: 14, path: [],                           role: 'blocker' },
        { playerId: 7, name: 'Zonal Block 3',  startX: 47,  startY: 14, path: [],                           role: 'blocker' },
      ],
    },
    {
      id: 'ars-corner-near-post-flood',
      name: 'Near-Post Flood',
      type: 'corner',
      side: 'left',
      phase: 'attacking',
      description: 'Three runners converge on the near post zone to win a knock-down or draw a foul.',
      ballStartX: 0,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'White (Taker)',  startX: 0,   startY: 4,  path: [],                           role: 'taker'   },
        { playerId: 2, name: 'Havertz',         startX: 72,  startY: 18, path: [{ x: 78, y: 8 }],           role: 'runner'  },
        { playerId: 3, name: 'Rice',            startX: 65,  startY: 22, path: [{ x: 70, y: 12 }],          role: 'runner'  },
        { playerId: 4, name: 'Saliba',          startX: 50,  startY: 20, path: [{ x: 50, y: 11 }],          role: 'runner'  },
        { playerId: 5, name: 'Odegaard',        startX: 35,  startY: 20, path: [{ x: 28, y: 10 }],          role: 'decoy'   },
        { playerId: 6, name: 'Blocker',         startX: 58,  startY: 24, path: [],                           role: 'blocker' },
      ],
    },
  ],
  freeKicks: [
    {
      id: 'ars-fk-rice-distance',
      name: 'Rice Long-Range Strike',
      type: 'freekick',
      side: 'centre',
      phase: 'attacking',
      description: 'Declan Rice strikes from 25–30 yards, bending over the wall. Odegaard makes a dummy run to dummy the shot while runners attack the rebound zone.',
      ballStartX: 50,
      ballStartY: 30,
      routes: [
        { playerId: 1, name: 'Rice (Taker)',   startX: 50,  startY: 30, path: [],                           role: 'taker'   },
        { playerId: 2, name: 'Odegaard Dummy', startX: 52,  startY: 30, path: [{ x: 62, y: 24 }],          role: 'decoy'   },
        { playerId: 3, name: 'Back-Post Run',  startX: 32,  startY: 24, path: [{ x: 22, y: 12 }],          role: 'runner'  },
        { playerId: 4, name: 'Penalty Area',   startX: 50,  startY: 22, path: [{ x: 50, y: 14 }],          role: 'runner'  },
      ],
    },
  ],
}

// ─── Man City (50) ────────────────────────────────────────────────────────────
// Key: Short corners with Bernardo/Walker; Haaland near-post flick; zonal delivery
const MAN_CITY: TeamSetPieces = {
  corners: [
    {
      id: 'mci-corner-short-combo',
      name: 'Short Corner Combination',
      type: 'corner',
      side: 'right',
      phase: 'attacking',
      description: 'Bernardo Silva drops to receive a short corner from Walker. He plays inside to a third man, pulling the defensive line and delivering to Haaland at the near post.',
      ballStartX: 100,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Walker (Taker)',  startX: 100, startY: 4,  path: [],                                          role: 'taker'   },
        { playerId: 2, name: 'Bernardo',         startX: 90,  startY: 12, path: [{ x: 85, y: 20 }],                         role: 'runner'  },
        { playerId: 3, name: 'Haaland',          startX: 72,  startY: 16, path: [{ x: 76, y: 7 }],                          role: 'runner'  },
        { playerId: 4, name: 'Gvardiol',         startX: 40,  startY: 20, path: [{ x: 28, y: 9 }],                          role: 'runner'  },
        { playerId: 5, name: 'Dias',             startX: 50,  startY: 18, path: [{ x: 50, y: 11 }],                         role: 'decoy'   },
      ],
    },
    {
      id: 'mci-corner-haaland-nearpost',
      name: 'Haaland Near-Post Flick',
      type: 'corner',
      side: 'left',
      phase: 'attacking',
      description: 'Outswinging from the left; Haaland charges the near post to flick on. Doku and Gvardiol attack the back post for the knockdown.',
      ballStartX: 0,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Doku (Taker)',   startX: 0,   startY: 4,  path: [],                           role: 'taker'   },
        { playerId: 2, name: 'Haaland',         startX: 75,  startY: 14, path: [{ x: 78, y: 6 }],           role: 'runner'  },
        { playerId: 3, name: 'Gvardiol',        startX: 28,  startY: 20, path: [{ x: 20, y: 8 }],           role: 'runner'  },
        { playerId: 4, name: 'Dias',            startX: 50,  startY: 18, path: [{ x: 50, y: 11 }],          role: 'runner'  },
        { playerId: 5, name: 'Blocker',         startX: 60,  startY: 20, path: [],                           role: 'blocker' },
        { playerId: 6, name: 'Bernardo (edge)', startX: 38,  startY: 30, path: [],                           role: 'decoy'   },
      ],
    },
  ],
  freeKicks: [
    {
      id: 'mci-fk-bernardo-swerve',
      name: 'Bernardo Swerving Delivery',
      type: 'freekick',
      side: 'left',
      phase: 'attacking',
      description: 'Bernardo curls from wide-left around the wall toward the far post. Haaland holds width at the back post; Dias crashes through the centre.',
      ballStartX: 35,
      ballStartY: 26,
      routes: [
        { playerId: 1, name: 'Bernardo (Taker)', startX: 35,  startY: 26, path: [],                          role: 'taker'   },
        { playerId: 2, name: 'Dummy Run',         startX: 33,  startY: 26, path: [{ x: 25, y: 20 }],         role: 'decoy'   },
        { playerId: 3, name: 'Haaland',           startX: 22,  startY: 18, path: [{ x: 18, y: 10 }],         role: 'runner'  },
        { playerId: 4, name: 'Dias',              startX: 50,  startY: 22, path: [{ x: 50, y: 13 }],         role: 'runner'  },
      ],
    },
  ],
}

// ─── Chelsea (49) ─────────────────────────────────────────────────────────────
// Key: Palmer direct free kicks; Reece James crosses; Caicedo/Jackson in box
const CHELSEA: TeamSetPieces = {
  corners: [
    {
      id: 'che-corner-james-cross',
      name: 'Reece James Driven Corner',
      type: 'corner',
      side: 'right',
      phase: 'attacking',
      description: 'Reece James drives the ball across the face of goal at knee height. Fofana attacks at the near post, Jackson peels to the back post, with blockers in the six-yard area.',
      ballStartX: 100,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Reece James',  startX: 100, startY: 4,  path: [],                           role: 'taker'   },
        { playerId: 2, name: 'Fofana',        startX: 74,  startY: 14, path: [{ x: 78, y: 6 }],           role: 'runner'  },
        { playerId: 3, name: 'Jackson',       startX: 38,  startY: 20, path: [{ x: 25, y: 9 }],           role: 'runner'  },
        { playerId: 4, name: 'Colwill',       startX: 52,  startY: 18, path: [{ x: 50, y: 10 }],          role: 'runner'  },
        { playerId: 5, name: 'Block 1',       startX: 62,  startY: 16, path: [],                           role: 'blocker' },
        { playerId: 6, name: 'Block 2',       startX: 55,  startY: 16, path: [],                           role: 'blocker' },
      ],
    },
  ],
  freeKicks: [
    {
      id: 'che-fk-palmer-direct',
      name: 'Palmer Direct Free Kick',
      type: 'freekick',
      side: 'right',
      phase: 'attacking',
      description: 'Cole Palmer strikes directly at goal from 20–25 yards right of centre with a curling right-footed shot. Known for precise placement over the wall\'s right shoulder.',
      ballStartX: 63,
      ballStartY: 24,
      routes: [
        { playerId: 1, name: 'Palmer (Taker)',  startX: 63,  startY: 24, path: [],                          role: 'taker'   },
        { playerId: 2, name: 'Decoy Dummy',     startX: 65,  startY: 24, path: [{ x: 72, y: 18 }],         role: 'decoy'   },
        { playerId: 3, name: 'Rebound Run',     startX: 45,  startY: 22, path: [{ x: 38, y: 12 }],         role: 'runner'  },
        { playerId: 4, name: 'Back Post',       startX: 35,  startY: 20, path: [{ x: 22, y: 10 }],         role: 'runner'  },
      ],
    },
    {
      id: 'che-fk-palmer-left-curl',
      name: 'Palmer Left-Side Curl',
      type: 'freekick',
      side: 'left',
      phase: 'attacking',
      description: 'Palmer curls from left side inside the box edge. Jackson peels at the back post, Caicedo late into the penalty area.',
      ballStartX: 38,
      ballStartY: 27,
      routes: [
        { playerId: 1, name: 'Palmer (Taker)', startX: 38,  startY: 27, path: [],                           role: 'taker'   },
        { playerId: 2, name: 'Decoy',          startX: 36,  startY: 27, path: [{ x: 28, y: 21 }],          role: 'decoy'   },
        { playerId: 3, name: 'Jackson',         startX: 25,  startY: 18, path: [{ x: 22, y: 10 }],          role: 'runner'  },
        { playerId: 4, name: 'Caicedo',         startX: 50,  startY: 23, path: [{ x: 50, y: 13 }],          role: 'runner'  },
      ],
    },
  ],
}

// ─── Tottenham (47) ────────────────────────────────────────────────────────────
// Key: Romero/van de Ven attacking corners; Son near-post flick; Maddison delivery
const TOTTENHAM: TeamSetPieces = {
  corners: [
    {
      id: 'tot-corner-romero-vdv',
      name: 'Romero & van de Ven Double Run',
      type: 'corner',
      side: 'right',
      phase: 'attacking',
      description: 'Maddison delivers inswinging. Romero attacks the near post with van de Ven making a crossing run to the back post, while Son holds the penalty spot.',
      ballStartX: 100,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Maddison (Taker)', startX: 100, startY: 4,  path: [],                         role: 'taker'   },
        { playerId: 2, name: 'Romero',            startX: 74,  startY: 16, path: [{ x: 78, y: 7 }],         role: 'runner'  },
        { playerId: 3, name: 'van de Ven',        startX: 42,  startY: 22, path: [{ x: 24, y: 9 }],         role: 'runner'  },
        { playerId: 4, name: 'Son',               startX: 52,  startY: 18, path: [{ x: 50, y: 11 }],        role: 'decoy'   },
        { playerId: 5, name: 'Blocker 1',         startX: 60,  startY: 18, path: [],                         role: 'blocker' },
        { playerId: 6, name: 'Blocker 2',         startX: 55,  startY: 20, path: [],                         role: 'blocker' },
      ],
    },
    {
      id: 'tot-corner-son-nearpost',
      name: 'Son Near-Post Flick',
      type: 'corner',
      side: 'left',
      phase: 'attacking',
      description: 'Outswinging from the left; Son charges the near post for a flick-on. Romero crashes to the back post for the second ball.',
      ballStartX: 0,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Pedro Porro (Taker)', startX: 0,  startY: 4,  path: [],                       role: 'taker'   },
        { playerId: 2, name: 'Son',                  startX: 74, startY: 14, path: [{ x: 78, y: 6 }],       role: 'runner'  },
        { playerId: 3, name: 'Romero',               startX: 28, startY: 20, path: [{ x: 20, y: 8 }],       role: 'runner'  },
        { playerId: 4, name: 'van de Ven',           startX: 50, startY: 20, path: [{ x: 50, y: 11 }],      role: 'runner'  },
        { playerId: 5, name: 'Edge runner',          startX: 38, startY: 30, path: [],                       role: 'decoy'   },
      ],
    },
  ],
  freeKicks: [
    {
      id: 'tot-fk-maddison-direct',
      name: 'Maddison Direct Attempt',
      type: 'freekick',
      side: 'centre',
      phase: 'attacking',
      description: 'Maddison bends from around 25 yards, targeting the top corner. Runners attack the rebound zone on both sides.',
      ballStartX: 52,
      ballStartY: 26,
      routes: [
        { playerId: 1, name: 'Maddison (Taker)', startX: 52,  startY: 26, path: [],                         role: 'taker'   },
        { playerId: 2, name: 'Decoy',            startX: 54,  startY: 26, path: [{ x: 62, y: 20 }],         role: 'decoy'   },
        { playerId: 3, name: 'Son',              startX: 36,  startY: 22, path: [{ x: 28, y: 12 }],         role: 'runner'  },
        { playerId: 4, name: 'Penalty Area',     startX: 50,  startY: 22, path: [{ x: 50, y: 14 }],         role: 'runner'  },
      ],
    },
  ],
}

// ─── Newcastle (34) ────────────────────────────────────────────────────────────
// Key: Trippier direct FKs; Schär/Botman in box; near-post corner runs
const NEWCASTLE: TeamSetPieces = {
  corners: [
    {
      id: 'new-corner-schar-botman',
      name: 'Schär & Botman Double Threat',
      type: 'corner',
      side: 'right',
      phase: 'attacking',
      description: 'Trippier inswinging delivery. Schär attacks near post, Botman peels to the back post — two tall CB threats that overload the penalty area.',
      ballStartX: 100,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Trippier (Taker)', startX: 100, startY: 4,  path: [],                         role: 'taker'   },
        { playerId: 2, name: 'Schär',             startX: 75,  startY: 15, path: [{ x: 79, y: 7 }],         role: 'runner'  },
        { playerId: 3, name: 'Botman',            startX: 40,  startY: 21, path: [{ x: 25, y: 9 }],         role: 'runner'  },
        { playerId: 4, name: 'Isak',              startX: 52,  startY: 17, path: [{ x: 50, y: 10 }],        role: 'decoy'   },
        { playerId: 5, name: 'Blocker',           startX: 62,  startY: 18, path: [],                         role: 'blocker' },
      ],
    },
    {
      id: 'new-corner-near-post-run',
      name: 'Near-Post Diagonal Run',
      type: 'corner',
      side: 'left',
      phase: 'attacking',
      description: 'Isak times a diagonal run to the near post off a left-sided corner. Botman holds central zone for second balls.',
      ballStartX: 0,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Trippier (Taker)', startX: 0,  startY: 4,  path: [],                          role: 'taker'   },
        { playerId: 2, name: 'Isak',              startX: 72, startY: 16, path: [{ x: 76, y: 7 }],          role: 'runner'  },
        { playerId: 3, name: 'Botman',            startX: 50, startY: 20, path: [{ x: 50, y: 11 }],         role: 'runner'  },
        { playerId: 4, name: 'Schär',             startX: 28, startY: 20, path: [{ x: 22, y: 9 }],          role: 'runner'  },
        { playerId: 5, name: 'Edge Runner',       startX: 40, startY: 28, path: [],                          role: 'decoy'   },
      ],
    },
  ],
  freeKicks: [
    {
      id: 'new-fk-trippier-direct',
      name: 'Trippier Direct Free Kick',
      type: 'freekick',
      side: 'right',
      phase: 'attacking',
      description: 'Kieran Trippier\'s signature right-footed delivery from 22–28 yards. He bends the ball over the wall, targeting the top-left corner. Known as one of the best FK specialists in the league.',
      ballStartX: 64,
      ballStartY: 25,
      routes: [
        { playerId: 1, name: 'Trippier (Taker)', startX: 64,  startY: 25, path: [],                         role: 'taker'   },
        { playerId: 2, name: 'Dummy',             startX: 66,  startY: 25, path: [{ x: 72, y: 19 }],        role: 'decoy'   },
        { playerId: 3, name: 'Botman',            startX: 44,  startY: 21, path: [{ x: 36, y: 11 }],        role: 'runner'  },
        { playerId: 4, name: 'Isak',              startX: 52,  startY: 20, path: [{ x: 50, y: 13 }],        role: 'runner'  },
      ],
    },
  ],
}

// ─── Brentford (55) ──────────────────────────────────────────────────────────
// Key: Iconic zonal blocking; Pinnock/Mee attacking; overload penalty area
const BRENTFORD: TeamSetPieces = {
  corners: [
    {
      id: 'brc-corner-zonal-overload',
      name: 'Zonal Block Overload',
      type: 'corner',
      side: 'right',
      phase: 'attacking',
      description: 'Brentford\'s signature corner: three blockers set a screen at the penalty-spot edge while Pinnock and Mee crash in from deep. Often draws fouls or wins first contact.',
      ballStartX: 100,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Mbeumo (Taker)', startX: 100, startY: 4,  path: [],                           role: 'taker'   },
        { playerId: 2, name: 'Pinnock',         startX: 40,  startY: 24, path: [{ x: 28, y: 9 }],           role: 'runner'  },
        { playerId: 3, name: 'Mee',             startX: 55,  startY: 20, path: [{ x: 50, y: 10 }],          role: 'runner'  },
        { playerId: 4, name: 'Wissa',           startX: 72,  startY: 16, path: [{ x: 76, y: 7 }],           role: 'runner'  },
        { playerId: 5, name: 'Zonal Block 1',  startX: 62,  startY: 17, path: [],                           role: 'blocker' },
        { playerId: 6, name: 'Zonal Block 2',  startX: 55,  startY: 17, path: [],                           role: 'blocker' },
        { playerId: 7, name: 'Zonal Block 3',  startX: 48,  startY: 17, path: [],                           role: 'blocker' },
      ],
    },
    {
      id: 'brc-corner-pinnock-back',
      name: 'Pinnock Back-Post Surge',
      type: 'corner',
      side: 'left',
      phase: 'attacking',
      description: 'Outswinging from the left; Pinnock charges late to the back post. Mee positions centrally for the flick. Brentford regularly threaten from set pieces due to physical CB pair.',
      ballStartX: 0,
      ballStartY: 4,
      routes: [
        { playerId: 1, name: 'Janelt (Taker)', startX: 0,   startY: 4,  path: [],                           role: 'taker'   },
        { playerId: 2, name: 'Pinnock',         startX: 30,  startY: 22, path: [{ x: 18, y: 8 }],           role: 'runner'  },
        { playerId: 3, name: 'Mee',             startX: 50,  startY: 20, path: [{ x: 50, y: 11 }],          role: 'runner'  },
        { playerId: 4, name: 'Wissa',           startX: 70,  startY: 16, path: [{ x: 74, y: 7 }],           role: 'decoy'   },
        { playerId: 5, name: 'Block 1',         startX: 60,  startY: 17, path: [],                           role: 'blocker' },
        { playerId: 6, name: 'Block 2',         startX: 53,  startY: 17, path: [],                           role: 'blocker' },
      ],
    },
  ],
  freeKicks: [
    {
      id: 'brc-fk-cross-delivery',
      name: 'Crossed Delivery to CB',
      type: 'freekick',
      side: 'right',
      phase: 'attacking',
      description: 'Rather than shooting, Brentford often whip in a cross for their giant CB pair. Mee peels off the back post while Pinnock attacks the centre.',
      ballStartX: 70,
      ballStartY: 30,
      routes: [
        { playerId: 1, name: 'Mbeumo (Taker)', startX: 70,  startY: 30, path: [],                           role: 'taker'   },
        { playerId: 2, name: 'Dummy',           startX: 72,  startY: 30, path: [{ x: 78, y: 24 }],          role: 'decoy'   },
        { playerId: 3, name: 'Pinnock',         startX: 50,  startY: 20, path: [{ x: 50, y: 11 }],          role: 'runner'  },
        { playerId: 4, name: 'Mee',             startX: 32,  startY: 22, path: [{ x: 22, y: 10 }],          role: 'runner'  },
      ],
    },
  ],
}

// ─── Registry ─────────────────────────────────────────────────────────────────
const TEAM_SET_PIECES: Record<number, TeamSetPieces> = {
  40: LIVERPOOL,
  42: ARSENAL,
  50: MAN_CITY,
  49: CHELSEA,
  47: TOTTENHAM,
  34: NEWCASTLE,
  55: BRENTFORD,
}

export function getTeamSetPieces(teamId: number): TeamSetPieces | null {
  return TEAM_SET_PIECES[teamId] ?? null
}
