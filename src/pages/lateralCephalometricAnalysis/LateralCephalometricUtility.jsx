export const COLOR_HIGHLIGHT = "#54c0ff";
export const COLOR_RESULT_LINE = "#ffad00";

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
  Pog: 'Pogonion',  
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

export const ANALYSIS = {
  STEINER: {
    name: "Steiner",
    markerPoints: ['C1','C2','S','N','A','U1A','Cm','Ls','Li','U1E','L1E','Mo','B','D','L1A','Pog\'','Go','Gn'],
    linesArray: (markerPoints) => {
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
        group: 'Skelletal Relationship',
        arrayIndicatorValue: [
          {
            indicator: "SNA",
            normName: "SNA",
            markerArray: ["S","N","A"],
            valueFn: (pointS,pointN,pointA) => calculateAngleFromThreePoint(pointS,pointN,pointA,false),
            highLightFn: (pointS,pointN,pointA) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointS,pointN]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointA,pointN]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointS,pointN]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointB,pointN]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointA,pointN]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointB,pointN]
                }
              ]
            },
            unit: "deg"
          },
          {
            indicator: "Mandible (S-N vs Go-Gn)",
            normName: "MANDIBLE_STEINER",
            markerArray: ["N","S","Gn","Go"],
            valueFn: (pointN,pointS,pointGn,pointGo) => calculateAngleFromFourPoint(pointN,pointS,pointGn,pointGo,false),
            highLightFn: (pointN,pointS,pointGn,pointGo) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,intersectPoint(pointN,pointS,pointGn,pointGo)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointGn,intersectPoint(pointN,pointS,pointGn,pointGo)]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointS,pointN]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointD,pointN]
                }
              ]
            },
            unit: "deg"
          }
        ]
      },
      {
        group: 'Dental to skeletal relationship',
        arrayIndicatorValue: [
          {
            indicator: "U1E->NA",
            normName: "U1ENA",
            markerArray: ["U1E","N","A","C1","C2"],
            valueFn: (pointU1E,pointN,pointA,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointU1E,pointN,pointA,pointC1,pointC2,lengthOfRuler),
            highLightFn: (pointU1E,pointN,pointA) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,projectPointOntoLine(pointU1E,pointN,pointA)]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointU1E,projectPointOntoLine(pointU1E,pointN,pointA)]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,intersectPoint(pointN,pointA,pointU1E,pointU1A)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointU1E,intersectPoint(pointN,pointA,pointU1E,pointU1A)]
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
                  color: COLOR_HIGHLIGHT,
                  line:  [pointN,projectPointOntoLine(pointL1E,pointN,pointB)]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointL1E,projectPointOntoLine(pointL1E,pointN,pointB)]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,intersectPoint(pointL1E,pointL1A,pointN,pointB)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointL1A,intersectPoint(pointL1E,pointL1A,pointN,pointB)]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,intersectPoint(pointN,pointS,pointU1E,pointMo)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointU1E,intersectPoint(pointN,pointS,pointU1E,pointMo)]
                }
              ]
            },
            unit: "deg"
          }
        ]
      },
      {
        group: 'Dental relationship',
        arrayIndicatorValue: [
          {
            indicator: "Inter-incisal",
            normName: "INTERINCISAL",
            markerArray: ["L1A","L1E","U1A","U1E"],
            highLightFn: (pointL1A,pointL1E,pointU1A,pointU1E) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointL1A,intersectPoint(pointL1A,pointL1E,pointU1A,pointU1E)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointU1A,intersectPoint(pointL1A,pointL1E,pointU1A,pointU1E)]
                }
              ]
            },
            valueFn: (pointL1A,pointL1E,pointU1A,pointU1E) => calculateAngleFromFourPoint(pointL1A,pointL1E,pointU1A,pointU1E),
            unit: "deg"
          }
        ]
      },
      {
        group: 'Soft Tissue',
        arrayIndicatorValue: [
          {
            indicator: "Ls->S-line",
            normName: "LS_TO_SLINE",
            markerArray: ["Ls","Cm","Pog'","C1","C2"],
            valueFn: (pointLs,pointCm,pointPo_g,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointLs,pointCm,pointPo_g,pointC1,pointC2,lengthOfRuler),
            highLightFn: (pointLs,pointCm,pointPo_g) => {
              return [
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointLs,projectPointOntoLine(pointLs,pointCm,pointPo_g)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointCm,pointPo_g] 
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
                  color: COLOR_RESULT_LINE,
                  line: [pointLi,projectPointOntoLine(pointLi,pointCm,pointPo_g)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointCm,pointPo_g] 
                }
              ]
            },
            unit:"mm"
          }
        ]
      }
    ]
  },
  NAGASAKI: {
    name: "Nagasaki",
    markerPoints: ['C1','C2','S','N','A','U1A','U1E','L1E','Mo','B','L1A','Go','Me'],
    linesArray: (markerPoints) => { 
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
        group: 'Skelletal Relationship',
        arrayIndicatorValue: [
          {
            indicator: "SNA",
            normName: "SNA",
            markerArray: ["S","N","A"],
            valueFn: (pointS,pointN,pointA) => calculateAngleFromThreePoint(pointS,pointN,pointA,false),
            highLightFn: (pointS,pointN,pointA) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointS,pointN]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointA,pointN]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointS,pointN]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointB,pointN]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointA,pointN]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointB,pointN]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,intersectPoint(pointN,pointS,pointMe,pointGo)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointMe,intersectPoint(pointN,pointS,pointMe,pointGo)]
                }
              ]
            },
            unit: "deg"
          }
        ]
      },
      {
        group: 'Dental to skeletal relationship',
        arrayIndicatorValue: [
          {
            indicator: "L1E->NA",
            normName: "L1ENA",
            markerArray: ["L1E","N","A","C1","C2"],
            valueFn: (pointL1E,pointN,pointA,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointL1E,pointN,pointA,pointC1,pointC2,lengthOfRuler),
            highLightFn: (pointL1E,pointN,pointA) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,projectPointOntoLine(pointL1E,pointN,pointA)]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointL1E,projectPointOntoLine(pointL1E,pointN,pointA)]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointU1E,intersectPoint(pointN,pointS,pointU1E,pointU1A)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,pointS]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointL1E,intersectPoint(pointL1E,pointL1A,pointGo,pointMe)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointGo,pointMe]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointA,projectPointOntoLine(pointA,pointMo,pointU1E)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointB,projectPointOntoLine(pointB,pointMo,pointU1E)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointMo,pointU1E]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [projectPointOntoLine(pointA,pointMo,pointU1E),projectPointOntoLine(pointB,pointMo,pointU1E)]
                }
              ]
            },
            unit: "mm"
          }
        ]
      },
      {
        group: 'Dental relationship',
        arrayIndicatorValue: [
          {
            indicator: "Inter-incisal",
            normName: "INTERINCISAL",
            markerArray: ["L1A","L1E","U1A","U1E"],
            valueFn: (pointL1A,pointL1E,pointU1A,pointU1E) => calculateAngleFromFourPoint(pointL1A,pointL1E,pointU1A,pointU1E),
            highLightFn: (pointL1A,pointL1E,pointU1A,pointU1E) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointL1A,intersectPoint(pointL1A,pointL1E,pointU1A,pointU1E)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointU1A,intersectPoint(pointL1A,pointL1E,pointU1A,pointU1E)]
                }
              ]
            },
            unit: "deg"
          }
        ]
      },
    ]
  },
  RICKETTS: {
    name: "Ricketts",
    markerPoints: ['C1','C2','N','Po','Pt','Or','DC','R1','R2','R3','R4','Ba','PNS','Go','Gn','Pog','Pm','L1A','Pog\'','Li','Ls','Prn','ANS','A','U1A','Mx6D','Md6O','Mo','PreM','L1E','U1E'],
    linesArray: (markerPoints) => {
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
        group: 'Skelletal Relationship',
        arrayIndicatorValue: [
          {
            indicator: "Facial Depth",
            normName: "FACIAL_DEPTH",
            markerArray: ["Po","Or","N","Pog"],
            valueFn: (pointPo,pointOr,pointN,pointPog) => calculateAngleFromFourPoint(pointPo,pointOr,pointN,pointPog,true),
            highLightFn: (pointPo,pointOr,pointN,pointPog) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,pointPog]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointPo,intersectPoint(pointPo,pointOr,pointN,pointPog)]
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,pointPog]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointA,projectPointOntoLine(pointA,pointN,pointPog)]
                }
              ]
            },
            unit: "mm"
          },
          {
            indicator: "Palatal plane to FH",
            normName: "PALATAL_FH",
            markerArray: ["Po","Or","PNS","ANS"],
            valueFn: (pointPo,pointOr,pointPNS,pointANS) => calculateAngleFromFourPoint(pointPo,pointOr,pointPNS,pointANS),
            highLightFn: (pointPo,pointOr,pointPNS,pointANS) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointOr,intersectPoint(pointPo,pointOr,pointPNS,pointANS)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointANS,intersectPoint(pointPo,pointOr,pointPNS,pointANS)]
                }
              ]
            },
            unit: "deg"
          }
        ]
      },
      {
        group: 'Face Typology',
        arrayIndicatorValue: [
          {
            indicator: "Facial Taper",
            normName: "FACIAL_TAPER",
            markerArray: ["N","Pog","Go","Gn"],
            valueFn: (pointN,pointPog,pointGo,pointGn) => calculateAngleFromFourPoint(pointN,pointPog,pointGo,pointGn,true),
            highLightFn: (pointN,pointPog,pointGo,pointGn) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointN,intersectPoint(pointN,pointPog,pointGo,pointGn)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointGo,intersectPoint(pointN,pointPog,pointGo,pointGn)]
                }
              ]
            },
            unit: "deg"
          }
        ]
      },
      {
        group: 'Mandible Growth Direction',
        arrayIndicatorValue: [
          {
            indicator: "Facial Axis",
            normName: "FACIAL_AXIS",
            markerArray: ["Ba","N","Gn","Pt"],
            valueFn: (pointBa,pointN,pointGn,pointPt) => calculateAngleFromFourPoint(pointBa,pointN,pointGn,pointPt,true),
            highLightFn: (pointBa,pointN,pointGn,pointPt) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointBa,pointN]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointGn,intersectPoint(pointBa,pointN,pointGn,pointPt)]
                }
              ]
            },
            unit: "deg"
          },
          {
            indicator: "Lower facial height",
            normName: "LOWER_FACIAL_HEIGHT",
            markerArray: ["R1","R2","R3","R4","ANS","Pm"],
            valueFn: (pointR1,pointR2,pointR3,pointR4,pointANS,pointPm) => calculateAngleFromThreePoint(pointANS,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4),pointPm,false),
            highLightFn: (pointR1,pointR2,pointR3,pointR4,pointANS,pointPm) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: cạnh trên cùng của hình chữ nhật tạo bởi 4 điểm 
                   */
                  line: [
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
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: cạnh bên trái của hình chữ nhật tạo bởi 4 điểm 
                   */
                  line: [
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
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: cạnh bên phải của hình chữ nhật tạo bởi 4 điểm
                   */
                  line: [
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
                },
                {
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: cạnh dưới cùng của hình chữ nhật tạo bởi 4 điểm
                   */
                  line: [
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
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: đường chéo thứ nhất của hình chữ nhật
                   */
                  line: [
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
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: đường chéo thứ hai của hình chữ nhật
                   */
                  line: [
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointANS,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointPm,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4)] 
                }
              ]
            },
            unit: "deg"
          }
        ]
      },
      {
        group: 'Mandible Shape',
        arrayIndicatorValue: [
          {
            indicator: "Mandibular Arc",
            normName: "MANDIBULAR_ARC",
            markerArray: ["R1","R2","R3","R4","DC","Pm"],
            valueFn: (pointR1,pointR2,pointR3,pointR4,pointDC,pointPm) => calculateAngleFromThreePoint(pointDC,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4),pointPm),
            highLightFn: (pointR1,pointR2,pointR3,pointR4,pointDC,pointPm) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: cạnh trên cùng của hình chữ nhật tạo bởi 4 điểm 
                   */
                  line: [
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
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: cạnh bên trái của hình chữ nhật tạo bởi 4 điểm 
                   */
                  line: [
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
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: cạnh bên phải của hình chữ nhật tạo bởi 4 điểm
                   */
                  line: [
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
                },
                {
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: cạnh dưới cùng của hình chữ nhật tạo bởi 4 điểm
                   */
                  line: [
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
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: đường chéo thứ nhất của hình chữ nhật
                   */
                  line: [
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
                  color: COLOR_HIGHLIGHT,
                  /**
                   * todo: đường chéo thứ hai của hình chữ nhật
                   */
                  line: [
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
                  color: COLOR_HIGHLIGHT,
                  line: [pointDC,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointPm,intersectPointDiagonalLineOfRectangle(pointR1,pointR2,pointR3,pointR4)] 
                }
              ]
            },
            unit: "deg"
          }
        ]
      },
      {
        group: 'Dental to skeletal relationship',
        arrayIndicatorValue: [
          {
            indicator: "Upper incisor to A-Pog",
            normName: "U1EAPOG",
            markerArray: ["U1E","A","Pog","C1","C2"],
            valueFn: (pointU1E,pointA,pointPog,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointU1E,pointA,pointPog,pointC1,pointC2,lengthOfRuler),
            highLightFn: (pointU1E,pointA,pointPog) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointA,pointPog]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointU1E,projectPointOntoLine(pointU1E,pointA,pointPog)]
                }
              ]
            },
            unit: "mm"
          },
          {
            indicator: "Lower incisor to A-Pog",
            normName: "L1EAPOG",
            markerArray: ["L1E","A","Pog","C1","C2"],
            valueFn: (pointL1E,pointA,pointPog,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointL1E,pointA,pointPog,pointC1,pointC2,lengthOfRuler),
            highLightFn: (pointL1E,pointA,pointPog) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointA,pointPog]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointL1E,projectPointOntoLine(pointL1E,pointA,pointPog)]
                }
              ]
            },
            unit: "mm"
          },
          {
            indicator: "U6 -> Ptv",
            normName: "U6PTV",
            markerArray: ["Po","Pt","Or","Mx6D","Mo","PreM","C1","C2"],
            valueFn: (pointPo,pointPt,pointOr,pointMx6D,pointMo,pointPreM,pointC1,pointC2,lengthOfRuler) => distanceFromTwoPoint(pointMx6D,intersectPoint(pointPt,projectPointOntoLine(pointPt,pointPo,pointOr),pointMx6D,intersectPointOfParallel(pointMx6D,pointMo,pointPreM)),pointC1,pointC2,lengthOfRuler),
            highLightFn: (pointPo,pointPt,pointOr,pointMx6D,pointMo,pointPreM) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointPo,pointOr]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointMo,pointPreM]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointPt,intersectPoint(pointPt,projectPointOntoLine(pointPt,pointPo,pointOr),pointMx6D,intersectPointOfParallel(pointMx6D,pointMo,pointPreM))]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointMx6D,intersectPoint(pointPt,projectPointOntoLine(pointPt,pointPo,pointOr),pointMx6D,intersectPointOfParallel(pointMx6D,pointMo,pointPreM))]
                }
              ]
            },
            unit: "mm"
          },
          {
            indicator: "Upper Incisor Inclination to A-Pog",
            normName: "U1APOG",
            markerArray: ["A","Pog'","U1A","U1E"],
            valueFn: (pointA,point_Pog,pointU1A,pointU1E) => calculateAngleFromFourPoint(pointA,point_Pog,pointU1A,pointU1E),
            highLightFn: (pointA,point_Pog,pointU1A,pointU1E) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointA,point_Pog]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointU1A,pointU1E]
                }
              ]
            },
            unit: "deg"
          },
          {
            indicator: "Lower Incisor Inclination to FH",
            normName: "L1APOG",
            markerArray: ["L1E","L1A","Po","Or"],
            valueFn: (pointL1E,pointL1A,pointPo,pointOr) => calculateAngleFromFourPoint(pointL1E,pointL1A,pointPo,pointOr,true),
            highLightFn: (pointL1E,pointL1A,pointPo,pointOr) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointL1A,intersectPoint(pointL1E,pointL1A,pointPo,pointOr)]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointPo,intersectPoint(pointL1E,pointL1A,pointPo,pointOr)]
                }
              ]
            },
            unit: "deg"
          }
        ]
      },
      {
        group: 'Dental relationship',
        arrayIndicatorValue: [
          {
            indicator: "Inter-incisal",
            normName: "INTERINCISAL",
            markerArray: ["U1A","U1E","L1A","L1E"],
            valueFn: (pointU1A,pointU1E,pointL1A,pointL1E) => calculateAngleFromFourPoint(pointU1A,pointU1E,pointL1A,pointL1E,false),
            highLightFn: (pointU1A,pointU1E,pointL1A,pointL1E) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line:[pointU1A,pointU1E]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointL1A,intersectPoint(pointU1A,pointU1E,pointL1A,pointL1E)]
                }
              ]
            },
            unit: "deg"
          },
          {
            indicator: "Molar Relationship",
            normName: "MOLAR_REL",
            markerArray: ["Mx6D","Md6O","Mo","PreM","C1","C2"],
            valueFn: (pointMx6D,pointMd6O,pointMo,pointPreM,pointC1,pointC2,lengthOfRuler) => distanceFromTwoPoint(pointMd6O,intersectPoint(pointMx6D,projectPointOntoLine(pointMx6D,pointMo,pointPreM),pointMd6O,intersectPointOfParallel(pointMd6O,pointMo,pointPreM)),pointC1,pointC2,lengthOfRuler),
            highLightFn: (pointMx6D,pointMd6O,pointMo,pointPreM) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointMo,pointPreM]
                },
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointMx6D,intersectPoint(pointMx6D,projectPointOntoLine(pointMx6D,pointMo,pointPreM),pointMd6O,intersectPointOfParallel(pointMd6O,pointMo,pointPreM))]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointMd6O,intersectPoint(pointMx6D,projectPointOntoLine(pointMx6D,pointMo,pointPreM),pointMd6O,intersectPointOfParallel(pointMd6O,pointMo,pointPreM))]
                }
              ]
            },
            unit: "mm"
          }
        ]
      },
      {
        group: 'Soft Tissue',
        arrayIndicatorValue: [
          {
            indicator: "Upper Lip to E Plane",
            normName: "LS_EPLANE",
            markerArray: ["Prn","Pog'","Ls","C1","C2"],
            valueFn: (pointPrn,point_Pog,pointLs,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointLs,pointPrn,point_Pog,pointC1,pointC2,lengthOfRuler),
            highLightFn: (pointPrn,point_Pog,pointLs) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointPrn,point_Pog]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointLs,projectPointOntoLine(pointLs,pointPrn,point_Pog)]
                }
              ]
            },
            unit: "mm"
          },
          {
            indicator: "Lower Lip to E Plane",
            normName: "LI_EPLANE",
            markerArray: ["Prn","Pog'","Li","C1","C2"],
            valueFn: (pointPrn,point_Pog,pointLi,pointC1,pointC2,lengthOfRuler) => distanceFromPointToLine(pointLi,pointPrn,point_Pog,pointC1,pointC2,lengthOfRuler),
            highLightFn: (pointPrn,point_Pog,pointLi) => {
              return [
                {
                  color: COLOR_HIGHLIGHT,
                  line: [pointPrn,point_Pog]
                },
                {
                  color: COLOR_RESULT_LINE,
                  line: [pointLi,projectPointOntoLine(pointLi,pointPrn,point_Pog)]
                }
              ]
            },
            unit: "mm"
          }
        ]
      }
    ]
  }
}

/**
 * todo: tính góc giữa vector AB và CD
 * @param {*} pointA điểm A
 * @param {*} pointB điểm B
 * @param {*} pointC điểm C
 * @param {*} pointD điểm D
 * @param {*} reverse xác định có phải là góc bù của giá trị cần tìm không
 * @returns góc tạo bởi vector AB và CD || trả về null nếu thiếu điểm
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
 * @returns góc tạo bởi 3 điểm || trả về null nếu thiếu điểm
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
 * @returns khoảng cách từ pointA đến đường thẳng đi qua pointB và pointC || trả về null nếu thiếu điểm
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
 * @returns tọa độ của chân đường vuông góc || trả về null nếu thiếu điểm
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
 * todo: khoảng cách giữa 2 điểm dựa vào khoảng cách thực tế được cung cấp bởi độ dài C1, C2 và độ dài thước đo lengthOfRuler
 * @param {*} pointA tọa độ điểm A
 * @param {*} pointB tọa độ điểm B
 * @returns khoảng cách giữa A và B theo giá trị thực tế và làm tròn 2 chữ số sau dấu phẩy || trả về null nếu thiếu điểm
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
 * @returns khoảng cách giữa 2 điểm đầu thước C1 và C2 || trả về null nếu thiếu điểm
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
 * @returns tọa độ của giao điểm 2 đường thằng p1-p2 và p3-p4 theo format {x,y} || trả về null nếu thiếu điểm
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
 * todo: tính tọa độ của giao điểm của 2 đường chéo hình chữ nhật tạo bởi đường thẳng song song đi qua 4 điểm R1, R2, R3, R4 
 * @param {*} pointR1 điểm thuộc cạnh hình chữ nhật
 * @param {*} pointR2 điểm thuộc cạnh hình chữ nhật
 * @param {*} pointR3 điểm thuộc cạnh hình chữ nhật
 * @param {*} pointR4 điểm thuộc cạnh hình chữ nhật
 * @returns tọa độ giao điểm của 2 đường chéo hình chữ nhật || trả về null nếu thiếu điểm
 */
export const intersectPointDiagonalLineOfRectangle = (pointR1,pointR2,pointR3,pointR4) => {
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

/**
 * todo: Tọa độ 1 điểm bất kỳ nằm trên đường thẳng đi qua điểm P và song song với đường thẳng MN
 * @param {*} pointP điểm mà đường thẳng song song đi qua
 * @param {*} pointM điểm đầu đường thẳng song song
 * @param {*} pointN điểm cuối đường thẳng song song
 * @returns tọa độ điểm thuộc đường thẳng song song || trả về null nếu thiếu điểm
 */
export const intersectPointOfParallel = (pointP,pointM,pointN) => {
  if(!pointP || !pointM || !pointN) return null;

  const vectorMN = { x: pointN.x - pointM.x, y: pointN.y - pointM.y };

  const distanceFactor = (pointP.x - pointM.x) / vectorMN.x;

  return {
    x: pointP.x - distanceFactor * vectorMN.x,
    y: pointP.y - distanceFactor * vectorMN.y,
  }
}




