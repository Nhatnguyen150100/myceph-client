import { point2PointDistance } from "../lateralCephalometricAnalysis/LateralCephalometricUtility.jsx";
import { midPointOfLineSegment } from "./CalculatorToothUtility.jsx";

export const ORBITAL_CURVE = {
  id: 1,
  name: 'Orbital Curve',
  toolTipWidth: 85,
  markerPoints: {
    sOr: {
      name: 'Superior Orbital',
      isShow: true
    },
    Or: {
      name: 'Orbitale',
      isShow: true
    },
    OrR: {
      name: 'OrR',
      isShow: false
    }
  },
  allPointsCurve: [
    'sOr',
    'Or',
    'OrR'
  ],
  lines: [],
  multiCurves: [
    {
      key: 'ORBITAL_CURVE_SUB_CURVE_1',
      controlPoints: {
        startPoint: 'sOr',
        endPoint: 'Or',
        controlPoint1: {
          name: 'sOr_TO_Or_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['sOr_TO_Or_P1'];
            const startPoint = markerPoints['sOr'];
            const endPoint = markerPoints['Or'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x - point2PointDistance(startPoint,endPoint)/7,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/1.9
            }
          }
        },
        controlPoint2: {
          name: 'sOr_TO_Or_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['sOr_TO_Or_P2'];
            const startPoint = markerPoints['sOr'];
            const endPoint = markerPoints['Or'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x - point2PointDistance(startPoint,endPoint)/8,
              y: endPoint.y + point2PointDistance(startPoint,endPoint)/18
            }
          }
        } 
      }
    },
    {
      key: 'ORBITAL_CURVE_SUB_CURVE_2',
      controlPoints: {
        startPoint: 'Or',
        endPoint: 'OrR',
        controlPoint1: {
          name: 'Or_TO_OrR_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Or_TO_OrR_P1'];
            const startPoint = markerPoints['Or'];
            const endPoint = markerPoints['OrR'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x + point2PointDistance(startPoint,endPoint)/15,
              y: startPoint.y - point2PointDistance(startPoint,endPoint)/15
            }
          }
        },
        controlPoint2: {
          name: 'Or_TO_OrR_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Or_TO_OrR_P2'];
            const startPoint = markerPoints['Or'];
            const endPoint = markerPoints['OrR'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x + point2PointDistance(startPoint,endPoint)/20,
              y: endPoint.y + point2PointDistance(startPoint,endPoint)/2
            }
          }
        } 
      }
    }
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(ORBITAL_CURVE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(ORBITAL_CURVE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point]?.y)
    })
  
    const minPointOfHeightShape = {
      x: Math.min(...pointArrayX) - 5,
      y: Math.min(...pointArrayY)
    }
    
    const maxPointOfHeightShape = {
      x: Math.min(...pointArrayX) - 5,
      y: Math.max(...pointArrayY)
    }
    
    return {
      pointStart: minPointOfHeightShape,
      pointEnd: maxPointOfHeightShape
    }
  },
  widthOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(ORBITAL_CURVE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(ORBITAL_CURVE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point].y)
    })
  
    const minPointOfWidthShape = {
      x: Math.min(...pointArrayX),
      y: Math.max(...pointArrayY) + 5
    }
    
    const maxPointOfWidthShape = {
      x: Math.max(...pointArrayX),
      y: Math.max(...pointArrayY) + 5
    }

    return {
      pointStart: minPointOfWidthShape,
      pointEnd: maxPointOfWidthShape
    }
  }
}

export const CRANIAL_BASE = {
  id: 2,
  name: 'Cranial Base',
  toolTipWidth: 56,
  markerPoints: {
    aC: {
      name: 'Anterior Cranial base',
      isShow: true
    },
    aS: {
      name: 'Anterior border of Sella Turcica',
      isShow: true
    },
    pS: {
      name: 'Posterior border of Sella Turcica',
      isShow: true
    },
    Ba: {
      name: 'Basion',
      isShow: true
    }
  },
  allPointsCurve: [
    'aC',
    'aS',
    'pS',
    'Ba'
  ],
  lines: [],
  multiCurves: [
    {
      key: 'CRANIAL_BASE_SUB_CURVE_1',
      controlPoints: {
        startPoint: 'aC',
        endPoint: 'aS',
        controlPoint1: {
          name: 'aC_TO_aS_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['aC_TO_aS_P1'];
            const startPoint = markerPoints['aC'];
            const endPoint = markerPoints['aS'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x - point2PointDistance(startPoint,endPoint)/6,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/3
            }
          }
        },
        controlPoint2: {
          name: 'aC_TO_aS_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['aC_TO_aS_P2'];
            const startPoint = markerPoints['aC'];
            const endPoint = markerPoints['aS'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x + point2PointDistance(startPoint,endPoint)/8,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/18
            }
          }
        } 
      }
    },
    {
      key: 'CRANIAL_BASE_SUB_CURVE_2',
      controlPoints: {
        startPoint: 'aS',
        endPoint: 'pS',
        controlPoint1: {
          name: 'aS_TO_pS_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['aS_TO_pS_P1'];
            const startPoint = markerPoints['aS'];
            const endPoint = markerPoints['pS'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x + point2PointDistance(startPoint,endPoint)/2,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)
            }
          }
        },
        controlPoint2: {
          name: 'aS_TO_pS_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['aS_TO_pS_P2'];
            const startPoint = markerPoints['aS'];
            const endPoint = markerPoints['pS'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x + point2PointDistance(startPoint,endPoint)/10,
              y: endPoint.y + point2PointDistance(startPoint,endPoint)*1.2
            }
          }
        } 
      }
    },
    {
      key: 'CRANIAL_BASE_SUB_CURVE_3',
      controlPoints: {
        startPoint: 'pS',
        endPoint: 'Ba',
        controlPoint1: {
          name: 'pS_TO_Ba_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['pS_TO_Ba_P1'];
            const startPoint = markerPoints['pS'];
            const endPoint = markerPoints['Ba'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x - point2PointDistance(startPoint,endPoint)/5,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/2
            }
          }
        },
        controlPoint2: {
          name: 'pS_TO_Ba_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['pS_TO_Ba_P2'];
            const startPoint = markerPoints['pS'];
            const endPoint = markerPoints['Ba'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x ,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/6
            }
          }
        } 
      }
    }
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(CRANIAL_BASE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(CRANIAL_BASE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point]?.y)
    })
  
    const minPointOfHeightShape = {
      x: Math.min(...pointArrayX) - 5,
      y: Math.min(...pointArrayY)
    }
    
    const maxPointOfHeightShape = {
      x: Math.min(...pointArrayX) - 5,
      y: Math.max(...pointArrayY)
    }
    
    return {
      pointStart: minPointOfHeightShape,
      pointEnd: maxPointOfHeightShape
    }
  },
  widthOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(CRANIAL_BASE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(CRANIAL_BASE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point].y)
    })
  
    const minPointOfWidthShape = {
      x: Math.min(...pointArrayX),
      y: Math.max(...pointArrayY) + 5
    }
    
    const maxPointOfWidthShape = {
      x: Math.max(...pointArrayX),
      y: Math.max(...pointArrayY) + 5
    }

    return {
      pointStart: minPointOfWidthShape,
      pointEnd: maxPointOfWidthShape
    }
  }
}

export const UPPER_SOFT_TISSUE = {
  id: 3,
  name: 'Upper soft tissue',
  toolTipWidth: 112,
  markerPoints: {
    O: {
      name: 'Superior Soft tissue Glabella',
      isShow: true
    },
    "G'": {
      name: 'Glabella',
      isShow: true
    },
    "N'": {
      name: 'Nasion soft tissue',
      isShow: true
    },
    Prn: {
      name: 'Pronasale',
      isShow: true
    },
    Sn: {
      name: 'Subnasale',
      isShow: true
    },
    Ls: {
      name: 'Labrale superius',
      isShow: true
    },
    Stms: {
      name: 'Stomion superius',
      isShow: true
    }
  },
  allPointsCurve: [
    'O',
    "G'",
    "N'",
    'Prn',
    'Sn',
    'Ls',
    'Stms'
  ],
  lines: [],
  multiCurves: [
    {
      key: 'UPPER_SOFT_TISSUE_SUB_CURVE_1',
      controlPoints: {
        startPoint: 'O',
        endPoint: "G'",
        controlPoint1: {
          name: 'O_TO_G\'_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['O_TO_G\'_P1'];
            const startPoint = markerPoints['O'];
            const endPoint = markerPoints["G'"];
  
            return controlPoint? controlPoint : {
              x: startPoint.x + point2PointDistance(startPoint,endPoint)/8,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/2.3
            }
          }
        },
        controlPoint2: {
          name: 'O_TO_G\'_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['O_TO_G\'_P2'];
            const startPoint = markerPoints['O'];
            const endPoint = markerPoints["G'"];
  
            return controlPoint? controlPoint : {
              x: endPoint.x,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/4
            }
          }
        } 
      }
    },
    {
      key: 'UPPER_SOFT_TISSUE_SUB_CURVE_2',
      controlPoints: {
        startPoint: "G'",
        endPoint: "N'",
        controlPoint1: {
          name: 'G\'_TO_N\'_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['G\'_TO_N\'_P1'];
            const startPoint = markerPoints["G'"];
            const endPoint = markerPoints["N'"];
  
            return controlPoint? controlPoint : {
              x: startPoint.x + point2PointDistance(startPoint,endPoint)/5,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/4
            }
          }
        },
        controlPoint2: {
          name: 'G\'_TO_N\'_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['G\'_TO_N\'_P2'];
            const startPoint = markerPoints["G'"];
            const endPoint = markerPoints["N'"];
  
            return controlPoint? controlPoint : {
              x: endPoint.x - point2PointDistance(startPoint,endPoint)/10,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/3
            }
          }
        } 
      }
    },
    {
      key: 'UPPER_SOFT_TISSUE_SUB_CURVE_3',
      controlPoints: {
        startPoint: "N'",
        endPoint: 'Prn',
        controlPoint1: {
          name: 'N\'_TO_Prn_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['N\'_TO_Prn_P1'];
            const startPoint = markerPoints["N'"];
            const endPoint = markerPoints['Prn'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x + point2PointDistance(startPoint,endPoint)/2.3,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/1.2
            }
          }
        },
        controlPoint2: {
          name: 'N\'_TO_Prn_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['N\'_TO_Prn_P2'];
            const startPoint = markerPoints["N'"];
            const endPoint = markerPoints['Prn'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/5
            }
          }
        } 
      }
    },
    {
      key: 'UPPER_SOFT_TISSUE_SUB_CURVE_4',
      controlPoints: {
        startPoint: "Prn",
        endPoint: 'Sn',
        controlPoint1: {
          name: 'Prn_TO_Sn_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Prn_TO_Sn_P1'];
            const startPoint = markerPoints['Prn'];
            const endPoint = markerPoints['Sn'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x - point2PointDistance(startPoint,endPoint)/6,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)
            }
          }
        },
        controlPoint2: {
          name: 'Prn_TO_Sn_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Prn_TO_Sn_P2'];
            const startPoint = markerPoints["Prn"];
            const endPoint = markerPoints['Sn'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x + point2PointDistance(startPoint,endPoint)/13,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/10
            }
          }
        } 
      }
    },
    {
      key: 'UPPER_SOFT_TISSUE_SUB_CURVE_5',
      controlPoints: {
        startPoint: "Sn",
        endPoint: 'Ls',
        controlPoint1: {
          name: 'Sn_TO_Ls_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Sn_TO_Ls_P1'];
            const startPoint = markerPoints['Sn'];
            const endPoint = markerPoints['Ls'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x - point2PointDistance(startPoint,endPoint)/8,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/6
            }
          }
        },
        controlPoint2: {
          name: 'Sn_TO_Ls_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Sn_TO_Ls_P2'];
            const startPoint = markerPoints["Sn"];
            const endPoint = markerPoints['Ls'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x - point2PointDistance(startPoint,endPoint)/6,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/2.5
            }
          }
        } 
      }
    },
    {
      key: 'UPPER_SOFT_TISSUE_SUB_CURVE_6',
      controlPoints: {
        startPoint: "Ls",
        endPoint: 'Stms',
        controlPoint1: {
          name: 'Ls_TO_Stms_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Ls_TO_Stms_P1'];
            const startPoint = markerPoints['Ls'];
            const endPoint = markerPoints['Stms'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/3
            }
          }
        },
        controlPoint2: {
          name: 'Ls_TO_Stms_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Ls_TO_Stms_P2'];
            const startPoint = markerPoints["Ls"];
            const endPoint = markerPoints['Stms'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x + point2PointDistance(startPoint,endPoint)/4,
              y: endPoint.y
            }
          }
        } 
      }
    }
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(UPPER_SOFT_TISSUE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(UPPER_SOFT_TISSUE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point]?.y)
    })
  
    const minPointOfHeightShape = {
      x: Math.min(...pointArrayX) - 5,
      y: Math.min(...pointArrayY)
    }
    
    const maxPointOfHeightShape = {
      x: Math.min(...pointArrayX) - 5,
      y: Math.max(...pointArrayY)
    }
    
    return {
      pointStart: minPointOfHeightShape,
      pointEnd: maxPointOfHeightShape
    }
  },
  widthOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(UPPER_SOFT_TISSUE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(UPPER_SOFT_TISSUE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point].y)
    })
  
    const minPointOfWidthShape = {
      x: Math.min(...pointArrayX),
      y: Math.max(...pointArrayY) + 5
    }
    
    const maxPointOfWidthShape = {
      x: Math.max(...pointArrayX),
      y: Math.max(...pointArrayY) + 5
    }

    return {
      pointStart: minPointOfWidthShape,
      pointEnd: maxPointOfWidthShape
    }
  }
}

export const LOWER_SOFT_TISSUE = {
  id: 4,
  name: 'Lower soft tissue',
  toolTipWidth: 116,
  markerPoints: {
    Stmi: {
      name: 'Stomion inferius',
      isShow: true
    },
    Li: {
      name: 'Labrale inferius',
      isShow: true
    },
    Sm: {
      name: 'Supamentale',
      isShow: true
    },
    "Pog'": {
      name: 'Pogonion soft tissue',
      isShow: true
    },
    "Me'": {
      name: 'Menton soft tissue',
      isShow: true
    },
    C: {
      name: 'Cevical point',
      isShow: true
    }
  },
  allPointsCurve: [
    'Stmi',
    'Li',
    'Sm',
    "Pog'",
    "Me'",
    'C'
  ],
  lines: [],
  multiCurves: [
    {
      key: 'LOWER_SOFT_TISSUE_SUB_CURVE_1',
      controlPoints: {
        startPoint: 'Stmi',
        endPoint: "Li",
        controlPoint1: {
          name: 'Stmi_TO_Li_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Stmi_TO_Li_P1'];
            const startPoint = markerPoints['Stmi'];
            const endPoint = markerPoints["Li"];
  
            return controlPoint? controlPoint : {
              x: startPoint.x + point2PointDistance(startPoint,endPoint)/2.2,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/8
            }
          }
        },
        controlPoint2: {
          name: 'Stmi_TO_Li_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Stmi_TO_Li_P2'];
            const startPoint = markerPoints['Stmi'];
            const endPoint = markerPoints["Li"];
  
            return controlPoint? controlPoint : {
              x: endPoint.x,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/4
            }
          }
        } 
      }
    },
    {
      key: 'LOWER_SOFT_TISSUE_SUB_CURVE_2',
      controlPoints: {
        startPoint: 'Li',
        endPoint: "Sm",
        controlPoint1: {
          name: 'Li_TO_Sm_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Li_TO_Sm_P1'];
            const startPoint = markerPoints["Li"];
            const endPoint = markerPoints["Sm"];
  
            return controlPoint? controlPoint : {
              x: startPoint.x - point2PointDistance(startPoint,endPoint)/5,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/1.2
            }
          }
        },
        controlPoint2: {
          name: 'Li_TO_Sm_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Li_TO_Sm_P2'];
            const startPoint = markerPoints["Li"];
            const endPoint = markerPoints["Sm"];
  
            return controlPoint? controlPoint : {
              x: endPoint.x + point2PointDistance(startPoint,endPoint)/5,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/1.2
            }
          }
        } 
      }
    },
    {
      key: 'LOWER_SOFT_TISSUE_SUB_CURVE_3',
      controlPoints: {
        startPoint: "Sm",
        endPoint: "Pog'",
        controlPoint1: {
          name: 'Sm_TO_Pog\'_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Sm_TO_Pog\'_P1'];
            const startPoint = markerPoints["Sm"];
            const endPoint = markerPoints["Pog'"];
  
            return controlPoint? controlPoint : {
              x: startPoint.x - point2PointDistance(startPoint,endPoint)/8,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/5
            }
          }
        },
        controlPoint2: {
          name: 'Sm_TO_Pog\'_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Sm_TO_Pog\'_P2'];
            const startPoint = markerPoints["Sm"];
            const endPoint = markerPoints["Pog'"];
  
            return controlPoint? controlPoint : {
              x: endPoint.x,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/1.3
            }
          }
        } 
      }
    },
    {
      key: 'LOWER_SOFT_TISSUE_SUB_CURVE_4',
      controlPoints: {
        startPoint: "Pog'",
        endPoint: "Me'",
        controlPoint1: {
          name: 'Pog\'_TO_Me\'_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Pog\'_TO_Me\'_P1'];
            const startPoint = markerPoints["Pog'"];
            const endPoint = markerPoints["Me'"];
  
            return controlPoint? controlPoint : {
              x: startPoint.x,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/5
            }
          }
        },
        controlPoint2: {
          name: 'Pog\'_TO_Me\'_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Pog\'_TO_Me\'_P2'];
            const startPoint = markerPoints["Pog'"];
            const endPoint = markerPoints["Me'"];
  
            return controlPoint? controlPoint : {
              x: endPoint.x + point2PointDistance(startPoint,endPoint)/2.7,
              y: endPoint.y
            }
          }
        } 
      }
    },
    {
      key: 'LOWER_SOFT_TISSUE_SUB_CURVE_5',
      controlPoints: {
        startPoint: "Me'",
        endPoint: 'C',
        controlPoint1: {
          name: 'Me\'_TO_C_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Me\'_TO_C_P1'];
            const startPoint = markerPoints["Me'"];
            const endPoint = markerPoints['C'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x - point2PointDistance(startPoint,endPoint)/1.3,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/6
            }
          }
        },
        controlPoint2: {
          name: 'Me\'_TO_C_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Me\'_TO_C_P2'];
            const startPoint = markerPoints["Me'"];
            const endPoint = markerPoints['C'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x + point2PointDistance(startPoint,endPoint)/16,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/16
            }
          }
        } 
      }
    }
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(LOWER_SOFT_TISSUE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(LOWER_SOFT_TISSUE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point]?.y)
    })
  
    const minPointOfHeightShape = {
      x: Math.min(...pointArrayX) - 5,
      y: Math.min(...pointArrayY)
    }
    
    const maxPointOfHeightShape = {
      x: Math.min(...pointArrayX) - 5,
      y: Math.max(...pointArrayY)
    }
    
    return {
      pointStart: minPointOfHeightShape,
      pointEnd: maxPointOfHeightShape
    }
  },
  widthOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(LOWER_SOFT_TISSUE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(LOWER_SOFT_TISSUE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point].y)
    })
  
    const minPointOfWidthShape = {
      x: Math.min(...pointArrayX),
      y: Math.max(...pointArrayY) + 5
    }
    
    const maxPointOfWidthShape = {
      x: Math.max(...pointArrayX),
      y: Math.max(...pointArrayY) + 5
    }

    return {
      pointStart: minPointOfWidthShape,
      pointEnd: maxPointOfWidthShape
    }
  }
}

export const MANDIBULAR3 = {
  id: 5,
  name: 'mandibular 3',
  toolTipWidth: 110,
  markerPoints: {
    R1: {
      name: 'R1 point',
      isShow: true
    },
    Cp: {
      name: 'Coronoid precess',
      isShow: true
    },
    R3: { 
      name: 'R3 point',
      isShow: true
    },
    mGo: {
      name: 'Mid-Notch Gonion',
      isShow: true
    },
    GoN: {
      name: 'Gonial Notch',
      isShow: true
    },
    Me: {
      name: 'Menton',
      isShow: true
    }
  },
  allPointsCurve: [
    'R1',
    'Cp',
    'R3',
    "mGo",
    "GoN",
    'Me'
  ],
  lines: [],
  multiCurves: [
    {
      key: 'MANDIBULAR_3_SUB_CURVE_1',
      controlPoints: {
        startPoint: 'R1',
        endPoint: "Cp",
        controlPoint1: {
          name: 'R1_TO_Cp_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['R1_TO_Cp_P1'];
            const startPoint = markerPoints['R1'];
            const endPoint = markerPoints["Cp"];
  
            return controlPoint? controlPoint : {
              x: startPoint.x - point2PointDistance(startPoint,endPoint)/10,
              y: startPoint.y - point2PointDistance(startPoint,endPoint)/4
            }
          }
        },
        controlPoint2: {
          name: 'R1_TO_Cp_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['R1_TO_Cp_P2'];
            const startPoint = markerPoints['R1'];
            const endPoint = markerPoints["Cp"];
  
            return controlPoint? controlPoint : {
              x: endPoint.x + point2PointDistance(startPoint,endPoint)/4,
              y: endPoint.y + point2PointDistance(startPoint,endPoint)/10
            }
          }
        } 
      }
    },
    {
      key: 'MANDIBULAR_3_SUB_CURVE_2',
      controlPoints: {
        startPoint: 'Cp',
        endPoint: "R3",
        controlPoint1: {
          name: 'Cp_TO_R3_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Cp_TO_R3_P1'];
            const startPoint = markerPoints["Cp"];
            const endPoint = markerPoints["R3"];
  
            return controlPoint? controlPoint : {
              x: startPoint.x - point2PointDistance(startPoint,endPoint)/3.7,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/20
            }
          }
        },
        controlPoint2: {
          name: 'Cp_TO_R3_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['Cp_TO_R3_P2'];
            const startPoint = markerPoints["Cp"];
            const endPoint = markerPoints["R3"];
  
            return controlPoint? controlPoint : {
              x: endPoint.x + point2PointDistance(startPoint,endPoint)/1.4,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/6
            }
          }
        } 
      }
    },
    {
      key: 'MANDIBULAR_3_SUB_CURVE_3',
      controlPoints: {
        startPoint: "R3",
        endPoint: "mGo",
        controlPoint1: {
          name: 'R3_TO_mGo_P1',
          hide: true,
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['R3_TO_mGo_P1'];
            const startPoint = markerPoints["R3"];
            const endPoint = markerPoints["mGo"];
  
            return controlPoint? controlPoint : {
              x: midPointOfLineSegment(startPoint, endPoint).x,
              y: midPointOfLineSegment(startPoint, endPoint).y
            }
          }
        },
        controlPoint2: {
          name: 'R3_TO_mGo_P2',
          hide: true,
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['R3_TO_mGo_P2'];
            const startPoint = markerPoints["R3"];
            const endPoint = markerPoints["mGo"];
  
            return controlPoint? controlPoint : {
              x: midPointOfLineSegment(startPoint, endPoint).x,
              y: midPointOfLineSegment(startPoint, endPoint).y
            }
          }
        } 
      }
    },
    {
      key: 'MANDIBULAR_3_SUB_CURVE_4',
      controlPoints: {
        startPoint: "mGo",
        endPoint: "GoN",
        controlPoint1: {
          name: 'mGo_TO_GoN_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['mGo_TO_GoN_P1'];
            const startPoint = markerPoints["mGo"];
            const endPoint = markerPoints["GoN"];
  
            return controlPoint? controlPoint : {
              x: startPoint.x + point2PointDistance(startPoint,endPoint)/3,
              y: startPoint.y 
            }
          }
        },
        controlPoint2: {
          name: 'mGo_TO_GoN_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['mGo_TO_GoN_P2'];
            const startPoint = markerPoints["mGo"];
            const endPoint = markerPoints["GoN"];
  
            return controlPoint? controlPoint : {
              x: endPoint.x - point2PointDistance(startPoint,endPoint)/3,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/4
            }
          }
        } 
      }
    },
    {
      key: 'MANDIBULAR_3_SUB_CURVE_5',
      controlPoints: {
        startPoint: "GoN",
        endPoint: 'Me',
        controlPoint1: {
          name: 'GoN_TO_Me_P1',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['GoN_TO_Me_P1'];
            const startPoint = markerPoints["GoN"];
            const endPoint = markerPoints['Me'];
  
            return controlPoint? controlPoint : {
              x: startPoint.x + point2PointDistance(startPoint,endPoint)/6,
              y: startPoint.y + point2PointDistance(startPoint,endPoint)/15
            }
          }
        },
        controlPoint2: {
          name: 'GoN_TO_Me_P2',
          positionDefault: (markerPoints) => {
            const controlPoint = markerPoints['GoN_TO_Me_P2'];
            const startPoint = markerPoints["GoN"];
            const endPoint = markerPoints['Me'];
  
            return controlPoint? controlPoint : {
              x: endPoint.x - point2PointDistance(startPoint,endPoint)/1.5,
              y: endPoint.y - point2PointDistance(startPoint,endPoint)/16
            }
          }
        } 
      }
    }
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(MANDIBULAR3.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(MANDIBULAR3.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point]?.y)
    })
  
    const minPointOfHeightShape = {
      x: Math.min(...pointArrayX) - 5,
      y: Math.min(...pointArrayY)
    }
    
    const maxPointOfHeightShape = {
      x: Math.min(...pointArrayX) - 5,
      y: Math.max(...pointArrayY)
    }
    
    return {
      pointStart: minPointOfHeightShape,
      pointEnd: maxPointOfHeightShape
    }
  },
  widthOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(MANDIBULAR3.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(MANDIBULAR3.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point].y)
    })
  
    const minPointOfWidthShape = {
      x: Math.min(...pointArrayX),
      y: Math.max(...pointArrayY) + 5
    }
    
    const maxPointOfWidthShape = {
      x: Math.max(...pointArrayX),
      y: Math.max(...pointArrayY) + 5
    }

    return {
      pointStart: minPointOfWidthShape,
      pointEnd: maxPointOfWidthShape
    }
  }
}