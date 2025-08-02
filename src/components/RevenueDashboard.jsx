import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useSelector } from 'react-redux';

const RevenueDashboard = () => {
 const darkMode = useSelector((state) => state.auth.darkMode);
  const bookedRef = useRef(null);
  const guestRef = useRef(null);

  const initChart = (ref, data, label, lineColor) => {
    const chart = echarts.init(ref);

    chart.setOption({
      animation: false,
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        textStyle: {
          color: '#1f2937'
        }
      },
      grid: {
        top: 10,
        right: 10,
        bottom: 30,
        left: 50
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisLine: { lineStyle: { color: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#E5E5E5'} },
        axisLabel: { color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgb(156 163 175)' }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#E5E5E5'} },
        splitLine: { lineStyle: { color: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#E5E5E5'} },
        axisLabel: {
          color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgb(156 163 175)',
          formatter: '${value}k'
        }
      },
      series: [
        {
          name: label,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 3, color: lineColor },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${lineColor}33` },
              { offset: 1, color: `${lineColor}03` }
            ])
          },
          data
        }
      ]
    });

    window.addEventListener('resize', () => chart.resize());
  };

useEffect(() => {
  if (bookedRef.current)
    initChart(bookedRef.current, [22, 25, 23, 30, 35, 33], 'Booked', '#4ade80');
  if (guestRef.current)
    initChart(guestRef.current, [60, 70, 80, 85, 95, 110], 'Guests', '#facc15');
}, [darkMode]); // 👈 React will now re-render charts when darkMode changes


  return (
    <div className="space-y-8 ">

      {/* Booked & Guest Charts in 2 lines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-secondary rounded-lg p-6 border border-info dark:border-inputborder hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
          <h3 className="text-lg font-medium mb-4">Total Booked</h3>
          <div ref={bookedRef} className="w-full h-[250px]" />
        </div>
        <div className="bg-white dark:bg-secondary rounded-lg p-6 border border-info dark:border-inputborder hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
          <h3 className="text-lg font-medium mb-4">Total Guests</h3>
          <div ref={guestRef} className="w-full h-[250px]" />
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
