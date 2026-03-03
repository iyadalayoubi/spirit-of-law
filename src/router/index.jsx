import { createBrowserRouter } from 'react-router-dom'
import Layout from '@components/layout/Layout'
import Home from '@pages/Home'
import NotFound from '@pages/404'

/**
 * Application router.
 * basename must match the Vite base path so the router knows which
 * part of the URL is the app root vs a route path.
 * On GitHub Pages this is /<repo-name>/.
 * Locally (VITE_BASE_PATH not set) it is '/'.
 */
const basename = import.meta.env.BASE_URL  // Vite sets this from the `base` config

const router = createBrowserRouter(
  [
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
  ],
  { basename }  // tells the router the URL prefix to strip before matching routes
)

export default router