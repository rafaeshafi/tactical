// Per-team professional tactical analysis — 2025/26 Premier League season

export interface TeamTacticalProfile {
  style: string
  strengths: string[]
  weaknesses: string[]
  keyPattern: string
  shapeAnalysis: string
  pressAnalysis: string
  buildUpAnalysis: string
  attackingAnalysis: string
  defensiveAnalysis: string
}

const PROFILES: Record<number, TeamTacticalProfile> = {

  // ── LIVERPOOL (40) ────────────────────────────────────────────────────────
  40: {
    style: 'High Press, Vertical Transitions',
    strengths: [
      'Wirtz as a world-class creative hub — dribbling, vision and final-ball in one player',
      'Frimpong\'s relentless overlapping runs from right-back add a new attacking dimension',
      'Double pivot of Mac Allister and Gravenberch provides both defensive cover and distribution',
      'Van Dijk and Konaté form one of the most dominant aerial defensive partnerships in Europe',
    ],
    weaknesses: [
      'Wirtz and Frimpong both attack simultaneously, leaving the right channel exposed on the counter',
      'Adjustment period — Wirtz integrating into a new league and system brings early inconsistency risk',
    ],
    keyPattern: 'Frimpong overlaps the right flank as Wirtz cuts inside into the right half-space — an overload that creates a 2v1 against the opposition left-back every time Liverpool advance.',
    shapeAnalysis: 'Liverpool\'s 4-2-3-1 continues to morph into a flexible 4-3-3 in possession under Arne Slot. Mac Allister and Gravenberch anchor the double pivot, compressing space between the lines while Szoboszlai operates as the mobile connector ahead of them. The arrival of Wirtz behind the centre-forward and Frimpong at right-back gives Liverpool a qualitatively different right-side dynamic — more creative, more direct, and harder to read than in recent seasons.',
    pressAnalysis: 'Slot\'s Liverpool press with structure rather than chaos. The trigger is the opposition centre-back receiving under pressure — at that moment, Liverpool\'s front three collapse simultaneously to cut off central options. With a PPDA around 9-10, they sit marginally below elite pressing intensity but make up for it with the speed of their recovery runs. The midfield three holds a compact mid-line, ensuring that when the press is bypassed, there is always a covering body.',
    buildUpAnalysis: 'Alisson\'s composure on the ball remains the foundation of Liverpool\'s build-up. He regularly acts as a third centre-back, allowing the defensive line to push higher as a unit. Robertson provides the deeper left outlet while Frimpong drives forward aggressively on the right. Mac Allister drops into the half-spaces to offer a central option out of pressure, and the whole team moves as a connected unit — ball retention is high and phase transitions are smooth.',
    attackingAnalysis: 'The attacking blueprint centres on Wirtz receiving between the lines on the right side, then either carrying at pace toward goal or threading vertical passes into Díaz\'s movement on the left. Nunez or the centre-forward makes runs in behind on diagonal drives, while Frimpong provides the overlap width to stretch the defensive line. Late arrivals from Szoboszlai and Mac Allister give Liverpool numbers in the box from midfield positions, completing a 3-5-2 attacking shape in the final third.',
    defensiveAnalysis: 'Out of possession Liverpool drop into a well-organised 4-2-3-1 block with the two pivots sitting in front of the back four. Van Dijk organises the line with authority, pushing it high enough to pin opposition attackers and regularly triggering offside traps. Konaté provides pace and physicality alongside him. Robertson and Frimpong track back quickly, and the compactness of the defensive shape means opponents rarely find genuine pockets between the lines.',
  },

  // ── ARSENAL (42) ──────────────────────────────────────────────────────────
  42: {
    style: 'Possession, Structured Build-Up',
    strengths: [
      'Gyokeres as a £63m striker brings a clinical finishing edge Arsenal have been missing',
      'Saka\'s consistency and one-on-one ability makes the right channel almost undefendable',
      'Rice as a ball-winning anchor gives Ødegaard licence to dictate higher up the pitch',
      'Saliba and Gabriel form arguably the best centre-back partnership in the Premier League',
    ],
    weaknesses: [
      'Gyokeres adapting to a new league and Arteta\'s positional system carries early-season risk',
      'Over-structured attacks can be predictable against a well-organised low block',
    ],
    keyPattern: 'Ben White inverts from right-back into a central midfield role, freeing Saka to attack the flank 1v1 while Ødegaard floods the right half-space — a permanent overload that consistently unpicks defensive structures.',
    shapeAnalysis: 'Arsenal\'s 4-3-3 converts to a 3-2-5 in possession with White tucking in as a third midfielder alongside Rice and Partey. This creates a midfield diamond that gives Ødegaard maximum freedom to connect the lines. Gyokeres replaces Havertz in the striker role — bringing a more direct, powerful presence in the box. Martinelli and Saka provide the width, but both are comfortable cutting inside, meaning Arsenal can attack through multiple central channels simultaneously.',
    pressAnalysis: 'Arsenal\'s press is well-organised and trigger-based. Gyokeres leads the first press with significant athleticism — a step up from the more technical lead-pressing of Havertz. The team presses in a 4-3-3 shape, using the compact midfield three to cut off central passing lanes and force the ball wide, where the nearest midfielder closes to create a numerical trap. Arteta\'s positional discipline in pressing phases has been refined over four seasons and is one of the most drilled in the league.',
    buildUpAnalysis: 'Raya remains central to Arsenal\'s controlled build-up, acting as a sweeper-keeper who joins play as a numerical advantage under pressure. Gabriel and Saliba split wide during goal-kicks while Rice drops between the centre-backs to form a temporary back three. This creates a structured first phase that resists opposition press well. Once out of the press, the ball moves quickly to Ødegaard or Saka in the half-spaces to break lines.',
    attackingAnalysis: 'The attacking mechanism has sharpened with Gyokeres in the nine role. He attacks space behind defenders with physical running, creates penalty box chances through intelligent positioning, and is a dominant aerial target on set pieces. Saka carries from the right and cuts inside to shoot or play Gyokeres in — this combination is the team\'s most consistent chance-generating route. Martinelli mirrors on the left with pace and directness, giving Arsenal genuine width on both flanks.',
    defensiveAnalysis: 'Arsenal defend in a disciplined 4-3-3 that transitions seamlessly into a 4-5-1 out of possession. Saliba and Gabriel are elite defensive partners — one providing a sweeping presence, the other dominance in the air and ground duels. Rice screens the back four effectively, reading play to intercept before teams can get between the lines. The high defensive line is maintained with confidence given the pace of the centre-backs behind it.',
  },

  // ── MAN CITY (50) ─────────────────────────────────────────────────────────
  50: {
    style: 'Possession, Positional Play',
    strengths: [
      'Haaland\'s penalty-box dominance — two consecutive seasons of 27+ Premier League goals',
      'Gvardiol\'s inverted left-back runs create a second striker presence in attack',
      'Fluid positional rotations across the attacking unit make defensive man-marking impossible',
      'Bernardo Silva\'s intelligence and technical quality as a free-roaming central midfielder',
    ],
    weaknesses: [
      'De Bruyne\'s fitness and role remains uncertain — his absence reduces creative quality significantly',
      'Marmoush integrating into City\'s complex positional system may take half a season to click',
    ],
    keyPattern: 'Gvardiol makes a timed late run from left-back into the striker zone, arriving to attack crosses alongside Haaland — the movement consistently pulls a second defender away and creates the space Haaland exploits.',
    shapeAnalysis: 'City\'s 4-3-3 continues its ever-evolving fluid identity under Guardiola. The fullbacks — particularly Gvardiol on the left — make dynamic decisions about when to advance and when to invert. Marmoush brings a new dimension as City\'s Bundesliga Golden Boot winner, playing in pockets between the lines and taking set pieces. The team\'s rotational intelligence is uniquely difficult to replicate — positions morph continuously rather than holding fixed roles.',
    pressAnalysis: 'City\'s press is patient and triggered by position rather than proximity to the ball. The team sets a mid-block trap, inviting the opponent to build short before engaging simultaneously on the ball carrier with multiple closers. A PPDA around 12 reflects a more conservative approach than elite pressers — City prefer to maintain shape and win possession through interceptions and positional superiority rather than high-energy chasing.',
    buildUpAnalysis: 'Ederson remains one of the best distribution goalkeepers in the world, frequently bypassing press lines with accurate long kicks. When building short, the deep midfielder — typically Rodri if fit — acts as the central pivot around which the entire team\'s movement organises. Walker provides a technical right-sided outlet while Gvardiol drives forward from the left, creating the asymmetric fullback dynamic Guardiola has used for a decade.',
    attackingAnalysis: 'The attacking phase centres on combinational play around Haaland\'s channel runs. The centre-forward pulls defenders deep or wide, creating space for Bernardo Silva, Foden, and Marmoush to arrive into. Marmoush brings Golden Boot-level finishing from second positions — his ability to press and run in behind adds a dynamic dimension alongside Haaland. Doku on the left provides pace and unpredictability in 1v1 situations, completing a genuinely multi-threat attack.',
    defensiveAnalysis: 'City defend with the same positional discipline that defines their attacking play. The mid-block funnels opponents toward wide areas, where the nearest midfielder closes aggressively. Rodri\'s positioning behind the midfield two — when he is available — is the key that holds the entire system together, covering spaces vacated by the advancing fullbacks. The flat back four trusts its pace and City\'s collective defensive compactness to limit transition opportunities.',
  },

  // ── CHELSEA (49) ──────────────────────────────────────────────────────────
  49: {
    style: 'Controlled Pressing, Counter-Attack',
    strengths: [
      'Palmer\'s creative intelligence and penalty-taking makes him the highest floor midfielder in FPL',
      'Reece James returning fit provides an elite right-back who operates like a midfielder in possession',
      'Width from both fullbacks creates space for Palmer to dictate from the number 10 position',
      'Caicedo\'s physicality and reading of play provides dominant midfield screening',
    ],
    weaknesses: [
      'Defensive vulnerability in transition when both fullbacks advance simultaneously',
      'Striker position remains uncertain — none of Chelsea\'s forwards have reliably delivered 15+ goals',
    ],
    keyPattern: 'Palmer drifts into the right half-space off his right channel, receives on the half-turn, and drives at the last defender — the movement that unlocks defensive structures more consistently than any other player in the Premier League.',
    shapeAnalysis: 'Chelsea\'s 4-2-3-1 provides clear structural definition with Caicedo and Fernández screening the defence. With Reece James available and fit, he pushes high as a right midfielder, converting Chelsea into a dynamic 3-2-5 in the final third. Palmer operates as a free agent between the lines — he is nominally a number 10 but has licence to drift right and receive in the channels. The system is most effective when both fullbacks are healthy and Chelsea can apply continuous width.',
    pressAnalysis: 'Chelsea employ a controlled mid-press rather than an aggressive high press. The front four initiate press triggers when the opposition defensive line receives, but the primary aim is to guide play into wide areas where defensive traps are set. The double pivot of Caicedo and Fernández covers the central third and provides immediate recovery when the press is beaten. Under Enzo Maresca, Chelsea\'s pressing is more structured than it was in previous seasons.',
    buildUpAnalysis: 'Sánchez\'s distribution is the first line of Chelsea\'s build-up. Fernández frequently drops between the centre-backs to create a three-man back line, freeing both fullbacks to advance higher. Caicedo acts as the central pivot, driving forward with the ball when space opens. The team builds with patience, using short combinations to draw the opposition out before playing through the lines into Palmer\'s feet.',
    attackingAnalysis: 'The attacking structure is built around Palmer\'s ability to receive and turn in tight spaces. Jackson leads the line with directness and physicality, making runs behind for the lofted balls that bypass defensive lines. Nkunku provides creative link play between midfield and the striker, while Madueke on the right offers direct running and pace in 1v1 situations. The team\'s best attacking sequences involve quick, tight combinations in the final third that open the space Palmer needs.',
    defensiveAnalysis: 'Chelsea\'s back four is well-organised under Maresca\'s coaching and has improved its defensive cohesion significantly through the 2025/26 pre-season. Colwill and Fofana are composed and capable in 1v1 situations. The double pivot of Caicedo and Fernández makes Chelsea difficult to penetrate centrally — their physicality and reading of play wins second balls consistently. The high line they hold is backed up by Sánchez\'s sweeping ability.',
  },

  // ── TOTTENHAM (47) ────────────────────────────────────────────────────────
  47: {
    style: 'Counter-Press, Direct Transitions',
    strengths: [
      'Son Heung-min\'s elite combination of goals, assists, and set-piece delivery',
      'Van de Ven\'s extraordinary recovery pace allows Spurs to defend an aggressive high line',
      'Romero\'s aggression and dominance in the air makes him a set-piece threat at both ends',
      'Kulusevski\'s dynamic runs from the right generate consistent chance-creating situations',
    ],
    weaknesses: [
      'Midfield two can be exposed numerically against possession-heavy opponents in central zones',
      'Predictable in attack when the counter-press structure is disrupted — slower build-up quality shows',
    ],
    keyPattern: 'Kulusevski drops into the right half-space to receive, drawing a midfielder out of position — immediately Son exploits the resulting space behind the left centre-back with a diagonal run in behind.',
    shapeAnalysis: 'Spurs\' 4-3-3 in 2025/26 continues to rely on high defensive line, aggressive pressing from the front, and rapid transition play once possession is won. Bissouma anchors the midfield three with defensive tenacity while Maddison and Bentancur have freedom to advance. The back four of Porro, Romero, Van de Ven, and Udogie provides elite athleticism at both ends — particularly the Van de Ven-Romero partnership, which enables the aggressive press high up the pitch.',
    pressAnalysis: 'Tottenham press with significant energy from all three forwards. The trigger is the opposition full-back receiving wide — at that moment Son and Kulusevski converge to force a mistake or a long ball. The press is physically demanding and effective against teams that build short, but leaves Spurs exposed against sides that can bypass the first press with quality long balls into wide channels, where the fullbacks are attacking high up the pitch.',
    buildUpAnalysis: 'Vicario\'s distribution ability makes him an active participant in Spurs\'s build-up phase. Pedro Porro advances as a right-sided midfielder in possession, providing a technical outlet on the right. Bissouma sits as the deepest midfielder to ensure the passing structure remains connected. The team plays with pace and directness as a priority — long progressive passes are preferred over short circulations when the opportunity presents itself.',
    attackingAnalysis: 'Spurs generate their best chances through direct, two-three touch combinations after winning possession high up the pitch. Son Heung-min\'s movement in the left channel is the primary attacking threat — he attacks diagonally at the last defender\'s shoulder, shooting on his stronger right foot. Kulusevski provides cutbacks from the right, and Maddison\'s reading of play allows him to arrive from midfield to convert from the second line on a regular basis.',
    defensiveAnalysis: 'Van de Ven\'s pace and Romero\'s reading of play together form one of the most physically formidable defensive partnerships in the league. The high line is carefully organised — Romero sets the offside trap and reads the pass timing, while Van de Ven recovers any ball that gets behind the line. The midfield three press-traps wide to prevent opponents from recycling quickly, making Spurs difficult to break down even when they are not in possession.',
  },

  // ── NEWCASTLE (34) ────────────────────────────────────────────────────────
  34: {
    style: 'High Press, Physical Direct Play',
    strengths: [
      'Isak\'s world-class movement and finishing — 25 Premier League goals in 2024/25',
      'Guimarães as an elite box-to-box midfielder who drives both press and build-up',
      'Gordon\'s directness and pace from the left wing provides sustained attacking threat',
      'Trippier\'s delivery from right-back generates consistent set-piece and open-play danger',
    ],
    weaknesses: [
      'The right channel is exposed when Trippier advances high with Gordon overloading the left',
      'Guimarães\'s absence reduces midfield quality significantly — the team is dependent on him',
    ],
    keyPattern: 'Joelinton wins the ball aggressively high up the pitch, immediately releasing a direct pass into Isak\'s movement in behind — a sequence that generated more than a third of Newcastle\'s goals in 2024/25.',
    shapeAnalysis: 'Newcastle\'s 4-3-3 under Eddie Howe is physically intense and tactically direct. Guimarães anchors the midfield with a combination of defensive reading and dynamic forward carrying, while Tonali provides pressing energy on the right side. Joelinton acts as a powerful left-sided 8 — half midfielder, half second striker — making aggressive runs beyond Isak and winning physical duels. Trippier operates as an auxiliary right midfielder in possession, providing delivery quality from deep positions.',
    pressAnalysis: 'Newcastle press with high intensity from all three forwards, targeting the opposition goalkeeper and centre-backs. The press aims to force long balls rather than recover possession directly — Newcastle are adept at contesting direct balls into the channels with their physical defensive line. Guimarães covers massive ground in pressing phases, which combined with Joelinton\'s work-rate makes Newcastle exhausting to play against from kick-off.',
    buildUpAnalysis: 'Pope\'s long distribution is used as a direct weapon to bypass pressing structures and launch Isak in behind. When building short, Schär\'s progressive passing drives the team out from the back with intelligent diagonal passes into the half-spaces. Trippier\'s quality on the right provides a controlled build-up outlet, and Hall\'s advancing runs from left-back add another advancing threat when Newcastle have established possession.',
    attackingAnalysis: 'Isak\'s movement is the centre of gravity in Newcastle\'s attacking output. He exploits the space behind defenders with intelligent runs off the shoulder, and his technical quality in tight spaces makes him dangerous even when teams press him closely. Gordon provides direct, physical running on the left, taking defenders on in 1v1 situations. Almiron\'s energy from the right adds further pressure on opposition full-backs, completing a front three that attacks with both pace and purpose.',
    defensiveAnalysis: 'The defensive block organises quickly around a flat back four led by Schär and Botman. Schär\'s reading of play and aggressive stepping is one of the league\'s more underrated defensive qualities. The high line is protected by Botman\'s recovery pace and Pope\'s sweeping presence. The midfield three screen effectively, making it difficult for opponents to find space between the lines when Newcastle are in their defensive shape.',
  },

  // ── ASTON VILLA (66) ─────────────────────────────────────────────────────
  66: {
    style: 'High Tempo, Physical Press',
    strengths: [
      'Watkins as a clinical, mobile striker who leads the press and finishes in the box',
      'Douglas Luiz\'s replacement Tielemans provides midfield creativity and defensive coverage',
      'Bailey and Diaby offer explosive pace and direct dribbling from wide positions',
      'Emiliano Martínez as one of Europe\'s best goalkeepers — saves and distribution',
    ],
    weaknesses: [
      'Exposed on the counter when both fullbacks advance — the defensive line can be stretched',
      'Creative quality between the lines dipped after Douglas Luiz\'s departure to Juventus',
    ],
    keyPattern: 'McGinn\'s timed late run from right midfield into the box goes undetected by opposition midfielders tracking Watkins — a movement that repeatedly generates goals from an unrecognised goal threat.',
    shapeAnalysis: 'Villa\'s 4-2-3-1 provides a clear double pivot with Tielemans behind, giving Ødegaard-style freedom to the number 10 operating ahead of them. Cash provides technical right-back quality with defensive intelligence on the ball. Digne offers crossing quality and width from left-back. The midfield three behind Watkins has licence to make runs beyond the striker, generating a 4v4 in the final third that overwhelms opponents who only track Watkins.',
    pressAnalysis: 'Watkins leads the press with significant work-rate, closing the opposition goalkeeper and defensive line to force hurried clearances. Bailey and Diaby trigger press traps on the flanks when the ball moves wide. The double pivot covers second balls when the press is beaten, maintaining defensive structure. Villa\'s pressing intensity is higher than their PPDA suggests — the front three are relentless in their individual press triggers.',
    buildUpAnalysis: 'Martínez\'s composure on the ball is central to Villa\'s build-up confidence. Cash and Digne push high early in the build-up phase, with the double pivot providing central options. Torres\'s progressive passing from centre-back is a key driver of the first phase, often finding McGinn in the right half-space or the wide forwards in attacking positions. The team can also play direct balls over the press into Watkins\' chest to bypass pressing structures.',
    attackingAnalysis: 'Watkins\'s movement is the focal point of Villa\'s attacking strategy — he attacks space behind defenders with precise timing, provides hold-up play for arriving midfielders, and scores consistently from inside the box. Bailey on the left attacks the full-back directly with pace, generating crossing and cutting situations. McGinn\'s energy from deeper positions and his goalscoring record make him a genuine second-tier attacking threat.',
    defensiveAnalysis: 'Konsa and Torres form a composed, well-organised defensive partnership with good aerial dominance between them. Martínez is one of the best goalkeepers in the league at organising the defensive line and sweeping behind it. Villa\'s defensive block is compact and physically demanding to break down — the team presses hard in transition to recover shape, and their physical intensity in duels makes them a formidable defensive unit.',
  },

  // ── BRENTFORD (55) ────────────────────────────────────────────────────────
  55: {
    style: 'Direct, Set-Piece Specialists',
    strengths: [
      'Mbeumo\'s 20 goals and 13 assists in 2024/25 — one of the best value assets in the league',
      'Wissa\'s direct running and finishing provides a second goal threat beyond Mbeumo',
      'Elite set-piece operation — corners and free-kicks are genuine goal-scoring mechanisms',
      'Nørgaard\'s leadership and positional discipline make Brentford difficult to break down centrally',
    ],
    weaknesses: [
      'Direct build-up style limits possession sequences — can be outplayed by technical possession teams',
      'The midfield three can be overrun by teams that commit men forward against them',
    ],
    keyPattern: 'Direct long ball into the channel by Flekken, contested by Wissa — the second ball is immediately pressed by a Brentford midfielder who arrives at pace, and a quick combination ends with a cross from the left channel into Mbeumo.',
    shapeAnalysis: 'Brentford\'s 4-3-3 prioritises physical intensity and set-piece excellence over technical possession. Nørgaard anchors a disciplined midfield three with Jensen and Janelt making forward runs. The wide forwards — Mbeumo on the right and Schade or Wissa on the left — stretch the opposition defence and create space for the arriving midfield runners. The system is clear, efficient, and built around the team\'s strongest attributes rather than imitation of a possession-heavy style.',
    pressAnalysis: 'Brentford press with high energy from the front three, disrupting opposition build-up with physical aggression and immediate intensity. The press is triggered early when the opposition back four receives under pressure, aiming to force long clearances that Brentford\'s midfield can contest for second balls. The physicality of the entire team makes the press effective even against technically superior opponents.',
    buildUpAnalysis: 'Flekken distributes directly and efficiently, using long balls to bypass opposition press lines. The midfield three positions themselves to contest and win the second ball from direct distributions. When building short, Nørgaard acts as the central pivot — the team circulates into wide areas and crosses quickly. Brentford\'s 78% pass accuracy reflects a pragmatic approach to ball progression rather than a weakness.',
    attackingAnalysis: 'Mbeumo is the focal point of everything Brentford do going forward. His movement behind defenders, finishing quality, and set-piece delivery make him an elite attacker at this level. Wissa provides powerful direct running at centre-backs, and his physical duels create space for Mbeumo to receive. The midfield runners — particularly Jensen — arrive late into the box to add an extra goal threat from the second line. Set pieces are a consistent and significant weapon.',
    defensiveAnalysis: 'Brentford defend in a flat 4-3-3 that drops quickly into a compact 4-5-1 block when possession is lost. Mee\'s reading of play and organisational leadership are central to the defensive structure. The midfield three recover positions quickly, maintaining a narrow defensive shape that forces opponents to attack from wide positions. Aerial dominance in both boxes is a consistent strength — Brentford regularly win physical battles throughout the pitch.',
  },
}

export function getTeamTacticalProfile(teamId: number): TeamTacticalProfile | null {
  return PROFILES[teamId] ?? null
}
