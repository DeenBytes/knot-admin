import React from 'react';

const stats = [
  { label: 'Total Events', value: 48, icon: 'calendar-line', change: '12%' },
  { label: 'Tables Booked', value: 156, icon: 'table-line', change: '8%' },
  { label: 'Guest List', value: 892, icon: 'team-line', change: '15%' },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ">
      {stats.map(({ label, value, icon, change }) => (
        <div key={label} className="bg-white dark:bg-secondary rounded-lg p-6 border border-info dark:border-inputborder hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-dark dark:text-info font-semibold">{label}</h3>
            <div className="w-10 h-10 rounded-full bg-primary/40 bg-opacity-20 flex items-center justify-center">
              <i className={`ri-${icon} text-primary`}></i>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-light dark:text-lightwhite">{value}</p>
              <p className="text-sm text-light">This Month</p>
            </div>
            <div className="flex items-center text-success">
              <i className="ri-arrow-up-line mr-1"></i>
              <span>{change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
