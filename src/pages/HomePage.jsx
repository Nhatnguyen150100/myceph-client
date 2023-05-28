import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DB_ENCRYPTION_CLINIC, DB_ENCRYPTION_DOCTOR, disConnectIndexDB, getData, onOpenIndexDB } from "../common/ConnectIndexDB.jsx";
import { cookies, SOFT_WARE_LIST } from "../common/Utility.jsx";
import NavbarComponent from "../components/NavbarComponent.jsx";
import { setArrayClinic, setEncryptKeyClinic, setIdClinicDefault, setRoleOfDoctor } from "../redux/ClinicSlice.jsx";
import { setEncryptKeyDoctor } from "../redux/DoctorSlice.jsx";
import { setAppName, setLoadingModal } from "../redux/GeneralSlice.jsx";
import { setArrayPatient, setCurrentPatient } from "../redux/PatientSlice.jsx";
import { getToServerWithToken } from "../services/getAPI.jsx";
import { refreshToken } from "../services/refreshToken.jsx";

export default function HomePage(props) {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const isRefresh = useSelector(state=>state.general.isRefresh);
  const currentPatient = useSelector(state=>state.patient.currentPatient);
  const doctor = useSelector(state=>state.doctor.data);
  const nav = useNavigate();

  const getAllClinicAndSetDefault = (indexDB) => {
    dispatch(setLoadingModal(true));
    return new Promise((resolve,reject) =>{
      getToServerWithToken(`/v1/doctor/getAllClinicFromDoctor/${doctor?.id}`).then(result => {
        result.data.map(clinic => {
          if(clinic.roleOfDoctor==='admin'){
            !currentPatient?.id && getToServerWithToken(`/v1/patient/getPatientListForClinic/${clinic.id}?page=${1}&pageSize=${10}&nameSearch=${''}`).then(response=>{
              dispatch(setArrayPatient(response.data));
              dispatch(setCurrentPatient(response.data[0]))
            })
            dispatch(setIdClinicDefault(clinic.id));
            getData(indexDB,clinic.id,DB_ENCRYPTION_CLINIC).then(encryptedData => {
              encryptedData ? dispatch(setEncryptKeyClinic({key: encryptedData.key, iv: encryptedData.iv})) : dispatch(setEncryptKeyClinic(null))
            })
            dispatch(setRoleOfDoctor(clinic.roleOfDoctor))
          }
        })
        if(result.data.length > 0) dispatch(setIdClinicDefault(result.data[0]?.id));
        dispatch(setArrayClinic(result.data));
        resolve();
      }).catch((err) =>{
        if(err.refreshToken && !isRefresh){
          refreshToken(nav,dispatch).then(()=>getAllClinicAndSetDefault(indexDB));
        }else{
          toast.error(err.message);
        }
        reject(err);
      }).finally(()=>dispatch(setLoadingModal(false)))
    })
  }

  useEffect(()=>{
    dispatch(setAppName(`Myceph - ${t('homepage')}`));
    if(doctor && cookies.get('accessToken')){
      let indexDB = null;
      onOpenIndexDB().then(db=>{
        indexDB = db;
        getData(db,doctor.id,DB_ENCRYPTION_DOCTOR).then(data =>{
          if(data) dispatch(setEncryptKeyDoctor({key: data.key, iv: data.iv}))
        })
        getAllClinicAndSetDefault(db).finally(()=>disConnectIndexDB(indexDB));
      });
    }
  },[])

  return <div className="h-100 w-100">
    <NavbarComponent />
    <div className="h-100 w-100 position-relative" style={{
      height: '100%',
      backgroundImage: `url("/assets/images/home-background-desktop.png")`,
      backgroundSize: 'cover',
    }}>
      <img className="position-absolute start-0 " src="/assets/images/technology_place.png" alt="img" height={580}/>
      <img className="position-absolute" src="/assets/images/background_technology.png" alt="img" width={700} style={{top:"450px",left:"-100px",opacity:"85%"}}/>
      <img className="position-absolute" src="/assets/images/pattern.svg" alt="img" width={700} style={{top:"800px",right:"0px"}}/>
      <img className="position-absolute" src="/assets/images/pattern.svg" alt="img" width={700} style={{top:"3000px",left:"0px"}}/>
      <img className="position-absolute" src="/assets/images/pattern.svg" alt="img" width={700} style={{top:"1500px",left:"-140px"}}/>
      <div className="container h-100 position-relative">
        <img className="position-absolute translate-middle" src="/assets/images/medical_technology.png" alt="img" height={550} style={{right:"-235px",top:"330px"}}/>
        <div className="d-flex flex-grow-1 justify-content-start">
          <div className="d-flex flex-column align-items-end justify-content-center" style={{marginTop:"100px", marginLeft:"20px"}}>
            <img src="/assets/images/teeth.png" alt="teeth" height={80}/>
            <strong className="text-white text-uppercase fw-bold" style={{fontSize:"100px"}}>
              myceph
            </strong>
            <h5 className="mc-color text-uppercase fw-bold" style={{fontSize:"60px"}}>
              cephalometric
            </h5>
            <img className="my-2" src="/assets/images/line_white.png" alt="img" width={200}/>
            <p className="mc-color fw-bold mt-2" style={{fontSize:"24px",width:"520px",textAlign:"right"}}>
              {t('Software to support management combined with patient analysis for doctors and orthodontic clinics')}
            </p>
          </div>
        </div>
        <div className="row" style={{marginTop:"150px"}}>
          <div className="col-md-6">
            <div className="m-2 p-4 shadow-lg rounded gradient-color">
              <p className="w-100 fst-italic text-white" style={{fontSize:"16px",textAlign:"justify"}}>
                {t('Patient management and craniofacial analysis software is an important tool in the modern medical field. This software helps manage patient information accurately and conveniently, from storing medical information to tracking the patient\'s medical examination and treatment schedule. In addition, the software also provides craniofacial analysis features, helping to identify and measure craniofacial tilt, thereby assisting experts in the diagnosis and treatment of diseases related to the respiratory tract. respiratory, oral and ENT. With the aid of patient management software and craniofacial analysis, doctors, dentists and other health professionals can make accurate and effective decisions in their treatment and health care patient.')}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="m-2 p-4 d-flex flex-column align-items-start justify-content-center">
              <h1 className="mc-color text-uppercase fw-bold">
                {t('myceph - comprehensive clinical support tool')}
              </h1>
              <img className="my-2" src="/assets/images/line_green.png" alt="img" width={200}/>
              <h4 className="mt-1 fst-italic" style={{fontSize:"18px",textAlign:"justify",color:"#53575d"}}>
                {t('Developed based on orthodontic research, combined with collected data.')}
              </h4>
              <h4 className="mt-1 fst-italic" style={{fontSize:"18px",textAlign:"justify",color:"#53575d"}}>
                {t('We build Ceph - software that not only effectively supports doctors but also clinics. Help the clinic optimize work in patient management and monitoring.')}
              </h4>
            </div>
          </div>
        </div>
        <div className="w-100 mt-5">
          <h1 className="text-center fw-bold mc-color text-uppercase">
            {t('the main features in the software')}
          </h1>
          <div className="w-100 d-flex justify-content-center align-items-center my-2">
            <img className="text-center" src="/assets/images/line_center.png" alt="img" width={300}/>
          </div>
          <div className="row">
            <div className="col-md-4 px-3 mt-5">
              <div className="d-flex flex-column shadow-lg align-items-center justify-content-start p-4 rounded gradient_color_green" style={{height:"400px"}}>
                <div className="my-3 rounded-circle shadow-lg p-3 bg-white d-flex justify-content-center align-items-center" style={{border:"dotted",borderColor:"#40bab5",height:"130px",width:"130px"}}>
                  <img src="/assets/images/lateral_cephalometric.png" alt="img" height={100} style={{backgroundSize:"cover"}}/>
                </div>
                <h2 className="my-3 text-uppercase fw-bold text-center text-white">
                  {t(SOFT_WARE_LIST.LATERALCEPH)}
                </h2>
                <h3 className="fst-italic mt-3 px-3 text-white" style={{fontSize:"16px",textAlign:"justify"}}>
                  {t('Analysis of craniofacial films. Supports Steiner, Ricketts, Nagasaki analysis types. Quickly provide analytical results with high accuracy')}
                </h3>
              </div>
            </div>
            <div className="col-md-4 px-3 mt-5">
              <div className="d-flex flex-column shadow-lg align-items-center justify-content-start p-4 rounded gradient_color_green" style={{height:"400px"}}>
                <div className="my-3 rounded-circle shadow-lg p-3 bg-white d-flex justify-content-center align-items-center" style={{border:"dotted",borderColor:"#40bab5",height:"130px",width:"130px"}}>
                  <img src="/assets/images/photo_library.png" alt="img" height={100} style={{backgroundSize:"cover"}}/>
                </div>
                <h2 className="my-3 text-uppercase fw-bold text-center text-white">
                  {t(SOFT_WARE_LIST.IMAGE_LIBRARY)}
                </h2>
                <h3 className="fst-italic mt-3 px-3 text-white" style={{fontSize:"16px",textAlign:"justify"}}>
                  {t('Store all patient images including X-ray, intraoral, facial during the patient\'s treatment')}
                </h3>
              </div>
            </div>
            <div className="col-md-4 px-3 mt-5">
              <div className="d-flex flex-column shadow-lg align-items-center justify-content-start p-4 rounded gradient_color_green" style={{height:"400px"}}>
                <div className="my-3 rounded-circle shadow-lg p-3 bg-white d-flex justify-content-center align-items-center" style={{border:"dotted",borderColor:"#40bab5",height:"130px",width:"130px"}}>
                  <img className="ms-1" src="/assets/images/encryption_icon.png" alt="img" height={60} style={{backgroundSize:"cover"}}/>
                </div>
                <h2 className="my-3 text-uppercase fw-bold text-center text-white">
                  {t('encryption')}
                </h2>
                <h3 className="fst-italic mt-3 px-3 text-white" style={{fontSize:"16px",textAlign:"justify"}}>
                  {t('The use of end-to-end encryption software is employed to protect patient information, including medical information, medical history, and other health-related information.')}
                </h3>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-4 px-3 mt-5">
              <div className="d-flex flex-column shadow-lg align-items-center justify-content-start p-4 rounded gradient_color_green" style={{height:"400px"}}>
                <div className="my-3 rounded-circle shadow-lg p-3 bg-white d-flex justify-content-center align-items-center" style={{border:"dotted",borderColor:"#40bab5",height:"130px",width:"130px"}}>
                  <img src="/assets/images/private_discussion.png" alt="img" height={100} style={{backgroundSize:"cover"}}/>
                </div>
                <h2 className="my-3 text-uppercase fw-bold text-center text-white">
                  {t(SOFT_WARE_LIST.DISCUSSION)}
                </h2>
                <h3 className="fst-italic mt-3 px-3 text-white" style={{fontSize:"16px",textAlign:"justify"}}>
                  {t('Allowing doctors to discuss a patient\'s problems privately with each other right on the patient\'s medical record')}
                </h3>
              </div>
            </div>
            <div className="col-md-4 px-3 mt-5">
              <div className="d-flex flex-column shadow-lg align-items-center justify-content-start p-4 rounded gradient_color_green" style={{height:"400px"}}>
                <div className="my-3 rounded-circle shadow-lg p-3 bg-white d-flex justify-content-center align-items-center" style={{border:"dotted",borderColor:"#40bab5",height:"130px",width:"130px"}}>
                  <img src="/assets/images/medical_record.png" alt="img" height={100} style={{backgroundSize:"cover"}}/>
                </div>
                <h2 className="my-3 text-uppercase fw-bold text-center text-white">
                  {t(SOFT_WARE_LIST.MEDICAL_RECORD)}
                </h2>
                <h3 className="fst-italic mt-3 px-3 text-white" style={{fontSize:"16px",textAlign:"justify"}}>
                  {t('Manage patient\'s medical records including basic patient information, family history, common problems, treatment history...')}
                </h3>
              </div>
            </div>
            <div className="col-md-4 px-3 mt-5">
              <div className="d-flex flex-column shadow-lg align-items-center justify-content-start p-4 rounded gradient_color_green" style={{height:"400px"}}>
                <div className="my-3 rounded-circle shadow-lg p-3 bg-white d-flex justify-content-center align-items-center" style={{border:"dotted",borderColor:"#40bab5",height:"130px",width:"130px"}}>
                  <img src="/assets/images/doctor_homepage.png" alt="img" height={100} style={{backgroundSize:"cover"}}/>
                </div>
                <h2 className="my-3 text-uppercase fw-bold text-center text-white">
                  {t(SOFT_WARE_LIST.DOCTOR_MANAGEMENT)}
                </h2>
                <h3 className="fst-italic mt-3 px-3 text-white" style={{fontSize:"16px",textAlign:"justify"}}>
                  {t('Doctor record management helps clinics easily manage members and positions of each doctor in the clinic')}
                </h3>
              </div>
            </div>
            <div className="col-md-4 px-3 mt-5">
              <div className="d-flex flex-column shadow-lg align-items-center justify-content-start p-4 rounded gradient_color_green" style={{height:"400px"}}>
                <div className="my-3 rounded-circle shadow-lg p-3 bg-white d-flex justify-content-center align-items-center" style={{border:"dotted",borderColor:"#40bab5",height:"130px",width:"130px"}}>
                  <img src="/assets/images/patient-100.png" alt="img" height={90} style={{backgroundSize:"cover"}}/>
                </div>
                <h2 className="my-3 text-uppercase fw-bold text-center text-white">
                  {t(SOFT_WARE_LIST.SHARE_PATIENT)}
                </h2>
                <h3 className="fst-italic mt-2 px-3 text-white" style={{fontSize:"16px",textAlign:"justify"}}>
                  {t('Sharing patient records among the clinic and between different doctors helps doctors easily access, discuss the patient\'s condition and provide appropriate treatment methods')}
                </h3>
              </div>
            </div>
            <div className="col-md-4 px-3 mt-5">
              <div className="d-flex flex-column shadow-lg align-items-center justify-content-start p-4 rounded gradient_color_green" style={{height:"400px"}}>
                <div className="my-3 rounded-circle shadow-lg p-3 bg-white d-flex justify-content-center align-items-center" style={{border:"dotted",borderColor:"#40bab5",height:"130px",width:"130px"}}>
                  <img src="/assets/images/calendar_homepage.png" alt="img" height={100} style={{backgroundSize:"cover"}}/>
                </div>
                <h2 className="my-3 text-uppercase fw-bold text-center text-white">
                  {t(SOFT_WARE_LIST.CALENDAR)}
                </h2>
                <h3 className="fst-italic mt-3 px-3 text-white" style={{fontSize:"16px",textAlign:"justify"}}>
                  {t('Help orthodontic clinics to schedule patient appointments as well as manage costs for treatments. Statistics of services as well as calendar status by month or by patient')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-100" style={{
        marginTop:"1850px",
        backgroundImage: `url("/assets/images/intro_background.png")`,
        backgroundSize: 'cover',
      }}>
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-md-6 h-100">
              <div className="m-2 h-100 p-4 d-flex flex-column align-items-start justify-content-center">
                <h1 className="mc-color text-uppercase fw-bold">
                  {t('Why choose Myceph - cephalometric?')} 
                </h1>
                <img className="my-2" src="/assets/images/line_green.png" alt="img" width={200}/>
                <h4 className="mt-1 fst-italic" style={{fontSize:"18px",textAlign:"justify",color:"#53575d"}}>
                  {t('Myceph - cephalometric software uses advanced image analysis technology to measure and analyze inclined film. This ensures that the analysis results provided are accurate and reliable.')}
                </h4>
                <h4 className="mt-1 fst-italic" style={{fontSize:"18px",textAlign:"justify",color:"#53575d"}}>
                  {t('Myceph - cephalometric software is designed to be easy to use and user-friendly. It provides an intuitive graphical interface to help users easily select and enter patient information, and clearly displays analysis results.')}
                </h4>
                <h4 className="mt-1 fst-italic" style={{fontSize:"18px",textAlign:"justify",color:"#53575d"}}>
                  {t('Myceph - cephalometric can be used on many different types of profile films and provides a variety of analysis methods to meet different user needs.')}
                </h4>
                <h4 className="mt-1 fst-italic" style={{fontSize:"18px",textAlign:"justify",color:"#53575d"}}>
                  {t('Myceph - cephalometric software offers a wide range of additional features, including customizing analysis results, generating reports, storing patient records, and sharing information with other experts in the field.')}
                </h4>
              </div>
            </div>
            <div className="col-md-6 h-100">
              <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                <div className="d-flex w-100">
                  <img className="my-2 me-4" src="/assets/images/image_intro3.jpeg" alt="img" width={350} />
                  <img className="my-2" src="/assets/images/image_intro1.jpeg" alt="img" width={280} />
                </div>
                <div className="d-flex w-100">
                  <img className="my-2 me-4" src="/assets/images/image_intro4.jpeg" alt="img" width={280} />
                  <img className="my-2" src="/assets/images/image_intro2.jpeg" alt="img" width={350} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-center fw-bold mc-color text-uppercase">
              {t('the features being developed')}
            </h1>
            <div className="w-100 d-flex flex-column justify-content-center align-items-center my-2">
              <img src="/assets/images/line_center.png" alt="img" width={300}/>
            </div>
            <div className="row mt-4">
              <div className="col-md-4 px-4">
                <img src="/assets/images/so_thang.png" alt="img" width={"100%"}/>
                <h2 className="mc-color text-uppercase fw-bold my-4 text-center">
                  {t('posterior-anterior cephalometric analysis')} 
                </h2>
                <h4 className="px-2 fst-italic" style={{fontSize:"18px",textAlign:"justify",color:"#53575d"}}>
                  {t('Just like analyzing the angled surfaces, when performing flat plane analysis, experts can detect issues such as defects, cavities, gingivitis, and damaged jawbones. With this technique, dentists can propose suitable treatment plans to address these issues and help patients achieve healthy and beautiful teeth.')}
                </h4>
              </div>
              <div className="col-md-4 px-4" style={{paddingTop:"100px"}}>
                <img src="/assets/images/vto_image.jpg" alt="img" width={"100%"}/>
                <h2 className="mc-color text-uppercase fw-bold my-4 text-center">
                  {t('facial treatment simulation')} 
                </h2>
                <h4 className="px-2 fst-italic" style={{fontSize:"18px",textAlign:"justify",color:"#53575d"}}>
                {t('Myceph - cephalometric software allows doctors to draw curves on a patient\'s X-ray film and then conduct simulations by moving bones or teeth. Finally evaluate the degree of displacement of the anatomical points to give results as well as see the appropriate treatment process.')}
                </h4>
              </div>
              <div className="col-md-4 px-4">
                <img src="/assets/images/AI_image.jpg" alt="img" width={"100%"}/>
                <h2 className="mc-color text-uppercase fw-bold my-4 text-center">
                  {t('automatically detect clinical landmark')} 
                </h2>
                <h4 className="px-2 fst-italic" style={{fontSize:"18px",textAlign:"justify",color:"#53575d"}}>
                  {t('This technique helps to reduce time and effort for dental professionals, while increasing the accuracy and reliability of the diagnostic evaluation process. AI can detect and mark necessary points on the image, such as tooth positions, angles, and jawbone sections. This helps dentists to easily identify the condition of the dental arch and adjust the treatment plan more accurately. In addition, the use of AI also helps to save time and reduce errors in the evaluation process, ensuring a safe and effective treatment process for patients.')}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="w-100 gradient_color_green" style={{marginTop:"1000px"}}>
          <div className="container" style={{paddingTop:"30px",paddingBottom:"30px"}}>
            <div className="row">
              <div className="col-md-6">
                <h2 className="text-start fw-bold text-white text-uppercase">
                  {t('myceph - cephalometric')}
                </h2>
                <div className="d-flex justify-content-start align-items-center mb-2">
                  <h5 className="me-2 text-capitalize text-white m-0">
                    {t('product name')}:
                  </h5>
                  <span className="fw-bold mc-color text-uppercase">
                    {t('Dental Imaging Software')}
                  </span>
                </div>
                <div className="d-flex justify-content-start align-items-center mb-2">
                  <h5 className="me-2 text-capitalize text-white m-0">
                    {t('Software Version')}:
                  </h5>
                  <span className="fw-bold mc-color text-uppercase">
                    1.0.0
                  </span>
                </div>
                <div className="d-flex justify-content-start align-items-center mb-2">
                  <h5 className="me-2 text-capitalize text-white m-0">
                    {t('author of software')}:
                  </h5>
                  <span className="fw-bold mc-color text-uppercase">
                    Nguyễn Xuân Nhất
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <p className="text-white fst-italic text-center d-flex align-items-center h-100" style={{fontSize:"18px"}}>
                  "{t('The Myceph - Cephalometric software is a program created by students for the purpose of research and completing their graduation thesis. The product\'s concept includes design and norm data taken from Viceph software. The product has no value on the market.')}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}