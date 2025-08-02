import React, { lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import { useSelector } from 'react-redux';
const ForgetPass = lazy(() => import("../pages/ForgetPass"));
const EventOutlet = lazy(() => import('../pages/event/EventOutlet'));
const Events = lazy(() => import('../pages/event/Events'));
const AddEvent = lazy(() => import('../pages/event/AddEvent'));
const EditEvent = lazy(() => import('../pages/event/EditEvent'));
const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const GalleryOutlet = lazy(() => import('../pages/gallery/GalleryOutlet'));
const Gallery = lazy(() => import('../pages/gallery/Gallery'));
const Category = lazy(() => import('../pages/gallery/Category'));
const GuestOutlet = lazy(() => import('../pages/Guest/GuestOutlet'));
const GuestList = lazy(() => import('../pages/Guest/GuestList'));
const Setting = lazy(() => import('../pages/Setting'));
const BlogOutlet = lazy(() => import('../pages/blog/BlogOutlet'));
const Blog = lazy(() => import('../pages/blog/Blog'));
const AddBlog = lazy(() => import('../pages/blog/AddBlog'));
const Editblog = lazy(() => import('../pages/blog/Editblog'));
const About = lazy(() => import('../pages/about/About'));
const AddMember =  lazy(() => import('../pages/auth/AddMember'));
const EditMember =  lazy(() => import('../pages/auth/EditMember'));
const Review = lazy(() => import('../pages/review/Review'));
const AddNewReview = lazy(() => import('../pages/review/AddNewReview'));
const EditReview = lazy(() => import('../pages/review/EditReview'));


const PublicOnlyRoute = ({ component }) => {
  const { user } = useSelector(state => state?.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.token && user?.role === "Admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (!user) return <>{component}</>;

  if (user.token && user.role !== "Admin") {
    return <ErrorPage />;
  }

  return null; // Avoid rendering if redirected
};



const PrivateRoute = ({ component }) => {
  const { user } = useSelector(state => state?.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  if (user.token && user.role === "Admin") {
    return <>{component}</>;
  }

  if (user.token && user.role !== "Admin") {
    return <ErrorPage />;
  }

  return null;
};

const useRoutes = () => {
  const publicRoutes = [
    { path: "/", component: <PublicOnlyRoute component={<Login />} /> },
    { path: "/forget-password", component: <PublicOnlyRoute component={<ForgetPass />} /> },
  ];

  const adminRoutes = [
    { path: "/dashboard", component: <PrivateRoute component={<Home />} /> },
    {
      path: "/events/",
      component: <PrivateRoute component={<EventOutlet />} />,
      children: [
        {
          index: true,
          component: <PrivateRoute component={<Events />} />,
        },

        { path: "add-event", component: <PrivateRoute component={<AddEvent />} /> },
        { path: "edit-event/:id", component: <PrivateRoute component={<EditEvent />} /> },
      ]
    },
    {
      path: "/gallery/",
      component: <PrivateRoute component={<GalleryOutlet />} />,
      children: [
        {
          index: true,
          component: <PrivateRoute component={<Gallery />} />,
        },
        {
          path:"category",
          component:<PrivateRoute component={<Category />} />
        }
      ]
    },
    {
      path: "/guestlist/",
      component: <PrivateRoute component={<GuestOutlet />} />,
      children: [
        {
          index: true,
          component: <PrivateRoute component={<GuestList />} />,
        },
      ]
    },
    {
      path: "/blog/",
      component: <PrivateRoute component={<BlogOutlet />} />,
      children: [
        {
          index: true,
          component: <PrivateRoute component={<Blog />} />,
        },
        {
          path: "add-blog",
          component: <PrivateRoute component={<AddBlog />} />,
        },
        {
          path: "edit-blog/:id",
          component: <PrivateRoute component={<Editblog />} />,
        }
      ]
    },
    {
      path: "/website/",
      component: <PrivateRoute component={<BlogOutlet />} />,
      children: [
        {
          path: "about",
          component: <PrivateRoute component={<About />} />,
        },
        {path: "reviews", component: <PrivateRoute component={<Review />} />},
        {path: "reviews/add-review", component: <PrivateRoute component={<AddNewReview />} />},
        {path: "reviews/edit-review/:id", component: <PrivateRoute component={<EditReview />} />},

        
      ]
    },
    {path:"/team/add-Member", component: <PrivateRoute component={<AddMember />} />},
    {path:"/team/edit-Member/:id", component: <PrivateRoute component={<EditMember />} />},

    {
      path: "/settings",
      component: <PrivateRoute component={<Setting />} />,
    }

  ];

  const sidebarLink = [
    { id: 1, icon: 'dashboard-line', label: 'Dashboard', link: '/dashboard' ,dock: true },
    { id: 2, icon: 'calendar-line', label: 'Events', link: '/events' ,dock: true },
    { id: 3, icon: 'table-line', label: 'Bookings', link: '/bookings', dock: true },
    { id: 4, icon: 'team-line', label: 'Guest List', link: '/guestlist',dock: true },
    { id: 5, icon: 'image-line', label: 'Gallery', link: '/gallery',dock: false,
       subList: [
        {
          icon: 'list-check-2',
          path: "/gallery/category",
          title: "Category List",
          dock: true,
        },
        {
          icon: 'image-line',
          path: "/gallery",
          title: "Gallery List",
          dock: true,
        },
    ]},
    { id: 6, icon: 'article-line', label: 'Blog', link: '/blog',dock: true },
    {id: 7, icon: 'window-line', label: 'Website', link: '/website',dock: false,
       subList: [
        {
          icon: 'information-line',
          path: "/website/about",
          title: "About",
          dock: true,
        },
        {
          icon: 'news-line',
          path: "/website/reviews",
          title: "Reviews",
          dock: true,
        },

      ]
    },
    { id: 8, icon: 'settings-3-line', label: 'Settings', link: '/settings',dock: true },
  ];

  // 🧠 Get all valid paths recursively
  const getAllPaths = (routes) => {
    const paths = [];

    routes.forEach((route) => {
      if (route.path) {
        const cleanedPath = route.path.replace(/(?<=\w)\/$/, "");
        paths.push(cleanedPath);
      }
      if (route.children) {
        route.children.forEach((child) => {
          if (!child.index) {
            const fullPath = `${route.path.replace(/\/$/, "")}/${child.path}`;
            paths.push(fullPath);
          }
        });
      }
    });

    return paths;
  };

  const allPaths = [...getAllPaths(publicRoutes), ...getAllPaths(adminRoutes)];
  return {
    publicRoutes,
    adminRoutes,
    sidebarLink,
    allPaths,
  };
};

export default useRoutes;
