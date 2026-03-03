import { RouterProvider } from 'react-router-dom'
import { LanguageProvider } from '@context/LanguageProvider'
import router from '@/router/index'

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  )
}

export default App