import { createBrowserRouter } from 'react-router-dom'
import Layout from '@components/layout/Layout'
import Home from '@pages/Home'
import NotFound from '@pages/404'

/**
 * Application router.
 * All routes are wrapped in Layout (Navbar + Footer).
 * Add new pages here as the site grows.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // Future pages go here, e.g.:
      // { path: 'practice-areas', element: <PracticeAreas /> },
      // { path: 'blog', element: <Blog /> },
      // { path: 'blog/:slug', element: <BlogPost /> },
    ],
    errorElement: <NotFound />,
  },
])

export default router