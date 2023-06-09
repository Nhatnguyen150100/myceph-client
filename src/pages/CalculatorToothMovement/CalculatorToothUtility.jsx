import { point2PointDistance } from "../lateralCephalometricAnalysis/LateralCephalometricUtility.jsx";

export const midPointOfLineSegment = (startPoint, endPoint) =>{
  return {
    x: (startPoint.x + endPoint.x) / 2,
    y: (startPoint.y + endPoint.y) / 2
  }
}

export const getMinPointFormShape = (shape,listPoint) => {
  const listPointXTemp = [];
  const listPointYTemp = [];
  Object.keys(shape.markerPoints).forEach(point => {
    listPointXTemp.push(listPoint[point].x)
    listPointYTemp.push(listPoint[point].y)
  })

  const minX = Math.min(...listPointXTemp);
  const minY = Math.min(...listPointYTemp);

  return {
    x: minX,
    y: minY
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
            x: endPoint.x - point2PointDistance(startPoint,endPoint)/8,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/4
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
            x: startPoint.x - point2PointDistance(startPoint,endPoint)*0.75,
            y: startPoint.y + point2PointDistance(startPoint,endPoint)/2
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
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/8,
            y: endPoint.y - point2PointDistance(startPoint,endPoint)/3
          }
        }
      } 
    },
    {
      startPoint: 'Pr',
      endPoint: 'UNS',
      controlPoint1: {
        name: 'Pr_TO_Pr_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['Pr_TO_Pr_P1'];
          const startPoint = markerPoints['Pr'];
          const endPoint = markerPoints['UNS'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/2.5,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/2.7
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
        name: 'PNS_TO_Pr_P1',
        positionDefault: (markerPoints) => {
          const controlPoint = markerPoints['PNS_TO_Pr_P1'];
          const startPoint = markerPoints['UNS'];
          const endPoint = markerPoints['PNS'];

          return controlPoint? controlPoint : {
            x: startPoint.x - point2PointDistance(startPoint,endPoint)/7,
            y: startPoint.y - point2PointDistance(startPoint,endPoint)/9
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
            x: endPoint.x + point2PointDistance(startPoint,endPoint)/1.75,
            y: endPoint.y
          }
        }
      } 
    }
  ]
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
  ]
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
  ] 
}