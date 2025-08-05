import { useEffect, useState } from 'react';
import Button from './reusableComp/Button';
import { apiJsonAuth } from '../api';
import { Link } from 'react-router-dom';


const RecentBookings = () => {
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(false);


  //=================Function to fetch booking list data=================//
  const fetchBookingListData = async () => {
    try {
      setLoading(true);
      const res = await apiJsonAuth.get(`/api/Admin/adminGetVipList`);
      if (res.data?.status === 1) {
        setBookingList(res.data.result);
        setLoading(false);
      }

    } catch (error) {
      console.log("Error", error);
      if (error?.status === 404) {
        setBookingList([]);
        setLoading(false);
      }
    }

  }
  useEffect(() => {
    fetchBookingListData();
  }, []);

  const getInitials = (name) => {
  if (!name) return "";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
};

  return (
    <div className="bg-white dark:bg-secondary rounded-lg p-6 border border-info dark:border-inputborder hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition duration-300 hover:transform hover:-translate-y-[2px]">
      <div className="flex flex-row gap-2 md:gap-0 justify-between items-center mb-6">
        <h3 className="text-xl text-black dark:text-lightwhite  font-medium">Recent Bookings</h3>
      </div>

      <div className="space-y-4">
        {bookingList.slice(0, 5).map((booking, i) => (
          <div key={i} className="flex items-center p-3 bg-lightborder dark:bg-inputbg rounded-lg">
            <div className="w-10 h-10 rounded-full bg-info dark:bg-inputborder flex items-center justify-center mr-3">
              <span>{getInitials(booking.fullName)}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{booking?.fullName}</p>
              <p className="text-sm text-light">{booking?.theme_Name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-light">{new Date(booking.createdAt).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
            </div>
          </div>
        ))}
      </div>
     <Link to="/guest/bookings">
      <Button variant='outline' className="w-full mt-6 py-2 cursor-pointer text-center transition whitespace-nowrap">
        View All Bookings
      </Button>
      </Link>
    </div>
  );
};

export default RecentBookings;
