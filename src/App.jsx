import { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./index.css";
import "./App.css";
import 'remixicon/fonts/remixicon.css';
import Layout from "./Layout";
import Loader from "./components/Loader";
import useRoutes from "./hooks/useRoutes";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import ErrorPage from "./pages/ErrorPage";
// import AddEvent from './pages/AddEvent'

function App() {
  const location = useLocation();
  const { publicRoutes, adminRoutes, } = useRoutes();
  const [isPublic, setIsPublic] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);
  const currentPath = location.pathname;
  useEffect(() => {
    const isPublicRoute = publicRoutes.some(
      (route) => route.path === currentPath
    );
    setIsPrivate(!isPublicRoute)
    setIsPublic(!isPublicRoute);
  }, [currentPath, publicRoutes]);

  // Get all public route paths
  const publicPaths = publicRoutes.map(route => route.path);
  const isPublicRoute = publicPaths.includes(location.pathname);
  return (
    <div>
      {/* <AddEvent /> */}
      <>
        <Suspense fallback={<Loader />}>
          <Routes>
            {publicRoutes.map((routeItem, index) => (
              <Route
                key={index}
                exact
                path={routeItem.path}
                element={routeItem.component}
              >
                {routeItem.children &&
                  routeItem.children.map((childRouteItem, childIndex) => (
                    <Route
                      key={childIndex}
                      index={childRouteItem.index}
                      path={childRouteItem.path}
                      element={childRouteItem.element}
                    />
                  ))}

              </Route>
            ))}

            {!isPrivate && isPublic && <Route path="*" element={<ErrorPage />} />}
          </Routes>
        </Suspense>

        {!isPublicRoute && (
          <Suspense fallback={<Loader />}>
            <Layout>
              <Routes>
                {adminRoutes.map((routeItem, index) => (
                  <Route
                    key={index}
                    path={routeItem.path}
                    element={routeItem.component}
                  >
                    {routeItem.children?.map((childRouteItem, childIndex) => (
                      <Route
                        key={childIndex}
                        index={childRouteItem.index}
                        path={childRouteItem.path}
                        element={childRouteItem.component}
                      />
                    ))}
                  </Route>
                ))}
                {(!isPrivate || isPublic) && <Route path="*" element={<ErrorPage />} />}

              </Routes>
            </Layout>

          </Suspense>
        )}
        <ToastContainer />
      </>
    </div>
  );
}

export default App;
