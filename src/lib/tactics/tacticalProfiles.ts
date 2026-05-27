// Per-team professional tactical analysis for 2024/25 Premier League season

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
  // Liverpool (40)
  40: {
    style: 'High Press, Vertical Transitions',
    strengths: [
      'Elite high press triggers ball recoveries in dangerous zones',
      'Wide forwards invert to overload half-spaces and create shooting lanes',
      'Double pivot frees attacking midfielder to link play between lines',
      'Exceptional set-piece threat from deliveries into the box',
    ],
    weaknesses: [
      'Vulnerability on the counter when fullbacks bomb forward simultaneously',
      'Over-reliance on Salah\'s individual moments in tight defensive blocks',
    ],
    keyPattern: 'Robertson and Alexander-Arnold provide overlapping width while Salah and Díaz invert — creating a 2v1 in both half-spaces simultaneously.',
    shapeAnalysis: 'Liverpool\'s 4-2-3-1 morphs fluidly into a 4-3-3 in possession. The two pivots — Mac Allister and Gravenberch — anchor deep while Szoboszlai roams as a box-to-box connector. The fullbacks push high and wide, stretching the pitch to its full dimensions and pulling opposition midfielders across, opening central corridors.',
    pressAnalysis: 'With a PPDA under 10, Liverpool deploy a structured high press triggered by the opposition goalkeeper receiving back-passes or playing into their own half. The front three press in tandem, forcing central defenders into rushed long balls. Midfield runners immediately close second-ball situations, meaning the team rarely resets from a low block.',
    buildUpAnalysis: 'Alisson is a proactive sweeper-keeper who frequently joins build-up as a third centre-back. Liverpool prefer short combinations through the thirds, with the double pivot dropping slightly to offer angles out of the defensive line. Alexander-Arnold\'s progressive passing — often carrying from right-back — is a key source of controlled ball advancement into the final third.',
    attackingAnalysis: 'The primary attacking pattern involves Salah running in behind from a narrow right channel while the left-sided forward — Díaz — cuts inside onto his right foot, dragging the left centre-back. Szoboszlai arrives late from midfield into the vacated space. Crosses from deep Robertson overlaps provide an additional cutback option that the forwards attack with late runs.',
    defensiveAnalysis: 'Out of possession Liverpool compress quickly into a mid-block, asking their front three to act as the first line of pressure. The back four holds a flat, high line to compress space and catch attackers offside. Van Dijk\'s reading of play allows the team to push even higher without risk, while Konaté provides aerial dominance and recovery pace behind the last line.',
  },

  // Arsenal (42)
  42: {
    style: 'Possession, Structured Build-Up',
    strengths: [
      'Exceptional positional structure creates clean passing triangles in every zone',
      'Rice as a defensive anchor allows Ødegaard complete freedom to dictate tempo',
      'Inverted fullbacks compact the central third and enable midfield overloads',
      'Saka\'s one-on-one ability on the right repeatedly isolates defenders',
    ],
    weaknesses: [
      'Reliance on set positional patterns can be disrupted by a high press',
      'Attacking transitions slower than peers when first press is bypassed',
    ],
    keyPattern: 'Ben White inverts into midfield as a right-sided halfback, freeing Saka to attack the flank 1v1 while Ødegaard occupies the right half-space — a permanent overload that unpicks low blocks.',
    shapeAnalysis: 'Arsenal operate in a 4-3-3 that in possession converts to a 3-2-5, with White tucking centrally as a third midfielder. Rice sits as a single pivot, enabling both Partey and Ødegaard to advance into higher positions. The back three in build-up phase — Gabriel, Saliba, and White — provides stability against opposition counter-press.',
    pressAnalysis: 'Arsenal\'s press is well-organised rather than frantic, with Havertz leading the line as the first presser. The team presses in their 4-3-3 shape, using the compact midfield unit of three to cut off central passing lanes and force the ball out wide. Once the ball is in wide areas, the nearest midfielder immediately closes to create a trap, typically recovering possession in the middle third.',
    buildUpAnalysis: 'Raya\'s ability on the ball is central to Arsenal\'s build-up — he acts as a sweeper-keeper who plays short to the centre-backs under pressure. Gabriel and Saliba split wide during goal-kicks, with Rice dropping to receive. The team favours a slow, deliberate build-up phase, using two-touch combinations to progress through the thirds before accelerating into the final third with vertical passes into Ødegaard or direct runs from Saka.',
    attackingAnalysis: 'Arsenal\'s main attacking mechanism centres on Saka\'s ball-carrying ability from the right channel, cutting inside to shoot or play through to Havertz in the striker position. Martinelli mirrors Saka\'s movement on the left, using pace and direct running. Ødegaard is constantly available in the right half-space to receive, turn, and play the final ball into Havertz\' movement.',
    defensiveAnalysis: 'Arsenal\'s defensive block is compact and disciplined. They defend in a 4-3-3 shape with the three midfielders forming a narrow unit to prevent central penetration. The back four is aggressive, stepping out to press attackers who receive in tight areas. Saliba and Gabriel are dominant aerially and comfortable in 1v1 situations, allowing the team to maintain a high line with confidence.',
  },

  // Man City (50)
  50: {
    style: 'Possession, Positional Play',
    strengths: [
      'Fluid positional rotations create numerical advantages across all zones',
      'Haaland\'s penalty box presence stretches defences to create space for runners',
      'Ability to maintain possession under extreme pressure and transition control',
      'De Bruyne\'s range of passing as a second-phase creator from midfield',
    ],
    weaknesses: [
      'Rodri\'s absence significantly reduces midfield control and defensive coverage',
      'Can be bypassed by direct, counter-pressing opponents in transition',
    ],
    keyPattern: 'Gvardiol\'s inverted runs from left-back into the striker zone create a second focal point alongside Haaland, confusing defensive shape and generating high-quality entries into the box.',
    shapeAnalysis: 'City\'s 4-3-3 morphs continuously in possession, with fullbacks — particularly Walker and Gvardiol — making dynamic decisions about when to advance and when to hold. Bernardo Silva drifts across the middle third as a free-roaming 8, while De Bruyne often drops deep as a pseudo-9 alongside Haaland to create two-man combinations. The midfield three rotate freely, making it difficult for opponents to fix their marking assignments.',
    pressAnalysis: 'City\'s press is patient and intelligent. The team sets a mid-block trap, inviting the opponent to build short before engaging with coordinated press movements that close all passing options simultaneously. With a PPDA reflecting a more conservative approach, City prioritise shape over aggressive pressing, using their superior positioning to win the ball through interceptions rather than tackles.',
    buildUpAnalysis: 'Ederson is used as a direct release valve when City face pressing opposition, his goal-kicks bypassing the first press line. In more controlled phases, City build through Rodri as the central pivot — the entire team\'s positional structure revolves around his deep-lying distribution. Walker provides a right-sided outlet while Gvardiol advances from the left, creating asymmetric fullback positioning that stretches opponents horizontally.',
    attackingAnalysis: 'The attacking phase centres on combinational play around Haaland\'s movement. The centre-forward runs the channels and into behind, dragging defenders away and creating space for Bernardo Silva, Foden, and De Bruyne arriving late. Doku provides the pace-and-directness from the left wing, taking defenders on in 1v1 situations and injecting unpredictability into an otherwise intricate possession game.',
    defensiveAnalysis: 'City defend with the same positional intelligence that defines their attacking play. Their mid-block funnels opponents wide before the nearest midfielder initiates a press to win the ball in wide areas. Rodri\'s positional discipline behind the midfield two is the key — he covers the spaces that Walker and Gvardiol vacate when advancing. The flat back four is well-drilled in holding a high line with offside traps.',
  },

  // Chelsea (49)
  49: {
    style: 'Controlled Pressing, Counter-Attack',
    strengths: [
      'Palmer\'s creative intelligence and goal-scoring from the number 10 role',
      'High pass accuracy reflects ability to maintain possession and recycle play',
      'Width from Reece James and Cucurella allows central overloads in build-up',
      'Caicedo\'s physicality and range provides a dominant screening midfielder',
    ],
    weaknesses: [
      'Defensive vulnerability when overcommitting to attacks and losing shape',
      'Inconsistency between attacking phases — can be wasteful in final third',
    ],
    keyPattern: 'Palmer drifts into the right half-space between the lines, receives on the half-turn, and drives at the last defender — the movement that unlocks every opponent\'s defensive structure.',
    shapeAnalysis: 'Chelsea\'s 4-2-3-1 provides a clear structure with Caicedo and Fernández screening the back four. The number 10 — Palmer — operates as a free agent between the lines, given licence to exploit pockets of space while the wide forwards provide width. Reece James pushes into a right midfield position when James is fit, generating a 3-2-5 in possession that creates overloads in the final third.',
    pressAnalysis: 'Chelsea employ a controlled mid-press rather than a frantic high press. The front four in their 4-2-3-1 initiate press triggers when the opponent\'s defensive line has the ball, but the primary aim is to guide play into wide areas where defensive traps are set. The double pivot covers central zones and provides immediate recovery when the press is beaten.',
    buildUpAnalysis: 'Sánchez\'s ball distribution is integral to Chelsea\'s build-up. The team builds through the double pivot with short passes, relying on the centre-backs splitting wide and the fullbacks pushing high. Fernández frequently drops between the centre-backs to create a three-man back line in possession, freeing the fullbacks to advance further. The central build-up allows Caicedo to drive forward with the ball.',
    attackingAnalysis: 'Jackson leads the line with physicality and directness, making intelligent runs in behind as well as holding the ball up for advancing midfielders. Nkunku provides creative link play between midfield and the striker, while Madueke on the right applies directness and pace in 1v1 situations. The team\'s best attacking moments come from quick combinations in tight spaces, playing through Palmer as the central creative hub.',
    defensiveAnalysis: 'Chelsea\'s defensive organisation centres on their 4-2-3-1 shape, with the front three pressing triggers set by the opponent\'s centre-backs. The double pivot is excellent at winning second balls and covering ground. Colwill and Fofana are composed defenders who are adept at recovering 1v1 situations, while Cucurella\'s aggression on the left side often disrupts opponent attacks early.',
  },

  // Tottenham (47)
  47: {
    style: 'Counter-Press, Direct Transitions',
    strengths: [
      'Explosive pace in behind from Son, Kulusevski, and Udogie on the left',
      'Romero and Van de Ven\'s pace allows an aggressive high defensive line',
      'Maddison\'s creativity between the lines as a number 8 creator',
      'Dominant aerial threat in attacking set-pieces through Romero and Solanke',
    ],
    weaknesses: [
      'Susceptible to quick rotational passing in midfield when overcommitting to press',
      'Midfield two can be outnumbered in central zones against possession teams',
    ],
    keyPattern: 'Kulusevski drops into midfield, allowing Son to isolate the left centre-back 1v1 in the inside-left channel — the team\'s most potent direct attacking route.',
    shapeAnalysis: 'Spurs\' 4-3-3 relies heavily on a dynamic midfield three with Bissouma as the anchor and Bentancur and Maddison given freedom to advance. The back four is high and aggressive, with Van de Ven\'s pace and Romero\'s tenacity providing cover behind. The wide forwards — Kulusevski and Son — are pivotal in both pressing and attacking phases, acting as genuine threats in behind.',
    pressAnalysis: 'Tottenham press aggressively from the front, with all three forwards engaging on the ball carrier. The press is triggered early — often before the opponent can settle into a build-up structure — and Spurs aim to recover possession high up the pitch to launch quick, devastating attacks. This high press leaves them vulnerable to quality long balls into wide areas if the initial press is bypassed.',
    buildUpAnalysis: 'Spurs use Vicario as an active participant in build-up, his passing ability under pressure providing an extra option out of the press. Pedro Porro advances as a right-sided midfielder in possession, driving into attacking areas. Bissouma sits as the deepest midfielder, providing a pivot for the team to play through. The team tends to play with pace and directness, looking to get the ball to their attackers quickly.',
    attackingAnalysis: 'The primary attack pattern is a direct diagonal from midfield finding Son in the left half-space, where he drives at goal with his right foot. Kulusevski provides cutbacks from the right channel — a combination that generates high-quality chances consistently. Maddison reads play intelligently to make runs from deep into the box, arriving to convert from the second line.',
    defensiveAnalysis: 'Spurs defend with a high defensive line that requires Van de Ven\'s extraordinary recovery pace to maintain safely. The team absorbs momentum with a compact 4-3-3, relying on Bissouma\'s tenacity and Bentancur\'s positional discipline to cover central spaces. Romero is aggressive in stepping out and winning the ball, with the high line designed to catch opponents offside on forward passes.',
  },

  // Newcastle (34)
  34: {
    style: 'High Press, Physical Direct Play',
    strengths: [
      'Bruno Guimarães as an elite box-to-box midfielder driving press and build-up',
      'Isak\'s movement and technical ability as a high-class lone striker',
      'Gordon\'s direct, pacey runs from the left provide consistent attacking threat',
      'Pope\'s distribution and sweeping allow Newcastle to defend a very high line',
    ],
    weaknesses: [
      'Midfield can be bypassed by quick wide switches when Trippier pushes high',
      'Over-reliance on Guimarães — his absence reduces quality significantly',
    ],
    keyPattern: 'Joelinton\'s aggressive press-and-recover from the left midfield role wins the ball high, immediately triggering a direct pass into Isak\'s movement in behind — the team\'s most effective goal-generating sequence.',
    shapeAnalysis: 'Newcastle\'s 4-3-3 is built on a midfield three where Guimarães covers the most ground and Tonali provides intensity from the right side. Joelinton acts as a powerful left-sided 8, combining pressing energy with direct attacking runs. Trippier operates as an auxiliary right midfielder in possession, providing an additional technical dimension.',
    pressAnalysis: 'Newcastle press with significant energy, particularly from Joelinton and Guimarães. The press is designed to force turnovers in the middle third rather than high up the pitch, with the forwards making ball-side runs to cut off central options. Once the ball is recovered, Newcastle transition at pace, looking for Isak\'s movement in behind.',
    buildUpAnalysis: 'Pope\'s distribution is a direct weapon — his long kicks into Isak\'s channels bypass opposition presses effectively. When building short, Schär\'s progressive passing from centre-back drives the team out and forward. Trippier\'s technical quality on the right provides a reliable passing outlet, while Hall mirrors his advance on the left to provide width.',
    attackingAnalysis: 'Isak\'s movement is central to Newcastle\'s attacking output — he exploits space behind defenders through intelligent timing and pace. Gordon runs at the opposition full-back on the left, using quick feet to create crossing situations. Barnes provides directness from the right, and the midfield three arrive late into the box from deeper positions, generating numbers in the final third.',
    defensiveAnalysis: 'Newcastle\'s defensive block is organised and physically demanding for opponents to break down. The back four holds a mid-line with Schar leading aerial duels and directing play. Botman\'s recovery pace compensates for the aggressive defensive line. The midfield three screen well, making it difficult for opponents to find pockets of space between the lines.',
  },

  // Aston Villa (66)
  66: {
    style: 'High Tempo, Physical Press',
    strengths: [
      'Watkins\' elite movement and clinical finishing as a genuine top-level striker',
      'Douglas Luiz and Tielemans provide a technically strong double pivot',
      'Bailey and Diaby offer explosive pace and direct running from wide positions',
      'Emiliano Martínez as a sweeper-keeper with elite shot-stopping',
    ],
    weaknesses: [
      'Vulnerable to quality movements in behind when both fullbacks push forward',
      'Midfield can lack defensive cover when Douglas Luiz advances aggressively',
    ],
    keyPattern: 'McGinn\'s late runs from right midfield into the box go undetected by opposition midfielders watching Watkins — a pattern that generated significant goals in the 2024/25 season.',
    shapeAnalysis: 'Villa\'s 4-2-3-1 deploys a clear double pivot with Douglas Luiz and Tielemans, with the number 10 — playing behind Watkins — acting as a mobile creative presence. Cash provides a technical right-back contribution with defensive intelligence, while Digne offers width and crossing quality from the left. The midfield three behind Watkins are given licence to make runs into the box, generating a 4v4 in the final third.',
    pressAnalysis: 'Villa press with high energy from their attacking unit. Watkins leads the press with significant work-rate, pressing the opposition goalkeeper and defenders to force hurried play. The wide attackers — Bailey and Diaby — trigger press traps on the flanks when the ball is played wide. The double pivot covers second balls effectively when the press is beaten.',
    buildUpAnalysis: 'Martínez\'s composure on the ball allows Villa to build from the back with confidence. Cash and Digne push high early in build-up, with the double pivot providing central options. Torres\' progressive passing from centre-back is a key source of advancement, often finding McGinn in the right half-space or Diaby in behind the left-back. The team can also play long balls over the press into Watkins\' chest.',
    attackingAnalysis: 'Villa\'s attacking patterns centre on Watkins\' movement in and around the final third. He attacks space behind defenders with precise timing and provides physical hold-up play. The wide forwards — Bailey on the left and Diaby on the right — run at defenders directly to generate crossing situations. McGinn\'s energy from deeper positions provides goals from the second line, making Villa difficult to defend without a back-five.',
    defensiveAnalysis: 'Konsa and Torres form a composed central defensive partnership, with the former providing aerial dominance and the latter contributing composure in possession. Martínez is one of the best goalkeepers in the league at sweeping and distribution, and his presence allows Villa to hold a reasonably high line. The team presses hard in transition to prevent opponents from settling after winning the ball.',
  },

  // Brentford (55)
  55: {
    style: 'Direct, Set-Piece Specialists',
    strengths: [
      'Elite set-piece operation — among the highest goals from dead balls in the league',
      'Mbeumo and Wissa\'s clinical partnership as a dynamic front two',
      'Nørgaard\'s leadership and defensive intelligence in the midfield anchor role',
      'High-energy press forces errors from inferior teams in possession',
    ],
    weaknesses: [
      'Direct style limits possession phases — can be outplayed by technical teams',
      'Back four can be overexposed when midfield three commit forward',
    ],
    keyPattern: 'Second balls from direct long distribution into the channels are immediately pressed by a runner — generating turnovers in the opposition half that are converted with ruthless directness.',
    shapeAnalysis: 'Brentford\'s 4-3-3 prioritises structure and physical intensity over technical ball manipulation. Nørgaard anchors a disciplined midfield three, with Jensen and Janelt given licence to make runs beyond the strikers. The wide forwards — Mbeumo and Schade — operate as direct wide attackers who pin back the opposition fullbacks, creating space in the central areas for the midfield runners.',
    pressAnalysis: 'Brentford\'s press is high-energy and physically demanding. The front three press with intensity when the ball is in the opposition\'s defensive third, aiming to force mistakes and win possession in attacking zones. The press is based on physicality and work-rate rather than structured tactical pressing traps, reflecting the team\'s direct approach throughout.',
    buildUpAnalysis: 'Brentford utilise direct long balls as a primary build-up mechanism — their 78% pass accuracy reflects a pragmatic approach to progression. Flekken distributes quickly to second-ball situations, with the midfield three positioned to contest and win direct balls into the front line. When building short, the central defenders use Nørgaard as a pivot to circulate into wide areas.',
    attackingAnalysis: 'The attacking output centres on Mbeumo and Wissa\'s movement and direct running. Mbeumo is a clinical finisher who exploits space behind defenders, while Wissa provides powerful direct running at centre-backs. The midfield runners — particularly Jensen — arrive late into the box to add numbers. Set pieces are a significant attacking weapon, with multiple aerial threats generating high-quality chances from corners and free-kicks.',
    defensiveAnalysis: 'Brentford defend in a flat 4-3-3 that drops quickly into a compact defensive block when the ball is lost. Mee\'s reading of play and positional intelligence is the cornerstone of the defensive unit. The midfield three recover quickly to maintain defensive shape. The team\'s physical intensity in duels makes them difficult to break down, and they defend set pieces with dominant aerial players.',
  },
}

export function getTeamTacticalProfile(teamId: number): TeamTacticalProfile | null {
  return PROFILES[teamId] ?? null
}
