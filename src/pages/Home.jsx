import RecentBookings from '../components/RecentBookings'
import StatsCards from '../components/StatsCards'
import UpcomingEvents from '../components/UpcomingEvents'
import RevenueDashboard from '../components/RevenueDashboard'

const Home = () => {
  return (
    <div className="pb-6">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        <UpcomingEvents />
        <RecentBookings />
      </div>
        <RevenueDashboard />
    </div>
  )
}

export default Home