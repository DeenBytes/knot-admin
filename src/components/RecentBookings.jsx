import Button from './reusableComp/Button';

const bookings = [
  { name: 'Rahul Kapoor', type: 'VIP Table for 6', price: '$1,200', date: 'June 21', initials: 'RK' },
  { name: 'Aisha Patel', type: 'Premium Table for 4', price: '$850', date: 'June 21', initials: 'AP' },
  { name: 'Vikram Kumar', type: 'Standard Table for 8', price: '$1,400', date: 'June 22', initials: 'VK' },
  { name: 'Neha Sharma', type: 'VIP Table for 4', price: '$900', date: 'June 22', initials: 'NS' },
  { name: 'Arjun Mehta', type: 'Premium Table for 6', price: '$1,050', date: 'June 23', initials: 'AM' },
];

const RecentBookings = () => {
  return (
    <div className="bg-white dark:bg-secondary rounded-lg p-6 border border-info dark:border-inputborder hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
      <div className="flex flex-row gap-2 md:gap-0 justify-between items-center mb-6">
        <h3 className="text-xl text-black dark:text-lightwhite  font-medium">Recent Bookings</h3>
      </div>

      <div className="space-y-4">
        {bookings.map((booking, i) => (
          <div key={i} className="flex items-center p-3 bg-lightborder dark:bg-inputbg rounded-lg">
            <div className="w-10 h-10 rounded-full bg-info dark:bg-inputborder flex items-center justify-center mr-3">
              <span>{booking.initials}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{booking.name}</p>
              <p className="text-sm text-light">{booking.type}</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-medium">{booking.price}</p>
              <p className="text-xs text-light">{booking.date}</p>
            </div>
          </div>
        ))}
      </div>

      <Button variant='outline' className="w-full mt-6 py-2 cursor-pointer text-center transition whitespace-nowrap">
        View All Bookings
      </Button>
    </div>
  );
};

export default RecentBookings;
