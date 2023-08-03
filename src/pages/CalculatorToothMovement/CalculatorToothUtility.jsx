import { point2PointDistance } from "../lateralCephalometricAnalysis/LateralCephalometricUtility.jsx";

export const midPointOfLineSegment = (startPoint, endPoint) =>{
  return {
    x: (startPoint.x + endPoint.x) / 2,
    y: (startPoint.y + endPoint.y) / 2
  }
}

export const getModelCurve = (name) => {
  let model;
  switch(name){
    case 'maxillary': model = UPPER_JAW_BONE_CURVE;
      break;
    case 'upper incisor': model = UPPER_INCISOR_CURVE;
      break;
    case 'under incisor': model = UNDER_INCISOR_CURVE;
      break;
    case 'mandibular': model = MANDIBULAR;
      break;
    case 'upper molar': model = UPPER_MOLAR;
      break;
    case 'lower molar': model = LOWER_MOLAR;
      break;
    default: model = null
      break;
  }

  return model
}

export const checkAllPointsExist = (curveModel,markerPointList) => {
  let checkPoint = true;
  Object.keys(curveModel.markerPoints).forEach(point => {
    if(!markerPointList[point]) checkPoint = false;
  })
  return checkPoint
}

export const UPPER_JAW_BONE_CURVE = {
  id: 1,
  name: 'maxillary',
  markerPoints: {
    PNS: {
      name: 'Posterior Nasal Spine',
      isShow: true
    },
    TNS: {
      name: 'TNS',
      isShow: false
    },
    ANS: {
      name: 'Anterior Nasal Spine',
      isShow: true 
    },
    Pr: {
      name: 'Prosthion',
      isShow: true
    },
    UNS: {
      name: 'UNS',
      isShow: false
    }
  }, 
  lines: [],
  isDrag: true,
  allPointsCurve: ['PNS','TNS','ANS','Pr','UNS','PNS_TO_TNS_P1','PNS_TO_TNS_P2','TNS_TO_ANS_P1','TNS_TO_ANS_P2','ANS_TO_Pr_P1','ANS_TO_Pr_P2','Pr_TO_UNS_P1','Pr_TO_UNS_P2','UNS_TO_PNS_P1','UNS_TO_PNS_P2'],
  // các điểm điều khiển sẽ được tạo mặc định và không chính xác dựa trên các điểm bắt đầu và kết thúc có sẵn
  controlPoints: [
    {
      startPoint: 'PNS',
      endPoint: 'TNS',
      controlPoint1: {
        name: 'PNS_TO_TNS_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['PNS_TO_TNS_P1'];
          const startPoint = markerPoints['PNS'];
          const endPoint = markerPoints['TNS'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/7,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/7
          }
        }
      },
      controlPoint2: {
        name: 'PNS_TO_TNS_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['PNS_TO_TNS_P2'];
          const startPoint = markerPoints['PNS'];
          const endPoint = markerPoints['TNS'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/7,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/4
          }
        }
      } 
    },
    {
      startPoint: 'TNS',
      endPoint: 'ANS',
      controlPoint1: {
        name: 'TNS_TO_ANS_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['TNS_TO_ANS_P1'];
          const startPoint = markerPoints['TNS'];
          const endPoint = markerPoints['ANS'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/5,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/3
          }
        }
      },
      controlPoint2: {
        name: 'TNS_TO_ANS_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['TNS_TO_ANS_P2'];
          const startPoint = markerPoints['TNS'];
          const endPoint = markerPoints['ANS'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/5,
            y: endPoint.y - 3
          }
        }
      } 
    },
    {
      startPoint: 'ANS',
      endPoint: 'Pr',
      controlPoint1: {
        name: 'ANS_TO_Pr_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['ANS_TO_Pr_P1'];
          const startPoint = markerPoints['ANS'];
          const endPoint = markerPoints['Pr'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)*0.8,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/4
          }
        }
      },
      controlPoint2: {
        name: 'ANS_TO_Pr_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['ANS_TO_Pr_P2'];
          const startPoint = markerPoints['ANS'];
          const endPoint = markerPoints['Pr'];

          return controlPoint? controlPoint : {
            x: endPoint.x,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/3
          }
        }
      } 
    },
    {
      startPoint: 'Pr',
      endPoint: 'UNS',
      controlPoint1: {
        name: 'Pr_TO_UNS_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Pr_TO_UNS_P1'];
          const startPoint = markerPoints['Pr'];
          const endPoint = markerPoints['UNS'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/2.5,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/6.5
          }
        }
      },
      controlPoint2: {
        name: 'Pr_TO_UNS_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Pr_TO_UNS_P2'];
          const startPoint = markerPoints['Pr'];
          const endPoint = markerPoints['UNS'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/2.5,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/2.7
          }
        }
      } 
    },
    {
      startPoint: 'UNS',
      endPoint: 'PNS',
      controlPoint1: {
        name: 'UNS_TO_PNS_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UNS_TO_PNS_P1'];
          const startPoint = markerPoints['UNS'];
          const endPoint = markerPoints['PNS'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/12,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/6
          }
        }
      },
      controlPoint2: {
        name: 'UNS_TO_PNS_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UNS_TO_PNS_P2'];
          const startPoint = markerPoints['UNS'];
          const endPoint = markerPoints['PNS'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/1.35,
            y: endPoint.y
          }
        }
      } 
    }
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(UPPER_JAW_BONE_CURVE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(UPPER_JAW_BONE_CURVE.markerPoints).forEach(point => {
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

    let nameStart = 'PNS';
    Object.keys(UPPER_JAW_BONE_CURVE.markerPoints).forEach(point => {
      if(markerPointList[point].y < markerPointList[nameStart].y) nameStart = point;
    })

    let nameEnd = 'PNS';
    Object.keys(UPPER_JAW_BONE_CURVE.markerPoints).forEach(point => {
      if(markerPointList[point].y > markerPointList[nameEnd].y) nameEnd = point;
    })

    return {
      pointStart: minPointOfHeightShape,
      pointEnd: maxPointOfHeightShape,
      nameStart: nameStart,
      nameEnd: nameEnd
    }
  },
  widthOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(UPPER_JAW_BONE_CURVE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(UPPER_JAW_BONE_CURVE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point].y)
    })
  
    const minPointOfWidthShape = {
      x: Math.min(...pointArrayX),
      y: Math.min(...pointArrayY) - 5
    }
    
    const maxPointOfWidthShape = {
      x: Math.max(...pointArrayX),
      y: Math.min(...pointArrayY) - 5
    }

    return {
      pointStart: minPointOfWidthShape,
      pointEnd: maxPointOfWidthShape
    }
  }
}

export const UPPER_INCISOR_CURVE = {
  id: 2,
  name: 'upper incisor',
  markerPoints: {
    U1A: {
      name: 'Upper 1 Apex',
      isShow: true
    },
    U1E: {
      name: 'Upper 1 Edge',
      isShow: true
    },
    U1L: {
      name: 'U1L',
      isShow: false
    },
    U1R: {
      name: 'U1R',
      isShow: false
    }
  }, 
  lines: [],
  isDrag: true,
  allPointsCurve:[
    'U1A',
    'U1E',
    'U1L',
    'U1R',
    'U1A_TO_U1R_P1',
    'U1A_TO_U1R_P2',
    'U1R_TO_U1E_P1',
    'U1R_TO_U1E_P2',
    'U1E_TO_U1L_P1',
    'U1E_TO_U1L_P2',
    'U1L_TO_U1A_P1',
    'U1L_TO_U1A_P2'
  ],
  // các điểm điều khiển sẽ được tạo mặc định và không chính xác dựa trên các điểm bắt đầu và kết thúc có sẵn
  controlPoints: [
    {
      startPoint: 'U1A',
      endPoint: 'U1R',
      controlPoint1: {
        name: 'U1A_TO_U1R_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['U1A_TO_U1R_P1'];
          const startPoint = markerPoints['U1A'];
          const endPoint = markerPoints['U1R'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/7,
            y: startPoint.y
          }
        }
      },
      controlPoint2: {
        name: 'U1A_TO_U1R_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['U1A_TO_U1R_P2'];
          const startPoint = markerPoints['U1A'];
          const endPoint = markerPoints['U1R'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/3.5,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/2
          }
        }
      } 
    },
    {
      startPoint: 'U1R',
      endPoint: 'U1E',
      controlPoint1: {
        name: 'U1R_TO_U1E_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['U1R_TO_U1E_P1'];
          const startPoint = markerPoints['U1R'];
          const endPoint = markerPoints['U1E'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/2.5,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/3
          }
        }
      },
      controlPoint2: {
        name: 'U1R_TO_U1E_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['U1R_TO_U1E_P2'];
          const startPoint = markerPoints['U1R'];
          const endPoint = markerPoints['U1E'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/7,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/7
          }
        }
      } 
    },
    {
      startPoint: 'U1E',
      endPoint: 'U1L',
      controlPoint1: {
        name: 'U1E_TO_U1L_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['U1E_TO_U1L_P1'];
          const startPoint = markerPoints['U1E'];
          const endPoint = markerPoints['U1L'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/4,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/2
          }
        }
      },
      controlPoint2: {
        name: 'U1E_TO_U1L_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['U1E_TO_U1L_P2'];
          const startPoint = markerPoints['U1E'];
          const endPoint = markerPoints['U1L'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/5,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/3
          }
        }
      } 
    },
    {
      startPoint: 'U1L',
      endPoint: 'U1A',
      controlPoint1: {
        name: 'U1L_TO_U1A_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['U1L_TO_U1A_P1'];
          const startPoint = markerPoints['U1L'];
          const endPoint = markerPoints['U1A'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/6,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/3
          }
        }
      },
      controlPoint2: {
        name: 'U1L_TO_U1A_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['U1L_TO_U1A_P2'];
          const startPoint = markerPoints['U1L'];
          const endPoint = markerPoints['U1A'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/5,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/8
          }
        }
      } 
    }
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(UPPER_INCISOR_CURVE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(UPPER_INCISOR_CURVE.markerPoints).forEach(point => {
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
    Object.keys(UPPER_INCISOR_CURVE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(UPPER_INCISOR_CURVE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point].y)
    })
  
    const minPointOfWidthShape = {
      x: Math.min(...pointArrayX),
      y: Math.min(...pointArrayY) - 5
    }
    
    const maxPointOfWidthShape = {
      x: Math.max(...pointArrayX),
      y: Math.min(...pointArrayY) - 5
    }

    return {
      pointStart: minPointOfWidthShape,
      pointEnd: maxPointOfWidthShape
    }
  }
}

export const UNDER_INCISOR_CURVE = {
  id: 3,
  name: 'under incisor',
  markerPoints: {
    L1A: {
      name: 'Under 1 Apex',
      isShow: true
    },
    L1E: {
      name: 'Under 1 Edge',
      isShow: true
    },
    L1L: {
      name: 'L1L',
      isShow: false
    },
    L1R: {
      name: 'L1R',
      isShow: false
    }
  }, 
  lines: [],
  isDrag: true,
  allPointsCurve:[
    'L1A',
    'L1E',
    'L1L',
    'L1R',
    'L1A_TO_L1R_P1',
    'L1A_TO_L1R_P2',
    'L1R_TO_L1E_P1',
    'L1R_TO_L1E_P2',
    'L1E_TO_L1L_P1',
    'L1E_TO_L1L_P2',
    'L1L_TO_L1A_P1',
    'L1L_TO_L1A_P2'
  ],
  // các điểm điều khiển sẽ được tạo mặc định và không chính xác dựa trên các điểm bắt đầu và kết thúc có sẵn
  controlPoints: [
    {
      startPoint: 'L1A',
      endPoint: 'L1R',
      controlPoint1: {
        name: 'L1A_TO_L1R_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L1A_TO_L1R_P1'];
          const startPoint = markerPoints['L1A'];
          const endPoint = markerPoints['L1R'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/7,
            y: startPoint.y
          }
        }
      },
      controlPoint2: {
        name: 'L1A_TO_L1R_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L1A_TO_L1R_P2'];
          const startPoint = markerPoints['L1A'];
          const endPoint = markerPoints['L1R'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/3,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/2
          }
        }
      } 
    },
    {
      startPoint: 'L1R',
      endPoint: 'L1E',
      controlPoint1: {
        name: 'L1R_TO_L1E_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L1R_TO_L1E_P1'];
          const startPoint = markerPoints['L1R'];
          const endPoint = markerPoints['L1E'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/4,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/6
          }
        }
      },
      controlPoint2: {
        name: 'L1R_TO_L1E_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L1R_TO_L1E_P2'];
          const startPoint = markerPoints['L1R'];
          const endPoint = markerPoints['L1E'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/7,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/7
          }
        }
      } 
    },
    {
      startPoint: 'L1E',
      endPoint: 'L1L',
      controlPoint1: {
        name: 'L1E_TO_L1L_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L1E_TO_L1L_P1'];
          const startPoint = markerPoints['L1E'];
          const endPoint = markerPoints['L1L'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/3,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/2
          }
        }
      },
      controlPoint2: {
        name: 'L1E_TO_L1L_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L1E_TO_L1L_P2'];
          const startPoint = markerPoints['L1E'];
          const endPoint = markerPoints['L1L'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/5,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/4
          }
        }
      } 
    },
    {
      startPoint: 'L1L',
      endPoint: 'L1A',
      controlPoint1: {
        name: 'L1L_TO_L1A_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L1L_TO_L1A_P1'];
          const startPoint = markerPoints['L1L'];
          const endPoint = markerPoints['L1A'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/3,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/2
          }
        }
      },
      controlPoint2: {
        name: 'L1L_TO_L1A_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L1L_TO_L1A_P2'];
          const startPoint = markerPoints['L1L'];
          const endPoint = markerPoints['L1A'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/5,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/8
          }
        }
      } 
    }
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(UNDER_INCISOR_CURVE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(UNDER_INCISOR_CURVE.markerPoints).forEach(point => {
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
    Object.keys(UNDER_INCISOR_CURVE.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(UNDER_INCISOR_CURVE.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point].y)
    })
  
    const minPointOfWidthShape = {
      x: Math.min(...pointArrayX),
      y: Math.min(...pointArrayY) - 5
    }
    
    const maxPointOfWidthShape = {
      x: Math.max(...pointArrayX),
      y: Math.min(...pointArrayY) - 5
    }

    return {
      pointStart: minPointOfWidthShape,
      pointEnd: maxPointOfWidthShape
    }
  }
}

export const MANDIBULAR = {
  id: 4,
  name: 'mandibular',
  markerPoints: {
    IdL: {
      name: 'IdL',
      isShow: false,
    },
    Id: {
      name: 'Id',
      isShow: true,
    },
    Pog: {
      name: 'Pogonion',
      isShow: true,
    },  
    Me: {
      name: 'Menton',
      isShow: true,
    }
  },
  lines: [
    {
      startPoint: 'Pog',
      endPoint: 'Me',
      lineColor: '#ff8da1'
    }
  ],
  isDrag: true,
  allPointsCurve:[
    'IdL',
    'Id',
    'Pog',
    'Me',
    'IdL_TO_Id_P1',
    'IdL_TO_Id_P2',
    'Id_TO_Id_P1',
    'Id_TO_Id_P2',
    'Pog_TO_Me_P1',
    'Pog_TO_Me_P2',
    'Me_TO_IdL_P1',
    'Me_TO_IdL_P2'
  ],
  controlPoints: [
    {
      startPoint: 'IdL',
      endPoint: 'Id',
      controlPoint1: {
        name: 'IdL_TO_Id_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['IdL_TO_Id_P1'];
          const startPoint = markerPoints['IdL'];
          const endPoint = markerPoints['Id'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)*0.7,
            y: startPoint.y
          }
        }
      },
      controlPoint2: {
        name: 'IdL_TO_Id_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['IdL_TO_Id_P2'];
          const startPoint = markerPoints['IdL'];
          const endPoint = markerPoints['Id'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/3.5,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/2
          }
        }
      } 
    },
    {
      startPoint: 'Id',
      endPoint: 'Pog',
      controlPoint1: {
        name: 'Id_TO_Id_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Id_TO_Id_P1'];
          const startPoint = markerPoints['Id'];
          const endPoint = markerPoints['Pog'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/15,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/15
          }
        }
      },
      controlPoint2: {
        name: 'Id_TO_Id_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Id_TO_Id_P2'];
          const startPoint = markerPoints['Id'];
          const endPoint = markerPoints['Pog'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/5,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/2
          }
        }
      } 
    },
    {
      startPoint: 'Pog',
      endPoint: 'Me',
      controlPoint1: {
        name: 'Pog_TO_Me_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Pog_TO_Me_P1'];
          const startPoint = markerPoints['Pog'];
          const endPoint = markerPoints['Me'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/15,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/7
          }
        }
      },
      controlPoint2: {
        name: 'Pog_TO_Me_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Pog_TO_Me_P2'];
          const startPoint = markerPoints['Pog'];
          const endPoint = markerPoints['Me'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/1.8,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/5
          }
        }
      } 
    },
    {
      startPoint: 'Me',
      endPoint: 'IdL',
      controlPoint1: {
        name: 'Me_TO_IdL_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Me_TO_IdL_P1'];
          const startPoint = markerPoints['Me'];
          const endPoint = markerPoints['IdL'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/3,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/10
          }
        }
      },
      controlPoint2: {
        name: 'Me_TO_IdL_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Me_TO_IdL_P2'];
          const startPoint = markerPoints['Me'];
          const endPoint = markerPoints['IdL'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/4,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/2.5
          }
        }
      } 
    }
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(MANDIBULAR.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(MANDIBULAR.markerPoints).forEach(point => {
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
    Object.keys(MANDIBULAR.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(MANDIBULAR.markerPoints).forEach(point => {
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

export const UPPER_MOLAR = {
  id: 5,
  name: "upper molar",
  markerPoints: {
    UP_M1: {
      name: "UP_MOLAR1",
      isShow: false,
    },
    UP_M2: {
      name: "UP_MOLAR2",
      isShow: false,
    },
    UMR: {
      name: "UMR",
      isShow: true
    },
    UP_M3: {
      name: "UP_MOLAR3",
      isShow: false,
    },
    UP_M4: {
      name: "UP_MOLAR4",
      isShow: false,
    },
    UO: {
      name: "UO",
      isShow: true
    },
    UP_M5: {
      name: "UP_MOLAR5",
      isShow: false,
    },
    UP_M6: {
      name: "UP_MOLAR6",
      isShow: false,
    },
    Mx6D: {
      name: "Mx6D",
      isShow: true
    },
    UP_M7: {
      name: "UP_MOLAR76",
      isShow: false,
    }
  },
  lines: [],
  isDrag: true,
  allPointsCurve: [
    'UP_M1',
    'UP_M2',
    'UMR',
    'UP_M3',
    'UP_M4',
    'UO',
    'UP_M5',
    'UP_M6',
    'Mx6D',
    'UP_M7',
    'UP_M1_TO_UP_M2_P1',
    'UP_M1_TO_UP_M2_P2',
    'UP_M2_TO_UMR_P1',
    'UP_M2_TO_UMR_P2',
    'UMR_TO_UP_M3_P1',
    'UMR_TO_UP_M3_P2',
    'UP_M3_TO_UP_M4_P1',
    'UP_M3_TO_UP_M4_P2',
    'UP_M4_TO_UO_P1',
    'UP_M4_TO_UO_P2',
    'UO_TO_UP_M5_P1',
    'UO_TO_UP_M5_P2',
    'UP_M5_TO_UP_M6_P1',
    'UP_M5_TO_UP_M6_P2',
    'UP_M6_TO_Mx6D_P1',
    'UP_M6_TO_Mx6D_P2',
    'Mx6D_TO_UP_M7_P1',
    'Mx6D_TO_UP_M7_P2',
    'UP_M7_TO_UP_M1_P1',
    'UP_M7_TO_UP_M1_P2'
  ],
  controlPoints: [
    {
      startPoint: 'UP_M1',
      endPoint: 'UP_M2',
      controlPoint1: {
        name: 'UP_M1_TO_UP_M2_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M1_TO_UP_M2_P1'];
          const startPoint = markerPoints['UP_M1'];
          const endPoint = markerPoints['UP_M2'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/4,
            y: startPoint.y + 3
          }
        }
      },
      controlPoint2: {
        name: 'UP_M1_TO_UP_M2_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M1_TO_UP_M2_P2'];
          const startPoint = markerPoints['UP_M1'];
          const endPoint = markerPoints['UP_M2'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/4,
            y: endPoint.y + 2
          }
        }
      } 
    },
    {
      startPoint: 'UP_M2',
      endPoint: 'UMR',
      controlPoint1: {
        name: 'UP_M2_TO_UMR_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M2_TO_UMR_P1'];
          const startPoint = markerPoints['UP_M2'];
          const endPoint = markerPoints['UMR'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/4,
            y: startPoint.y - 5
          }
        }
      },
      controlPoint2: {
        name: 'UP_M2_TO_UMR_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M2_TO_UMR_P2'];
          const startPoint = markerPoints['UP_M2'];
          const endPoint = markerPoints['UMR'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/4,
            y: endPoint.y + 4
          }
        }
      } 
    },
    {
      startPoint: 'UMR',
      endPoint: 'UP_M3',
      controlPoint1: {
        name: 'UMR_TO_UP_M3_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UMR_TO_UP_M3_P1'];
          const startPoint = markerPoints['UMR'];
          const endPoint = markerPoints['UP_M3'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/5,
            y: startPoint.y
          }
        }
      },
      controlPoint2: {
        name: 'UMR_TO_UP_M3_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UMR_TO_UP_M3_P2'];
          const startPoint = markerPoints['UMR'];
          const endPoint = markerPoints['UP_M3'];

          return controlPoint? controlPoint : {
            x: endPoint.x - 1,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/8
          }
        }
      } 
    },
    {
      startPoint: 'UP_M3',
      endPoint: 'UP_M4',
      controlPoint1: {
        name: 'UP_M3_TO_UP_M4_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M3_TO_UP_M4_P1'];
          const startPoint = markerPoints['UP_M3'];
          const endPoint = markerPoints['UP_M4'];

          return controlPoint? controlPoint : {
            x: startPoint.x ,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/3
          }
        }
      },
      controlPoint2: {
        name: 'UP_M3_TO_UP_M4_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M3_TO_UP_M4_P2'];
          const startPoint = markerPoints['UP_M3'];
          const endPoint = markerPoints['UP_M4'];

          return controlPoint? controlPoint : {
            x: endPoint.x,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/3
          }
        }
      } 
    },
    {
      startPoint: 'UP_M4',
      endPoint: 'UO',
      controlPoint1: {
        name: 'UP_M4_TO_UO_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M4_TO_UO_P1'];
          const startPoint = markerPoints['UP_M4'];
          const endPoint = markerPoints['UO'];

          return controlPoint? controlPoint : {
            x: startPoint.x ,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/3.5
          }
        }
      },
      controlPoint2: {
        name: 'UP_M4_TO_UO_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M4_TO_UO_P2'];
          const startPoint = markerPoints['UP_M4'];
          const endPoint = markerPoints['UO'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/4,
            y: endPoint.y
          }
        }
      } 
    },
    {
      startPoint: 'UO',
      endPoint: 'UP_M5',
      controlPoint1: {
        name: 'UO_TO_UP_M5_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UO_TO_UP_M5_P1'];
          const startPoint = markerPoints['UO'];
          const endPoint = markerPoints['UP_M5'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/3,
            y: startPoint.y
          }
        }
      },
      controlPoint2: {
        name: 'UO_TO_UP_M5_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UO_TO_UP_M5_P2'];
          const startPoint = markerPoints['UO'];
          const endPoint = markerPoints['UP_M5'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/3,
            y: endPoint.y
          }
        }
      } 
    },
    {
      startPoint: 'UP_M5',
      endPoint: 'UP_M6',
      controlPoint1: {
        name: 'UP_M5_TO_UP_M6_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M5_TO_UP_M6_P1'];
          const startPoint = markerPoints['UP_M5'];
          const endPoint = markerPoints['UP_M6'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/3,
            y: startPoint.y
          }
        }
      },
      controlPoint2: {
        name: 'UP_M5_TO_UP_M6_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M5_TO_UP_M6_P2'];
          const startPoint = markerPoints['UP_M5'];
          const endPoint = markerPoints['UP_M6'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/3,
            y: endPoint.y
          }
        }
      } 
    },
    {
      startPoint: 'UP_M6',
      endPoint: 'Mx6D',
      controlPoint1: {
        name: 'UP_M6_TO_Mx6D_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M6_TO_Mx6D_P1'];
          const startPoint = markerPoints['UP_M6'];
          const endPoint = markerPoints['Mx6D'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/4,
            y: startPoint.y
          }
        }
      },
      controlPoint2: {
        name: 'UP_M6_TO_Mx6D_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M6_TO_Mx6D_P2'];
          const startPoint = markerPoints['UP_M6'];
          const endPoint = markerPoints['Mx6D'];

          return controlPoint? controlPoint : {
            x: endPoint.x,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/4
          }
        }
      } 
    },
    {
      startPoint: 'Mx6D',
      endPoint: 'UP_M7',
      controlPoint1: {
        name: 'Mx6D_TO_UP_M7_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Mx6D_TO_UP_M7_P1'];
          const startPoint = markerPoints['Mx6D'];
          const endPoint = markerPoints['UP_M7'];

          return controlPoint? controlPoint : {
            x: startPoint.x,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/2
          }
        }
      },
      controlPoint2: {
        name: 'Mx6D_TO_UP_M7_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Mx6D_TO_UP_M7_P2'];
          const startPoint = markerPoints['Mx6D'];
          const endPoint = markerPoints['UP_M7'];

          return controlPoint? controlPoint : {
            x: endPoint.x,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/2
          }
        }
      } 
    },
    {
      startPoint: 'UP_M7',
      endPoint: 'UP_M1',
      controlPoint1: {
        name: 'UP_M7_TO_UP_M1_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M7_TO_UP_M1_P1'];
          const startPoint = markerPoints['UP_M7'];
          const endPoint = markerPoints['UP_M1'];

          return controlPoint? controlPoint : {
            x: startPoint.x + 1,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/8
          }
        }
      },
      controlPoint2: {
        name: 'UP_M7_TO_UP_M1_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['UP_M7_TO_UP_M1_P2'];
          const startPoint = markerPoints['UP_M7'];
          const endPoint = markerPoints['UP_M1'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/8,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/8
          }
        }
      } 
    }
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(UPPER_MOLAR.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(UPPER_MOLAR.markerPoints).forEach(point => {
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
    Object.keys(UPPER_MOLAR.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(UPPER_MOLAR.markerPoints).forEach(point => {
      pointArrayY.push(markerPointList[point].y)
    })
  
    const minPointOfWidthShape = {
      x: Math.min(...pointArrayX),
      y: Math.min(...pointArrayY) - 5
    }
    
    const maxPointOfWidthShape = {
      x: Math.max(...pointArrayX),
      y: Math.min(...pointArrayY) - 5
    }

    return {
      pointStart: minPointOfWidthShape,
      pointEnd: maxPointOfWidthShape
    }
  }
}

export const LOWER_MOLAR = {
  id: 6,
  name: 'lower molar',
  markerPoints: {
    Md6O: {
      name: 'Distal Cusp of Mandibular First Molar',
      isShow: true,
    },
    L_M1: {
      name: 'L_M1',
      isShow: false
    },
    LO: {
      name: 'LO',
      isShow: true
    },
    Md6M: {
      name: 'Md6M',
      isShow: true
    },
    L_M2: {
      name: 'L_M2',
      isShow: false
    },
    LMR: {
      name: 'LMR',
      isShow: true
    },
    L_M3: {
      name: 'L_M3',
      isShow: false
    },
    L_M4: {
      name: 'L_M4',
      isShow: false
    },
    L_M5: {
      name: 'L_M5',
      isShow: false
    },
    L_M6: {
      name: 'L_M6',
      isShow: false
    }
  },
  lines: [],
  isDrag: true,
  allPointsCurve: [
    'Md6O',
    'L_M1',
    'LO',
    'Md6M',
    'L_M2',
    'LMR',
    'L_M3',
    'L_M4',
    'L_M5',
    'L_M6',
    'Md6O_TO_L_M1_P1',
    'Md6O_TO_L_M1_P2',
    'L_M1_TO_LO_P1',
    'L_M1_TO_LO_P2',
    'LO_TO_Md6M_P1',
    'LO_TO_Md6M_P2',
    'Md6M_TO_L_M2_P1',
    'Md6M_TO_L_M2_P2',
    'L_M2_TO_LMR_P1',
    'L_M2_TO_LMR_P2',
    'LMR_TO_L_M3_P1',
    'LMR_TO_L_M3_P2',
    'L_M3_TO_L_M4_P1',
    'L_M3_TO_L_M4_P2',
    'L_M4_TO_L_M5_P1',
    'L_M4_TO_L_M5_P2',
    'L_M5_TO_L_M6_P1',
    'L_M5_TO_L_M6_P2',
    'L_M6_TO_Md6O_P1',
    'L_M6_TO_Md6O_P2'
  ],
  controlPoints: [
    {
      startPoint: 'Md6O',
      endPoint: 'L_M1',
      controlPoint1: {
        name: 'Md6O_TO_L_M1_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Md6O_TO_L_M1_P1'];
          const startPoint = markerPoints['Md6O'];
          const endPoint = markerPoints['L_M1'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/2,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/2.8
          }
        }
      },
      controlPoint2: {
        name: 'Md6O_TO_L_M1_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Md6O_TO_L_M1_P2'];
          const startPoint = markerPoints['Md6O'];
          const endPoint = markerPoints['L_M1'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/4,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/7
          }
        }
      } 
    },
    {
      startPoint: 'L_M1',
      endPoint: 'LO',
      controlPoint1: {
        name: 'L_M1_TO_LO_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M1_TO_LO_P1'];
          const startPoint = markerPoints['L_M1'];
          const endPoint = markerPoints['LO'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/3.5,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/3
          }
        }
      },
      controlPoint2: {
        name: 'L_M1_TO_LO_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M1_TO_LO_P2'];
          const startPoint = markerPoints['L_M1'];
          const endPoint = markerPoints['LO'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/2.3,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/5
          }
        }
      } 
    },
    {
      startPoint: 'LO',
      endPoint: 'Md6M',
      controlPoint1: {
        name: 'LO_TO_Md6M_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['LO_TO_Md6M_P1'];
          const startPoint = markerPoints['LO'];
          const endPoint = markerPoints['Md6M'];

          return controlPoint? controlPoint : {
            x: startPoint.x + point2PointDistance(startPoint,endPoint)/6,
            y: startPoint.y
          }
        }
      },
      controlPoint2: {
        name: 'LO_TO_Md6M_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['LO_TO_Md6M_P2'];
          const startPoint = markerPoints['LO'];
          const endPoint = markerPoints['Md6M'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/8,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/2.5
          }
        }
      } 
    },
    {
      startPoint: 'Md6M',
      endPoint: 'L_M2',
      controlPoint1: {
        name: 'Md6M_TO_L_M2_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Md6M_TO_L_M2_P1'];
          const startPoint = markerPoints['Md6M'];
          const endPoint = markerPoints['L_M2'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/7,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/3.5
          }
        }
      },
      controlPoint2: {
        name: 'Md6M_TO_L_M2_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Md6M_TO_L_M2_P2'];
          const startPoint = markerPoints['Md6M'];
          const endPoint = markerPoints['L_M2'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/7,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/2.2
          }
        }
      } 
    },
    {
      startPoint: 'L_M2',
      endPoint: 'LMR',
      controlPoint1: {
        name: 'L_M2_TO_LMR_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M2_TO_LMR_P1'];
          const startPoint = markerPoints['L_M2'];
          const endPoint = markerPoints['LMR'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/15,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/14
          }
        }
      },
      controlPoint2: {
        name: 'L_M2_TO_LMR_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M2_TO_LMR_P2'];
          const startPoint = markerPoints['L_M2'];
          const endPoint = markerPoints['LMR'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/6,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/15
          }
        }
      } 
    },
    {
      startPoint: 'LMR',
      endPoint: 'L_M3',
      controlPoint1: {
        name: 'LMR_TO_L_M3_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['LMR_TO_L_M3_P1'];
          const startPoint = markerPoints['LMR'];
          const endPoint = markerPoints['L_M3'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/8,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/10
          }
        }
      },
      controlPoint2: {
        name: 'LMR_TO_L_M3_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['LMR_TO_L_M3_P2'];
          const startPoint = markerPoints['LMR'];
          const endPoint = markerPoints['L_M3'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/6,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/10
          }
        }
      } 
    },
    {
      startPoint: 'L_M3',
      endPoint: 'L_M4',
      controlPoint1: {
        name: 'L_M3_TO_L_M4_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M3_TO_L_M4_P1'];
          const startPoint = markerPoints['L_M3'];
          const endPoint = markerPoints['L_M4'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/6,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/8
          }
        }
      },
      controlPoint2: {
        name: 'L_M3_TO_L_M4_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M3_TO_L_M4_P2'];
          const startPoint = markerPoints['L_M3'];
          const endPoint = markerPoints['L_M4'];

          return controlPoint? controlPoint : {
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/7,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/12
          }
        }
      } 
    },
    {
      startPoint: 'L_M4',
      endPoint: 'L_M5',
      controlPoint1: {
        name: 'L_M4_TO_L_M5_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M4_TO_L_M5_P1'];
          const startPoint = markerPoints['L_M4'];
          const endPoint = markerPoints['L_M5'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/6,
            y: startPoint.y
          }
        }
      },
      controlPoint2: {
        name: 'L_M4_TO_L_M5_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M4_TO_L_M5_P2'];
          const startPoint = markerPoints['L_M4'];
          const endPoint = markerPoints['L_M5'];

          return controlPoint? controlPoint : {
            x: endPoint.x,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/5
          }
        }
      } 
    },
    {
      startPoint: 'L_M5',
      endPoint: 'L_M6',
      controlPoint1: {
        name: 'L_M5_TO_L_M6_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M5_TO_L_M6_P1'];
          const startPoint = markerPoints['L_M5'];
          const endPoint = markerPoints['L_M6'];

          return controlPoint? controlPoint : {
            x: startPoint.x,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/2.5
          }
        }
      },
      controlPoint2: {
        name: 'L_M5_TO_L_M6_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M5_TO_L_M6_P2'];
          const startPoint = markerPoints['L_M5'];
          const endPoint = markerPoints['L_M6'];

          return controlPoint? controlPoint : {
            x: endPoint.x ,
            y: endPoint.y + point2PointDistance(startPoint,endPoint)/2.5
          }
        }
      } 
    },
    {
      startPoint: 'L_M6',
      endPoint: 'Md6O',
      controlPoint1: {
        name: 'L_M6_TO_Md6O_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M6_TO_Md6O_P1'];
          const startPoint = markerPoints['L_M6'];
          const endPoint = markerPoints['Md6O'];

          return controlPoint? controlPoint : {
            x: startPoint.x,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/2.5
          }
        }
      },
      controlPoint2: {
        name: 'L_M6_TO_Md6O_P2',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['L_M6_TO_Md6O_P2'];
          const startPoint = markerPoints['L_M6'];
          const endPoint = markerPoints['Md6O'];

          return controlPoint? controlPoint : {
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/3.5 ,
            y: endPoint.y
          }
        }
      } 
    },
  ],
  heightOfShape: (markerPointList) => {
    let pointArrayX = []
    Object.keys(LOWER_MOLAR.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point]?.x)
    })
    
    let pointArrayY = []
    Object.keys(LOWER_MOLAR.markerPoints).forEach(point => {
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
    Object.keys(LOWER_MOLAR.markerPoints).forEach(point => {
      pointArrayX.push(markerPointList[point].x)
    })
  
    let pointArrayY = []
    Object.keys(LOWER_MOLAR.markerPoints).forEach(point => {
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