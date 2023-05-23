import { point2PointDistance } from "../lateralCephalometricAnalysis/LateralCephalometricUtility";

export const UPPER_JAW_BONE_CURVE = {
  markerPoints: [
    {
      name: 'PNS',
      isShow: true
    },
    {
      name: 'ANS',
      isShow: true 
    },
    {
      name: 'TNS',
      isShow: false
    },
    {
      name: 'TNS',
      isShow: false
    },
    {
      name: 'UNS',
      isShow: false
    },
    {
      name: 'Pr',
      isShow: true
    }
 ], 
  // các điểm điều khiển sẽ được tạo mặc định và không chính xác dựa trên các điểm bắt đầu và kết thúc có sẵn
  controlPoints: [
    {
      startPoint: 'PNS',
      endPoint: 'TNS',
      controlPoint1: {
        name: 'PNS_TO_TNS_P1',
        positionDefault: (markerPoints) => {
          const startPoint = markerPoints['PNS'];
          const endPoint = markerPoints['TNS'];

          const distance = point2PointDistance(startPoint,endPoint);
          return {
            x: startPoint.x + distance/6,
            y: startPoint.y - distance/7
          }
        }
      },
      controlPoint2: {
        name: 'PNS_TO_TNS_P2',
        positionDefault: (markerPoints) => {
          const startPoint = markerPoints['PNS'];
          const endPoint = markerPoints['TNS'];

          const distance = point2PointDistance(startPoint,endPoint);
          return {
            x: startPoint.x - distance/5,
            y: startPoint.y + distance/6
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
          const startPoint = markerPoints['TNS'];
          const endPoint = markerPoints['ANS'];

          const distance = point2PointDistance(startPoint,endPoint);
          return {
            x: startPoint.x + distance/4,
            y: startPoint.y + distance*0.8
          }
        }
      },
      controlPoint2: {
        name: 'TNS_TO_ANS_P2',
        positionDefault: (markerPoints) => {
          const startPoint = markerPoints['TNS'];
          const endPoint = markerPoints['ANS'];

          const distance = point2PointDistance(startPoint,endPoint);
          return {
            x: startPoint.x - distance/5,
            y: startPoint.y - distance/5
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
          const startPoint = markerPoints['ANS'];
          const endPoint = markerPoints['Pr'];

          const distance = point2PointDistance(startPoint,endPoint);
          return {
            x: startPoint.x - distance/2,
            y: startPoint.y + distance/2
          }
        }
      },
      controlPoint2: {
        name: 'ANS_TO_Pr_P2',
        positionDefault: (markerPoints) => {
          const startPoint = markerPoints['ANS'];
          const endPoint = markerPoints['Pr'];

          const distance = point2PointDistance(startPoint,endPoint);
          return {
            x: startPoint.x,
            y: startPoint.y - distance/2
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
          const startPoint = markerPoints['Pr'];
          const endPoint = markerPoints['UNS'];

          const distance = point2PointDistance(startPoint,endPoint);
          return {
            x: startPoint.x + distance/3,
            y: startPoint.y - distance/3
          }
        }
      },
      controlPoint2: {
        name: 'Pr_TO_UNS_P2',
        positionDefault: (markerPoints) => {
          const startPoint = markerPoints['Pr'];
          const endPoint = markerPoints['UNS'];

          const distance = point2PointDistance(startPoint,endPoint);
          return {
            x: startPoint.x - distance/2,
            y: startPoint.y - distance/3
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
          const startPoint = markerPoints['UNS'];
          const endPoint = markerPoints['PNS'];

          const distance = point2PointDistance(startPoint,endPoint);
          return {
            x: startPoint.x + distance*0.9,
            y: startPoint.y + distance/3
          }
        }
      },
      controlPoint2: {
        name: 'UNS_TO_PNS_P2',
        positionDefault: (markerPoints) => {
          const startPoint = markerPoints['UNS'];
          const endPoint = markerPoints['PNS'];

          const distance = point2PointDistance(startPoint,endPoint);
          return {
            x: startPoint.x - distance/3,
            y: startPoint.y - distance/3
          }
        }
      } 
    }
  ]
}