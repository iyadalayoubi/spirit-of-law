import Hero from '@components/sections/Hero'
import About from '@components/sections/About'
import Team from '@components/sections/Team'
import Services from '@components/sections/Services'
import Contact from '@components/sections/Contact'

/**
 * Home — Landing page.
 * Each section receives its own ID for anchor navigation.
 */
function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Team />
      <Services />
      <Contact />
    </main>
  )
}

export default Home