import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import SelectFieldInput from '../../common/SelectFieldInput.jsx';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FONT_SIZE, getServicesDataForChart } from '../../common/Utility.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
); 

export default function ChartSection(props){
  const {t} = useTranslation();
  const propertiesClinic = useSelector(state => state.calendar.propertiesClinic);
  const listAppointmentDate = useSelector(state => state.calendar.listAppointmentDate);
  const [quarter,setQuarter] = useState();
  const [typeChart,setTypeChart] = useState('idService');

  useEffect(()=>{
    const currentMonth = new Date(props.currentDay).getMonth();
    if(1 <= currentMonth <= 3) setQuarter({
      key: 'quarter1',
      name: 'The 1st quarter',
      value: ['January', 'February', 'March']
    })
    else if(4 <= currentMonth <= 6) setQuarter({
      key: 'quarter2',
      name: 'Second quarter',
      value: ['April','May','June']
    })
    else if(7 <= currentMonth <=9) setQuarter({
      key: 'quarter3',
      nam: 'Third quarter',
      value: ['July','August','September']
    })
    else setQuarter({
      key: 'quarter4',
      nam: 'Fourth quarter',
      value: ['October','November','December']
    })
  },[props.currentDay])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t(`${typeChart==='idService'?'Service':'Status'} statistics chart in 1 quarter`),
      },
    },
  };

  const data = useMemo(()=>{
    if(typeChart==='idService' && propertiesClinic){
      return {
        labels : quarter?.value,
        datasets: propertiesClinic?.serviceOfClinic.map((service,_) => {
          return {
            label: service.nameService,
            data: getServicesDataForChart(listAppointmentDate,service.id,typeChart,quarter?.key),
            backgroundColor: service.colorService
          }
        })
      }
    }else if(propertiesClinic){
      return {
        labels : quarter?.value,
        datasets: propertiesClinic?.statusOfClinic.map((status,_) => {
          return {
            label: status.nameStatus,
            data: getServicesDataForChart(listAppointmentDate,status.id,typeChart,quarter?.key),
            backgroundColor: status.colorStatus
          }
        })
      }
    }else{
      return {
        labels: [],
        datasets: []
      }
    }
  },[quarter,propertiesClinic,listAppointmentDate,typeChart]) 

  return <div className='h-100 w-100 d-flex flex-column align-items-center justify-content-start mt-4'>
    <div className='d-flex flex-row align-items-center justify-content-between w-100'>
      <SelectFieldInput legend={t('Quarter')} fontSize={FONT_SIZE} onChange={value=>{
        if(value === 'quarter1') setQuarter({
          key: 'quarter1',
          name: 'The 1st quarter',
          value: ['January', 'February', 'March']
        })
        else if(value === 'quarter2') setQuarter({
          key: 'quarter2',
          name: 'Second quarter',
          value: ['April','May','June']
        })
        else if(value === 'quarter3') setQuarter({
          key: 'quarter3',
          nam: 'Third quarter',
          value: ['July','August','September']
        })
        else setQuarter({
          key: 'quarter4',
          nam: 'Fourth quarter',
          value: ['October','November','December']
        })
      }}>
        <option value={'quarter1'}>
          {t('The 1st quarter')}
        </option>
        <option value={'quarter2'}>
          {t('Second quarter')}
        </option>
        <option value={'quarter3'}>
          {t('Third quarter')}
        </option>
        <option value={'quarter4'}>
          {t('Fourth quarter')}
        </option>
      </SelectFieldInput>
      <SelectFieldInput legend={t('Statistics by')} fontSize={FONT_SIZE} onChange={value=>setTypeChart(value)}>
        <option value={'idService'}>
          {t('service of clinic')}
        </option>
        <option value={'idStatus'}>
          {t('status of clinic')}
        </option>
      </SelectFieldInput>
    </div>
    <Bar className='my-3' options={options} data={data} />
  </div>
}