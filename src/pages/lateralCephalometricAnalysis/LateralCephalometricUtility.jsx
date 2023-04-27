export const MARKER_LIST = {
  Co:'Condylion',
  A:'A point',
  ANS: 'Anterior Nasal Spine',
  B:'B point',
  Cm:'Columella',
  D:'D point',
  Gn:'Gnathion',
  L1A:'Lower 1 Apex',
  L1E:'Lower 1 Edge',
  Li: 'Labrale inferious',
  Ls: 'Labrale superius',
  Me:'Menton',
  Mo:'Molar occlusion',
  N:"Nasion",
  "Pog'": "Soft tissue Pogonion",
  U1E:'Upper 1 Edge',
  U1A:'Upper 1 Apex',
  S:"Sella turcica",  
  C1:"Calibration point 1",
  C2:"Calibration point 2",
  Go:"Gonion",
  Po:'Porion',
  Or:'Orbital',
  Pt: 'PT Point',
  DC:'Condyle',
  Ba: 'Basion',
  R1:"R1 point",  
  R2:"R2 point",  
  R3:"R3 point", 
  R4:"R4 point", 
  PNS: 'Posterior Nasal Spine',
  Prn: 'Pronasale',
  Mx6D: 'Most Distal Point of Maxillary First Molar',
  Md6O: 'Distal Cusp of Mandibular First Molar',
  PreM: 'Premolar',
  Pm: 'Suprapogonion'
};

export const HIGHLIGHT_COLOR = "#54c0ff";
export const LINE_RESULT_COLOR = "#ffad00";


export const ANALYSIS = {
  STEINER: {
    name: "Steiner",
    markerPoints: ['C1','C2','S','N','A','U1A','Cm','Ls','Li','U1E','L1E','Mo','B','D','L1A','Pog\'','Go','Gn'],
    lines: (markerPoints) => {
      return [
        [markerPoints["S"],markerPoints["N"]],
        [markerPoints["N"],markerPoints["A"]],
        [markerPoints["N"],markerPoints["B"]],
        [markerPoints["Mo"],markerPoints["U1E"]],
        [markerPoints["Cm"],markerPoints['Pog\'']],
        [markerPoints["Go"],markerPoints["Gn"]]
      ]
    },
    arrayListValue: [
      {
        indicator: "SNA",
        normName: "SNA",
        markerArray: ["S","N","A"],
        valueFn: (pointS,pointN,pointA) => calculateAngleFromThreePoint(pointS,pointN,pointA,false),
        highLightFn: (pointS,pointN,pointA) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointS,pointN]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointA,pointN]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "SNB",
        normName: "SNB",
        markerArray: ["S","N","B"],
        valueFn: (pointS,pointN,pointB) => calculateAngleFromThreePoint(pointS,pointN,pointB,false),
        highLightFn: (pointS,pointN,pointB) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointS,pointN]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointB,pointN]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "ANB",
        normName: "ANB",
        markerArray: ["A","N","B"],
        valueFn: (pointA,pointN,pointB) => calculateAngleFromThreePoint(pointA,pointN,pointB,false),
        highLightFn: (pointA,pointN,pointB) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointA,pointN]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointB,pointN]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Inter-incisal",
        normName: "INTERINCISAL",
        markerArray: ["L1A","L1E","U1A","U1E"],
        highLightFn: (pointL1A,pointL1E,pointU1A,pointU1E) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointL1A,intersectPoint(pointL1A,pointL1E,pointU1A,pointU1E)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointU1A,intersectPoint(pointL1A,pointL1E,pointU1A,pointU1E)]
            }
          ]
        },
        valueFn: (pointL1A,pointL1E,pointU1A,pointU1E) => calculateAngleFromFourPoint(pointL1A,pointL1E,pointU1A,pointU1E),
        unit: "deg"
      },
      {
        indicator: "Mandible (S-N vs Go-Gn)",
        normName: "MANDIBLE_STEINER",
        markerArray: ["S","N","Gn","Go"],
        valueFn: (pointN,pointS,pointGn,pointGo) => calculateAngleFromFourPoint(pointN,pointS,pointGn,pointGo,false),
        highLightFn: (pointN,pointS,pointGn,pointGo) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,intersectPoint(pointN,pointS,pointGn,pointGo)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointGn,intersectPoint(pointN,pointS,pointGn,pointGo)]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "SND",
        normName: "SND",
        markerArray: ["S","N","D"],
        valueFn: (pointS,pointN,pointD) => calculateAngleFromThreePoint(pointS,pointN,pointD,false),
        highLightFn: (pointS,pointN,pointD) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointS,pointN]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointD,pointN]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "U1E->NA",
        normName: "U1ENA",
        markerArray: ["U1E","N","A","C1","C2"],
        valueFn: (pointU1E,pointN,pointA,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointU1E,pointN,pointA,pointC1,pointC2,lengthOfRuler),
        highLightFn: (pointU1E,pointN,pointA) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,projectPointOntoLine(pointU1E,pointN,pointA)]
            },
            {
              color: LINE_RESULT_COLOR,
              linesArray: [pointU1E,projectPointOntoLine(pointU1E,pointN,pointA)]
            }
          ]
        },
        unit: "mm"
      },
      {
        indicator: "U1-NA",
        normName: "U1NA",
        markerArray: ["N","A","U1E","U1A"],
        valueFn: (pointN,pointA,pointU1E,pointU1A) => calculateAngleFromFourPoint(pointN,pointA,pointU1E,pointU1A,false),
        highLightFn: (pointN,pointA,pointU1E,pointU1A) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,intersectPoint(pointN,pointA,pointU1E,pointU1A)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointU1E,intersectPoint(pointN,pointA,pointU1E,pointU1A)]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "L1E->NB",
        normName: "L1ENB",
        markerArray: ["L1E","N","B","C1","C2"],
        valueFn: (pointL1E,pointN,pointB,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointL1E,pointN,pointB,pointC1,pointC2,lengthOfRuler),
        highLightFn: (pointL1E,pointN,pointB) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray:  [pointN,projectPointOntoLine(pointL1E,pointN,pointB)]
            },
            {
              color: LINE_RESULT_COLOR,
              linesArray: [pointL1E,projectPointOntoLine(pointL1E,pointN,pointB)]
            }
          ]
        },
        unit: "mm"
      },
      {
        indicator: "L1-NB",
        normName: "L1NB",
        markerArray: ["L1E","L1A","N","B"],
        valueFn: (pointL1E,pointL1A,pointN,pointB) => calculateAngleFromFourPoint(pointL1E,pointL1A,pointN,pointB),
        highLightFn: (pointL1E,pointL1A,pointN,pointB) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,intersectPoint(pointL1E,pointL1A,pointN,pointB)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointL1A,intersectPoint(pointL1E,pointL1A,pointN,pointB)]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Occlusal",
        normName: "SNMOU1E",
        markerArray: ["N","S","U1E","Mo"],
        valueFn: (pointN,pointS,pointU1E,pointMo) => calculateAngleFromFourPoint(pointN,pointS,pointU1E,pointMo),
        highLightFn: (pointN,pointS,pointU1E,pointMo) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,intersectPoint(pointN,pointS,pointU1E,pointMo)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointU1E,intersectPoint(pointN,pointS,pointU1E,pointMo)]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Ls->S-line",
        normName: "LS_TO_SLINE",
        markerArray: ["Ls","Cm","Pog'","C1","C2"],
        valueFn: (pointLs,pointCm,pointPo_g,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointLs,pointCm,pointPo_g,pointC1,pointC2,lengthOfRuler),
        highLightFn: (pointLs,pointCm,pointPo_g) => {
          return [
            {
              color: LINE_RESULT_COLOR,
              linesArray: [pointLs,projectPointOntoLine(pointLs,pointCm,pointPo_g)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointCm,pointPo_g] 
            }
          ]
        },
        unit: "mm"
      },
      {
        indicator: "Li->S-line",
        normName: "LI_TO_SLINE",
        markerArray: ["Li","Cm","Pog'","C1","C2"],
        valueFn: (pointLi,pointCm,pointPo_g,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointLi,pointCm,pointPo_g,pointC1,pointC2,lengthOfRuler),
        highLightFn: (pointLi,pointCm,pointPo_g) => {
          return [
            {
              color: LINE_RESULT_COLOR,
              linesArray: [pointLi,projectPointOntoLine(pointLi,pointCm,pointPo_g)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointCm,pointPo_g] 
            }
          ]
        },
        unit:"mm"
      }
    ]
  },
  NAGASAKI: {
    name: "Nagasaki",
    markerPoints: ['C1','C2','S','N','A','U1A','U1E','L1E','Mo','B','L1A','Go','Me'],
    lines: (markerPoints) => { 
      return [
        [markerPoints["S"],markerPoints["N"]],
        [markerPoints["N"],markerPoints["A"]],
        [markerPoints["A"],markerPoints["U1E"]],
        [markerPoints["U1A"],markerPoints["U1E"]],
        [markerPoints["U1A"],markerPoints["L1E"]],
        [markerPoints["L1E"],markerPoints["L1A"]],
        [markerPoints["L1A"],markerPoints["B"]],
        [markerPoints["B"],markerPoints["Me"]],
        [markerPoints["Go"],markerPoints["Me"]]
      ]
    },
    arrayListValue: [
      {
        indicator: "SNA",
        normName: "SNA",
        markerArray: ["S","N","A"],
        valueFn: (pointS,pointN,pointA) => calculateAngleFromThreePoint(pointS,pointN,pointA,false),
        highLightFn: (pointS,pointN,pointA) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointS,pointN]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointA,pointN]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "SNB",
        normName: "SNB",
        markerArray: ["S","N","B"],
        valueFn: (pointS,pointN,pointB) => calculateAngleFromThreePoint(pointS,pointN,pointB,false),
        highLightFn: (pointS,pointN,pointB) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointS,pointN]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointB,pointN]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "ANB",
        normName: "ANB",
        markerArray: ["A","N","B"],
        valueFn: (pointA,pointN,pointB) => calculateAngleFromThreePoint(pointA,pointN,pointB,false),
        highLightFn: (pointA,pointN,pointB) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointA,pointN]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointB,pointN]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Inter-incisal",
        normName: "INTERINCISAL",
        markerArray: ["L1A","L1E","U1A","U1E"],
        valueFn: (pointL1A,pointL1E,pointU1A,pointU1E) => calculateAngleFromFourPoint(pointL1A,pointL1E,pointU1A,pointU1E),
        highLightFn: (pointL1A,pointL1E,pointU1A,pointU1E) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointL1A,intersectPoint(pointL1A,pointL1E,pointU1A,pointU1E)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointU1A,intersectPoint(pointL1A,pointL1E,pointU1A,pointU1E)]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Mandible (S-N vs Go-Me)",
        normName: "MANDIBLE_NAGASAKI",
        markerArray: ["N","S","Me","Go"],
        valueFn: (pointN,pointS,pointMe,pointGo) => calculateAngleFromFourPoint(pointN,pointS,pointMe,pointGo),
        highLightFn: (pointN,pointS,pointMe,pointGo) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,intersectPoint(pointN,pointS,pointMe,pointGo)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointMe,intersectPoint(pointN,pointS,pointMe,pointGo)]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "L1E->NA",
        normName: "L1ENA",
        markerArray: ["L1E","N","A","C1","C2"],
        valueFn: (pointL1E,pointN,pointA,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointL1E,pointN,pointA,pointC1,pointC2,lengthOfRuler),
        highLightFn: (pointL1E,pointN,pointA) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,projectPointOntoLine(pointL1E,pointN,pointA)]
            },
            {
              color: LINE_RESULT_COLOR,
              linesArray: [pointL1E,projectPointOntoLine(pointL1E,pointN,pointA)]
            }
          ]
        },
        unit: "mm"
      },
      {
        indicator: "U1-SN",
        normName: "U1SN",
        markerArray: ["N","S","U1E","U1A"],
        valueFn: (pointN,pointS,pointU1E,pointU1A) => calculateAngleFromFourPoint(pointN,pointS,pointU1E,pointU1A),
        highLightFn: (pointN,pointS,pointU1E,pointU1A) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointU1E,intersectPoint(pointN,pointS,pointU1E,pointU1A)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,pointS]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "IMPA",
        normName: "IMPA",
        markerArray: ["L1E","L1A","Go","Me"],
        valueFn: (pointL1E,pointL1A,pointGo,pointMe) => calculateAngleFromFourPoint(pointL1E,pointL1A,pointGo,pointMe),
        highLightFn: (pointL1E,pointL1A,pointGo,pointMe) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointL1E,intersectPoint(pointL1E,pointL1A,pointGo,pointMe)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointGo,pointMe]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Wits",
        normName: "WITS",
        markerArray: ["A","B","Mo","U1E","C1","C2"],
        valueFn: (pointA,pointB,pointMo,pointU1E,pointC1,pointC2,lengthOfRuler) => distanceFromTwoPoint(projectPointOntoLine(pointA,pointMo,pointU1E),projectPointOntoLine(pointB,pointMo,pointU1E),pointC1,pointC2,lengthOfRuler),
        highLightFn: (pointA,pointB,pointMo,pointU1E) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointA,projectPointOntoLine(pointA,pointMo,pointU1E)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointB,projectPointOntoLine(pointB,pointMo,pointU1E)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointMo,pointU1E]
            },
            {
              color: LINE_RESULT_COLOR,
              linesArray: [projectPointOntoLine(pointA,pointMo,pointU1E),projectPointOntoLine(pointB,pointMo,pointU1E)]
            }
          ]
        },
        unit: "mm"
      }
    ]
  },
  RICKETTS: {
    name: "Ricketts",
    markerPoints: ['C1','C2','N','Po','Pt','Or','DC','R1','R2','R3','R4','Ba','PNS','Go','Gn','Pog','Pm','L1A','Pog\'','Li','Ls','Prn','ANS','A','U1A','Mx60','Md60','Mo','PreM','L1E','U1E'],
    lines: (markerPoints) => {
      return [
        [markerPoints['N'],markerPoints['Ba']],
        [markerPoints['Or'],markerPoints['Po']],
        [markerPoints['Pt'],markerPoints['Gn']],
        [markerPoints['Pog\''],markerPoints['Prn']],
        [markerPoints['Pog'],markerPoints['N']],
        [markerPoints['U1A'],markerPoints['U1E']],
        [markerPoints['L1A'],markerPoints['L1E']],
        [markerPoints['Co'],markerPoints['Gn']],
        [markerPoints['DC'],intersectPointDiagonalLineOfRectangle(markerPoints['R1'],markerPoints['R2'],markerPoints['R3'],markerPoints['R4'])],
        [markerPoints['Pm'],intersectPointDiagonalLineOfRectangle(markerPoints['R1'],markerPoints['R2'],markerPoints['R3'],markerPoints['R4'])]
      ]
    },
    arrayListValue: [
      {
        indicator: "Facial Axis",
        normName: "FACIAL_AXIS",
        markerArray: ["Ba","N","Gn","Pt"],
        valueFn: (pointBa,pointN,pointGn,pointPt) => calculateAngleFromFourPoint(pointBa,pointN,pointGn,pointPt,true),
        highLightFn: (pointBa,pointN,pointGn,pointPt) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointBa,pointN]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointGn,intersectPoint(pointBa,pointN,pointGn,pointPt)]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Facial Depth",
        normName: "FACIAL_DEPTH",
        markerArray: ["Po","Or","N","Pog"],
        valueFn: (pointPo,pointOr,pointN,pointPog) => calculateAngleFromFourPoint(pointPo,pointOr,pointN,pointPog,true),
        highLightFn: (pointPo,pointOr,pointN,pointPog) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,pointPog]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointPo,intersectPoint(pointPo,pointOr,pointN,pointPog)]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "MD-FH",
        normName: "MD_FH",
        markerArray: ["Or","Pr","Gn","Go"],
        valueFn: (pointOr,pointPr,pointGn,pointGo) => calculateAngleFromFourPoint(pointOr,pointPr,pointGn,pointGo,true),
        highLightFn: (pointOr,pointPr,pointGn,pointGo) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointOr,intersectPoint(pointOr,pointPr,pointGn,pointGo)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointGn,intersectPoint(pointOr,pointPr,pointGn,pointGo)]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Facial Taper",
        normName: "FACIAL_TAPER",
        markerArray: ["N","Pog","Go","Gn"],
        valueFn: (pointN,pointPog,pointGo,pointGn) => calculateAngleFromFourPoint(pointN,pointPog,pointGo,pointGn,true),
        highLightFn: (pointN,pointPog,pointGo,pointGn) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,intersectPoint(pointN,pointPog,pointGo,pointGn)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointGo,intersectPoint(pointN,pointPog,pointGo,pointGn)]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Lower facial height",
        normName: "LOWER_FACIAL_HEIGHT",
        markerArray: ["R1","R2","R3","R4","ANS","Pm"],
        valueFn: (pointR1,pointR2,pointR3,pointR4,pointANS,pointPm) => calculateAngleFromThreePoint(pointANS,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4),pointPm),
        highLightFn: (pointR1,pointR2,pointR3,pointR4,pointANS,pointPm) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: cạnh trên cùng của hình chữ nhật tạo bởi 4 điểm 
               */
              linesArray: [
                // topLeft
                {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
                // topRight
                {
                  x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                }
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: cạnh bên trái của hình chữ nhật tạo bởi 4 điểm 
               */
              linesArray: [
                // topLeft
                {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
                // bottomLeft
                {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                }
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: cạnh bên phải của hình chữ nhật tạo bởi 4 điểm
               */
              linesArray: [
                {
                  color: HIGHLIGHT_COLOR,
                  linesArray: [
                    // topRight
                    {
                      x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                      y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                    },
                    // bottomRight
                    {
                      x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                      y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                    }
                  ]
                }
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: cạnh dưới cùng của hình chữ nhật tạo bởi 4 điểm
               */
              linesArray: [
                // bottomLeft
                {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
                // bottomRight
                {
                  x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                }
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: đường chéo thứ nhất của hình chữ nhật
               */
              linesArray: [
                // topLeft
                  {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
                // bottomRight
                  {
                  x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                }
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: đường chéo thứ hai của hình chữ nhật
               */
              linesArray: [
                // topRight
                {
                  x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
                // bottomLeft
                {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointANS,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointPm,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4)] 
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Mandibular Arc",
        normName: "MANDIBULAR_ARC",
        markerArray: ["R1","R2","R3","R4","DC","Pm"],
        valueFn: (pointR1,pointR2,pointR3,pointR4,pointDC,pointPm) => calculateAngleFromThreePoint(pointDC,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4),pointPm),
        highLightFn: (pointR1,pointR2,pointR3,pointR4,pointDC,pointPm) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: cạnh trên cùng của hình chữ nhật tạo bởi 4 điểm 
               */
              linesArray: [
                // topLeft
                {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
                // topRight
                {
                  x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                }
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: cạnh bên trái của hình chữ nhật tạo bởi 4 điểm 
               */
              linesArray: [
                // topLeft
                {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
                // bottomLeft
                {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                }
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: cạnh bên phải của hình chữ nhật tạo bởi 4 điểm
               */
              linesArray: [
                {
                  color: HIGHLIGHT_COLOR,
                  linesArray: [
                    // topRight
                    {
                      x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                      y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                    },
                    // bottomRight
                    {
                      x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                      y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                    }
                  ]
                }
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: cạnh dưới cùng của hình chữ nhật tạo bởi 4 điểm
               */
              linesArray: [
                // bottomLeft
                {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
                // bottomRight
                {
                  x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                }
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: đường chéo thứ nhất của hình chữ nhật
               */
              linesArray: [
                // topLeft
                  {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
                // bottomRight
                  {
                  x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                }
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              /**
               * todo: đường chéo thứ hai của hình chữ nhật
               */
              linesArray: [
                // topRight
                {
                  x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
                // bottomLeft
                {
                  x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
                  y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
                },
              ]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointDC,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4)]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointPm,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4)] 
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Palatal plane to FH",
        normName: "PALATAL_FH",
        markerArray: ["Po","Or","PNS","ANS"],
        valueFn: (pointPo,pointOr,pointPNS,pointANS) => calculateAngleFromFourPoint(pointPo,pointOr,pointPNS,pointANS),
        highLightFn: (pointPo,pointOr,pointPNS,pointANS) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointPo,pointOr]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointPNS,pointANS]
            }
          ]
        },
        unit: "deg"
      },
      {
        indicator: "Maxillary Convexity",
        normName: "MAXILLARY_CONVEXITY",
        markerArray: ["N","A","Pog","C1","C2"],
        valueFn: (pointN,pointA,pointPog,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointA,pointN,pointPog,pointC1,pointC2,lengthOfRuler),
        highLightFn: (pointN,pointA,pointPog) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointN,pointPog]
            },
            {
              color: LINE_RESULT_COLOR,
              linesArray: [pointA,projectPointOntoLine(pointA,pointN,pointPog)]
            }
          ]
        },
        unit: "mm"
      },
      {
        indicator: "Upper incisor to A-Pog",
        normName: "U1EAPOG",
        markerArray: ["A","U1E","Pog","C1","C2"],
        valueFn: (pointU1E,pointA,pointPog,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointU1E,pointA,pointPog,pointC1,pointC2,lengthOfRuler),
        highLightFn: (pointU1E,pointA,pointPog) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointA,pointPog]
            },
            {
              color: LINE_RESULT_COLOR,
              linesArray: [pointU1E,projectPointOntoLine(pointU1E,pointA,pointPog)]
            }
          ]
        },
        unit: "mm"
      },
      {
        indicator: "Lower incisor to A-Pog",
        normName: "L1EAPOG",
        markerArray: ["A","L1E","Pog","C1","C2"],
        valueFn: (pointL1E,pointA,pointPog,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointL1E,pointA,pointPog,pointC1,pointC2,lengthOfRuler),
        highLightFn: (pointL1E,pointA,pointPog) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointA,pointPog]
            },
            {
              color: LINE_RESULT_COLOR,
              linesArray: [pointL1E,projectPointOntoLine(pointL1E,pointA,pointPog)]
            }
          ]
        },
        unit: "mm"
      },
      {
        indicator: "Lower Incisor Inclination",
        normName: "L1APOG",
        markerArray: ["L1E","L1A","A","Pog"],
        valueFn: (pointL1E,pointL1A,pointA,pointPog) => calculateAngleFromFourPoint(pointL1E,pointL1A,pointA,pointPog,true),
        highLightFn: (pointL1E,pointL1A,pointA,pointPog) => {
          return [
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointL1E,pointL1A]
            },
            {
              color: HIGHLIGHT_COLOR,
              linesArray: [pointA,pointPog]
            }
          ]
        },
        unit: "deg"
      },
      // {
      //   indicator: "U6 -> Ptv"
      // }
    ]
  }
}


/**
 * nguồn norms tham khảo: https://viceph.net/
 */
export const PREDEFINED_NORMS = {
  ASIA: {
    "name":"Asia",
    "data":{
      "SNA": {"data":{"F": {"MIN": 82,"MAX": 88},"M": {"MIN": 81,"MAX": 89}}},
      "SNB": {"data":{"F": {"MIN": 77,"MAX": 85},"M": {"MIN": 77,"MAX": 85}}},
      "ANB": {"data":{"F": {"MIN": 2,"MAX": 6},"M": {"MIN": 2,"MAX": 6}}},
      "MANDIBLE_STEINER": {"data":{"F": {"MIN": 24.5,"MAX": 31.7},"M": {"MIN": 19.3,"MAX": 27.7}}},
      "SND": {"data":{"F": {"MIN": 76,"MAX": 81.2},"M": {"MIN": 77.7,"MAX": 82.7}}},
      "U1ENA": {"data":{"F": {"MIN": 5.7,"MAX": 10.9},"M": {"MIN": 4.2,"MAX": 11.6}}},
      "U1NA": {"data":{"F": {"MIN": 21.2,"MAX": 32.8},"M": {"MIN": 21.2,"MAX": 32.8}}},
      "L1ENB": {"data":{"F": {"MIN": 5.7,"MAX": 9.1},"M": {"MIN": 3.5,"MAX": 8.7}}},
      "L1NB": {"data":{"F": {"MIN": 26.8,"MAX": 35.4},"M": {"MIN": 18.9,"MAX": 30.5}}},
      "SNMOU1E": {"data":{"F": {"MIN": 9,"MAX": 17},"M": {"MIN": 11,"MAX": 19}}},
      "LS_TO_SLINE": {"data":{"F": {"MIN": "","MAX": ""},"M": {"MIN": "","MAX": ""}}},
      "LI_TO_SLINE": {"data":{"F": {"MIN": "","MAX": ""},"M": {"MIN": "","MAX": ""}}},
      "FMA": {"data":{"F": {"MIN": 19.6,"MAX": 28.2},"M": {"MIN": 14.6,"MAX": 27}}},
      "FMIA": {"data":{"F": {"MIN": 51.4,"MAX": 63},"M": {"MIN": 56.7,"MAX": 71.1}}},
      "IMPA": {"data":{"F": {"MIN": 89,"MAX": 103},"M": {"MIN": 90,"MAX": 104}}},
      "MANDIBLE_NAGASAKI": {"data":{"F": {"MIN": 22,"MAX": 38},"M": {"MIN": 24,"MAX": 34}}},
      "WITS": {"data":{"F": {"MIN": -6,"MAX": 6},"M": {"MIN": -6,"MAX": 6}}},
      "L1ENA": {"data":{"F": {"MIN": -1.5,"MAX": 2.5},"M": {"MIN": -1.5,"MAX": 2.5}}},
      "U1SN": {"data":{"F": {"MIN": 100,"MAX": 114},"M": {"MIN": 98,"MAX": 116}}},
      "ICH": {"data":{"F": {"MIN": 163,"MAX": 196.46},"M": {"MIN": 161.88,"MAX": 190.72}}},
      "CMC": {"data":{"F": {"MIN": 128.84,"MAX": 144.64},"M": {"MIN": 127.14,"MAX": 146.34 }}},
      "AN": {"data":{"F": {"MIN": 0.65,"MAX": 3.05},"M": {"MIN": 0.79,"MAX": 3.29}}},
      "ISY": {"data":{"F": {"MIN": 95.7,"MAX": 108.04},"M": {"MIN": 97.72,"MAX": 111.52}}},
      "IMA": {"data":{"F": {"MIN": -5.75,"MAX": 47.31},"M": {"MIN": 6.36,"MAX": 22.84}}},
      "LAFH": {"data":{"F": {"MIN": 54.34,"MAX": 70.3},"M": {"MIN": 60.78,"MAX": 74.1}}},
      "NGoMe": {"data":{"F": {"MIN": 71.59,"MAX": 81.37},"M": {"MIN": 71.59,"MAX": 81.37}}},
      "FACIAL_DEPTH": {"data":{"F": {"MIN": 81.4,"MAX": 90},"M": {"MIN": 81.5,"MAX": 90.1}}},
      "MANDIBULAR_PLANE": {"data":{"F": {"MIN": 18,"MAX": 45.5},"M": {"MIN": 18,"MAX": 45.5}}},
      "NAPOG": {"data":{ "F": {"MIN": -3,"MAX": 14},"M": {"MIN": -3,"MAX": 14}}},
      "YAXIS": {"data":{"F": {"MIN": 62,"MAX": 70},"M": {"MIN": 62,"MAX": 70}}},
      "OCCLUSAL_PLANE": {"data":{"F": {"MIN": 7,"MAX": 25},"M": {"MIN": 7,"MAX": 25}}},
      "L1_OCCLUSAL": {"data":{ "F": {"MIN": 2.1,"MAX": 20},"M": {"MIN": 3.5,"MAX": 19.1}}},
      "U1EAPOG": {"data":{"F": {"MIN": 4,"MAX": 12},"M": {"MIN": 5,"MAX": 13}}},
      "MD_FH": {"data":{"F": {"MIN": 21.6,"MAX":36},"M": {"MIN":21.6,"MAX":35.8}}},
      "FACIAL_AXIS": {"data":{"F": {"MIN": 81,"MAX":89},"M": {"MIN":79,"MAX":87}}},
      "FACIAL_TAPER": {"data":{"F": {"MIN": 60.5,"MAX":70.5},"M": {"MIN":60.5,"MAX":70.5}}},
      "LOWER_FACIAL_HEIGHT": {"data":{"F": {"MIN": 40.2,"MAX":50.4},"M": {"MIN":40.6,"MAX":50.8}}},
      "MANDIBULAR_ARC": {"data":{"F": {"MIN": 15.6,"MAX":35},"M": {"MIN":17.1,"MAX":35.5}}},
      "MAXILLARY_CONVEXITY": {"data":{"F": {"MIN": 0.7,"MAX":6.3},"M": {"MIN":-0.2,"MAX":7}}},
      "L1EAPOG": {"data":{"F": {"MIN": -2,"MAX":4},"M": {"MIN":-2,"MAX":4}}},
      "L1APOG": {"data":{"F": {"MIN": 14.9,"MAX":39.9},"M": {"MIN":14.6,"MAX":39.4}}},
      "U6PTV": {"data":{"F": {"MIN": 11.1,"MAX":20.3},"M": {"MIN":12.4,"MAX":23}}},
      "LS_EPLANE": {"data":{"F": {"MIN": -4.8,"MAX":0.8},"M": {"MIN":-5.6,"MAX":1.6}}},
      "LI_EPLANE": {"data":{"F": {"MIN": -1.2,"MAX":4.8},"M": {"MIN":-1.5,"MAX":6.5}}},
      "MOLAR_REL": {"data":{"F": {"MIN": "","MAX":""},"M": {"MIN":"","MAX":""}}},
      "U1APOG": {"data":{"F": {"MIN": "","MAX":""},"M": {"MIN":"","MAX":""}}},
      "MANDIBULAR_AB":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "PALATAL_FH":{"data":{"F":{"MIN": -6,"MAX": 3.2},"M":{"MIN": -4.9,"MAX": 3.3}}},
      "ODI":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "ABPLANE":{"data":{"F":{"MIN": -11,"MAX": 0},"M":{"MIN": -11,"MAX": 0}}},
      "APDI":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "CF":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "INTERINCISAL":{"data":{"F":{"MIN": "114","MAX": "134"},"M":{"MIN": "114","MAX": "134"}}},
      "EI":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "L1NA":{"data":{"F":{"MIN": 20,"MAX": 30},"M":{"MIN": 20,"MAX": 30}}}
    }
  },
  JAPANESE: {
    "name":"Japanese",
    "data":{
      "SNA": {"data":{"F": {"MIN": 78.5,"MAX": 84.5},"M": {"MIN": 77.5,"MAX": 84.5}}},
      "SNB": {"data":{"F": {"MIN": 74.5,"MAX": 81.5},"M": {"MIN": 74.5,"MAX": 81.5}}},
      "ANB": {"data":{"F": {"MIN": 1,"MAX": 7},"M": {"MIN": 1,"MAX": 7}}},
      "MANDIBLE_STEINER": {"data":{"F": {"MIN": 31.5,"MAX": 40.7},"M": {"MIN": 32.1,"MAX": 40.7}}},
      "SND": {"data":{"F": {"MIN": 70.8,"MAX": 77},"M": {"MIN": 69.6,"MAX": 76}}},
      "U1ENA": {"data":{"F": {"MIN": 4.3,"MAX": 8.1},"M": {"MIN": 3.8,"MAX": 7.2}}},
      "U1NA": {"data":{"F": {"MIN": 19.5,"MAX": 29.9},"M": {"MIN": 18.8,"MAX": 28.2}}},
      "L1ENB": {"data":{"F": {"MIN": 5.4,"MAX": 10.2},"M": {"MIN": 6.1,"MAX": 9.5}}},
      "L1NB": {"data":{"F": {"MIN": 24.4,"MAX": 37.6},"M": {"MIN": 27,"MAX": 36}}},
      "SNMOU1E": {"data":{"F": {"MIN": 15.5,"MAX": 22.9},"M": {"MIN": 17.2,"MAX": 24.8}}},
      "LS_TO_SLINE": {"data":{"F": {"MIN": "","MAX": ""},"M": {"MIN": "","MAX": ""}}},
      "LI_TO_SLINE": {"data":{"F": {"MIN": "","MAX": ""},"M": {"MIN": "","MAX": ""}}},
      "FMA": {"data":{"F": {"MIN": 23.6,"MAX": 34},"M": {"MIN": 20,"MAX": 32.6}}},
      "FMIA": {"data":{"F": {"MIN": 48.1,"MAX": 61.1},"M": {"MIN": 52.3,"MAX": 65.7}}},
      "IMPA": {"data":{"F": {"MIN": 88,"MAX": 100},"M": {"MIN": 88,"MAX": 100}}},
      "MANDIBLE_NAGASAKI": {"data":{"F": {"MIN": 33,"MAX": 45},"M": {"MIN": 33,"MAX": 45}}},
      "WITS": {"data":{"F": {"MIN": -6,"MAX": 6},"M": {"MIN": -6,"MAX": 6}}},
      "L1ENA": {"data":{"F": {"MIN": -1.5,"MAX": 2.5},"M": {"MIN": -1.5,"MAX": 2.5}}},
      "U1SN": {"data":{"F": {"MIN": 97,"MAX": 109},"M": {"MIN": 97,"MAX": 109}}},
      "ICH": {"data":{"F": {"MIN": "","MAX": ""},"M": {"MIN": "","MAX": ""}}},
      "CMC": {"data":{"F": {"MIN": "","MAX": ""},"M": {"MIN": "","MAX": "" }}},
      "AN": {"data":{"F": {"MIN": "","MAX": ""},"M": {"MIN": "","MAX": ""}}},
      "ISY": {"data":{"F": {"MIN": "","MAX": ""},"M": {"MIN": "","MAX": ""}}},
      "IMA": {"data":{"F": {"MIN": "","MAX": ""},"M": {"MIN": "","MAX": ""}}},
      "LAFH": {"data":{"F": {"MIN": "","MAX": ""},"M": {"MIN": "","MAX": ""}}},
      "NGoMe": {"data":{"F": {"MIN": 71.59,"MAX": 81.37},"M": {"MIN": 71.59,"MAX": 81.37}}},
      "FACIAL_DEPTH": {"data":{"F": {"MIN": 84.23,"MAX": 91.37},"M": {"MIN": 81.23,"MAX": 91.37}}},
      "MANDIBULAR_PLANE": {"data":{"F": {"MIN": 23,"MAX": 34.5},"M": {"MIN": 23,"MAX": 34.5}}},
      "NAPOG": {"data":{ "F": {"MIN": 3.1,"MAX": 12.3},"M": {"MIN": 3.1,"MAX": 12.3}}},
      "YAXIS": {"data":{"F": {"MIN": 61.4,"MAX": 69.3},"M": {"MIN": 61.4,"MAX": 69.3}}},
      "OCCLUSAL_PLANE": {"data":{"F": {"MIN": 6.9,"MAX": 14.2},"M": {"MIN": 6.9,"MAX": 14.2}}},
      "L1_OCCLUSAL": {"data":{ "F": {"MIN": 18.6,"MAX": 29.6},"M": {"MIN": 18.6,"MAX": 29.6}}},
      "U1EAPOG": {"data":{"F": {"MIN": 0.9,"MAX": 4.5},"M": {"MIN": 0.9,"MAX": 4.5}}},
      "MD_FH": {"data":{"F": {"MIN": 22,"MAX":30},"M": {"MIN":22,"MAX":30}}},
      "FACIAL_AXIS": {"data":{"F": {"MIN": 87,"MAX":93},"M": {"MIN":87,"MAX":93}}},
      "FACIAL_TAPER": {"data":{"F": {"MIN": 65,"MAX":71},"M": {"MIN":65,"MAX":71}}},
      "LOWER_FACIAL_HEIGHT": {"data":{"F": {"MIN": 43,"MAX":51},"M": {"MIN":43,"MAX":51}}},
      "MANDIBULAR_ARC": {"data":{"F": {"MIN": 22,"MAX":30},"M": {"MIN":22,"MAX":30}}},
      "MAXILLARY_CONVEXITY": {"data":{"F": {"MIN": 0,"MAX":4},"M": {"MIN":0,"MAX":4}}},
      "L1EAPOG": {"data":{"F": {"MIN": 0,"MAX":4},"M": {"MIN":0,"MAX":4}}},
      "L1APOG": {"data":{"F": {"MIN": 18,"MAX":26},"M": {"MIN":18,"MAX":26}}},
      "U6PTV": {"data":{"F": {"MIN": "","MAX":""},"M": {"MIN":"","MAX":""}}},
      "LS_EPLANE": {"data":{"F": {"MIN": -0.7,"MAX":-0.7},"M": {"MIN":-0.7,"MAX":-0.7}}},
      "LI_EPLANE": {"data":{"F": {"MIN": -2.7,"MAX":3.3},"M": {"MIN":-2.7,"MAX":3.3}}},
      "MOLAR_REL": {"data":{"F": {"MIN": "","MAX":""},"M": {"MIN":"","MAX":""}}},
      "U1APOG": {"data":{"F": {"MIN": "","MAX":""},"M": {"MIN":"","MAX":""}}},
      "MANDIBULAR_AB":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "PALATAL_FH":{"data":{"F":{"MIN": -3,"MAX": 3},"M":{"MIN": -3,"MAX": 3}}},
      "ODI":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "ABPLANE":{"data":{"F":{"MIN": -8.5,"MAX": -2},"M":{"MIN": -8.5,"MAX": -2}}},
      "APDI":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "CF":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "INTERINCISAL":{"data":{"F":{"MIN": 118,"MAX": 132},"M":{"MIN": 118,"MAX": 132}}},
      "EI":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "L1NA":{"data":{"F":{"MIN": 20,"MAX": 30},"M":{"MIN": 20,"MAX": 30}}}
    }
  },
  VIETNAM: {
    "name":"Vietnamese",
    "data":{
      "SNA": {"data":{"F": {"MIN": 81.14,"MAX": 86.92},"M": {"MIN": 81.43,"MAX": 87.91}}},
      "SNB": {"data":{"F": {"MIN": 78.48,"MAX": 84.2},"M": {"MIN": 77.9,"MAX": 84.58}}},
      "ANB": {"data":{"F": {"MIN": 1.09,"MAX": 3.81},"M": {"MIN": 2.02,"MAX": 4.56}}},
      "MANDIBLE_STEINER": {"data":{"F": {"MIN": 21.4,"MAX": 32.24},"M": {"MIN": 22.45,"MAX": 29.81}}},
      "SND": {"data":{"F": {"MIN": 74.5,"MAX": 80.32},"M": {"MIN": 75.41,"MAX": 81.51}}},
      "U1ENA": {"data":{"F": {"MIN": 2.53,"MAX": 5.71},"M": {"MIN": 2.34,"MAX": 6.12}}},
      "U1NA": {"data":{"F": {"MIN": 18.4,"MAX": 30.32},"M": {"MIN": 20.79,"MAX": 29.81}}},
      "L1ENB": {"data":{"F": {"MIN": 2.05,"MAX": 6.57},"M": {"MIN": 3.26,"MAX": 7.02}}},
      "L1NB": {"data":{"F": {"MIN": 22.29,"MAX": 34.55},"M": {"MIN": 23.7,"MAX": 35.78}}},
      "SNMOU1E": {"data":{"F": {"MIN": 9.72,"MAX": 17.74},"M": {"MIN": 9.13,"MAX": 16.15}}},
      "FMA": {"data":{"F": {"MIN": 23.6,"MAX": 34},"M": {"MIN": 20,"MAX": 32.6}}},
      "FMIA": {"data":{"F": {"MIN": 48.1,"MAX": 61.1},"M": {"MIN": 52.3,"MAX": 65.7}}},
      "IMPA": {"data":{"F": {"MIN": 88,"MAX": 100},"M": {"MIN": 88,"MAX": 100}}},
      "MANDIBLE_NAGASAKI": {"data":{"F": {"MIN": 33,"MAX": 45},"M": {"MIN": 33,"MAX": 45}}},
      "WITS": {"data":{"F": {"MIN": -6,"MAX": 6},"M": {"MIN": -6,"MAX": 6}}},
      "L1ENA": {"data":{"F": {"MIN": -1.5,"MAX": 2.5},"M": {"MIN": -1.5,"MAX": 2.5}}},
      "U1SN": {"data":{"F": {"MIN": 97,"MAX": 109},"M": {"MIN": 97,"MAX": 109}}},
      "ICH": {"data":{"F": {"MIN": 163,"MAX": 196.46},"M": {"MIN": 161.88,"MAX": 190.72}}},
      "CMC": {"data":{"F": {"MIN": 128.84,"MAX": 144.64},"M": {"MIN": 127.14,"MAX": 146.34 }}},
      "AN": {"data":{"F": {"MIN": 0.65,"MAX": 3.05},"M": {"MIN": 0.79,"MAX": 3.29}}},
      "ISY": {"data":{"F": {"MIN": 95.7,"MAX": 108.04},"M": {"MIN": 97.72,"MAX": 111.52}}},
      "IMA": {"data":{"F": {"MIN": -5.75,"MAX": 47.31},"M": {"MIN": 6.36,"MAX": 22.84}}},
      "LAFH": {"data":{"F": {"MIN": 54.34,"MAX": 70.3},"M": {"MIN": 60.78,"MAX": 74.1}}},
      "NGoMe": {"data":{"F": {"MIN": 71.59,"MAX": 81.37},"M": {"MIN": 71.59,"MAX": 81.37}}},
      "FACIAL_DEPTH": {"data":{"F": {"MIN": 84.23,"MAX": 91.37},"M": {"MIN": 84.23,"MAX": 91.37}}},
      "MANDIBULAR_PLANE": {"data":{"F": {"MIN": 23,"MAX": 34.5},"M": {"MIN": 23,"MAX": 34.5}}},
      "NAPOG": {"data":{ "F": {"MIN": 3.1,"MAX": 11.1},"M": {"MIN": 3.1,"MAX": 11.1}}},
      "YAXIS": {"data":{"F": {"MIN": 61.4,"MAX": 69.3},"M": {"MIN": 61.4,"MAX": 69.3}}},
      "OCCLUSAL_PLANE": {"data":{"F": {"MIN": 6.9,"MAX": 13.1},"M": {"MIN": 6.9,"MAX": 13.1}}},
      "L1_OCCLUSAL": {"data":{ "F": {"MIN": 18.6,"MAX": 28.1},"M": {"MIN": 18.6,"MAX": 28.1}}},
      "U1EAPOG": {"data":{"F": {"MIN": 0.9,"MAX": 4.5},"M": {"MIN": 0.9,"MAX": 4.5}}},
      "MD_FH": {"data":{"F": {"MIN": 22,"MAX":30},"M": {"MIN":22,"MAX":30}}},
      "FACIAL_AXIS": {"data":{"F": {"MIN": 87,"MAX":93},"M": {"MIN":87,"MAX":93}}},
      "FACIAL_TAPER": {"data":{"F": {"MIN": 65,"MAX":71},"M": {"MIN":65,"MAX":71}}},
      "LOWER_FACIAL_HEIGHT": {"data":{"F": {"MIN": 43,"MAX":51},"M": {"MIN":43,"MAX":51}}},
      "MANDIBULAR_ARC": {"data":{"F": {"MIN": 22,"MAX":30},"M": {"MIN":22,"MAX":30}}},
      "MAXILLARY_CONVEXITY": {"data":{"F": {"MIN": 0,"MAX":4},"M": {"MIN":0,"MAX":4}}},
      "L1EAPOG": {"data":{"F": {"MIN": 0,"MAX":4},"M": {"MIN":0,"MAX":4}}},
      "L1APOG": {"data":{"F": {"MIN": 18,"MAX":26},"M": {"MIN":18,"MAX":26}}},
      "U6PTV": {"data":{"F": {"MIN": 13.6,"MAX":20.2},"M": {"MIN":15.4,"MAX":23}}},
      "LS_EPLANE": {"data":{"F": {"MIN": -0.7,"MAX":-0.7},"M": {"MIN":-0.7,"MAX":-0.7}}},
      "LI_EPLANE": {"data":{"F": {"MIN": -2.7,"MAX":3.3},"M": {"MIN":-2.7,"MAX":3.3}}},
      "MOLAR_REL": {"data":{"F": {"MIN": "","MAX":""},"M": {"MIN":"","MAX":""}}},
      "U1APOG": {"data":{"F": {"MIN": 21.9,"MAX":30.5},"M": {"MIN":23.1,"MAX":32.9}}},
      "MANDIBULAR_AB":{"data":{"F":{"MIN": "","MAX": ""},"M":{"MIN": "","MAX": ""}}},
      "PALATAL_FH":{"data":{"F":{"MIN": -3,"MAX": 3},"M":{"MIN": -3,"MAX": 3}}},
      "ODI":{"data":{"F":{"MIN":68.5,"MAX":80.5},"M":{"MIN":68.5,"MAX":80.5}}},
      "ABPLANE":{"data":{"F":{"MIN": -8.5,"MAX": -2},"M":{"MIN": -8.5,"MAX": -2}}},
      "APDI":{"data":{"F":{"MIN":77.7,"MAX":85.1},"M":{"MIN":77.7,"MAX":85.1}}},
      "CF":{"data":{"F":{"MIN":155.9,"MAX":155.9},"M":{"MIN":155.9,"MAX":155.9}}},
      "INTERINCISAL":{"data":{"F":{"MIN":114.87,"MAX":133.09},"M":{"MIN":113.72,"MAX":128.88}}},
      "LS_TO_SLINE":{"data":{"F":{"MIN": -0.1,"MAX": 3.3},"M":{"MIN": -1.7,"MAX": 2.5}}},
      "LI_TO_SLINE":{"data":{"F":{"MIN": -1.9,"MAX": 1.5},"M":{"MIN": -3.4,"MAX": 2}}},
      "EI":{"data":{"F":{"MIN":"","MAX":""},"M":{"MIN":"","MAX":""}}},
      "L1NA":{"data":{"F":{"MIN": 20,"MAX": 30},"M":{"MIN": 20,"MAX": 30}}}
    }
  }
}

/**
 * todo: tính góc giữa vector AB và CD
 * @param {*} pointA điểm A
 * @param {*} pointB điểm B
 * @param {*} pointC điểm C
 * @param {*} pointD điểm D
 * @param {*} reverse xác định có phải là góc bù của giá trị cần tìm không
 * @returns góc tạo bởi vector AB và CD
 */
export const calculateAngleFromFourPoint = (pointA, pointB, pointC, pointD, reverse = true) => {
  if(!pointA || !pointB || !pointC || !pointD) return '-';
  // Tính vector AB và vector CD
  const ABx = pointB.x - pointA.x;
  const ABy = pointB.y - pointA.y;
  const CDx = pointD.x - pointC.x;
  const CDy = pointD.y - pointC.y;

  // Tính tích vô hướng của hai vector
  const dotProduct = ABx * CDx + ABy * CDy;

  // Tính độ dài của hai vector
  const ABLength = Math.sqrt(ABx * ABx + ABy * ABy);
  const CDLength = Math.sqrt(CDx * CDx + CDy * CDy);

  // Tính góc giữa hai vector
  const cosTheta = dotProduct / (ABLength * CDLength);
  const theta = Math.acos(cosTheta);

  // Đổi từ radian sang độ
  const degree = (theta * 180 / Math.PI);
  if(reverse) return degree.toFixed(2)
  else return (180-degree).toFixed(2);
}

/**
 * todo: tính góc tạo bởi 3 điểm 
 * @param {*} startPoint điểm đầu
 * @param {*} centerPoint điểm giữa (đỉnh của góc)
 * @param {*} endPoint điểm cuối
 * @returns góc tạo bởi 3 điểm
 */
export const calculateAngleFromThreePoint = (startPoint,centerPoint,endPoint,reverse = true) => {
  if(!startPoint || !centerPoint || !endPoint) return '-';
  const degree = calculateAngleFromFourPoint(startPoint,centerPoint,centerPoint,endPoint,reverse);
  return degree;
}


/**
 * todo: tính khoảng cách từ 1 điểm đến 1 đường thẳng
 * @param {*} pointA điểm cần tính khoảng cách
 * @param {*} pointB điểm thuộc đường thẳng
 * @param {*} pointC điểm thuộc đường thẳng
 * @returns khoảng cách từ pointA đến đường thẳng đi qua pointB và pointC
 * ? công thức tham khảo: vectorAB.vectorBC = |vectorAB|.|vectorBC|.cos(vectorAB,vectorBC)
 */
export const distanceFromPointToLine = (pointA, pointB, pointC, pointC1, pointC2, lengthOfRuler) => {
  if(!pointA || !pointB || !pointC) return '-';
  const xA = pointA.x;
  const yA = pointA.y;
  const xB = pointB.x;
  const yB = pointB.y;
  const xC = pointC.x;
  const yC = pointC.y;

  const vectorBC = { x: xC - xB, y: yC - yB };
  const vectorAB = { x: xB - xA, y: yB - yA };

  // vector pháp tuyến của BC
  const vectorN = { x: -vectorBC.y, y: vectorBC.x };

  // độ dài vector N
  const magnitudeN = Math.sqrt(vectorN.x ** 2 + vectorN.y ** 2);

  // tích vô hướng của vector AB và N
  const dotProductABN = vectorAB.x * vectorN.x + vectorAB.y * vectorN.y;

  const distance = Math.abs(dotProductABN) / magnitudeN;

  const realResult =  (distance *lengthOfRuler) / point2PointDistance(pointC1,pointC2);
  return realResult.toFixed(2);
}


/**
 * todo: tọa độ của chân đường vuông góc của pointA lên đường thẳng pointB,pointC
 * @param {*} pointP điểm cần lấy chân đường vuông góc
 * @param {*} pointA điểm đầu
 * @param {*} pointB điểm cuối
 * @returns tọa độ của chân đường vuông góc
 */
export const projectPointOntoLine = (pointP, pointA, pointB) => {
  if(!pointA || !pointB || !pointP) return null;
  // tính vector AB và AP
  const vectorAB = {x: pointB.x - pointA.x, y: pointB.y - pointA.y};
  const vectorAP = {x: pointP.x - pointA.x, y: pointP.y - pointA.y};  

  // tính t là tỷ lệ khoảng cách của chân đường vuông góc của P với điểm A và AB
  const dotAB = vectorAB.x ** 2 + vectorAB.y ** 2;
  const dotAPAB = vectorAP.x * vectorAB.x + vectorAP.y * vectorAB.y;
  const t = dotAPAB / dotAB;

  // tính tọa độ của điểm P trên đường thẳng AB
  const projection = {
    x: pointA.x + vectorAB.x * t,
    y: pointA.y + vectorAB.y * t
  };

  return projection;
}


/**
 * todo: khoảng cách giữa 2 điểm dựa vào khoản cách thực tế được cung cấp bởi độ dài C1, C2 và độ dài thước đo lengthOfRuler
 * @param {*} pointA tọa độ điểm A
 * @param {*} pointB tọa độ điểm B
 * @returns khoảng cách giữa A và B theo giá trị thực tế và làm tròn 2 chữ số sau dấu phẩy
 */
export const distanceFromTwoPoint = (pointA, pointB, pointC1, pointC2, lengthOfRuler) => {
  if(!pointA || !pointB) return '-';
  const distance = Math.sqrt((pointB.y - pointA.y) **2 + (pointB.x - pointA.x) **2);
  const realResult = distance/point2PointDistance(pointC1,pointC2);
  return (realResult*lengthOfRuler).toFixed(2);
}

/**
 * todo: khoảng cách 2 điểm đầu thước C1 và C2
 * @param {*} pointC1 điểm C1
 * @param {*} C2 điểm C2
 * @returns khoảng cách giữa 2 điểm đầu thước C1 và C2
 */
 export function point2PointDistance(pointC1,pointC2) {
  let result = null;
  if(pointC1 && pointC2) result = Math.sqrt((pointC2.x-pointC1.x)*(pointC2.x-pointC1.x)+(pointC2.y-pointC1.y)*(pointC2.y-pointC1.y));
  return result;
}

/**
 * todo: tính tọa độ giao điểm của 2 đường thẳng p1p2 và p3p4
 * @param {*} p1 format {x,y}
 * @param {*} p2 format {x,y}
 * @param {*} p3 format {x,y}
 * @param {*} p4 format {x,y}
 * @returns tọa độ của giao điểm 2 đường thằng p1-p2 và p3-p4 theo format {x,y}
 */
 export function intersectPoint(p1,p2,p3,p4) { //computer intersect of 2 lines p1-p2 and p3-p4
  if(!p1 || !p2 || !p3 || !p4) return null;
  let tx = (p1.x*p2.y-p1.y*p2.x)*(p3.x-p4.x) - (p1.x-p2.x)*(p3.x*p4.y-p3.y*p4.x);
  let bx = (p1.x-p2.x)*(p3.y-p4.y) - (p1.y-p2.y)*(p3.x-p4.x);
  let x = parseFloat(tx)/parseFloat(bx);
  let ty = (p1.x*p2.y-p1.y*p2.x)*(p3.y-p4.y)-(p1.y-p2.y)*(p3.x*p4.y-p3.y*p4.x);
  let by = (p1.x-p2.x)*(p3.y-p4.y) - (p1.y-p2.y)*(p3.x-p4.x);
  let y = parseFloat(ty)/parseFloat(by);
  return {x:x,y:y};
}


/**
 * todo: tính tọa độ của hình chữ nhật tạo bởi đường thẳng song song đi qua 4 điểm R1, R2, R3, R4 
 * @param {*} pointR1 điểm thuộc cạnh hình chữ nhật
 * @param {*} pointR2 điểm thuộc cạnh hình chữ nhật
 * @param {*} pointR3 điểm thuộc cạnh hình chữ nhật
 * @param {*} pointR4 điểm thuộc cạnh hình chữ nhật
 * @returns tọa độ giao điểm của 2 đường chéo hình chữ nhật
 */
export function intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4) {
  if(!pointR1 || !pointR2 || !pointR3 || !pointR4) return null;
  // điểm trên cùng bên trái của hình chữ nhật
  const topLeftPoint = {
    x: Math.min(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
    y: Math.min(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
  }

  // điểm dưới cùng bên phải của hình chữ nhật
  const bottomRightPoint = {
    x: Math.max(pointR1.x, pointR2.x, pointR3.x, pointR4.x),
    y: Math.max(pointR1.y, pointR2.y, pointR3.y, pointR4.y)
  }

  // tọa độ giao điểm của 2 đường chéo là trung điểm của 1 đường chéo
  const intersectPointDiagonalLine = {
    x: (topLeftPoint.x + bottomRightPoint.x) / 2,
    y: (topLeftPoint.y + bottomRightPoint.y) / 2
  }

  return intersectPointDiagonalLine;
}






